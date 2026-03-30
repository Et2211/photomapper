import { configureStore } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";

import type { RootState } from "@/store";
import authReducer from "@/store/authSlice";
import { photosApi } from "@/store/photosApi";
import uiReducer from "@/store/uiSlice";

type PartialState = Partial<RootState>;

export const createTestStore = (preloadedState: PartialState = {}) =>
  configureStore({
    reducer: {
      [photosApi.reducerPath]: photosApi.reducer,
      auth: authReducer,
      ui: uiReducer,
    },
    middleware: (getDefault) => getDefault().concat(photosApi.middleware),
    preloadedState: preloadedState as RootState,
  });

export const renderWithProviders = (
  ui: React.ReactElement,
  { preloadedState = {} }: { preloadedState?: PartialState } = {},
) => {
  const store = createTestStore(preloadedState);
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store,
  };
};
