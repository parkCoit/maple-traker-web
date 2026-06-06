import type { Character } from "@/types/farming";
type Props = {
  data: Character & { image?: string };
};
export function CharacterCard({ data }: Props) {
  const expRate = Math.min(Math.max(Number(data.exp || 0), 0), 100);
  return (
    <div className="bg-[#16162a] border border-[#2a2a4a] rounded-xl overflow-hidden">
      <div className="flex flex-col sm:flex-row items-stretch">
        {/* 좌측: 캐릭터 이미지 */}
        <div className="relative w-full sm:w-44 shrink-0 bg-linear-to-br from-[#1a1a3e] via-[#0f0f28] to-[#1a0f2e] overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-[#c8a84b]/8 blur-xl" />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-[#8060d8]/10 blur-lg" />
          </div>
          {data.image ? (
            <div className="relative h-full w-full pb-2 min-h-25 sm:min-h-32.5 overflow-hidden">
              <img
                src={data.image}
                alt={`${data.name} 이미지`}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ imageRendering: "pixelated" }}
              />
            </div>
          ) : (
            <div className="relative h-full flex items-center justify-center min-h-25 sm:min-h-32.5">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#2a2a4a] border border-[#3a3a5a]">
                <i className="ri-user-3-line text-[#5a5a7a] text-3xl" />
              </div>
            </div>
          )}
          {data.world && (
            <div className="absolute top-2 left-2">
              <span className="text-[9px] text-[#8a8aaa] bg-[#0d0d1a]/70 px-1.5 py-0.5 rounded-full">
                {data.world}
              </span>
            </div>
          )}
        </div>
        {/* 우측: 정보 */}
        <div className="flex-1 px-4 py-3 flex flex-col justify-between min-w-0">
          {/* 이름 + 직업 */}
          <div className="mb-2">
            <p className="text-[10px] uppercase tracking-widest text-[#c8a84b]/70 mb-0.5">
              캐릭터 정보
            </p>
            <h2 className="text-white text-lg font-bold leading-tight truncate">
              {data.name}
            </h2>
            <p className="text-[#8a8aaa] text-xs mt-0.5">
              {data.job} · {data.world}
            </p>
          </div>
          {/* 레벨 + EXP 바 */}
          <div className="mb-2">
            <div className="flex items-baseline gap-2 mb-1.5">
              <span className="text-[#c8a84b] text-3xl font-black leading-none">
                Lv.{data.level}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-[#0d0d1a] rounded-full overflow-hidden border border-[#1e1e38]">
                <div
                  className="h-full rounded-full bg-linear-to-r from-[#c8a84b] to-[#f0d060] transition-all duration-700"
                  style={{ width: `${expRate}%` }}
                />
              </div>
              <span className="text-[#8a8aaa] text-[10px] font-medium shrink-0 w-12 text-right">
                {expRate.toFixed(2)}%
              </span>
            </div>
          </div>
          {/* 하단 통계 */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#1e1e38]">
            {[
              { label: "직업", value: data.job || "—" },
              { label: "레벨", value: data.level ? `${data.level}` : "—" },
              { label: "월드", value: data.world || "—" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-[#4a4a6a] text-[9px] mb-0.5">{s.label}</p>
                <p className="text-[#c0c0d8] text-[10px] font-medium truncate">
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
