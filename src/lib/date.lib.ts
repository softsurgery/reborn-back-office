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