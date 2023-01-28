import { IDBRecipe } from "../../db";
import "./recipeList.css";

interface IProps {
  data: IDBRecipe;
}

function RecipeList(props: IProps) {
  return (
    <div className="recipe__list">
      <p className="recipe__list--name">{props.data.name}</p>
    </div>
  );
}

export default RecipeList;
