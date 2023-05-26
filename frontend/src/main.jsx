import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// import AppContextProvider from "./AppContextProvider";
import App from "./App";
import "./index.css";
import { AuthContextProvider } from "./components/Auth";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthContextProvider>
    {/* <AppContextProvider> */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    {/* </AppContextProvider> */}
  </AuthContextProvider>
);
