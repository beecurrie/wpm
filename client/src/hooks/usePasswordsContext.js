import { PasswordsContext } from "../context/PasswordsContext";
import { useContext } from "react";

export const usePasswordsContext = () => {
  const context = useContext(PasswordsContext);

  if (!context) {
    throw Error("Context must be used inside a ContextProvider");
  }

  return context;
};
