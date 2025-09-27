import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./features/admin/routes";
import { Provider } from "react-redux";
import store from "./features/admin/store";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
