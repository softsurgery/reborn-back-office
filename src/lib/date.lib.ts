import { format, parseISO } from "date-fns";

export function toDateOnly(date: Date) {
  if (isNaN(date?.getTime())) {
    throw new Error("Invalid date object");
  }
  return format(date, "yyyy-MM-dd");
}

export function transformDate(dateString: string) {
  const date = parseISO(dateString);
  return format(date, "dd-MM-yyyy");
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

export const formatMessageTime = (
  dateInput?: string | Date,
  locale?: string,
  t?: (key: string) => string
) => {
  if (!dateInput) return "";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();
  const weekAgo = new Date(now);
  weekAgo.setDate(now.getDate() - 7);
  const isThisWeek = date > weekAgo && !isToday && !isYesterday;

  const timeStr = date.toLocaleTimeString(locale || "en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (isToday) return timeStr;
  if (isYesterday)
    return `${
      t?.("userManagement.inspect.conversations.conversationList.yesterday") ||
      "Yesterday"
    } at ${timeStr}`;
  if (isThisWeek)
    return `${date.toLocaleDateString(locale, {
      weekday: "long",
    })} at ${timeStr}`;
  return `${date.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  })} at ${timeStr}`;
};
