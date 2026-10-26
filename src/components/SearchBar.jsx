import { useRef } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, onClear }) {
  const inputRef = useRef(null);

  const handleClear = () => {
    onClear();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <label htmlFor="dish-search" className="sr-only">
        Search dishes
      </label>

      {/* Leading Search Icon */}
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--color-muted)]">
        <Search size={20} strokeWidth={1.75} aria-hidden="true" />
      </div>

      {/* Search Input */}
      <input
        ref={inputRef}
        id="dish-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search dishes, e.g. ramen"
        autoComplete="off"
        spellCheck="false"
        className="w-full h-12 pl-11 pr-11 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-control)] text-base text-[var(--color-ink)] placeholder-[var(--color-muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ink)] transition-colors"
      />

      {/* Clear Button */}
      {value && value.length > 0 && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute inset-y-0 right-0 pr-1 flex items-center justify-center w-11 h-12 text-[var(--color-muted)] hover:text-[var(--color-ink)] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ink)] rounded-r-[var(--radius-control)]"
        >
          <X size={20} strokeWidth={1.75} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
