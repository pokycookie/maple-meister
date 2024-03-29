import { Datum, Serie } from "@nivo/line";
import { IPieData } from "../components/nivo/pieChart";
import { IDBItemLog } from "../db";
import { IDBRecipeExtend } from "../pages/recipe";

export function itemLogToSerie(
  itemLogs: IDBItemLog[],
  id: string | number
): Serie[] {
  const data: Datum[] = itemLogs.map((log) => {
    return {
      x: log.updated.toLocaleString(),
      y: log.price,
    };
  });
  return [{ id, data }];
}

export function recipeToPieData(recipes: IDBRecipeExtend[]): IPieData[] {
  return recipes.map((recipe) => {
    return {
      id: recipe.id!,
      value: recipe.price - recipe.cost,
      label: recipe.name,
    };
  });
}
