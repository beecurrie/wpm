import React from "react";
import { Route, Routes } from "react-router-dom";
import Start from "./components/Start";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import LogOut from "./components/LogOut";
import ProtectedRoutes from "./components/ProtectedRoutes";
import UpdateProfile from "./components/UpdateProfile";
import ChangePassword from "./components/ChangePassword";
import ForgotPassword from "./components/ForgotPassword";
import ShowUsers from "./components/ShowUsers";
import UnderConstruction from "./components/underConstruction";

const App = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/forgot" element={<ForgotPassword />} />

      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<Start />} />
        <Route path="/dashboard" element={<Start />} />
        <Route path="/logout" element={<LogOut />} />
        <Route
          path="/updateuser"
          element={<UpdateProfile shownav={true} userdata={user} />}
        />
        <Route path="/changepassword" element={<ChangePassword />} />

        <Route path="/undercons" element={<UnderConstruction />} />
      </Route>
    </Routes>
  );
};

export default App;
