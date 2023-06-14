import { db, TTransactionType } from "../db";
import {
  SAME_PRICE,
  UPDATE_ITEM,
  UPDATE_ITEM_ERR,
  UPDATE_LEDGER,
  UPDATE_LEDGER_ERR,
} from "../lang/noti";
import { Noti } from "../lib/notification";

export const updateItem = async (
  itemID: number,
  price: number,
  force?: boolean,
  type?: TTransactionType
) => {
  const prevPrice = (await db.item.get(itemID))?.price ?? 0;

  // 아이템 가격이 이전과 동일한 경우
  if (!force && prevPrice === price) {
    Noti.warning(SAME_PRICE);
    return;
  }

  try {
    // Update Item price
    await db.item.update(itemID, { price });
    // Add itemLog
    await db.itemLog.add({ item: itemID, price, updated: new Date(), type });
    Noti.success(UPDATE_ITEM);
  } catch (err) {
    // Dexie error
    console.error(err);
    Noti.danger(UPDATE_ITEM_ERR);
  }
};

export const updateLedger = async (
  itemID: number,
  price: number,
  count: number,
  type: TTransactionType
) => {
  const sign = type === "buy" ? -1 : 1;
  const diff = price * count * sign;
  const assets = ((await db.user.get({ key: "assets" }))?.value ?? 0) + diff;

  try {
    // Update assets
    await db.user.put({ key: "assets", value: assets });
    // Add ledger
    await db.ledger.add({ item: itemID, price, count, type, updated: new Date(), assets });
    Noti.success(UPDATE_LEDGER);
    // Update item
    await updateItem(itemID, price, true, type);
  } catch (err) {
    // Dexie error
    console.error(err);
    Noti.danger(UPDATE_LEDGER_ERR);
  }
};

export const buyItem = async (itemID: number, price: number, count: number) => {
  await updateLedger(itemID, price, count, "buy");
};

export const sellItem = async (itemID: number, price: number, count: number) => {
  await updateLedger(itemID, price, count, "sell");
};
