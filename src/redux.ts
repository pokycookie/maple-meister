import { configureStore, createAction, createReducer } from "@reduxjs/toolkit";
import { TPage } from "./types";

export interface IReduxStore {
  page: TPage;
}

const initState: IReduxStore = {
  page: "timer",
};

export const RSetPage = createAction<TPage>("PAGE");

const reducer = createReducer(initState, (builder) => {
  builder.addCase(RSetPage, (state, action) => {
    state.page = action.payload;
  });
});

export default configureStore({
  reducer,
});
