import type { DisplayFarmingLog } from "@/types/farming";
import { formatKoreanCurrency } from "@/utils/format";
type CalendarDay = {
  date: Date;
  log?: DisplayFarmingLog;
};
type Props = {
  selectedMonth: string;
  monthOptions: string[];
  onMonthChange: (value: string) => void;
  dayNames: string[];
  calendarDays: CalendarDay[];
  startOffset: number;
};
function getTier(stuff: number) {
  // 티어 기준을 '소재(stuff)' 기준으로 변경
  if (stuff >= 10)
    return {
      label: "레전",
      bgColor: "bg-[#c8a84b]/10",
      borderColor: "border-[#c8a84b]/50",
      textColor: "text-[#c8a84b]",
      badgeBg: "bg-[#c8a84b]/20",
      dotColor: "bg-[#c8a84b]",
    };
  if (stuff >= 6)
    return {
      label: "유니크",
      bgColor: "bg-[#c878f0]/10",
      borderColor: "border-[#c878f0]/50",
      textColor: "text-[#c878f0]",
      badgeBg: "bg-[#c878f0]/20",
      dotColor: "bg-[#c878f0]",
    };
  if (stuff >= 3)
    return {
      label: "에픽",
      bgColor: "bg-[#8060d8]/10",
      borderColor: "border-[#8060d8]/50",
      textColor: "text-[#8060d8]",
      badgeBg: "bg-[#8060d8]/20",
      dotColor: "bg-[#8060d8]",
    };
  return null;
}

function getGradeInfo(stuff: number) {
  if (stuff >= 10) return { color: "#3fb950", phrase: "메제 나이쨔!" };
  if (stuff >= 6) return { color: "#d29922", phrase: "도류도급 에바야~" };
  if (stuff >= 3) return { color: "#8b949e", phrase: "빵미농급 기모띠~" };
  return { color: "#484f58", phrase: "일안하냐?" };
}
export function FarmingCalendar({
  selectedMonth,
  monthOptions,
  onMonthChange,
  dayNames,
  calendarDays,
  startOffset,
}: Props) {
  const [year, month] = selectedMonth.split("-");
  const huntDays = calendarDays.filter((d) => d.log).length;
  const totalMeso = calendarDays.reduce((a, d) => a + (d.log?.meso ?? 0), 0);
  const totalFrags = calendarDays.reduce((a, d) => a + (d.log?.frags ?? 0), 0);
  const totalStuff = calendarDays.reduce((a, d) => a + (d.log?.stuff ?? 0), 0);
  const totalCombined = calendarDays.reduce(
    (a, d) => a + (d.log?.total ?? d.log?.meso ?? 0),
    0,
  );
  const avgStuff = huntDays > 0 ? totalStuff / huntDays : 0;
  const gradeInfo = getGradeInfo(Math.floor(avgStuff));
  const monthPhrase = gradeInfo.phrase;
  const monthPhraseColor = gradeInfo.color;
  const avgFrags = huntDays > 0 ? (totalFrags / huntDays).toFixed(1) : "0";
  const isDummy = huntDays === 0;
  return (
    <div className="bg-[#16162a] border border-[#2a2a4a] rounded-xl p-5 flex flex-col h-full">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-white text-sm font-bold">
            {year}년 {Number(month)}월
          </span>
          <span
            className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-[#0d0d1a] border border-[#2a2a4a]"
            style={{ color: monthPhraseColor }}
          >
            {monthPhrase}
          </span>
          {totalCombined > 0 && (
            <span className="text-[#c8a84b] text-[10px] font-medium">
              {formatKoreanCurrency(totalCombined)} 총수입
            </span>
          )}
          {isDummy && (
            <span className="text-[8px] text-[#5a5a7a] bg-[#1e1e38] px-1.5 py-0.5 rounded-full">
              더미 데이터
            </span>
          )}
        </div>
        <select
          value={selectedMonth}
          onChange={(e) => onMonthChange(e.target.value)}
          className="bg-[#0d0d1a] border border-[#2a2a4a] text-white text-xs rounded-lg px-3 py-1.5 outline-none focus:border-[#c8a84b]/60 cursor-pointer"
        >
          {monthOptions.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>

      {/* 월 통계 */}
      {huntDays > 0 && (
        <div className="grid grid-cols-4 gap-1.5 mb-3 p-2.5 bg-[#0d0d1a] rounded-xl border border-[#1e1e38]">
          {[
            {
              label: "사냥일",
              value: `${huntDays}일`,
              color: "text-[#c0c0d8]",
            },
            {
              label: "메소",
              value: formatKoreanCurrency(totalMeso),
              color: "text-[#60c8a0]",
            },
            {
              label: "조각",
              value: `${totalFrags}개`,
              color: "text-[#c0c0d8]",
            },
            {
              label: "평균조각",
              value: `${avgFrags}개`,
              color: "text-[#c8a84b]",
            },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-[8px] text-[#4a4a6a] mb-0.5">{s.label}</p>
              <p className={`text-[10px] font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}
      {/* 티어 범례 */}
      <div className="flex items-center gap-3 justify-center mb-3 flex-wrap">
        {[
          {
            label: "에픽 3+",
            dotColor: "bg-[#8060d8]",
            text: "text-[#8060d8]",
          },
          {
            label: "유니크 6+",
            dotColor: "bg-[#c878f0]",
            text: "text-[#c878f0]",
          },
          {
            label: "레전 10+",
            dotColor: "bg-[#c8a84b]",
            text: "text-[#c8a84b]",
          },
        ].map((t) => (
          <div key={t.label} className="flex items-center gap-1">
            <div className={`w-1.5 h-1.5 rounded-full ${t.dotColor}`} />
            <span className={`text-[9px] ${t.text}`}>{t.label}</span>
          </div>
        ))}
      </div>
      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 mb-1">
        {dayNames.map((day, i) => (
          <div
            key={day}
            className={`text-center text-[10px] font-semibold py-1 ${
              i === 0
                ? "text-[#ff6b6b]"
                : i === 6
                  ? "text-[#60a8f0]"
                  : "text-[#5a5a7a]"
            }`}
          >
            {day}
          </div>
        ))}
      </div>
      {/* 날짜 칸 */}
      <div className="grid grid-cols-7 gap-0.5 flex-1">
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {calendarDays.map(({ date, log }) => {
          const day = date.getDate();
          const hasLog = Boolean(log);
          const stuff = log?.stuff ?? 0;
          const frags = log?.frags ?? 0;
          const tier = hasLog ? getTier(stuff) : null;
          const grade = getGradeInfo(stuff);
          const colIdx = (startOffset + day - 1) % 7;
          return (
            <div
              key={date.toISOString()}
              className={`relative flex flex-col items-center pt-1.5 pb-0.5 rounded-lg min-h-11 sm:min-h-14.5 transition-all border
                ${
                  tier
                    ? `${tier.bgColor} ${tier.borderColor}`
                    : hasLog
                      ? "bg-[#c8a84b]/5 border-[#c8a84b]/20"
                      : "border-transparent"
                }`}
            >
              <span
                className={`text-[11px] font-semibold leading-none ${
                  tier
                    ? tier.textColor
                    : colIdx === 0
                      ? "text-[#ff6b6b]"
                      : colIdx === 6
                        ? "text-[#60a8f0]"
                        : hasLog
                          ? "text-[#c0c0d8]"
                          : "text-[#2e2e50]"
                }`}
              >
                {day}
              </span>

              {hasLog && (
                <div className="w-full flex flex-col items-center mt-1">
                  <span
                    className="text-[8px] font-semibold px-1.5 py-0.5 rounded-full mb-1 text-center"
                    style={{ color: grade.color }}
                  >
                    {grade.phrase}
                  </span>
                  <div className="hidden sm:flex items-center gap-2 text-[8px] text-[#bfbfd8]">
                    <span className="flex items-center gap-1">
                      <span>🎮</span>
                      <span className="font-bold">{stuff}</span>
                      <span className="text-[#8a8a9e]">소재</span>
                    </span>
                    <span className="text-[8px] flex items-center gap-1">
                      <span>💎</span>
                      <span className="font-bold">{frags}</span>
                    </span>
                  </div>
                  <div className="mt-1">
                    <span className="text-[8px] font-extrabold text-[#f6d34d]">
                      {formatKoreanCurrency(log!.meso)}
                    </span>
                  </div>
                  <div className="mt-1">
                    <span className="text-[8px] font-extrabold text-[#f6d34d]">
                      {formatKoreanCurrency(log!.total)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
