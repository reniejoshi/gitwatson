import { useState } from "react";
import { THEME } from "../../styles/theme";

const SAMPLE_USERS = ["reniejoshi", "aadiguy", "rodlewis360", "aaravgupta299"];

interface SampleChipsProps {
  onSelect: (username: string) => void;
}

export function SampleChips({ onSelect }: SampleChipsProps) {
  const [hoveredChip, setHoveredChip] = useState<string | null>(null);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "0.5rem",
        marginTop: "0.85rem",
        fontSize: "0.78rem",
      }}
    >
      <span style={{ color: THEME.textMuted }}>try:</span>
      {SAMPLE_USERS.map((user) => {
        const isHovered = hoveredChip === user;
        return (
          <button
            key={user}
            type="button"
            onClick={() => onSelect(user)}
            onMouseEnter={() => setHoveredChip(user)}
            onMouseLeave={() => setHoveredChip(null)}
            style={{
              backgroundColor: isHovered
                ? "rgba(37, 99, 235, 0.2)"
                : "transparent",
              border: `1px solid ${isHovered ? THEME.borderFocus : THEME.border}`,
              borderRadius: "2px",
              color: isHovered ? THEME.textPrimary : THEME.textSecondary,
              fontFamily: "inherit",
              fontSize: "0.78rem",
              padding: "0.2rem 0.5rem",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {user}
          </button>
        );
      })}
    </div>
  );
}
