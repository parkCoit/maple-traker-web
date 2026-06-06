import { useCallback, useEffect, useState } from "react";
import { autoLoginAPI } from "@/api/user";
import { getSessionToken } from "@/utils/auth";

// 간단한 레코드 타입 (WeeklyChart가 기대하는 필드)
export type ServerRecord = {
  date: string; // YYYY-MM-DD
  materials: number; // stuff
  netMeso: number; // raw meso amount (unit kept consistent with WeeklyChart expectation)
  fragments: number;
  fragmentPrice: number;
  kojam: number;
  kojamPrice: number;
  huntingHours: number;
  huntingMinutes: number;
};

export function useServerRecords() {
  const [records, setRecords] = useState<ServerRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getSessionToken();
      if (!token) {
        setError("no session token");
        setRecords([]);
        setLoading(false);
        return;
      }

      const data = await autoLoginAPI(token);

      // map server logs to ServerRecord
      const mapped: ServerRecord[] = (data.farming || []).map((log: any) => ({
        date: log.date,
        materials: log.stuff ?? 0,
        netMeso: log.meso_man ?? 0,
        fragments: log.frags ?? 0,
        fragmentPrice: log.f_price ?? 0,
        kojam: log.gems ?? 0,
        kojamPrice: log.g_price ?? 0,
        huntingHours: 0,
        huntingMinutes: 0,
      }));

      setRecords(mapped);
    } catch (err: any) {
      setError(err?.message || String(err));
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchRecords();
  }, [fetchRecords]);

  return { records, loading, error, refetch: fetchRecords };
}
