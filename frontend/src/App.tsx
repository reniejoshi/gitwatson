import { useEffect, useRef, useState } from "react";
import { useUserProfile } from "./api/useUserProfile";

const SAMPLE_USERS = ["reniejoshi", "aadiguy", "rodlewis360", "aaravgupta299"];
const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Rust: "#dea584",
  Java: "#b07219",
  "C#": "#178600",
  "C++": "#f34b7d",
  C: "#555555",
  Go: "#00ADD8",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Lua: "#000080",
};

function App() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [hoveredChip, setHoveredChip] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [submittedUser, setSubmittedUser] = useState("");
  const { data } = useUserProfile(submittedUser);

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

  const runSearch = (username: string) => {
    const trimmedUsername = username.trim();
    if (!trimmedUsername) return;
    setQuery(trimmedUsername);
    setSubmittedUser(trimmedUsername);
    console.log("Searching for:", trimmedUsername);
  };

  const clearSearch = () => {
    setQuery("");
    setSubmittedUser("");
  };

  const handleSearch = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    runSearch(query);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f0e17",
        backgroundImage: "radial-gradient(#1e1d2e 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        color: "#e2e8f0",
        fontFamily: "'Fira Code', monospace",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "18vh 1.25rem 4rem",
        }}
      >
        <div style={{ width: "100%", maxWidth: "540px" }}>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              margin: "0 0 0.4rem 0",
              color: "#f1f5f9",
            }}
          >
            gitwatson
          </h1>
          <form onSubmit={handleSearch}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#161514",
                border: `1px solid ${isFocused ? "#1d6fa5" : "#2563eb"}`,
                boxShadow: isFocused
                  ? "0 0 0 2px rgba(59, 130, 246, 0.25)"
                  : "none",
                borderRadius: "3px",
                padding: "0.65rem 0.85rem",
                transition: "border-color 0.15s ease, box-shadow 0.15s ease",
              }}
            >
              <span
                style={{
                  color: "#2563eb",
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
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    clearSearch();
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
                  color: "#e2e8f0",
                  fontFamily: "inherit",
                  fontSize: "0.9rem",
                  minWidth: 0,
                }}
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => {
                    clearSearch();
                    inputRef.current?.focus();
                  }}
                  style={{
                    backgroundColor: "#1e1d30",
                    border: "1px solid #2e2d47",
                    borderRadius: "2px",
                    color: "#94a3b8",
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
                    backgroundColor: "#1e1d30",
                    border: "1px solid #2e2d47",
                    borderRadius: "2px",
                    color: "#64748b",
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
            <span style={{ color: "#64748b" }}>try:</span>
            {SAMPLE_USERS.map((user) => {
              const isHovered = hoveredChip === user;
              return (
                <button
                  key={user}
                  type="button"
                  onClick={() => runSearch(user)}
                  onMouseEnter={() => setHoveredChip(user)}
                  onMouseLeave={() => setHoveredChip(null)}
                  style={{
                    backgroundColor: isHovered
                      ? "rgba(37, 99, 235, 0.2)"
                      : "transparent",
                    border: `1px solid ${isHovered ? "#3b82f6" : "#2563eb"}`,
                    borderRadius: "2px",
                    color: isHovered ? "#f1f5f9" : "#94a3b8",
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
        </div>
        <section
          style={{
            marginTop: "2.5rem",
            display: "flex",
            flexDirection: "row",
            gap: "1rem",
            justifyContent: "center",
          }}
        >
          {data && (
            <div
              style={{
                padding: "1.25rem",
                backgroundColor: "#161524",
                border: "1px solid #2563eb",
                borderRadius: "3px",
                width: "300px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <img
                  src={data.profile.avatar_url}
                  alt={data.profile.login}
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "3px",
                    border: "1px solid #2563eb",
                  }}
                />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      fontSize: "1.05rem",
                      fontWeight: 700,
                      color: "#f1f5f9",
                    }}
                  >
                    {data.profile.name || data.profile.login}
                  </div>
                  <a
                    href={data.profile.html_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontSize: "0.82rem",
                      color: "#38bdf8",
                      textDecoration: "none",
                    }}
                  >
                    @{data.profile.login} ↗
                  </a>
                </div>
              </div>

              {data.profile.bio && (
                <p
                  style={{
                    margin: "1rem 0 0",
                    fontSize: "0.84rem",
                    color: "#94a3b8",
                    lineHeight: 1.5,
                  }}
                >
                  {data.profile.bio}
                </p>
              )}
              {data.profile.status_message && (
                <p
                  style={{
                    margin: "1rem 0 0",
                    fontSize: "0.84rem",
                    color: "#94a3b8",
                    lineHeight: 1.5,
                  }}
                >
                  {data.profile.status_message}
                </p>
              )}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  marginTop: "1.15rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid #2563eb",
                  fontSize: "0.8rem",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div
                    style={{
                      color: "#64748b",
                      fontSize: "0.8rem",
                    }}
                  >
                    REPOS
                  </div>
                  <div style={{ fontWeight: 700, marginTop: "0.15rem" }}>
                    {data.profile.repositories_count ?? 0}
                  </div>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div style={{ color: "#64748b", fontSize: "0.8rem" }}>
                    FOLLOWERS
                  </div>
                  <div style={{ fontWeight: 700, marginTop: "0.15rem" }}>
                    {data.profile.followers_count ?? 0}
                  </div>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div style={{ color: "#64748b", fontSize: "0.8rem" }}>
                    FOLLOWING
                  </div>
                  <div style={{ fontWeight: 700, marginTop: "0.15rem" }}>
                    {data.profile.following_count ?? 0}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.55rem",
                    marginTop: "0.4rem",
                    paddingTop: "1rem",
                    borderTop: "1px solid #2563eb",
                    fontSize: "0.8rem",
                  }}
                >
                  <div style={{ color: "#64748b", fontSize: "0.8rem" }}>
                    LANGUAGES
                  </div>
                  {data.profile.top_languages &&
                  data.profile.top_languages.length > 0 ? (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.5rem 0.85rem",
                      }}
                    >
                      {data.profile.top_languages.map((lang) => (
                        <span
                          key={lang}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.4rem",
                            fontWeight: 600,
                            color: "#e2e8f0",
                          }}
                        >
                          <span
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              backgroundColor:
                                LANGUAGE_COLORS[lang] ?? "#8b8982",
                              flexShrink: 0,
                            }}
                          />
                          {lang}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div style={{ color: "#64748b" }}>No languages</div>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                    marginTop: "0.85rem",
                    paddingTop: "1rem",
                    borderTop: "1px solid #2563eb",
                    fontSize: "0.8rem",
                  }}
                >
                  {data.profile.created_at && (
                    <div>
                      <div style={{ color: "#64748b", fontSize: "0.8rem" }}>
                        JOINED
                      </div>
                      <div style={{ fontWeight: 700, marginTop: "0.15rem" }}>
                        {data.profile.created_at &&
                          new Date(data.profile.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                      </div>
                    </div>
                  )}
                  {data.profile.location && (
                    <div>
                      <div style={{ color: "#64748b", fontSize: "0.8rem" }}>
                        LOCATION
                      </div>
                      <div style={{ fontWeight: 700, marginTop: "0.15rem" }}>
                        {data.profile.location}
                      </div>
                    </div>
                  )}
                  {data.profile.company && (
                    <div>
                      <div style={{ color: "#64748b", fontSize: "0.8rem" }}>
                        COMPANY
                      </div>
                      <div style={{ fontWeight: 700, marginTop: "0.15rem" }}>
                        {data.profile.company}
                      </div>
                    </div>
                  )}
                  {data.profile.website_url && (
                    <div>
                      <div style={{ color: "#64748b", fontSize: "0.8rem" }}>
                        WEBSITE
                      </div>
                      <div style={{ fontWeight: 700, marginTop: "0.15rem" }}>
                        <a
                          href={data.profile.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: "0.82rem",
                            color: "#38bdf8",
                            textDecoration: "none",
                          }}
                        >
                          {data.profile.website_url} ↗
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {data && (
            <div
              style={{
                padding: "1.25rem",
                backgroundColor: "#161524",
                border: "1px solid #2563eb",
                borderRadius: "3px",
                width: "700px",
              }}
            >
              :)
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
