import * as React from "react";
import {
  eachMonthOfInterval,
  endOfYear,
  format,
  getMonth,
  getYear,
  Locale,
  setMonth,
  setYear,
  startOfYear,
} from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { enUS, fr } from "date-fns/locale";
import { Skeleton } from "./skeleton";

function getLocalizedMonths(locale: Locale) {
  const months = eachMonthOfInterval({
    start: startOfYear(new Date()),
    end: endOfYear(new Date()),
  });

  return months.map((month) => format(month, "LLLL", { locale }));
}

interface DatePickerProps {
  className?: string;
  containerClassName?: string;
  value?: Date;
  onChange: (value: Date | null) => void;
  startYear?: number;
  endYear?: number;
  nullable?: boolean;
  isPending?: boolean;
}
export function DatePicker({
  className,
  containerClassName,
  value,
  onChange,
  startYear = getYear(new Date()) - 100,
  endYear = getYear(new Date()) + 100,
  nullable = false,
  isPending,
}: DatePickerProps) {
  const i18n = { language: "en" };

  const months = React.useMemo(() => {
    return getLocalizedMonths(i18n.language == "fr" ? fr : enUS);
  }, [i18n.language]);

  const date = React.useMemo(() => {
    return value;
  }, [value, i18n.language]);

  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  );

  const handleMonthChange = (month: string) => {
    if (date) {
      const newDate = setMonth(date, months.indexOf(month));
      onChange(newDate);
    }
  };

  const handleYearChange = (year: string) => {
    if (date) {
      const newDate = setYear(date, parseInt(year));
      onChange(newDate);
    }
  };

  const handleSelect = (selectedData: Date | undefined) => {
    if (selectedData) {
      onChange(selectedData);
    }
  };
  if (isPending) return <Skeleton className={cn("h-9", className)} />;
  return (
    <div className="flex flex-row gap-2">
      <Popover modal>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant={"outline"}
            className={cn(
              "flex gap-2 justify-center items-center py-4",
              !value && "text-muted-foreground",
              className
            )}
            onClick={() => onChange(new Date())}
          >
            <CalendarIcon className="h-4 w-4" />
            <span className="text-xs">
              {date
                ? format(date, "PPP", {
                    locale: i18n.language == "fr" ? fr : enUS,
                  })
                : "Pick a date..."}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn("w-auto p-2 flex flex-col", containerClassName)}
        >
          <div className="flex justify-between p-2">
            <Select
              onValueChange={handleMonthChange}
              value={months[getMonth(date || new Date())]}
            >
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              onValueChange={handleYearChange}
              value={getYear(date || new Date()).toString()}
            >
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            initialFocus
            month={date}
            onMonthChange={onChange}
          />
        </PopoverContent>
      </Popover>
      {nullable && (
        <Button
          type="button"
          size={"icon"}
          variant={"ghost"}
          onClick={() => onChange(null)}
          disabled={value == null}
        >
          <X />
        </Button>
      )}
    </div>
  );
}
