import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SingleValue } from "react-select";
import Select from "react-select";
import { db, IDBItem, IIngredient } from "../../db";
import { Noti } from "../../lib/notification";
import { IReduxStore, RSetModalID, RSetRecipeList } from "../../redux";
import NumberInput from "../../components/numberInput/numberInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import {
  CREATE_RECIPE_INGREDIENTCOUNT_ERR,
  CREATE_RECIPE_INGREDIENTITEM_ERR,
  CREATE_RECIPE_NAME_ERR,
  CREATE_RECIPE_RESULTCOUNT_ERR,
  CREATE_RECIPE_REUSLTITEM_ERR,
  SELECT_ITEM_ERR,
} from "../../lang/noti";
import { createRecipe, updateRecipe } from "../../utils/dexie";

interface IIngredientPlus extends IIngredient {
  name: string;
}

function RecipeAddModal({ editID }: { editID?: number }) {
  const [title, setTitle] = useState<string>("");
  const [resultItem, setResultItem] = useState<{ value: number; label: string } | null>(null);
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

  const recipeUpdateHandler = async () => {
    if (!editID) return;
    if (!resultItem) {
      Noti.warning(CREATE_RECIPE_REUSLTITEM_ERR);
      return;
    }
    if (resultCount < 1) {
      Noti.warning(CREATE_RECIPE_RESULTCOUNT_ERR);
      return;
    }
    if (title.trim() === "") {
      Noti.warning(CREATE_RECIPE_NAME_ERR);
      return;
    }

    const items: IIngredient[] = ingredients.map((e) => {
      return { id: e.id, count: e.count };
    });

    try {
      await updateRecipe(editID, { name: title, resultItem: resultItem.value, resultCount, items });
      refreshDB();
      dispatch(RSetModalID(null));
    } catch (err) {
      console.error(err);
    }
  };

  const recipeSubmitHandler = async () => {
    if (!resultItem) {
      Noti.warning(CREATE_RECIPE_REUSLTITEM_ERR);
      return;
    }
    if (resultCount < 1) {
      Noti.warning(CREATE_RECIPE_RESULTCOUNT_ERR);
      return;
    }
    if (title.trim() === "") {
      Noti.warning(CREATE_RECIPE_NAME_ERR);
      return;
    }

    const items: IIngredient[] = ingredients.map((e) => {
      return { id: e.id, count: e.count };
    });

    try {
      await createRecipe({ name: title, resultItem: resultItem.value, resultCount, items });
      refreshDB();
      dispatch(RSetModalID(null));
    } catch (err) {
      console.error(err);
    }
  };

  const ingredientDeleteHandler = (i: number) => {
    const tmpArr = [...ingredients];
    tmpArr.splice(i, 1);
    setIngredients(tmpArr);
  };

  const ingredientAddHandler = async () => {
    if (!item) {
      Noti.warning(SELECT_ITEM_ERR);
      return;
    }
    if (count < 1) {
      Noti.warning(CREATE_RECIPE_INGREDIENTCOUNT_ERR);
      return;
    }
    const name = (await db.item.get(item))?.name;
    if (!name) {
      Noti.danger(CREATE_RECIPE_INGREDIENTITEM_ERR);
      return;
    }
    setIngredients((prev) => [...prev, { id: item, count, name }]);
  };

  const itemHandler = (e: SingleValue<{ value: number; label: string }>) => {
    if (e) setItem(e.value);
    else setItem(null);
  };

  const resultItemHandler = async (e: SingleValue<{ value: number; label: string }>) => {
    if (e) {
      const itemID = e.value;
      const itemName = (await db.item.get(itemID))?.name ?? "";
      setResultItem({ value: itemID, label: itemName });
      if (itemName !== "") {
        setTitle(`${itemName} 제작 레시피`);
      }
    } else {
      setResultItem(null);
    }
  };

  useEffect(() => {
    const setForm = async () => {
      if (!editID) return;
      const recipe = await db.recipe.get(editID);
      if (!recipe) return;

      const resultItemName = (await db.item.get(recipe.resultItem))?.name ?? "";
      const ingredients = await Promise.all(
        recipe.items.map<Promise<IIngredientPlus>>((ingredient) => {
          return new Promise((resolve, reject) => {
            db.item.get(ingredient.id).then((res) => {
              if (res) {
                resolve({ ...ingredient, name: res.name });
              } else {
                reject("wrong item");
              }
            });
          });
        })
      );

      setTitle(recipe.name);
      setResultItem({ value: recipe.resultItem, label: resultItemName });
      setResultCount(recipe.resultCount);
      setIngredients(ingredients);
    };
    if (editID) setForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="recipe__add__modal">
      <div className="recipe--title__area">
        <input
          type="text"
          className="title__area--input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="레시피 이름을 선택하세요"
          // disabled={editID ? true : false}
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
          value={resultItem}
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
              onClick={() => ingredientDeleteHandler(i)}
            >
              <p className="ingredient__list--name">{e.name}</p>
              <p className="ingredient__list--count">{e.count}개</p>
            </div>
          );
        })}
      </div>
      <div className="recipe__modal--seperator"></div>
      <div className="recipe--btn__area">
        {editID ? (
          <button className="form--btn ok--btn" onClick={recipeUpdateHandler}>
            레시피 수정
          </button>
        ) : (
          <button className="form--btn ok--btn" onClick={recipeSubmitHandler}>
            레시피 추가
          </button>
        )}
        <button className="form--btn cancel--btn" onClick={() => dispatch(RSetModalID(null))}>
          취소
        </button>
      </div>
    </div>
  );
}

export default RecipeAddModal;
