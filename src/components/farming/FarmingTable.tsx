import { useState, useMemo, useEffect } from "react";
import type { FarmingLog } from "@/types/farming";
import { getFarmingLogs } from "@/api/user";
import { formatKoreanCurrency } from "@/utils/format";
type Props = {
  logs: FarmingLog[];
  nickname?: string;
};
const PER_PAGE = 5;

export function FarmingTable({ logs, nickname }: Props) {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [fetchedLogs, setFetchedLogs] = useState<FarmingLog[] | null>(null);

  const filtered = useMemo(() => {
    const source = fetchedLogs ?? logs;
    // sort by date descending (latest first)
    const sorted = [...source].sort((a, b) => {
      const ta = new Date(a.date).getTime();
      const tb = new Date(b.date).getTime();
      return tb - ta;
    });
    if (!searchQuery.trim()) return sorted;
    const q = searchQuery.trim().replace(/\//g, "-");
    return sorted.filter((l) => l.date.includes(q));
  }, [logs, fetchedLogs, searchQuery]);

  useEffect(() => {
    let mounted = true;
    const normalize = (d: string) => {
      try {
        const dt = new Date(d);
        if (!isNaN(dt.getTime())) return dt.toLocaleDateString("en-CA");
      } catch (e) {}
      return d.slice(0, 10);
    };
    const load = async () => {
      if (!nickname) return;
      try {
        const data = await getFarmingLogs(nickname);
        if (!mounted) return;
        const payload = data?.farming ?? data ?? [];
        const mapped = (payload || []).map((log: any) => {
          const manToRaw = (v: number | undefined | null) => (v ?? 0) * 10000;
          const mesoRaw = log.meso ?? manToRaw(log.meso_man);
          const totalRaw =
            log.total_meso ??
            manToRaw(
              (log.meso_man ?? 0) +
                (log.frags ?? 0) * (log.f_price ?? 0) +
                (log.gems ?? 0) * (log.g_price ?? 0),
            );

          return {
            date: normalize(log.date),
            stuff: log.stuff ?? 0,
            meso: mesoRaw,
            frags: log.frags ?? 0,
            gems: log.gems ?? 0,
            total: totalRaw,
          };
        });
        setFetchedLogs(mapped);
        setPage(1);
      } catch (err) {
        setFetchedLogs(null);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [nickname]);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const pageButtons = useMemo(() => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const half = 2;
    let start = Math.max(1, page - half);
    let end = Math.min(totalPages, page + half);
    if (end - start < 4) {
      if (start === 1) end = Math.min(totalPages, 5);
      else start = Math.max(1, end - 4);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [totalPages, page]);
  return (
    <div className="bg-[#16162a] border border-[#2a2a4a] rounded-xl p-5">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center">
            <i className="ri-list-check text-[#c8a84b] text-base" />
          </div>
          <h3 className="text-white text-sm font-semibold"></h3>
          <span className="text-[#5a5a7a] text-xs">
            {searchQuery
              ? `${filtered.length}건 검색됨`
              : `총 ${logs.length}건`}
          </span>
        </div>
        {/* 날짜 검색 */}
        <div className="relative">
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center pointer-events-none">
            <i className="ri-search-line text-[#5a5a7a] text-xs" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="날짜 검색 (예: 05-18, 2026)"
            className="bg-[#0d0d1a] border border-[#2a2a4a] rounded-xl pl-7 pr-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#c8a84b]/60 transition-colors w-52"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-[#5a5a7a] hover:text-white transition-colors cursor-pointer"
            >
              <i className="ri-close-line text-xs" />
            </button>
          )}
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="text-center py-10">
          <div className="w-10 h-10 flex items-center justify-center mx-auto mb-3">
            <i className="ri-inbox-line text-[#3a3a5a] text-3xl" />
          </div>
          <p className="text-[#3a3a5a] text-sm">
            {searchQuery
              ? `"${searchQuery}"에 해당하는 기록이 없습니다`
              : "기록이 없습니다"}
          </p>
        </div>
      ) : (
        <>
          {/* 테이블 헤더 */}
          <div className="grid grid-cols-6 gap-2 px-3 py-2 bg-[#0d0d1a] rounded-lg mb-2 text-[10px] text-[#5a5a7a] font-medium">
            <span>날짜</span>
            <span className="text-center">소재</span>
            <span className="text-right">메소</span>
            <span className="text-right">조각</span>
            <span className="text-right">코잼</span>
            <span className="text-right">총합</span>
          </div>
          {/* 기록 행 */}
          <div className="space-y-1 min-h-50">
            {paginated.map((log, i) => {
              return (
                <div
                  key={i}
                  className="grid grid-cols-6 gap-2 px-3 py-2.5 rounded-lg hover:bg-[#1a1a30] border border-transparent hover:border-[#2a2a4a] transition-colors"
                >
                  <span className="text-[#8a8aaa] text-xs self-center">
                    {log.date}
                  </span>
                  {/* 소재 + 티어 */}
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-[#c0c0d8] text-xs font-medium">
                      {log.stuff}소재
                    </span>
                  </div>
                  <span className="text-[#60c8a0] text-xs text-right self-center">
                    {formatKoreanCurrency(log.meso)}
                  </span>
                  <span className="text-[#c0c0d8] text-xs text-right self-center">
                    {log.frags}개
                  </span>
                  <span className="text-[#c0c0d8] text-xs text-right self-center">
                    {log.gems}개
                  </span>
                  <span className="text-[#c8a84b] text-xs font-semibold text-right self-center">
                    {formatKoreanCurrency(log.total)}
                  </span>
                </div>
              );
            })}
          </div>
          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#1e1e38]">
              <span className="text-[#5a5a7a] text-xs">
                {(page - 1) * PER_PAGE + 1}–
                {Math.min(page * PER_PAGE, filtered.length)} / {filtered.length}
                건
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-[#8a8aaa] hover:text-white hover:bg-[#2a2a4a] disabled:opacity-20 transition-colors cursor-pointer"
                >
                  <i className="ri-skip-back-mini-line text-sm" />
                </button>
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-[#8a8aaa] hover:text-white hover:bg-[#2a2a4a] disabled:opacity-20 transition-colors cursor-pointer"
                >
                  <i className="ri-arrow-left-s-line text-sm" />
                </button>
                {pageButtons[0] > 1 && (
                  <span className="text-[#3a3a5a] text-xs px-1">...</span>
                )}
                {pageButtons.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs transition-colors cursor-pointer ${
                      p === page
                        ? "bg-[#c8a84b] text-[#0d0d1a] font-bold"
                        : "text-[#8a8aaa] hover:text-white hover:bg-[#2a2a4a]"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                {pageButtons[pageButtons.length - 1] < totalPages && (
                  <span className="text-[#3a3a5a] text-xs px-1">...</span>
                )}
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-[#8a8aaa] hover:text-white hover:bg-[#2a2a4a] disabled:opacity-20 transition-colors cursor-pointer"
                >
                  <i className="ri-arrow-right-s-line text-sm" />
                </button>
                <button
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-[#8a8aaa] hover:text-white hover:bg-[#2a2a4a] disabled:opacity-20 transition-colors cursor-pointer"
                >
                  <i className="ri-skip-forward-mini-line text-sm" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
