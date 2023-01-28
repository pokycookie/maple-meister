import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Store } from "react-notifications-component";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Select, { SingleValue } from "react-select";
import Modal from "../components/modal/modal";
import NumberInput from "../components/numberInput/numberInput";
import RecipeList from "../components/recipeList/recipeList";
import { db, IDBItem, IDBRecipe, IIngredient } from "../db";
import { IReduxStore, RSetRecipeList } from "../redux";
import "../styles/pages/recipe.scss";

type TModal = "ADD" | "DEL";

function RecipePage() {
  const [modal, setModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<TModal>("ADD");

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

  useEffect(() => {
    refreshDB();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="recipe__page">
      <div className="recipe__ul">
        {recipeList.map((data) => {
          return <RecipeList data={data} key={data.id} />;
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
        <Modal open={modal} width="70%" height="70%">
          <RecipeAddModal setModal={setModal} />
        </Modal>
      ) : (
        <Modal open={modal} width="50%" height="300px" onClick={() => setModal(false)}>
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
      Store.addNotification({
        message: `삭제할 아이템을 선택해주세요`,
        type: "warning",
        insert: "top",
        container: "top-right",
        dismiss: {
          duration: 3000,
        },
      });
    } else {
      db.recipe
        .delete(recipe)
        .then(() => {
          Store.addNotification({
            message: `레시피가 삭제 되었습니다`,
            type: "success",
            insert: "top",
            container: "top-right",
            dismiss: {
              duration: 3000,
            },
          });
          refreshDB();
        })
        .catch((err) => {
          console.error(err);
          Store.addNotification({
            title: "Error",
            message: `레시피를 삭제 하지 못했습니다`,
            type: "danger",
            insert: "top",
            container: "top-right",
            dismiss: {
              duration: 3000,
            },
          });
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
    if (!resultItem) {
      Store.addNotification({
        message: `결과 아이템을 선택해주세요`,
        type: "warning",
        insert: "top",
        container: "top-right",
        dismiss: {
          duration: 3000,
        },
      });
    }
    if (resultCount < 1) {
      Store.addNotification({
        message: `개수를 1개 이상으로 설정해주세요`,
        type: "warning",
        insert: "top",
        container: "top-right",
        dismiss: {
          duration: 3000,
        },
      });
    }
    if (title.trim() === "") {
      Store.addNotification({
        message: `레시피 이름을 설정해주세요`,
        type: "warning",
        insert: "top",
        container: "top-right",
        dismiss: {
          duration: 3000,
        },
      });
    }
    if (resultItem && resultCount > 0 && title.trim() !== "") {
      const items: IIngredient[] = ingredients.map((e) => {
        return { id: e.id, count: e.count };
      });
      db.recipe
        .add({ name: title, resultItem, resultCount, items })
        .then(() => {
          Store.addNotification({
            title: `${title}`,
            message: `새로운 레시피가 추가되었습니다`,
            type: "success",
            insert: "top",
            container: "top-right",
            dismiss: {
              duration: 3000,
            },
          });
          refreshDB();
          props.setModal(false);
        })
        .catch((err) => {
          console.error(err);
          Store.addNotification({
            title: "Error",
            message: `새로운 레시피를 추가하지 못했습니다`,
            type: "danger",
            insert: "top",
            container: "top-right",
            dismiss: {
              duration: 3000,
            },
          });
        });
    }
  };

  const ingredientDltHandler = (i: number) => {
    const tmpArr = [...ingredients];
    tmpArr.splice(i, 1);
    setIngredients(tmpArr);
  };

  const ingredientAddHandler = async () => {
    if (!item) {
      Store.addNotification({
        message: `아이템을 선택해주세요`,
        type: "warning",
        insert: "top",
        container: "top-right",
        dismiss: {
          duration: 3000,
        },
      });
    }
    if (count < 1) {
      Store.addNotification({
        message: `개수를 1개 이상으로 설정해주세요`,
        type: "warning",
        insert: "top",
        container: "top-right",
        dismiss: {
          duration: 3000,
        },
      });
    }
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
