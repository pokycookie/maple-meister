import { configureStore, createAction, createReducer } from "@reduxjs/toolkit";
import { TPage } from "./types";
import { IDBItem, IDBRecipe } from "./db";

export interface IReduxStore {
  page: TPage;
  itemList: IDBItem[];
  recipeList: IDBRecipe[];
  modalID: string | null;
}

const initState: IReduxStore = {
  page: "timer",
  itemList: [],
  recipeList: [],
  modalID: null,
};

export const RSetPage = createAction<TPage>("PAGE");
export const RSetItemList = createAction<IDBItem[]>("ITEMLIST");
export const RSetRecipeList = createAction<IDBRecipe[]>("RECIPELIST");
export const RSetModalID = createAction<string | null>("MODALID");

const reducer = createReducer(initState, (builder) => {
  builder
    .addCase(RSetPage, (state, action) => {
      state.page = action.payload;
    })
    .addCase(RSetItemList, (state, action) => {
      state.itemList = action.payload;
    })
    .addCase(RSetRecipeList, (state, action) => {
      state.recipeList = action.payload;
    })
    .addCase(RSetModalID, (state, action) => {
      state.modalID = action.payload;
    });
});

export default configureStore({
  reducer,
});
