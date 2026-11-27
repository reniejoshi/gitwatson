import type { CSSProperties, ReactNode } from "react";
import { THEME } from "../styles/theme";

interface CardProps {
  children: ReactNode;
  style?: CSSProperties;
}

export function Card({ children, style }: CardProps) {
  return (
    <div
      style={{
        padding: "1.25rem",
        backgroundColor: THEME.surface,
        border: `1px solid ${THEME.border}`,
        borderRadius: "3px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
