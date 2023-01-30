import { useCallback, useEffect, useState } from "react";
import { db, IDBRecipe } from "../../db";
import { decimalSeparator } from "../../lib/numberString";
import "./recipeList.css";

interface IProps {
  data: IDBRecipe;
}

function RecipeList(props: IProps) {
  const [price, setPrice] = useState(0);
  const [cost, setCost] = useState(0);

  const getPrice = useCallback(async () => {
    const resultPrice = (await db.item.get(props.data.resultItem))?.price ?? 0;
    const resultCount = props.data.resultCount;
    setPrice(resultPrice * resultCount);
  }, [props.data]);

  const getCost = useCallback(async () => {
    const tmpCost = await props.data.items.reduce(async (acc, e) => {
      const itemPrice = (await db.item.get(e.id))?.price ?? 0;
      return (await acc) + itemPrice * e.count;
    }, Promise.resolve(0));
    setCost(tmpCost);
  }, [props.data]);

  useEffect(() => {
    getPrice();
    getCost();
  }, [getCost, getPrice]);

  return (
    <div className="recipe__list">
      <p className="recipe__list--name">{props.data.name}</p>
      {/* <p className="recipe__list--price">{decimalSeparator(price)}메소</p> */}
      {/* <p className="recipe__list--cost">{decimalSeparator(cost)}메소</p> */}
      <p className="recipe__list--margin">
        {price - cost > 0 ? "+" : "-"}
        {decimalSeparator(Math.abs(price - cost))}메소
      </p>
    </div>
  );
}

export default RecipeList;
