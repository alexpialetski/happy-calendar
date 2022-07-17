import axios, { AxiosError } from "axios";

import { COGNITO_CLIENT_ID, COGNITO_DOMAIN } from "../constants/session";
import { getCode, getTokens, saveTokens } from "../utils/session";

export const axiosInstance = axios.create({
  baseURL: "https://p51bpqf1pj.execute-api.us-east-1.amazonaws.com/",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((request) => {
  request.headers = {
    ...(request.headers || {}),
    Authorization: `Bearer ${getTokens().accessToken}`,
  };

  return request;
}, undefined);

axiosInstance.interceptors.response.use(
  undefined,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      const { refreshToken } = getTokens();
      const code = getCode();
      const authHeaders = {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      };

      if (refreshToken) {
        const data = new URLSearchParams();
        data.append("grant_type", "refresh_token");
        data.append("client_id", COGNITO_CLIENT_ID);
        data.append("refresh_token", refreshToken);

        return axios
          .post<{ access_token: string }>(
            `${COGNITO_DOMAIN}/oauth2/token`,
            data,
            authHeaders
          )
          .then((res) => saveTokens(res.data.access_token, refreshToken))
          .then(() => axiosInstance.request(error.config));
      }

      if (code) {
        const data = new URLSearchParams();
        data.append("grant_type", "authorization_code");
        data.append("client_id", COGNITO_CLIENT_ID);
        data.append("redirect_uri", window.location.origin);
        data.append("code", code);

        return axios
          .post<{ access_token: string; refresh_token: string }>(
            `${COGNITO_DOMAIN}/oauth2/token`,
            data,
            authHeaders
          )
          .then(({ data: { access_token, refresh_token } }) =>
            saveTokens(access_token, refresh_token)
          )
          .then(() => axiosInstance.request(error.config));
      }

      return window.location.replace(
        `${COGNITO_DOMAIN}/login?response_type=code&client_id=${COGNITO_CLIENT_ID}&redirect_uri=${window.location.origin}`
      );
    }

    return Promise.reject(error);
  }
);
