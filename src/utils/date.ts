const MS_PER_DAY = 24 * 60 * 60 * 1000;

function startOfDay(date: Date): Date {
    const copy = new Date(date);
    copy.setHours(0, 0, 0, 0);
    return copy;
}

// Formats a date as "YYYY-MM-DD" in local time (toISOString() would use UTC and can be a day off)
export function toLocalDateString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Parses "YYYY-MM-DD" as local midnight (new Date("YYYY-MM-DD") would parse it as UTC midnight)
export function parseLocalDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
}

// Whole days from today until the due date; negative when it is overdue
function daysUntil(dueDate: string): number {
    const due = parseLocalDate(dueDate);
    const today = startOfDay(new Date());
    return Math.round((due.getTime() - today.getTime()) / MS_PER_DAY);
}

export function isDueDateToday(dueDate: string): boolean {
    return daysUntil(dueDate) === 0;
}

export function isDueDatePast(dueDate: string): boolean {
    return daysUntil(dueDate) < 0;
}

export function isDueDateFuture(dueDate: string): boolean {
    return daysUntil(dueDate) > 0;
}

export function formatDueDate(dueDate: string): string {
    const days = daysUntil(dueDate);

    if (days < 0) return `${-days} day${days === -1 ? '' : 's'} late`;
    if (days === 0) return 'due today';
    if (days === 1) return 'due tomorrow';
    return `due in ${days} days`;
}

// "Mon 14 Mar"
export function formatShortDate(date: Date): string {
    const weekday = date.toLocaleDateString('en-US', {weekday: 'short'});
    const month = date.toLocaleDateString('en-US', {month: 'short'});
    return `${weekday} ${date.getDate()} ${month}`;
}

// "Monday"
export function formatWeekday(date: Date): string {
    return date.toLocaleDateString('en-US', {weekday: 'long'});
}

// "14th"
export function formatDayOfMonth(date: Date): string {
    const day = date.getDate();
    const lastTwoDigits = day % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) return `${day}th`;
    const suffix = {1: 'st', 2: 'nd', 3: 'rd'}[day % 10] ?? 'th';
    return `${day}${suffix}`;
}

// "14 March"
export function formatDayAndMonth(date: Date): string {
    return `${date.getDate()} ${date.toLocaleDateString('en-US', {month: 'long'})}`;
}
