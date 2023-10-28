import { createContext, useReducer } from "react";

export const PasswordsContext = createContext();

export const passwordsReducer = (state, action) => {
  switch (action.type) {
    case "SET_PASSWORDS":
      return {
        passwords: action.payload,
      };
    case "CREATE_PASSWORD":
      return {
        passwords: [action.payload, ...state.passwords],
      };
    case "UPDATE_PASSWORD":
      return {
        passwords: [...state.passwords],
      };
    case "CLOSE_PASSWORD":
      return {
        passwords: [...state.passwords],
      };
    case "DELETE_PASSWORD":
      return {
        passwords: state.passwords.filter((pw) => pw._id !== action.payload),
      };
    case "SET_USERS":
      return {
        usersList: action.payload,
      };
    case "CREATE_USER":
      return {
        usersList: [action.payload, ...state.usersList],
      };
    case "DELETE_USER":
      return {
        usersList: state.usersList.filter(
          (obs) => obs._id !== action.payload._id
        ),
      };
    case "UPDATE_USER":
      return { usersList: [...state.usersList] };

    default:
      return state;
  }
};

export const PasswordsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(passwordsReducer, {
    passwords: [],
  });

  return (
    <PasswordsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </PasswordsContext.Provider>
  );
};
