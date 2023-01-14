import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import redux from "./redux";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import "./styles/index.scss";
import { ReactNotifications } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <Provider store={redux}>
      <ReactNotifications />
      <App />
    </Provider>
  </React.StrictMode>
);

serviceWorkerRegistration.register();
