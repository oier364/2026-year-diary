const STORAGE_KEY = 'diary-2026';

export interface DiaryEntries {
  [date: string]: string; // key: "YYYY-MM-DD", value: entry text
}

export function loadEntries(): DiaryEntries {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveEntry(date: string, text: string) {
  const entries = loadEntries();
  if (text.trim()) {
    entries[date] = text;
  } else {
    delete entries[date];
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function getEntry(date: string): string {
  return loadEntries()[date] || '';
}

export const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export const DAYS_ES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export function getDaysInMonth(month: number, year = 2026): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(month: number, year = 2026): number {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Monday = 0
}

export function formatDate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function formatLongDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const date = new Date(y, m - 1, d);
  return `${daysOfWeek[date.getDay()]}, ${d} de ${MONTHS_ES[m - 1]} de ${y}`;
}
