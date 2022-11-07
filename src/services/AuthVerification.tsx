import React from "react";
import { useLocation } from "react-router-dom";

const parseJWT = (token: string) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

interface AuthVerificationProps {
  logout: any;
}

const AuthVerification: React.FC<AuthVerificationProps> = ({ logout }) => {
  let location = useLocation();

  React.useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user) {
      const decodedJWT = parseJWT(user);
      if (decodedJWT.exp * 1000 < Date.now()) {
        logout();
      }
    }
  }, [location]);

  return <></>;
};

export default AuthVerification;
