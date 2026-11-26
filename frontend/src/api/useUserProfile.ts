import { useQuery } from '@tanstack/react-query';
import type { UserLookupResponse } from '../types/developer';

export function useUserProfile(username: string) {
    return useQuery<UserLookupResponse>({
        queryKey: ['user', username],
        queryFn: async () => {
            const response = await fetch(`/api/users/${encodeURIComponent(username)}`);
            if (!response.ok) {
                throw new Error(`Backend error: ${response.status}`);
            }
            return response.json();
        },
        enabled: Boolean(username),
        staleTime: 1000 * 60 * 5,
    });
}