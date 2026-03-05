import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Save } from 'lucide-react';
import { formatLongDate, getEntry, saveEntry } from '@/lib/diary-store';

interface Props {
  selectedDate: string;
  onSaved: () => void;
}

export default function DiaryEntry({ selectedDate, onSaved }: Props) {
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setText(getEntry(selectedDate));
    setSaved(false);
    textareaRef.current?.focus();
  }, [selectedDate]);

  const handleSave = () => {
    saveEntry(selectedDate, text);
    setSaved(true);
    onSaved();
    setTimeout(() => setSaved(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={selectedDate}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.25 }}
        className="flex flex-col h-full"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-5 h-5 text-accent" />
          <h3 className="font-display text-lg font-semibold text-foreground">
            {formatLongDate(selectedDate)}
          </h3>
        </div>

        {/* Lined textarea */}
        <div className="relative flex-1 min-h-[300px] rounded-md border border-border bg-card overflow-hidden">
          {/* Ruled lines */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `repeating-linear-gradient(to bottom, transparent, transparent 31px, hsl(var(--diary-line)) 31px, hsl(var(--diary-line)) 32px)`,
              backgroundPositionY: '8px',
            }}
          />
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe aquí lo que pasó hoy..."
            className="w-full h-full resize-none bg-transparent p-4 font-body text-foreground leading-8 focus:outline-none placeholder:text-muted-foreground/50"
            style={{ lineHeight: '32px' }}
          />
        </div>

        {/* Save button */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-muted-foreground font-body">
            Ctrl+S para guardar
          </span>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-body font-medium text-sm hover:opacity-90 transition-opacity"
          >
            <Save className="w-4 h-4" />
            {saved ? '¡Guardado!' : 'Guardar'}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
