export function formatKoreanCurrency(value: number): string {
  const num = Math.floor(value);
  if (num >= 10000) {
    const eok = Math.floor(num / 10000);
    const man = num % 10000;
    if (man === 0) return `${eok}억`;
    return `${eok}억 ${man.toLocaleString()}만`;
  }
  return num > 0 ? num.toLocaleString() : "0";
}

export function getWeekOfMonth(dt: Date): number {
  const firstDay = new Date(dt.getFullYear(), dt.getMonth(), 1).getDay();
  const dom = dt.getDate();
  const adjusted_dom = dom + firstDay;
  return Math.floor((adjusted_dom - 1) / 7) + 1;
}

export function getKstNow(): Date {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 9 * 60 * 60 * 1000);
}
