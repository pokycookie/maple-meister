import { db, TTransactionType } from "../db";
import {
  CREATE_ITEM,
  CREATE_ITEM_ERR,
  DELETE_ITEM,
  DELETE_ITEMLOG,
  DELETE_ITEMLOG_ERR,
  DELETE_ITEM_ERR,
  DELETE_ITEM_RELATED_ERR,
  DELETE_LEDGER,
  DELETE_LEDGER_ERR,
  ITEM_NAME_ERR,
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

export const createItem = async (itemName: string) => {
  // itemName이 비어있거나 공백인 경우
  if (itemName.trim() === "") {
    Noti.warning(ITEM_NAME_ERR);
    return;
  }

  try {
    // Create new item
    await db.item.add({ name: itemName, price: 0 });
    Noti.success(CREATE_ITEM);
  } catch (err) {
    // Dexie error
    console.error(err);
    Noti.danger(CREATE_ITEM_ERR);
  }
};

export const deleteItem = async (itemID: number) => {
  // 해당 itemID를 재료로 사용하고 있는 레시피 배열
  const relatedRecipe = await db.recipe
    .filter(
      (recipe) =>
        recipe.items.some((recipeItem) => recipeItem.id === itemID) || recipe.resultItem === itemID
    )
    .toArray();

  switch (relatedRecipe.length) {
    case 0:
      // 해당 itemID를 재료로 사용하는 레시피가 존재하지 않는 경우
      try {
        // Delete item
        await db.item.delete(itemID);
        Noti.success(DELETE_ITEM);
      } catch (err) {
        // Dexie error
        console.error(err);
        Noti.danger(DELETE_ITEM_ERR);
      }
      break;
    case 1:
      // 해당 itemID를 재료로 사용하는 레시피가 1개 존재하는 경우
      Noti.warning(DELETE_ITEM_RELATED_ERR);
      break;
    default:
      // 해당 itemID를 재료로 사용하는 레시피가 다수 존재하는 경우
      Noti.warning(DELETE_ITEM_RELATED_ERR);
      break;
  }
};

export const deleteItemLog = async (logID: number) => {
  try {
    // Delete itemLog
    await db.itemLog.delete(logID);
    Noti.success(DELETE_ITEMLOG);
  } catch (err) {
    // Dexie error
    console.error(err);
    Noti.danger(DELETE_ITEMLOG_ERR);
  }
};

export const deleteLedger = async (id: number) => {
  try {
    // Delete ledger
    await db.ledger.delete(id);
    Noti.success(DELETE_LEDGER);
  } catch (err) {
    // Dexie error
    console.error(err);
    Noti.danger(DELETE_LEDGER_ERR);
  }
};
