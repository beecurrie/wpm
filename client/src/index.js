import React from "react";
import { BrowserRouter } from "react-router-dom";
import { BreakpointProvider } from "react-socks"; //added: 21-Oct-23 by GAG

import App from "./App";
import { PasswordsContextProvider } from "./context/PasswordsContext";

// Importing the Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

import "./index.css";

// The following is code React-17 and was causing a Warning Error: Gilberto - 04-Nov-2023
// ReactDOM.render(
//   <PasswordsContextProvider>
//     <BrowserRouter>
//       <BreakpointProvider>
//         <App />
//       </BreakpointProvider>
//     </BrowserRouter>
//   </PasswordsContextProvider>,
//   document.getElementById("root")
// );

//This fix below is for React-18 upgrade: Gilberto - 04-Nov-2023
import { createRoot } from "react-dom/client";
const container = document.getElementById("root");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <PasswordsContextProvider>
    <BrowserRouter>
      <BreakpointProvider>
        <App />
      </BreakpointProvider>
    </BrowserRouter>
  </PasswordsContextProvider>
);
