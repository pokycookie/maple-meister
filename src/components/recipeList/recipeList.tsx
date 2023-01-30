import { decimalSeparator } from "../../lib/numberString";
import "./recipeList.css";

interface IProps {
  name: string;
  price: number;
  cost: number;
  ratio: { positive: boolean; value: number };
}

function RecipeList(props: IProps) {
  const percentage = (props.price - props.cost) / props.ratio.value;

  return (
    <div className="recipe__list">
      <p className="recipe__list--name">{props.name}</p>
      <div className="recipe__list--margin">
        <div
          className="margin--percentage"
          style={{
            backgroundColor: props.ratio.positive ? "#379237" : "#DC3535",
            width: `${percentage * 150}px`,
          }}
        ></div>
        <p>
          {props.ratio.positive ? "+" : "-"}
          {decimalSeparator(Math.abs(props.price - props.cost))}메소
        </p>
      </div>
    </div>
  );
}

export default RecipeList;
