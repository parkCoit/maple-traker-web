import { formatKoreanCurrency } from "@/utils/format";
type Props = {
  today: number;
  week: number;
  month: number;
  currentWeek: number;
};
// 세부 지표도 props로 받거나, 없으면 value만 표시하는 버전
interface StatCardProps {
  label: string;
  icon: string;
  accentColor: string;
  value: number;
  // 세부 지표 (선택)
  netMeso?: number;
  totalFrags?: number;
  avgFrags?: number;
}
function StatCard({
  label,
  icon,
  accentColor,
  value,
  netMeso,
  totalFrags,
  avgFrags,
}: StatCardProps) {
  const hasData = value > 0;
  return (
    <div className="flex-1 bg-[#0d0d1a] rounded-xl p-3 border border-[#1e1e38]">
      {/* 헤더 */}
      <div className="flex items-center gap-1.5 mb-2">
        <div className="w-4 h-4 flex items-center justify-center">
          <i className={`${icon} text-sm`} style={{ color: accentColor }} />
        </div>
        <span className="text-[#8a8aaa] text-xs font-medium">{label}</span>
      </div>
      {/* 총금액 */}
      <p className="text-white text-base font-bold mb-2 leading-tight">
        {hasData ? (
          formatKoreanCurrency(value)
        ) : (
          <span className="text-[#2e2e50] text-sm">기록 없음</span>
        )}
      </p>
      {/* 세부 지표 */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-[#4a4a6a]">순 메소</span>
          <span
            className="text-[10px] font-medium"
            style={{ color: hasData ? "#60c8a0" : "#2e2e50" }}
          >
            {hasData && netMeso != null ? formatKoreanCurrency(netMeso) : "—"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-[#4a4a6a]">총 조각</span>
          <span className="text-[10px] text-[#c0c0d8] font-medium">
            {hasData && totalFrags != null ? `${totalFrags}개` : "—"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-[#4a4a6a]">평균 조각</span>
          <span
            className="text-[10px] font-medium"
            style={{ color: hasData ? accentColor : "#2e2e50" }}
          >
            {hasData && avgFrags != null ? `${avgFrags.toFixed(1)}개` : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
export function FarmingSummary({ today, week, month, currentWeek }: Props) {
  const isDummy = today === 0 && week === 0 && month === 0;
  return (
    <div className="bg-[#16162a] border border-[#2a2a4a] rounded-xl p-4 flex flex-col h-full">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center">
            <i className="ri-coins-line text-[#c8a84b] text-base" />
          </div>
          <h3 className="text-white text-sm font-semibold">수입 요약</h3>
          {isDummy && (
            <span className="text-[8px] text-[#5a5a7a] bg-[#1e1e38] px-1.5 py-0.5 rounded-full">
              더미 데이터
            </span>
          )}
        </div>
        <span className="text-[9px] text-[#c8a84b] bg-[#c8a84b]/10 border border-[#c8a84b]/20 px-2 py-0.5 rounded-full whitespace-nowrap">
          {currentWeek}주차
        </span>
      </div>
      <div className="flex flex-col gap-2.5 flex-1">
        <StatCard
          label="오늘"
          icon="ri-sun-line"
          accentColor="#f0c040"
          value={today}
        />
        <StatCard
          label="이번 주"
          icon="ri-calendar-2-line"
          accentColor="#60c8a0"
          value={week}
        />
        <StatCard
          label="이번 달"
          icon="ri-calendar-line"
          accentColor="#c878f0"
          value={month}
        />
      </div>
    </div>
  );
}
