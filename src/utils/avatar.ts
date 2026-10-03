const AVATAR_COLORS = ['--blue', '--teal', '--red'];

export function getAvatarColorVar(seed: string): string {
    const hash = Array.from(seed).reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return `var(${AVATAR_COLORS[hash % AVATAR_COLORS.length]})`;
}
