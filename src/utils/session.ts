import {
  STORAGE_ACCESS_TOKEN_KEY,
  STORAGE_CODE_KEY,
  STORAGE_REFRESH_TOKEN_KEY,
} from "../constants/session";

export const getCode = () => sessionStorage.getItem(STORAGE_CODE_KEY);

export const saveCode = (code: string) =>
  sessionStorage.setItem(STORAGE_CODE_KEY, code);

export const getTokens = (): {
  accessToken: string | null;
  refreshToken: string | null;
} => ({
  accessToken: sessionStorage.getItem(STORAGE_ACCESS_TOKEN_KEY),
  refreshToken: sessionStorage.getItem(STORAGE_REFRESH_TOKEN_KEY),
});

export const saveTokens = (accessToken: string, refreshToken: string): void => {
  sessionStorage.setItem(STORAGE_ACCESS_TOKEN_KEY, accessToken);
  sessionStorage.setItem(STORAGE_REFRESH_TOKEN_KEY, refreshToken);
};
