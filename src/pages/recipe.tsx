import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
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

type TModal = "ADD" | "DEL";

export interface IDBRecipeExtend extends IDBRecipe {
  cost: number;
  price: number;
}

interface IDBIngredientMAX {
  item: IDBItem;
  count: number;
}

interface IDBRecipeMAX {
  id: number;
  name: string;
  items: IDBIngredientMAX[];
  resultItem: IDBItem;
  resultCount: number;
}

function RecipePage() {
  const [modal, setModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<TModal>("ADD");
  const [pieData, setPieData] = useState<IPieData[]>([]);
  const [chartSize, setChartSize] = useState<ISize>({ width: 10, height: 10 });
  // const [controlData, setControlData] = useState<IDBRecipeMAX[]>([]);
  const [items, setItems] = useState<IDBItem[]>([]);

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

  const pieClickHandler = (data: ComputedDatum<IPieData>) => {
    const selectedData = recipeList.find((e) => e.id === data.id);
    console.log(selectedData);
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

  const itemHandler = (item: number, price: number) => {
    const prevItems = [...items];
    prevItems[prevItems.findIndex((e) => e.id === item)].price = price;
    setItems(prevItems);
  };

  const getRecipeMax = async (data: IDBRecipe[]) => {
    return await Promise.all(
      data.map<Promise<IDBRecipeMAX>>(async (data) => {
        return {
          id: data.id!,
          name: data.name,
          items: await Promise.all(
            data.items.map<Promise<IDBIngredientMAX>>(async (ingredient) => {
              const item = (await db.item.get(ingredient.id))!;
              return {
                item,
                count: ingredient.count,
              };
            })
          ),
          resultItem: (await db.item.get(data.resultItem))!,
          resultCount: data.resultCount,
        };
      })
    );
  };

  const initItems = async () => {
    const tmpItems = await db.item.toArray();
    setItems(tmpItems);
  };

  const getItemPrice = (id: number) => {
    return items.find((e) => e.id === id)?.price ?? 0;
  };

  const getPrice = (data: IDBRecipe) => {
    // const resultPrice = (await db.item.get(data.resultItem))?.price ?? 0;
    const resultPrice = getItemPrice(data.resultItem);
    const resultCount = data.resultCount;
    return resultPrice * resultCount;
  };

  const getCost = (data: IDBRecipe) => {
    // const tmpCost = await data.items.reduce(async (acc, e) => {
    //   const itemPrice = (await db.item.get(e.id))?.price ?? 0;
    //   return (await acc) + itemPrice * e.count;
    // }, Promise.resolve(0));
    const tmpCost = data.items.reduce((acc, curr) => {
      return acc + getItemPrice(curr.id) * curr.count;
    }, 0);
    return tmpCost;
  };

  const recipeExtend = useLiveQuery<IDBRecipeExtend[]>(() => {
    const tmpData = recipeList.map((recipe) => {
      return {
        id: recipe.id,
        items: recipe.items,
        name: recipe.name,
        resultCount: recipe.resultCount,
        resultItem: recipe.resultItem,
        cost: getCost(recipe),
        price: getPrice(recipe),
      };
    });
    tmpData.sort((a, b) => {
      const marginA = a.price - a.cost;
      const marginB = b.price - b.cost;
      return marginB - marginA;
    });
    return tmpData;
  }, [items]);

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

  // Set PieData depends on controlData
  // useEffect(() => {
  //   const tmpData: IPieData[] = controlData.map<IPieData>((recipe) => {
  //     const price = recipe.resultItem.price * recipe.resultCount;
  //     const cost = recipe.items.reduce((acc, curr) => {
  //       return acc + curr.item.price * curr.count;
  //     }, 0);
  //     return {
  //       id: recipe.id,
  //       value: price - cost,
  //       label: recipe.name,
  //     };
  //   });
  //   setPieData(tmpData);
  // }, [controlData]);

  // const recipeMax = async () => {
  //   const tmpControlData = await getRecipeMax(recipeList);
  //   setControlData(tmpControlData);
  // };

  // Get recipeMax data at first time
  // useEffect(() => {
  //   if (controlData.length === 0) recipeMax();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [recipeList]);

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
        <PieChart data={pieData} onClick={(data) => pieClickHandler(data)} />
        <HiddenDiv>
          <ItemPriceInput
            items={items}
            refresh={initItems}
            onChange={(item, price) => itemHandler(item, price)}
          />
        </HiddenDiv>
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
