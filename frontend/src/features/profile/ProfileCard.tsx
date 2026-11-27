import { Card } from "../../components/Card";
import { LanguageDot } from "../../components/LanguageDot";
import { THEME } from "../../styles/theme";
import type { GitHubProfile } from "../../types/developer";

interface ProfileCardProps {
  profile: GitHubProfile;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const sectionDivider = {
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.75rem",
    marginTop: "1.15rem",
    paddingTop: "1rem",
    borderTop: `1px solid ${THEME.border}`,
    fontSize: "0.8rem",
  };

  return (
    <Card style={{ width: "300px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <img
          src={profile.avatar_url}
          alt={profile.login}
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "3px",
            border: `1px solid ${THEME.border}`,
          }}
        />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: "1.05rem",
              fontWeight: 700,
              color: THEME.textPrimary,
            }}
          >
            {profile.name || profile.login}
          </div>
          <a
            href={profile.html_url}
            target="_blank"
            rel="noreferrer"
            style={{
              fontSize: "0.82rem",
              color: THEME.link,
              textDecoration: "none",
            }}
          >
            @{profile.login} ↗
          </a>
        </div>
      </div>

      {profile.bio && (
        <p
          style={{
            margin: "1rem 0 0",
            fontSize: "0.84rem",
            color: THEME.textSecondary,
            lineHeight: 1.5,
          }}
        >
          {profile.bio}
        </p>
      )}
      {profile.status_message && (
        <p
          style={{
            margin: "0.75rem 0 0",
            fontSize: "0.84rem",
            color: THEME.textSecondary,
            lineHeight: 1.5,
          }}
        >
          {profile.status_message}
        </p>
      )}

      <div style={sectionDivider}>
        <a
          href={`${profile.html_url}?tab=repositories`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            textDecoration: "none",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div style={{ color: THEME.accent }}>REPOS ↗</div>
          <div style={{ fontWeight: 700 }}>
            {profile.repositories_count ?? 0}
          </div>
        </a>
        <a
          href={`${profile.html_url}?tab=followers`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            textDecoration: "none",
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ color: THEME.accent }}>FOLLOWERS ↗</div>
          <div style={{ fontWeight: 700 }}>{profile.followers_count ?? 0}</div>
        </a>
        <a
          href={`${profile.html_url}?tab=following`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            textDecoration: "none",
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ color: THEME.accent }}>FOLLOWING ↗</div>
          <div style={{ fontWeight: 700 }}>{profile.following_count ?? 0}</div>
        </a>

        <div style={{ ...sectionDivider, marginTop: "0.4rem", gap: "0.55rem" }}>
          <div style={{ color: THEME.accent }}>LANGUAGES</div>
          {profile.top_languages && profile.top_languages.length > 0 ? (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem 0.85rem",
              }}
            >
              {profile.top_languages.map((lang) => (
                <LanguageDot key={lang} language={lang} />
              ))}
            </div>
          ) : (
            <div style={{ color: THEME.textMuted }}>No languages</div>
          )}
        </div>

        <div style={{ ...sectionDivider, marginTop: "0.4rem" }}>
          {profile.created_at && (
            <div>
              <div style={{ color: THEME.accent }}>JOINED</div>
              <div style={{ fontWeight: 700, marginTop: "0.15rem" }}>
                {new Date(profile.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
          )}
          {profile.location && (
            <div>
              <div style={{ color: THEME.accent }}>LOCATION</div>
              <div style={{ fontWeight: 700, marginTop: "0.15rem" }}>
                {profile.location}
              </div>
            </div>
          )}
          {profile.company && (
            <div>
              <div style={{ color: THEME.accent }}>COMPANY</div>
              <div style={{ fontWeight: 700, marginTop: "0.15rem" }}>
                <a
                  href={`https://github.com/${profile.company.at(0) === "@" ? profile.company.slice(1) : profile.company}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: THEME.link }}
                >
                  {profile.company} ↗
                </a>
              </div>
            </div>
          )}
          {profile.website_url && (
            <div>
              <div style={{ color: THEME.accent }}>WEBSITE</div>
              <div style={{ fontWeight: 700, marginTop: "0.15rem" }}>
                <a
                  href={profile.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: THEME.link }}
                >
                  {profile.website_url} ↗
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
