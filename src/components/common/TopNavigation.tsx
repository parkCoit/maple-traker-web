import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutAPI } from "@/api/user";
import { clearSessionToken, getSessionToken } from "@/utils/auth";
export default function TopNavigation() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const handleLogout = async () => {
    const sessionToken = getSessionToken();
    if (sessionToken) {
      try {
        await logoutAPI(sessionToken);
      } catch (error) {
        console.warn("로그아웃 요청 실패", error);
      }
    }
    clearSessionToken();
    navigate("/");
  };
  return (
    <header className="h-14 bg-[#0f0f20] border-b border-[#1e1e38] flex items-center justify-between px-4 md:px-6 flex-shrink-0 relative z-20">
      {/* 로고 */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 flex items-center justify-center">
          <i className="ri-sword-line text-[#c8a84b] text-xl" />
        </div>
        <span className="text-white font-bold text-base tracking-tight">
          Maple Tracker
        </span>
      </div>
      {/* 데스크탑 우측 */}
      <div className="hidden md:flex items-center gap-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#8a8aaa] hover:text-[#ff6b6b] hover:bg-[#8b1a1a]/20 transition-colors cursor-pointer whitespace-nowrap"
        >
          <div className="w-4 h-4 flex items-center justify-center">
            <i className="ri-logout-box-r-line text-sm" />
          </div>
          로그아웃
        </button>
      </div>
      {/* 모바일 우측 */}
      <div className="flex md:hidden items-center gap-2">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#1a1a30] border border-[#2a2a4a] text-[#8a8aaa] hover:text-white transition-colors cursor-pointer"
        >
          <i
            className={`${menuOpen ? "ri-close-line" : "ri-menu-line"} text-lg`}
          />
        </button>
      </div>
      {/* 모바일 드롭다운 */}
      {menuOpen && (
        <div className="absolute top-14 left-0 right-0 bg-[#0f0f20] border-b border-[#1e1e38] md:hidden z-50">
          <div className="px-4 py-3 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-[#ff6b6b] bg-[#8b1a1a]/10 border border-[#8b1a1a]/20 cursor-pointer whitespace-nowrap"
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-logout-box-r-line text-sm" />
              </div>
              로그아웃
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
