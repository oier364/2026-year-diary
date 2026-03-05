import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import DiaryCalendar from '@/components/DiaryCalendar';
import DiaryEntry from '@/components/DiaryEntry';
import { formatDate, loadEntries, DiaryEntries } from '@/lib/diary-store';

const today = new Date();
const initialDate = formatDate(2026, today.getFullYear() === 2026 ? today.getMonth() : 0, today.getFullYear() === 2026 ? today.getDate() : 1);

const Index = () => {
  const [month, setMonth] = useState(today.getFullYear() === 2026 ? today.getMonth() : 0);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [entries, setEntries] = useState<DiaryEntries>(loadEntries);

  const handleChangeMonth = (dir: -1 | 1) => {
    setMonth((m) => Math.max(0, Math.min(11, m + dir)));
  };

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
  };

  const refreshEntries = useCallback(() => {
    setEntries(loadEntries());
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-accent" />
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Mi Diario 2026
          </h1>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8"
        >
          {/* Calendar side */}
          <div className="bg-card rounded-lg border border-border p-5 shadow-sm h-fit">
            <DiaryCalendar
              month={month}
              selectedDate={selectedDate}
              entries={entries}
              onSelectDate={handleSelectDate}
              onChangeMonth={handleChangeMonth}
            />

            {/* Stats */}
            <div className="mt-6 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground font-body">
                <span className="font-semibold text-foreground">{Object.keys(entries).length}</span>{' '}
                {Object.keys(entries).length === 1 ? 'entrada escrita' : 'entradas escritas'}
              </p>
            </div>
          </div>

          {/* Entry side */}
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <DiaryEntry selectedDate={selectedDate} onSaved={refreshEntries} />
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Index;
