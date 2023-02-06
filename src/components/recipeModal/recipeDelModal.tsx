import { useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SingleValue } from "react-select";
import Select from "react-select";
import { db, IDBRecipe } from "../../db";
import { Noti } from "../../lib/notification";
import { IReduxStore, RSetRecipeList } from "../../redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

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

export default RecipeDelModal;
