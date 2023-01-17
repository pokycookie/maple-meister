import Dexie, { Table } from "dexie";

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
  items: number[];
}

export class MapleMeister extends Dexie {
  timer!: Table<IDBTimer>;
  item!: Table<IDBItem>;
  recipe!: Table<IDBRecipe>;

  constructor() {
    super("mapleMeister");
    this.version(1).stores({
      timer: "++id, title, time",
    });
    this.version(2).stores({
      timer: "++id, title, time",
      item: "++id, &name, price",
      recipe: "++id, &name, items",
    });
  }
}

export const db = new MapleMeister();
