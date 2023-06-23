import { useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import EditableList from "../../components/editableList/editableList";
import { db, IDBRecipe } from "../../db";
import { IReduxStore, RSetRecipeList } from "../../redux";
import { deleteRecipe } from "../../utils/dexie";
import RecipeAddModal from "./recipeAddModal";
import styles from "./recipeEditModal.module.css";

function RecipeEditModal() {
  const [editID, setEditID] = useState<number | undefined>(undefined);

  const recipeList = useSelector<IReduxStore, IDBRecipe[]>((state) => {
    return state.recipeList;
  }, shallowEqual);

  const dispatch = useDispatch();

  const refreshDB = async () => {
    const data = await db.recipe.toArray();
    dispatch(RSetRecipeList(data));
  };

  const editHandler = (recipe: IDBRecipe) => {
    setEditID(recipe.id);
  };

  const deleteHandler = async (recipe: IDBRecipe) => {
    try {
      await deleteRecipe(recipe.id!);
      refreshDB();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {!editID ? (
        <div>
          <h1 className={styles.title}>레시피 목록</h1>
          <ul>
            {recipeList.map((recipe, i) => {
              return (
                <EditableList
                  key={i}
                  editHandler={() => editHandler(recipe)}
                  deleteHandler={() => deleteHandler(recipe)}
                >
                  <div className={styles.list}>
                    <p>{recipe.name}</p>
                  </div>
                </EditableList>
              );
            })}
          </ul>
        </div>
      ) : (
        <RecipeAddModal editID={editID} />
      )}
    </>
  );
}

export default RecipeEditModal;
