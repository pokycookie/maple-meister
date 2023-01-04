import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import "./styles/index.scss";
import MyApp from "./timeSelector";
import TimePicker from "./components/timePicker/timePicker";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    {/* <App /> */}
    {/* <MyApp /> */}
    <TimePicker />
  </React.StrictMode>
);

serviceWorkerRegistration.register();
