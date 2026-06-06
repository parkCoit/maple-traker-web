export const SESSION_TOKEN_KEY = "session_token";

export const getSessionToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem(SESSION_TOKEN_KEY) ||
    sessionStorage.getItem(SESSION_TOKEN_KEY)
  );
};

export const saveSessionToken = (token: string, autoLogin: boolean) => {
  if (typeof window === "undefined") return;

  if (autoLogin) {
    localStorage.setItem(SESSION_TOKEN_KEY, token);
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
  } else {
    sessionStorage.setItem(SESSION_TOKEN_KEY, token);
    localStorage.removeItem(SESSION_TOKEN_KEY);
  }
};

export const clearSessionToken = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_TOKEN_KEY);
  sessionStorage.removeItem(SESSION_TOKEN_KEY);
};
