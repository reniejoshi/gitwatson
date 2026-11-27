import { useEffect, useRef, useState } from "react";
import { THEME } from "../../styles/theme";

interface SearchBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
}

export function SearchBar({
  query,
  onQueryChange,
  onSearch,
  onClear,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: THEME.surface,
          border: `1px solid ${isFocused ? THEME.borderFocus : THEME.border}`,
          boxShadow: isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.25)" : "none",
          borderRadius: "3px",
          padding: "0.65rem 0.85rem",
          transition: "border-color 0.15s ease, box-shadow 0.15s ease",
        }}
      >
        <span
          style={{
            color: THEME.textMuted,
            fontSize: "0.88rem",
            userSelect: "none",
          }}
        >
          ://github.com/
        </span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              onClear();
              inputRef.current?.blur();
            }
          }}
          placeholder="username"
          aria-label="GitHub username"
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: THEME.textBody,
            fontFamily: "inherit",
            fontSize: "0.9rem",
            minWidth: 0,
          }}
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              onClear();
              inputRef.current?.focus();
            }}
            style={{
              backgroundColor: THEME.surfaceMuted,
              border: `1px solid ${THEME.borderSubtle}`,
              borderRadius: "2px",
              color: THEME.textSecondary,
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: "0.75rem",
              padding: "0.15rem 0.45rem",
              marginLeft: "0.5rem",
            }}
          >
            esc
          </button>
        ) : (
          <kbd
            style={{
              backgroundColor: THEME.surfaceMuted,
              border: `1px solid ${THEME.borderSubtle}`,
              borderRadius: "2px",
              color: THEME.textMuted,
              fontFamily: "inherit",
              fontSize: "0.75rem",
              padding: "0.15rem 0.45rem",
              marginLeft: "0.5rem",
            }}
          >
            /
          </kbd>
        )}
      </div>
    </form>
  );
}
