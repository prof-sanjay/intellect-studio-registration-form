'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function Combobox({
  options,
  value,
  onChange,
  placeholder,
  error,
  disabled,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value || '');
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = query.length > 0
    ? options.filter((o) => o.toLowerCase().includes(query.toLowerCase()))
    : options;

  const handleSelect = (opt: string) => {
    setQuery(opt);
    onChange(opt);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        className={cn('input-base', error && 'input-error')}
        value={query}
        onChange={(e) => { setQuery(e.target.value); onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
      />
      <AnimatePresence>
        {open && filtered.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 top-full left-0 right-0 bg-white border border-border shadow-lg max-h-48 overflow-y-auto"
          >
            {filtered.slice(0, 10).map((opt) => (
              <li
                key={opt}
                onMouseDown={() => handleSelect(opt)}
                className={cn(
                  'px-4 py-2.5 text-sm cursor-pointer hover:bg-bg transition-colors font-sans',
                  opt === value && 'bg-ink text-white hover:bg-ink'
                )}
              >
                {opt}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}

export function RatingScale({
  value,
  onChange,
  labels,
  error,
}: {
  value: number | undefined;
  onChange: (v: number) => void;
  labels: [string, string, string, string, string];
  error?: string;
}) {
  return (
    <div>
      <div className="flex items-start justify-between gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className="flex flex-1 flex-col items-center gap-1.5 py-1"
          >
            <span
              className={cn(
                'flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border font-syne font-bold text-xs sm:text-sm transition-all duration-150',
                value === n
                  ? 'border-ink bg-ink text-white'
                  : 'border-border bg-white text-ink hover:border-ink-3'
              )}
            >
              {n}
            </span>
            <span
              className={cn(
                'font-mono text-[7px] sm:text-[8px] tracking-wide uppercase text-center leading-tight',
                value === n ? 'text-ink' : 'text-ink-3'
              )}
            >
              {labels[n - 1]}
            </span>
          </button>
        ))}
      </div>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}

export function OptionChip({
  label,
  checked,
  onChange,
  type = 'checkbox',
  name,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  type?: 'checkbox' | 'radio';
  name?: string;
}) {
  return (
    <label
      className={cn(
        'flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs cursor-pointer transition-colors',
        checked ? 'border-ink text-ink bg-ink/5' : 'border-border text-ink-2 bg-white hover:border-ink-3'
      )}
    >
      <span
        className={cn(
          'flex items-center justify-center w-3.5 h-3.5 rounded-full border shrink-0 transition-colors',
          checked ? 'border-ink bg-ink' : 'border-ink-3 bg-white'
        )}
      >
        {checked && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
      </span>
      <span className="font-sans">{label}</span>
      <input type={type} name={name} checked={checked} onChange={onChange} className="sr-only" />
    </label>
  );
}

export function SelectField({
  options,
  value,
  onChange,
  placeholder,
  error,
  disabled,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <select
        className={cn('input-base', error && 'input-error', 'cursor-pointer')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        <option value="">{placeholder || 'Select…'}</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}
