import { IDBItem, IDBItemLog, IDBLedger, IDBRecipe } from "../db";
import { getDateText } from "./time";

export type TFile = "backup" | "recipe" | "item" | "itemLog" | "ledger" | "setting";

interface IMeta {
  type: TFile;
}

interface IMMDF__prototype {
  item?: IDBItem[];
  recipe?: IDBRecipe[];
  itemLog?: IDBItemLog[];
  ledger?: IDBLedger[];
}

export interface IMMDF__data extends IMMDF__prototype {
  backup?: IMMDF__prototype;
}

export interface IMMDF {
  meta: IMeta;
  data: IMMDF__data;
}

export function download(data: any, type: TFile) {
  const DATA: IMMDF = { meta: { type }, data };
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
  return new Promise<any>((resolve, rejects) => {
    const LINK = document.createElement("input");
    LINK.type = "file";
    LINK.accept = ".txt";
    LINK.addEventListener("change", () => {
      if (LINK.files && LINK.files.length > 0) {
        try {
          const FILE = LINK.files[0];
          const READER = new FileReader();
          READER.readAsText(FILE);
          READER.onload = () => {
            document.body.removeChild(LINK);
            const obj = JSON.parse(READER.result as string);
            resolve(obj);
          };
        } catch (error) {
          rejects(error);
        }
      } else {
        rejects();
      }
    });
    LINK.click();
  });
}
