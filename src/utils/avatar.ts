const AVATAR_COLORS = ['--blue', '--teal', '--red'];

export function getAvatarColorVar(seed: string): string {
    const hash = Array.from(seed).reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return `var(${AVATAR_COLORS[hash % AVATAR_COLORS.length]})`;
}

export function resolveAvatarUrl(src?: string): string | undefined {
    return src?.startsWith('/') ? `${import.meta.env.VITE_API_BASE_URL}${src}` : src;
}

export function hasCustomAvatar(src?: string): boolean {
    return !!src?.startsWith('/api/users/');
}
