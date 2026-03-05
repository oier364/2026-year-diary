import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  MONTHS_ES, DAYS_ES, getDaysInMonth, getFirstDayOfMonth, formatDate, DiaryEntries,
} from '@/lib/diary-store';

interface Props {
  month: number;
  selectedDate: string;
  entries: DiaryEntries;
  onSelectDate: (date: string) => void;
  onChangeMonth: (dir: -1 | 1) => void;
}

export default function DiaryCalendar({ month, selectedDate, entries, onSelectDate, onChangeMonth }: Props) {
  const year = 2026;
  const daysInMonth = getDaysInMonth(month);
  const firstDay = getFirstDayOfMonth(month);

  const today = new Date();
  const todayStr = formatDate(today.getFullYear(), today.getMonth(), today.getDate());

  const cells: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="w-full">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => onChangeMonth(-1)}
          disabled={month === 0}
          className="p-2 rounded-md hover:bg-secondary disabled:opacity-30 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <h2 className="text-2xl font-display font-semibold text-foreground tracking-wide">
          {MONTHS_ES[month]} 2026
        </h2>
        <button
          onClick={() => onChangeMonth(1)}
          disabled={month === 11}
          className="p-2 rounded-md hover:bg-secondary disabled:opacity-30 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS_ES.map((d) => (
          <div key={d} className="text-center text-xs font-body font-medium text-muted-foreground uppercase tracking-wider py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />;
          const dateStr = formatDate(year, month, day);
          const isSelected = dateStr === selectedDate;
          const isToday = dateStr === todayStr;
          const hasEntry = !!entries[dateStr];

          return (
            <motion.button
              key={dateStr}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectDate(dateStr)}
              className={`
                relative aspect-square flex items-center justify-center rounded-md text-sm font-body transition-all
                ${isSelected
                  ? 'bg-diary-selected text-primary-foreground font-semibold shadow-md'
                  : isToday
                    ? 'ring-2 ring-diary-today text-foreground font-medium'
                    : 'hover:bg-secondary text-foreground'
                }
              `}
            >
              {day}
              {hasEntry && !isSelected && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-diary-entry-dot" />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
