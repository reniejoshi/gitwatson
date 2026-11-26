export interface Developer {
    username: string;
    avatarUrl: string;
    topLanguages: string[];
    bio: string;
}

export interface UserLookupResponse {
    targetUser: string;
    profile: Developer;
    cachedAt: string;
}