import { useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SingleValue } from "react-select";
import Select from "react-select";
import { db, IDBItem, IIngredient } from "../../db";
import { Noti } from "../../lib/notification";
import { IReduxStore, RSetModalID, RSetRecipeList } from "../../redux";
import NumberInput from "../numberInput/numberInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

interface IIngredientPlus extends IIngredient {
  name: string;
}

function RecipeAddModal() {
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
          dispatch(RSetModalID(null));
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
        <button className="form--btn cancel--btn" onClick={() => dispatch(RSetModalID(null))}>
          취소
        </button>
      </div>
    </div>
  );
}

export default RecipeAddModal;
