import Dexie, { Table } from "dexie";

export type TTransactionType = "buy" | "sell";

export interface IDBTimer {
  id?: number;
  title: string;
  time: number;
}

export interface IDBItem {
  id?: number;
  name: string;
  price: number;
}

export interface IDBRecipe {
  id?: number;
  name: string;
  items: IIngredient[];
  resultItem: number;
  resultCount: number;
}

export interface IIngredient {
  id: number;
  count: number;
}

export interface IDBItemLog {
  id?: number;
  item: number;
  price: number;
  updated: Date;
  type?: TTransactionType;
}

export interface IDBLedger {
  id?: number;
  item: number;
  type: TTransactionType;
  price: number;
  count: number;
  assets: number;
  updated: Date;
}

export interface IDBUser {
  key: string;
  value: any;
}

export class MapleMeister extends Dexie {
  timer!: Table<IDBTimer>;
  item!: Table<IDBItem>;
  recipe!: Table<IDBRecipe>;
  itemLog!: Table<IDBItemLog>;
  ledger!: Table<IDBLedger>;
  user!: Table<IDBUser>;

  constructor() {
    super("mapleMeister");
    this.version(1).stores({
      timer: "++id, title, time",
    });
    this.version(2).stores({
      timer: "++id, title, time",
      item: "++id, &name, price",
      recipe: "++id, &name, items, resultItem, resultCount",
      itemLog: "++id, [item+updated], price, type",
      ledger: "++id, item, type, price, assets, updated",
      user: "&key, value",
    });
  }
}

// 2개 이상의 인덱싱을 하기 위해 compound index를 사용 ex) [item+updated]

export const db = new MapleMeister();
