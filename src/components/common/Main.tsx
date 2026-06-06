import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { loginAPI, autoLoginAPI } from "@/api/user";
import { clearSessionToken, saveSessionToken } from "@/utils/auth";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function Main() {
  const navigate = useNavigate();
  const location = useLocation();

  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [autoLogin, setAutoLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const prefillNickname = (location.state as { prefillNickname?: string })
      ?.prefillNickname;
    if (prefillNickname) {
      setNickname(prefillNickname);
    }
  }, [location.state]);

  useEffect(() => {
    const checkSession = async () => {
      const isFromFarming = sessionStorage.getItem("visitedFarming") === "true";
      if (isFromFarming) {
        sessionStorage.removeItem("visitedFarming");
        setLoading(false);
        return;
      }

      const savedToken = localStorage.getItem("session_token");

      if (savedToken) {
        try {
          const data = await autoLoginAPI(savedToken);

          navigate("/farming", { state: { userData: data } });
          return;
        } catch (err) {
          console.error("자동 로그인 세션 만료:", err);
          clearSessionToken();
        }
      }
      setLoading(false);
    };

    checkSession();
  }, [navigate]);

  const handleLogin = async () => {
    if (!nickname || !password) {
      alert("닉네임과 암호를 입력하세요.");
      return;
    }

    try {
      setLoading(true);

      const data = await loginAPI(nickname, password, autoLogin);

      if (data.session_token) {
        saveSessionToken(data.session_token, autoLogin);
      }

      navigate("/farming", { state: { userData: data } });
    } catch (err: any) {
      alert(err?.response?.data?.detail || "로그인 실패");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !nickname) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm">
        <div className="rounded-3xl border border-amber-500/20 bg-slate-900/95 px-6 py-4 shadow-xl shadow-amber-500/20">
          메이플 세션을 확인 중입니다...
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-tr from-amber-500/10 via-transparent to-transparent" />
      <div className="pointer-events-none absolute left-8 top-16 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute right-8 bottom-16 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />

      <Card className="relative z-10 w-full max-w-lg overflow-hidden rounded-[2rem] border border-amber-500/15 bg-slate-950/95 p-8 shadow-[0_35px_100px_-60px_rgba(251,146,60,0.8)]">
        <div className="flex flex-col gap-3 mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs uppercase tracking-[0.32em] text-amber-200">
            🍁 Maple Tracker
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white">
              캐릭터 사냥 관리
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              닉네임과 암호를 입력하면 현재 캐릭터의 사냥 정보를 불러옵니다.
              자동 로그인을 켜면 다음 방문부터 바로 접속합니다.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-4">
            <p className="text-xs uppercase tracking-[0.26em] text-amber-300/80">
              로그인 안내
            </p>
            <p className="mt-2 text-sm text-slate-300">
              닉네임과 암호를 입력하면 현재 캐릭터의 사냥 정보를 불러옵니다.
              자동 로그인을 켜면 다음 방문부터 바로 접속합니다.
            </p>
          </div>

          <div className="grid gap-4">
            <Input
              placeholder="닉네임"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="bg-slate-950 border-amber-500/20 text-white placeholder:text-slate-500"
            />

            <Input
              type="password"
              placeholder="암호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-slate-950 border-amber-500/20 text-white placeholder:text-slate-500"
            />

            <div className="flex items-center justify-between gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  id="autoLogin"
                  checked={autoLogin}
                  onChange={(e) => setAutoLogin(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-amber-500 accent-amber-500"
                />
                자동 로그인 유지
              </label>
              <span className="text-xs text-slate-500">7일간 유지</span>
            </div>

            <Button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold"
            >
              {loading ? "접속 중..." : "메이플 입장"}
            </Button>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-center text-xs text-slate-500">
          서버 인증 기반 Maple Tracker 시스템
        </div>
      </Card>
    </div>
  );
}
