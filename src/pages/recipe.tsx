import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Select, { SingleValue } from "react-select";
import Modal from "../components/modal/modal";
import NumberInput from "../components/numberInput/numberInput";
import RecipeList from "../components/recipeList/recipeList";
import { useLiveQuery } from "dexie-react-hooks";
import { db, IDBItem, IDBRecipe, IIngredient } from "../db";
import { IReduxStore, RSetRecipeList } from "../redux";
import "../styles/pages/recipe.scss";
import { Noti } from "../lib/notification";

type TModal = "ADD" | "DEL";

interface IRecipeData {
  recipe: IDBRecipe;
  cost: number;
  price: number;
}

function RecipePage() {
  const [modal, setModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<TModal>("ADD");
  // const [maxMargin, setMaxmargin] = useState<number>(0)
  // const [minMargin, setMinmargin] = useState<number>(0)

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
    // if (tmpData.length > 0) {
    //   setMaxmargin(tmpData[0].price - tmpData[0].cost)
    //   setMinmargin(tmpData[-1].price - tmpData[-1].cost)
    // }
    return tmpData;
  }, [recipeList]);

  useEffect(() => {
    refreshDB();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="recipe__page">
      <div className="recipe__ul">
        {recipeData?.map((data, i, arr) => {
          const margin = data.price - data.cost;
          const positive = margin > 0 ? true : false;
          const value =
            arr.length > 0
              ? positive
                ? arr[0].price - arr[0].cost
                : arr[arr.length - 1].price - arr[arr.length - 1].cost
              : 0;
          return (
            <RecipeList
              name={data.recipe.name}
              price={data.price}
              cost={data.cost}
              key={data.recipe.id}
              ratio={{ positive, value }}
            />
          );
        })}
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

function RecipeDelModal() {
  const [recipe, setRecipe] = useState<number | null>(null);

  const recipeList = useSelector<IReduxStore, IDBRecipe[]>((state) => {
    return state.recipeList;
  }, shallowEqual);

  const dispatch = useDispatch();

  const refreshDB = async () => {
    const data = await db.recipe.toArray();
    dispatch(RSetRecipeList(data));
  };

  const itemHandler = (e: SingleValue<{ value: number; label: string }>) => {
    if (e) setRecipe(e.value);
    else setRecipe(null);
  };

  const delHandler = async () => {
    if (recipe === null) {
      Noti.warning("삭제할 아이템을 선택해주세요");
    } else {
      db.recipe
        .delete(recipe)
        .then(() => {
          Noti.success("레시피가 삭제 되었습니다");
          refreshDB();
        })
        .catch((err) => {
          console.error(err);
          Noti.danger("레시피를 삭제하지 못했습니다");
        });
    }
  };

  const options = recipeList.map((e) => {
    return { value: e.id!, label: e.name };
  });

  return (
    <div className="recipe__del__modal">
      <Select
        className="form--select"
        placeholder="삭제할 아이템을 선택하세요"
        options={options}
        isClearable={true}
        onChange={itemHandler}
        maxMenuHeight={33 * 6}
      />
      <button className="form--btn" onClick={delHandler}>
        <FontAwesomeIcon icon={faTrashAlt} />
      </button>
    </div>
  );
}

interface IProps {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IIngredientPlus extends IIngredient {
  name: string;
}

function RecipeAddModal(props: IProps) {
  const [title, setTitle] = useState<string>("");
  const [resultItem, setResultItem] = useState<number | null>(null);
  const [resultCount, setResultCount] = useState<number>(1);
  const [item, setItem] = useState<number | null>(null);
  const [count, setCount] = useState<number>(1);
  const [ingredients, setIngredients] = useState<IIngredientPlus[]>([]);

  const dispatch = useDispatch();

  const itemList = useSelector<IReduxStore, IDBItem[]>((state) => {
    return state.itemList;
  }, shallowEqual);

  const options = itemList.map((e) => {
    return { value: e.id!, label: e.name };
  });

  const refreshDB = async () => {
    const data = await db.recipe.toArray();
    dispatch(RSetRecipeList(data));
  };

  const recipeSubmitHandler = () => {
    if (!resultItem) Noti.warning("결과 아이템을 선택해주세요");
    if (resultCount < 1) Noti.warning("개수를 1개 이상으로 설정해주세요");
    if (title.trim() === "") Noti.warning("레시피 이름을 설정해주세요");

    if (resultItem && resultCount > 0 && title.trim() !== "") {
      const items: IIngredient[] = ingredients.map((e) => {
        return { id: e.id, count: e.count };
      });
      db.recipe
        .add({ name: title, resultItem, resultCount, items })
        .then(() => {
          Noti.success(`${title}가 새로운 레시피로 추가되었습니다.`);
          refreshDB();
          props.setModal(false);
        })
        .catch((err) => {
          console.error(err);
          Noti.danger("새로운 레시피를 추가하지 못했습니다");
        });
    }
  };

  const ingredientDltHandler = (i: number) => {
    const tmpArr = [...ingredients];
    tmpArr.splice(i, 1);
    setIngredients(tmpArr);
  };

  const ingredientAddHandler = async () => {
    if (!item) Noti.warning("아이템을 선택해주세요");
    if (count < 1) Noti.warning("개수를 1개 이상으로 설정해주세요");
    if (item && count > 0) {
      const name = (await db.item.get(item))?.name ?? "";
      setIngredients((prev) => [...prev, { id: item, count, name }]);
    }
  };

  const itemHandler = (e: SingleValue<{ value: number; label: string }>) => {
    if (e) setItem(e.value);
    else setItem(null);
  };

  const resultItemHandler = async (e: SingleValue<{ value: number; label: string }>) => {
    if (e) {
      const itemID = e.value;
      const itemName = (await db.item.get(itemID))?.name ?? "";
      setResultItem(itemID);
      if (itemName !== "") {
        setTitle(`${itemName} 제작 레시피`);
      }
    } else {
      setResultItem(null);
    }
  };

  return (
    <div className="recipe__add__modal">
      <div className="recipe--title__area">
        <input
          type="text"
          className="title__area--input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="레시피 이름을 선택하세요"
        />
      </div>
      <div className="recipe__modal--seperator"></div>
      <div className="recipe--result__area">
        <Select
          className="form--select"
          placeholder="결과 아이템을 선택하세요"
          options={options}
          isClearable={true}
          onChange={resultItemHandler}
          maxMenuHeight={33 * 6}
        />
        <NumberInput
          className="form--input input--resultCount"
          value={resultCount}
          separators
          unit="개"
          onChange={(value) => setResultCount(value)}
        />
      </div>
      <div className="recipe__modal--seperator"></div>
      <div className="recipe--input__area">
        <Select
          className="form--select"
          placeholder="재료 아이템을 선택하세요"
          options={options}
          isClearable={true}
          onChange={itemHandler}
          maxMenuHeight={33 * 6}
        />
        <NumberInput
          className="form--input input--count"
          value={count}
          separators
          unit="개"
          onChange={(value) => setCount(value)}
        />
        <button className="form--btn add--btn" onClick={ingredientAddHandler}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      <div className="recipe__modal--seperator"></div>
      <div className="recipe--ingredient__area">
        {ingredients.map((e, i) => {
          return (
            <div
              className="ingredient__list"
              key={`${e.id}${i}`}
              onClick={() => ingredientDltHandler(i)}
            >
              <p className="ingredient__list--name">{e.name}</p>
              <p className="ingredient__list--count">{e.count}개</p>
            </div>
          );
        })}
      </div>
      <div className="recipe__modal--seperator"></div>
      <div className="recipe--btn__area">
        <button className="form--btn ok--btn" onClick={recipeSubmitHandler}>
          레시피 추가
        </button>
        <button className="form--btn cancel--btn" onClick={() => props.setModal(false)}>
          취소
        </button>
      </div>
    </div>
  );
}

export default RecipePage;
