import axios from "axios";
import { VITE_API_BASE_URL } from "@/secret.json";

// const API_BASE_URL = "http://localhost:8000";

const api = axios.create({
  baseURL: VITE_API_BASE_URL,
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

export const getFarmingLogs = async (
  nickname: string,
  opts?: { year?: number; month?: number },
) => {
  const params: Record<string, any> = {};
  if (opts?.year) params.year = opts.year;
  if (opts?.month) params.month = opts.month;
  const response = await api.get(`/farming/${nickname}`, { params });
  return response.data; // { nickname, summary, farming }
};
