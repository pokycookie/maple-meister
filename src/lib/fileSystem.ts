import { db, IDBItem, IDBItemLog, IDBLedger, IDBRecipe } from "../db";
import { getDateText } from "./time";

export type TFile = "backup" | "recipe" | "item" | "itemLog" | "ledger" | "setting";

interface IMeta {
  type: TFile;
}

export interface IMMDF__DATA {
  item?: IDBItem[];
  recipe?: IDBRecipe[];
  itemLog?: IDBItemLog[];
  ledger?: IDBLedger[];
}

export interface IMMDF extends IMMDF__DATA {
  backup?: IMMDF__DATA;
}

export interface IMMDF__FILE {
  meta: IMeta;
  data: IMMDF;
}

export function download(data: any, type: TFile) {
  const DATA: IMMDF__FILE = { meta: { type }, data };
  const FILE = new File([JSON.stringify(DATA)], `${new Date().toDateString()}.txt`, {
    type: "text/plain",
  });
  const URL = window.URL.createObjectURL(FILE);
  const LINK = document.createElement("a");
  LINK.href = URL;
  LINK.download = `${getDateText(new Date())}${type}.mmdf`;
  document.body.appendChild(LINK);
  LINK.click();
  document.body.removeChild(LINK);
  window.URL.revokeObjectURL(URL);
}

export function upload() {
  return new Promise<IMMDF__FILE>((resolve, rejects) => {
    const LINK = document.createElement("input");
    LINK.type = "file";
    LINK.accept = ".mmdf";
    LINK.addEventListener("change", () => {
      if (LINK.files && LINK.files.length > 0) {
        try {
          const FILE = LINK.files[0];
          const READER = new FileReader();
          READER.readAsText(FILE);
          READER.onload = () => {
            const obj = JSON.parse(READER.result as string, (key, value) => {
              if (typeof value === "string") {
                const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
                if (dateRegex.test(value)) {
                  return new Date(value);
                }
              }
              return value;
            }) as IMMDF__FILE;
            resolve(obj);
          };
        } catch (error) {
          rejects(error);
        }
      } else {
        rejects();
      }
    });
    document.body.appendChild(LINK);
    LINK.click();
    document.body.removeChild(LINK);
  });
}

export type TReaderOption = "option1" | "option2" | "force";

export const setItem = async (fileData: IMMDF__DATA, option?: TReaderOption) => {
  const items = fileData.item ?? [];
  switch (option) {
    case "option1":
      for (const item of items) {
        const dbItem = await db.item.get({ name: item.name });
        if (!dbItem) await db.item.add({ name: item.name, price: item.price });
      }
      break;
    case "force":
      // 모든 데이터를 초기화하고 새 데이터를 적용
      await db.item.clear();
      for (const item of items) {
        await db.item.add(item);
      }
      break;
    default:
      // 같은 이름의 아이템이 있는 경우 price만 수정
      // 같은 이름의 아이템이 없는 경우 새 데이터를 추가
      for (const item of items) {
        const dbItem = await db.item.get({ name: item.name });
        if (dbItem) {
          await db.item.update(dbItem.id!, { price: item.price });
        } else {
          await db.item.add({ name: item.name, price: item.price });
        }
      }
      break;
  }
};

export const setRecipe = async (fileData: IMMDF__DATA, option?: TReaderOption) => {
  const recipes = fileData.recipe ?? [];
  switch (option) {
    case "option1":
      for (const recipe of recipes) {
        const dbRecipe = await db.recipe.get({ name: recipe.name });
        delete recipe.id;
        if (dbRecipe) {
          await db.recipe.update(dbRecipe.id!, recipe);
        } else {
          await db.recipe.add(recipe);
        }
      }
      break;
    case "force":
      // 모든 데이터를 초기화하고 새 데이터를 적용
      await db.recipe.clear();
      for (const recipe of recipes) {
        await db.recipe.add(recipe);
      }
      break;
    default:
      // 같은 이름의 레시피가 존재하지 않는 경우에 새 데이터를 적용
      for (const recipe of recipes) {
        const dbRecipe = await db.recipe.get({ name: recipe.name });
        delete recipe.id;
        if (!dbRecipe) await db.recipe.add(recipe);
      }
      break;
  }
};

export const setItemLog = async (fileData: IMMDF__DATA, option?: TReaderOption) => {
  const itemLogs = fileData.itemLog ?? [];
  switch (option) {
    case "force":
      // 모든 데이터를 초기화하고 새 데이터를 적용
      await db.itemLog.clear();
      for (const itemLog of itemLogs) {
        await db.itemLog.add(itemLog);
      }
      break;
    default:
      for (const itemLog of itemLogs) {
        delete itemLog.id;
        await db.itemLog.add(itemLog);
      }
      break;
  }
};

export const setLedger = async (fileData: IMMDF__DATA, option?: TReaderOption) => {
  const ledgers = fileData.ledger ?? [];
  switch (option) {
    case "force":
      // 모든 데이터를 초기화하고 새 데이터를 적용
      await db.ledger.clear();
      for (const ledger of ledgers) {
        await db.ledger.add(ledger);
      }
      break;
    default:
      for (const ledger of ledgers) {
        delete ledger.id;
        await db.ledger.add(ledger);
      }
      break;
  }
};
