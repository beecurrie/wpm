import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import ThemeProvider from "react-bootstrap/ThemeProvider";
import { BreakpointProvider } from "react-socks"; //added: 21-Oct-23 by GAG

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
        <BreakpointProvider>
          <App />
        </BreakpointProvider>
      </ThemeProvider>
    </BrowserRouter>
  </PasswordsContextProvider>,
  document.getElementById("root")
);
