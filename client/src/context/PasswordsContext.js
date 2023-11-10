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
      // console.log("index:", action.payload[0]); //index of the array to change: Gilberto/11-Nov-23

      const newPasswords = [...state.passwords];
      newPasswords[action.payload[0]] = action.payload[1]; //returned object from backend: Gilberto/11-Nov-23

      //console.log("new passwords: ", newPasswords); //the new passwords array to replace the current state variable passwords (state.passwords): Gilberto/11-Nov-23
      return {
        passwords: [...newPasswords], //update state variable passwords (state.passwords): Gilberto/11-Nov-23
      };

    case "DELETE_PASSWORD":
      return {
        passwords: state.passwords.filter((pw) => pw._id !== action.payload), //return the new array of passwords without the one that was deleted: Gilberto/11-Nov-23
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
