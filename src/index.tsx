import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import redux from "./redux";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import "./styles/index.scss";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={redux}>
      <App />
    </Provider>
  </React.StrictMode>
);

serviceWorkerRegistration.register();
