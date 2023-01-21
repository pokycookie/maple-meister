import { configureStore, createAction, createReducer } from "@reduxjs/toolkit";
import { TPage } from "./types";
import { IDBItem } from "./db";

export interface IReduxStore {
  page: TPage;
  itemList: IDBItem[];
}

const initState: IReduxStore = {
  page: "timer",
  itemList: [],
};

export const RSetPage = createAction<TPage>("PAGE");
export const RSetItemList = createAction<IDBItem[]>("ITEMLIST");

const reducer = createReducer(initState, (builder) => {
  builder
    .addCase(RSetPage, (state, action) => {
      state.page = action.payload;
    })
    .addCase(RSetItemList, (state, action) => {
      state.itemList = action.payload;
    });
});

export default configureStore({
  reducer,
});
