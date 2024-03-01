import React from "react";

import "./index.css";

import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

import { restoreCSRF, csrfFetch } from "./store/csrf";

import configureStore from "./store";
import { logout } from "./store/session";
import { Modal, ModalProvider } from "./context/Modal";

const store = configureStore();

if (process.env.NODE_ENV !== "production") {
  restoreCSRF();

  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = logout;
}

const rootElement = document.getElementById("root");
ReactDOM.createRoot(rootElement).render(
  <ModalProvider>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Modal />
      </BrowserRouter>
    </Provider>
  </ModalProvider>
);
