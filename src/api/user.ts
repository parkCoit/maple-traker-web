import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const loginAPI = async (
  nickname: string,
  password: string,
  autoLogin: boolean,
) => {
  const response = await api.post("/auth/login", {
    nickname,
    password,
    auto_login: autoLogin,
  });
  return response.data;
};

export const autoLoginAPI = async (sessionToken: string) => {
  const response = await api.post("/auth/auto-login", {
    session_token: sessionToken,
  });
  return response.data;
};

export const logoutAPI = async (sessionToken: string) => {
  const response = await api.post("/auth/logout", {
    session_token: sessionToken,
  });
  return response.data;
};

export const getFarmingLogs = async (nickname: string) => {
  const response = await api.get(`/farming/${nickname}`);
  return response.data;
};
