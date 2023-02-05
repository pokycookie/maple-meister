import { Datum, Serie } from "@nivo/line";
import { IDBItemLog } from "../db";

export function itemLogToSerie(itemLogs: IDBItemLog[], id: string | number): Serie[] {
  const data: Datum[] = itemLogs.map((log) => {
    return {
      x: log.updated.toLocaleString(),
      y: log.price,
    };
  });
  return [{ id, data }];
}
