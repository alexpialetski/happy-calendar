import { useEffect, useState, createContext, useCallback } from "react";

import { getUserInfo } from "../service/user.service";
import { User } from "../types/user";
import { getTokens, saveCode } from "../utils/session";

export const UserContext = createContext<{
  user?: User;
  login: () => void;
}>({
  login: () => {
    return;
  },
});

export type UserContextProviderProps = {};

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { accessToken, refreshToken } = getTokens();
  const urlCode = new URLSearchParams(window.location.search).get("code");
  const [user, setUser] = useState<User>();
  const [code, setCode] = useState<string>();

  const login = useCallback(() => getUserInfo().then(setUser), []);

  useEffect(() => {
    if (accessToken || refreshToken || code) {
      login();
    }
  }, [accessToken, refreshToken, code, login]);

  useEffect(() => {
    if (urlCode) {
      saveCode(urlCode);
      setCode(urlCode);
    }
  }, [urlCode]);

  return (
    <UserContext.Provider value={{ user, login }}>
      {children}
    </UserContext.Provider>
  );
};
