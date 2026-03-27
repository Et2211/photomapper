"use client";

import { Provider } from "react-redux";

import AuthProvider from "./AuthProvider";
import { store } from "./index";

const StoreProvider = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>
    <AuthProvider>{children}</AuthProvider>
  </Provider>
);

export default StoreProvider;
