import { useState } from "react";
import { useUserProfile } from "./api/useUserProfile";
import { Card } from "./components/Card";
import { ProfileCard } from "./features/profile/ProfileCard";
import { SampleChips } from "./features/search/SampleChips";
import { SearchBar } from "./features/search/SearchBar";
import { THEME } from "./styles/theme";

function App() {
  const [query, setQuery] = useState("");
  const [submittedUser, setSubmittedUser] = useState("");
  const { data } = useUserProfile(submittedUser);

  const runSearch = (username: string) => {
    const trimmed = username.trim();
    if (!trimmed) return;
    setQuery(trimmed);
    setSubmittedUser(trimmed);
  };

  const clearSearch = () => {
    setQuery("");
    setSubmittedUser("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: THEME.bg,
        backgroundImage: `radial-gradient(${THEME.dot} 1px, transparent 1px)`,
        backgroundSize: "24px 24px",
        color: THEME.textBody,
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
          transition: "padding 0.25s ease",
        }}
      >
        <div style={{ width: "100%", maxWidth: "540px" }}>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              margin: "0 0 0.4rem 0",
              color: THEME.textPrimary,
            }}
          >
            gitwatson
          </h1>
          <SearchBar
            query={query}
            onQueryChange={setQuery}
            onSearch={() => runSearch(query)}
            onClear={clearSearch}
          />
          <SampleChips onSelect={runSearch} />
        </div>

        {data && (
          <section
            style={{
              marginTop: "2.5rem",
              display: "flex",
              flexDirection: "row",
              gap: "1rem",
              justifyContent: "center",
            }}
          >
            <ProfileCard profile={data.profile} />
            <Card style={{ width: "700px" }}>:)</Card>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
