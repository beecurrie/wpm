const LogOut = () => {
  const doLogOut = async () => {
    try {
      localStorage.setItem("auth", "false");
      localStorage.setItem("user", null);
      window.location.replace("/");
    } catch (err) {
      console.log(err);
    }
  };
  doLogOut();
};

export default LogOut;
