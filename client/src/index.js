import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import ThemeProvider from "react-bootstrap/ThemeProvider";

import App from "./App";
import { PasswordsContextProvider } from "./context/PasswordsContext";

// Importing the Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

import "./index.css";

ReactDOM.render(
  <PasswordsContextProvider>
    <BrowserRouter>
      <ThemeProvider
        breakpoints={["xxxl", "xxl", "xl", "lg", "md", "sm", "xs", "xxs"]}
        minBreakpoint="xl"
      >
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </PasswordsContextProvider>,
  document.getElementById("root")
);
