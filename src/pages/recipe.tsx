import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { faFolderOpen, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Modal from "../components/modal/modal";
import { useLiveQuery } from "dexie-react-hooks";
import { db, IDBItem, IDBRecipe } from "../db";
import { IReduxStore, RSetRecipeList } from "../redux";
import "../styles/pages/recipe.scss";
import PieChart, { IPieData } from "../components/nivo/pieChart";
import { recipeToPieData } from "../lib/nivo";
import { ISize } from "../types";
import RecipeAddModal from "../components/recipeModal/recipeAddModal";
import RecipeDelModal from "../components/recipeModal/recipeDelModal";
import { ComputedDatum } from "@nivo/pie";
import ItemPriceInput from "../components/itemPriceInput/itemPriceInput";
import HiddenDiv from "../components/hiddenDiv/hiddenDiv";
import RecipePieModal from "../components/recipeModal/recipePieModal";

type TModal = "ADD" | "DEL" | "PIE";

export interface IDBRecipeExtend extends IDBRecipe {
  cost: number;
  price: number;
}

function RecipePage() {
  const [modal, setModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<TModal>("ADD");
  const [pieData, setPieData] = useState<IPieData[]>([]);
  const [chartSize, setChartSize] = useState<ISize>({ width: 10, height: 10 });
  const [editedItems, setEditedItems] = useState<IDBItem[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedPie, setSelectedPie] = useState<IDBRecipe | null>(null);

  const EChartArea = useRef<HTMLDivElement>(null);

  const recipeList = useSelector<IReduxStore, IDBRecipe[]>((state) => {
    return state.recipeList;
  }, shallowEqual);

  const dispatch = useDispatch();

  const refreshDB = async () => {
    const data = await db.recipe.toArray();
    dispatch(RSetRecipeList(data));
  };

  const modalHandler = (type: TModal) => {
    setModal(true);
    setModalType(type);
  };

  const pieClickHandler = (data: ComputedDatum<IPieData>) => {
    modalHandler("PIE");
    const selectedData = recipeList.find((e) => e.id === data.id) ?? null;
    setSelectedPie(selectedData);
    // console.log(selectedData);
  };

  const resizeHandler = () => {
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

  const itemHandler = (item: number, price: number) => {
    const prevItems = [...editedItems];
    prevItems[prevItems.findIndex((e) => e.id === item)].price = price;
    setEditedItems(prevItems);
  };

  const initItems = async () => {
    const tmpItems = await db.item.toArray();
    setEditedItems(tmpItems);
  };

  const recipeExtend = useLiveQuery<IDBRecipeExtend[]>(() => {
    const promiseRecipe = Promise.all(
      recipeList.map<Promise<IDBRecipeExtend>>(async (recipe) => {
        const items = editMode ? editedItems : await db.item.toArray();
        const cost = recipe.items.reduce((acc, curr) => {
          return acc + (items.find((e) => e.id === curr.id)?.price ?? 0) * curr.count;
        }, 0);
        const price =
          recipe.resultCount * (items.find((e) => e.id === recipe.resultItem)?.price ?? 0);

        return {
          id: recipe.id,
          items: recipe.items,
          name: recipe.name,
          resultCount: recipe.resultCount,
          resultItem: recipe.resultItem,
          cost,
          price,
        };
      })
    );
    return promiseRecipe;
  }, [recipeList, editedItems, editMode]);

  useEffect(() => {
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  // Set PieData depends on recipeExtend
  useEffect(() => {
    if (recipeExtend !== undefined) {
      const tmpData: IPieData[] = recipeToPieData(recipeExtend).filter((e) => e.value > 0);
      setPieData(tmpData);
    } else {
      setPieData([]);
    }
  }, [recipeExtend]);

  // Refresh EditedItems
  useEffect(() => {
    if (editMode) initItems();
  }, [editMode]);

  // Initialize
  useEffect(() => {
    refreshDB();
    initItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="recipe__page">
      <div
        className="chart__area"
        ref={EChartArea}
        style={{ width: chartSize.width, height: chartSize.height }}
      >
        {pieData.length > 0 ? (
          <PieChart data={pieData} onClick={(data) => pieClickHandler(data)} />
        ) : (
          <div className="chart--empty">
            <FontAwesomeIcon className="empty--icon" icon={faFolderOpen} />
            <p className="empty--text">데이터가 존재하지 않습니다</p>
          </div>
        )}
        <HiddenDiv onChange={(isOpen) => setEditMode(isOpen)}>
          <ItemPriceInput
            items={editedItems}
            refresh={initItems}
            onChange={(item, price) => itemHandler(item, price)}
          />
        </HiddenDiv>
      </div>
      <div className="btn__area">
        <button className="add__btn circleBtn" onClick={() => modalHandler("ADD")}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
        <button className="dlt__btn circleBtn" onClick={() => modalHandler("DEL")}>
          <FontAwesomeIcon icon={faTrashAlt} />
        </button>
      </div>
      {modalType === "ADD" ? (
        <Modal open={modal} width="70%" height="70%" maxWidth="700px" minHeight="400px">
          <RecipeAddModal setModal={setModal} />
        </Modal>
      ) : modalType === "DEL" ? (
        <Modal
          open={modal}
          width="50%"
          height="300px"
          maxWidth="500px"
          onClick={() => setModal(false)}
        >
          <RecipeDelModal />
        </Modal>
      ) : (
        <Modal
          open={modal}
          width="50%"
          height="300px"
          maxWidth="500px"
          onClick={() => setModal(false)}
        >
          <RecipePieModal data={selectedPie} />
        </Modal>
      )}
    </div>
  );
}

export default RecipePage;
