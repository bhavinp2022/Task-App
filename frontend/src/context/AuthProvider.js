import { createContext, useState } from "react";
import { USER_STORE_KEY } from "../constants/localstorage";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: localStorage.getItem(USER_STORE_KEY),
  });

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
