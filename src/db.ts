import Dexie, { Table } from "dexie";

export interface IDBTimer {
  id?: number;
  title: string;
  time: number;
}

export class MapleMeister extends Dexie {
  timer!: Table<IDBTimer>;

  constructor() {
    super("mapleMeister");
    this.version(1).stores({
      timer: "++id, title, time",
    });
  }
}

export const db = new MapleMeister();
