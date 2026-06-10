import { useState, useMemo } from "react";
import { useServerRecords } from "@/hooks/useServerRecords";
import type { ServerRecord as HuntRecord } from "@/hooks/useServerRecords";
import { formatKoreanCurrency } from "@/utils/format";

function getTotalMeso(record: HuntRecord): number {
  // record.netMeso, fragmentPrice, kojamPrice are stored in raw meso units
  return (
    (record.netMeso ?? 0) +
    (record.fragments ?? 0) * (record.fragmentPrice ?? 0) +
    (record.kojam ?? 0) * (record.kojamPrice ?? 0)
  );
}
function getWeekRange(
  year: number,
  month: number,
  weekIndex: number,
): { start: string; end: string } {
  const firstDay = new Date(year, month, 1);
  const firstMonday = new Date(firstDay);
  const dow = firstDay.getDay();
  firstMonday.setDate(1 - ((dow + 6) % 7));
  const start = new Date(firstMonday);
  start.setDate(firstMonday.getDate() + weekIndex * 7);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return {
    start: start.toLocaleDateString("en-CA"),
    end: end.toLocaleDateString("en-CA"),
  };
}
function getWeeksInMonth(year: number, month: number): number {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstMonday = new Date(firstDay);
  const dow = firstDay.getDay();
  firstMonday.setDate(1 - ((dow + 6) % 7));
  let count = 0;
  const cur = new Date(firstMonday);
  while (cur <= lastDay) {
    count++;
    cur.setDate(cur.getDate() + 7);
  }
  return count;
}
const DAYS = ["월", "화", "수", "목", "금", "토", "일"];
const BAR_MAX_PX = 140;
export default function WeeklyChart() {
  const { records, loading, error, refetch } = useServerRecords();
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }),
  );
  const [selYear, setSelYear] = useState(now.getFullYear());
  const [selMonth, setSelMonth] = useState(now.getMonth());
  const totalWeeks = getWeeksInMonth(selYear, selMonth);
  const [selWeek, setSelWeek] = useState(0);
  const { start, end } = getWeekRange(selYear, selMonth, selWeek);
  const weekData = useMemo(() => {
    return DAYS.map((day, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const dateStr = d.toLocaleDateString("en-CA");
      const dayRecords = records.filter((r) => r.date === dateStr);
      const total = dayRecords.reduce((acc, r) => acc + getTotalMeso(r), 0);
      const materials = dayRecords.reduce((acc, r) => acc + r.materials, 0);
      const netMeso = dayRecords.reduce((acc, r) => acc + (r.netMeso ?? 0), 0);
      const fragments = dayRecords.reduce((acc, r) => acc + r.fragments, 0);
      const huntingTime = dayRecords.reduce(
        (acc, r) => acc + r.huntingHours * 60 + r.huntingMinutes,
        0,
      );
      return {
        day,
        date: dateStr,
        total,
        materials,
        netMeso,
        fragments,
        huntingTime,
      };
    });
  }, [records, start]);
  const maxVal = Math.max(...weekData.map((d) => d.total), 1);
  const weekStats = useMemo(() => {
    const totalMaterials = weekData.reduce((acc, d) => acc + d.materials, 0);
    const totalMeso = weekData.reduce((acc, d) => acc + d.netMeso, 0);
    const totalFragments = weekData.reduce((acc, d) => acc + d.fragments, 0);
    const totalHuntingMin = weekData.reduce((acc, d) => acc + d.huntingTime, 0);
    const avgMesoPerMat =
      totalMaterials > 0 ? Math.floor(totalMeso / totalMaterials) : 0;
    const avgFragPerMat =
      totalMaterials > 0 ? (totalFragments / totalMaterials).toFixed(1) : "0";
    return {
      totalMaterials,
      totalMeso,
      totalFragments,
      totalHuntingMin,
      avgMesoPerMat,
      avgFragPerMat,
    };
  }, [weekData]);
  const months = Array.from({ length: 12 }, (_, i) => i);
  const years = [now.getFullYear() - 1, now.getFullYear()];
  const todayStr = now.toLocaleDateString("en-CA", { timeZone: "Asia/Seoul" });
  if (loading) {
    return (
      <div className="bg-[#16162a] border border-[#2a2a4a] rounded-xl p-4 md:p-5 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#2a2a4a]" />
            <div className="w-20 h-4 rounded bg-[#2a2a4a]" />
          </div>
          <div className="flex gap-1.5">
            <div className="w-16 h-7 rounded bg-[#2a2a4a]" />
            <div className="w-14 h-7 rounded bg-[#2a2a4a]" />
            <div className="w-14 h-7 rounded bg-[#2a2a4a]" />
          </div>
        </div>
        <div className="w-32 h-3 rounded bg-[#2a2a4a] mb-5" />
        <div className="flex items-end gap-2 h-47 mb-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full max-w-12 rounded-t-lg bg-[#2a2a4a]"
                style={{ height: `${40 + i * 16}px` }}
              />
              <div className="w-4 h-3 rounded bg-[#2a2a4a]" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-2 bg-[#0d0d1a] rounded-lg p-2.5 border border-[#1e1e38]"
            >
              <div className="w-7 h-7 rounded bg-[#2a2a4a] shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="w-16 h-2.5 rounded bg-[#2a2a4a]" />
                <div className="w-10 h-3 rounded bg-[#2a2a4a]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-[#16162a] border border-[#2a2a4a] rounded-xl p-4 md:p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 flex items-center justify-center">
            <i className="ri-bar-chart-2-line text-[#c8a84b] text-base" />
          </div>
          <h3 className="text-white text-sm font-semibold">주간 수익</h3>
        </div>
        <div className="text-center py-8">
          <div className="w-10 h-10 flex items-center justify-center mx-auto mb-3">
            <i className="ri-error-warning-line text-[#ff6b6b] text-2xl" />
          </div>
          <p className="text-[#8a8aaa] text-sm mb-1">
            데이터를 불러오지 못했습니다
          </p>
          <p className="text-[#5a5a7a] text-xs mb-4">{error}</p>
          <button
            onClick={refetch}
            className="inline-flex items-center gap-1.5 bg-[#c8a84b] text-[#0d0d1a] px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#f0d060] transition-colors cursor-pointer"
          >
            <i className="ri-refresh-line" />
            다시 시도
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-[#16162a] border border-[#2a2a4a] rounded-xl p-4 md:p-5">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center">
            <i className="ri-bar-chart-2-line text-[#c8a84b] text-base" />
          </div>
          <h3 className="text-white text-sm font-semibold">주간 수익</h3>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <select
            value={selYear}
            onChange={(e) => {
              setSelYear(Number(e.target.value));
              setSelWeek(0);
            }}
            className="bg-[#0d0d1a] border border-[#2a2a4a] rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:border-[#c8a84b]/60 cursor-pointer"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}년
              </option>
            ))}
          </select>
          <select
            value={selMonth}
            onChange={(e) => {
              setSelMonth(Number(e.target.value));
              setSelWeek(0);
            }}
            className="bg-[#0d0d1a] border border-[#2a2a4a] rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:border-[#c8a84b]/60 cursor-pointer"
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {m + 1}월
              </option>
            ))}
          </select>
          <select
            value={selWeek}
            onChange={(e) => setSelWeek(Number(e.target.value))}
            className="bg-[#0d0d1a] border border-[#2a2a4a] rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:border-[#c8a84b]/60 cursor-pointer"
          >
            {Array.from({ length: totalWeeks }, (_, i) => (
              <option key={i} value={i}>
                {i + 1}주차
              </option>
            ))}
          </select>
        </div>
      </div>
      <p className="text-[#5a5a7a] text-xs mb-5">
        {start} ~ {end}
      </p>
      <div
        className="relative w-full mb-2"
        style={{ height: `${BAR_MAX_PX + 48}px` }}
      >
        {[0.25, 0.5, 0.75, 1].map((ratio) => (
          <div
            key={ratio}
            className="absolute left-0 right-0 border-t border-[#1e1e38]"
            style={{ bottom: `${48 + ratio * BAR_MAX_PX}px` }}
          >
            <span className="absolute right-0 -top-3 text-[9px] text-[#3a3a5a]">
              {formatKoreanCurrency(Math.round(maxVal * ratio))}
            </span>
          </div>
        ))}
        <div
          className="absolute inset-x-0 bottom-0 flex items-end gap-1 sm:gap-2"
          style={{ height: `${BAR_MAX_PX + 48}px` }}
        >
          {weekData.map((d) => {
            const barH =
              d.total > 0
                ? Math.max(Math.round((d.total / maxVal) * BAR_MAX_PX), 4)
                : 0;
            const isToday = d.date === todayStr;
            return (
              <div
                key={d.day}
                className="flex-1 flex flex-col items-center"
                style={{ height: `${BAR_MAX_PX + 48}px` }}
              >
                <div className="flex-1 flex items-end justify-center pb-1">
                  {d.total > 0 && (
                        <span
                          className={`text-[9px] font-medium leading-none ${isToday ? "text-[#c8a84b]" : "text-[#5a5a7a]"}`}
                        >
                          {formatKoreanCurrency(d.total)}
                    </span>
                  )}
                </div>
                <div
                  className={`w-full max-w-12 rounded-t-lg transition-all duration-500 ${
                    isToday
                      ? "bg-linear-to-t from-[#c8a84b] to-[#f0d060]"
                      : d.total > 0
                        ? "bg-linear-to-t from-[#3a3a6a] to-[#5a5a9a] hover:from-[#4a4a7a] hover:to-[#6a6aaa]"
                        : "bg-[#1a1a2a]"
                  }`}
                  style={{ height: `${barH}px` }}
                />
                <div className="h-8 flex flex-col items-center justify-center gap-0.5 mt-1">
                  <span
                    className={`text-xs font-medium ${isToday ? "text-[#c8a84b]" : "text-[#5a5a7a]"}`}
                  >
                    {d.day}
                  </span>
                  {isToday && (
                    <div className="w-1 h-1 rounded-full bg-[#c8a84b]" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="pt-4 border-t border-[#2a2a4a] grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          {
            icon: "ri-time-line",
            label: "총 사냥시간",
            value: `${Math.floor(weekStats.totalHuntingMin / 60)}시간 ${weekStats.totalHuntingMin % 60}분`,
          },
          {
            icon: "ri-archive-line",
            label: "사용 소재",
            value: `${weekStats.totalMaterials}개`,
          },
          {
            icon: "ri-money-cny-circle-line",
            label: "총 메소",
            value:
              weekStats.totalMeso > 0
                ? formatKoreanCurrency(weekStats.totalMeso)
                : "—",
          },
          {
            icon: "ri-focus-2-line",
            label: "총 조각",
            value: `${weekStats.totalFragments}개`,
          },
          {
            icon: "ri-line-chart-line",
            label: "소재당 평균 메소",
            value:
              weekStats.totalMaterials > 0
                ? formatKoreanCurrency(weekStats.avgMesoPerMat)
                : "—",
          },
          {
            icon: "ri-stack-line",
            label: "소재당 평균 조각",
            value:
              weekStats.totalMaterials > 0
                ? `${weekStats.avgFragPerMat}개`
                : "—",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-2 bg-[#0d0d1a] rounded-lg p-2.5 border border-[#1e1e38]"
          >
            <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#1e1e38] shrink-0">
              <i className={`${s.icon} text-[#c8a84b] text-sm`} />
            </div>
            <div className="min-w-0">
              <p className="text-[#5a5a7a] text-[10px] leading-tight">
                {s.label}
              </p>
              <p className="text-[#c0c0d8] text-xs font-semibold truncate">
                {s.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
