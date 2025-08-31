import { format, parseISO } from "date-fns";

export function toDateOnly(date: Date) {
    if (isNaN(date?.getTime())) {
        throw new Error("Invalid date object");
    }
    return format(date, "yyyy-MM-dd");
}

export function transformDate(dateString: string) {
    const date = parseISO(dateString);
    return format(date, 'dd-MM-yyyy');
  }

export function toDateTime(date: Date) {
    if (isNaN(date.getTime())) {
        throw new Error("Invalid date object");
    }
    return format(date, "yyyy-MM-dd HH:mm:ss");
}

export function timeAgo(input: Date | string): string {
  const date = input instanceof Date ? input : new Date(input);
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60)
    return `${diffSeconds} second${diffSeconds !== 1 ? "s" : ""} ago`;
  if (diffMinutes < 60)
    return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
  if (diffHours < 24)
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
}