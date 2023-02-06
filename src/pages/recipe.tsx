import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Modal from "../components/modal/modal";
import { useLiveQuery } from "dexie-react-hooks";
import { db, IDBRecipe } from "../db";
import { IReduxStore, RSetRecipeList } from "../redux";
import "../styles/pages/recipe.scss";
import PieChart, { IPieData } from "../components/nivo/pieChart";
import { recipeToPieData } from "../lib/nivo";
import { ISize } from "../types";
import RecipeAddModal from "../components/recipeModal/recipeAddModal";
import RecipeDelModal from "../components/recipeModal/recipeDelModal";

type TModal = "ADD" | "DEL";

export interface IRecipeData {
  recipe: IDBRecipe;
  cost: number;
  price: number;
}

function RecipePage() {
  const [modal, setModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<TModal>("ADD");
  const [pieData, setPieData] = useState<IPieData[]>([]);
  const [chartSize, setChartSize] = useState<ISize>({ width: 10, height: 10 });

  const EChartArea = useRef<HTMLDivElement>(null);

  const recipeList = useSelector<IReduxStore, IDBRecipe[]>((state) => {
    return state.recipeList;
  }, shallowEqual);

  const dispatch = useDispatch();

  const refreshDB = async () => {
    const data = await db.recipe.toArray();
    dispatch(RSetRecipeList(data));
  };

  const addHandler = () => {
    setModal(true);
    setModalType("ADD");
  };
  const delHandler = () => {
    setModal(true);
    setModalType("DEL");
  };

  const resizeHandler = () => {
    // const width = EChartArea.current?.clientWidth ?? 0;
    // const height = EChartArea.current?.clientHeight ?? 0;
    const navSize = 70;
    const vw =
      Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) - navSize;
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    const size = Math.min(vw, vh) / 2;
    setChartSize({
      width: size,
      height: size,
    });
  };

  const getPrice = async (data: IDBRecipe) => {
    const resultPrice = (await db.item.get(data.resultItem))?.price ?? 0;
    const resultCount = data.resultCount;
    return resultPrice * resultCount;
  };

  const getCost = async (data: IDBRecipe) => {
    const tmpCost = await data.items.reduce(async (acc, e) => {
      const itemPrice = (await db.item.get(e.id))?.price ?? 0;
      return (await acc) + itemPrice * e.count;
    }, Promise.resolve(0));
    return tmpCost;
  };

  const recipeData = useLiveQuery<IRecipeData[]>(async () => {
    const tmpData = await Promise.all(
      recipeList.map<Promise<IRecipeData>>(async (recipe) => {
        return {
          recipe,
          cost: await getCost(recipe),
          price: await getPrice(recipe),
        };
      })
    );
    tmpData.sort((a, b) => {
      const marginA = a.price - a.cost;
      const marginB = b.price - b.cost;
      return marginB - marginA;
    });
    return tmpData;
  }, [recipeList]);

  useEffect(() => {
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  useEffect(() => {
    if (recipeData !== undefined) {
      const tmpData: IPieData[] = recipeToPieData(recipeData).filter((e) => e.value > 0);
      setPieData(tmpData);
    } else {
      setPieData([]);
    }
  }, [recipeData]);

  useEffect(() => {
    refreshDB();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="recipe__page">
      <div
        className="chart__area"
        ref={EChartArea}
        style={{ width: chartSize.width, height: chartSize.height }}
      >
        <PieChart data={pieData} />
      </div>
      <div className="btn__area">
        <button className="add__btn circleBtn" onClick={addHandler}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
        <button className="dlt__btn circleBtn" onClick={delHandler}>
          <FontAwesomeIcon icon={faTrashAlt} />
        </button>
      </div>
      {modalType === "ADD" ? (
        <Modal open={modal} width="70%" height="70%" maxWidth="700px">
          <RecipeAddModal setModal={setModal} />
        </Modal>
      ) : (
        <Modal
          open={modal}
          width="50%"
          height="300px"
          maxWidth="500px"
          onClick={() => setModal(false)}
        >
          <RecipeDelModal />
        </Modal>
      )}
    </div>
  );
}

export default RecipePage;
