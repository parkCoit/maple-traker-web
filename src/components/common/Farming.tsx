import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { autoLoginAPI } from "@/api/user";
import { getSessionToken, clearSessionToken } from "@/utils/auth";
import { CharacterCard } from "@/components/farming/CharacterCard";
import { FarmingSummary } from "@/components/farming/FarmingSummary";
import { FarmingCalendar } from "@/components/farming/FarmingCalendar";
import { FarmingTable } from "@/components/farming/FarmingTable";
import WeeklyChart from "@/components/farming/WeeklyChart";
import type { DisplayFarmingLog, MapleInfo } from "@/types/farming";

const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

type FarmingSummaryData = {
  today_total: number;
  week_total: number;
  month_total: number;
};

type ServerFarmingLog = {
  date: string;
  level?: number;
  exp_pct?: number;

  meso_man: number;
  frags: number;
  gems: number;

  f_price?: number;
  g_price?: number;

  stuff: number;

  total_meso: number;
};

type FarmingResponse = {
  nickname: string;
  session_token: string;

  maple: MapleInfo;

  summary: FarmingSummaryData;

  farming: ServerFarmingLog[];
};

const getWeekOfMonth = (date: Date) => {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const offsetDate = date.getDate() + firstDay - 1;
  return Math.floor(offsetDate / 7) + 1;
};

const buildCalendar = (
  year: number,
  month: number,
  logs: Map<string, DisplayFarmingLog>,
) => {
  const firstOfMonth = new Date(year, month - 1, 1);
  const lastOfMonth = new Date(year, month, 0);
  const totalDays = lastOfMonth.getDate();
  const startOffset = firstOfMonth.getDay();

  return {
    startOffset,
    days: Array.from({ length: totalDays }, (_, index) => {
      const date = new Date(year, month - 1, index + 1);
      const key = date.toISOString().slice(0, 10);
      return { date, log: logs.get(key) };
    }),
  };
};

export function Farming() {
  const location = useLocation();
  const navigate = useNavigate();

  const initialData =
    (location.state as { userData?: FarmingResponse })?.userData ?? null;

  const [userData, setUserData] = useState<FarmingResponse | null>(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  useEffect(() => {
    if (userData) {
      sessionStorage.setItem("visitedFarming", "true");
      return;
    }

    const restoreSession = async () => {
      const token = getSessionToken();
      if (!token) {
        navigate("/", { replace: true });
        return;
      }

      setLoading(true);
      try {
        const data = await autoLoginAPI(token);
        setUserData(data);
      } catch (error) {
        clearSessionToken();
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, [userData, navigate]);

  const logs = useMemo<DisplayFarmingLog[]>(() => {
    if (!userData) return [];

    return userData.farming.map((log) => ({
      date: log.date,
      stuff: log.stuff,
        // convert server 'man' units to raw meso
        meso: (log.meso_man ?? log.meso ?? 0) * 10000,
      frags: log.frags,
      gems: log.gems,
        total: (log.total_meso ?? log.total ?? 0) * 10000,
    }));
  }, [userData]);

  const monthOptions = useMemo(() => {
    const uniqueMonths = Array.from(
      new Set(
        logs.map((log) => {
          const date = new Date(log.date);
          return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        }),
      ),
    );

    return uniqueMonths.sort((a, b) => (a > b ? -1 : 1));
  }, [logs]);

  useEffect(() => {
    if (monthOptions.length && !monthOptions.includes(selectedMonth)) {
      setSelectedMonth(monthOptions[0]);
    }
  }, [monthOptions, selectedMonth]);

  const currentDate = new Date();
  const [selectedYear, selectedMonthIndex] = selectedMonth
    .split("-")
    .map(Number);

  const monthlyLogs = logs.filter((log) => {
    const date = new Date(log.date);
    return (
      date.getFullYear() === selectedYear &&
      date.getMonth() === selectedMonthIndex - 1
    );
  });

  const currentWeek = getWeekOfMonth(currentDate);
  const { today_total, week_total, month_total } = userData.summary;

  const logsByDate = useMemo(
    () =>
      new Map<string, DisplayFarmingLog>(
        monthlyLogs.map((log) => [log.date, log]),
      ),
    [monthlyLogs],
  );

  const calendar = useMemo(
    () => buildCalendar(selectedYear, selectedMonthIndex, logsByDate),
    [selectedYear, selectedMonthIndex, logsByDate],
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
        <div className="rounded-3xl border border-amber-500/15 bg-slate-900/95 px-8 py-6 shadow-xl shadow-amber-500/20">
          캐릭터 데이터를 불러오는 중입니다...
        </div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  const maple = userData.maple;

  return (
    <div className="flex flex-col min-h-screen bg-[#0b0b18] text-slate-100 overflow-hidden">
      <div className={`flex-1 overflow-y-auto`}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-6 space-y-4 md:space-y-6">
          {/* 캐릭터 + 수입요약 */}
          <div className="space-y-4">
            <CharacterCard
              data={{
                name: maple.character_name,
                world: maple.world_name,
                job: maple.character_class,
                level: maple.character_level,
                exp: maple.character_exp,
                image: maple.character_image,
              }}
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">
            <div className="lg:col-span-2 h-full">
              <FarmingSummary
                today={today_total}
                week={week_total}
                month={month_total}
                currentWeek={currentWeek}
              />
            </div>
            <div className="lg:col-span-3 h-full">
              {/* 달력 */}
              <FarmingCalendar
                selectedMonth={selectedMonth}
                monthOptions={monthOptions}
                onMonthChange={setSelectedMonth}
                dayNames={dayNames}
                calendarDays={calendar.days}
                startOffset={calendar.startOffset}
              />
            </div>
          </div>
          <div className="mt-6">
            <WeeklyChart />
          </div>
          {/* 로그 테이블 */}
          <div className="rounded-2xl border border-white/5 bg-white/3 p-5 md:p-6">
            <FarmingTable logs={monthlyLogs} nickname={userData.nickname} />
          </div>
        </div>
      </div>
    </div>
  );
}
