export interface GitHubProfile {
  username?: string;
  login?: string;
  avatar_url?: string;
  html_url?: string;
  name?: string;
  top_languages?: string[];
  bio?: string;
  status_emoji?: string;
  status_message?: string;
  company?: string;
  location?: string;
  email?: string;
  website_url?: string;
  followers_count?: number;
  following_count?: number;
  repositories_count?: number;
  created_at?: string;
}

export interface UserLookupResponse {
  profile: GitHubProfile;
}
