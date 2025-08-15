import React, { use } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Eye, EyeOff } from "lucide-react";
import { Field, SelectOption } from "./types";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "react-i18next";
import { PasswordField } from "../PasswordField";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface FieldBuilderProps {
  field?: Field<any>;
}

export const FieldBuilder = ({ field }: FieldBuilderProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { t } = useTranslation("common");

  switch (field?.variant) {
    case "text":
    case "email":
    case "tel":
    case "url":
      return (
        <Input
          className={cn(
            field?.className,
            field.error && "border-destructive focus-visible:ring-destructive"
          )}
          type={field.variant}
          placeholder={field.placeholder}
          value={field.props?.value}
          onChange={(event) => {
            field?.props?.onChange?.(event.target.value);
          }}
        />
      );
    case "number":
      return (
        <Input
          className={cn(
            field?.className,
            field.error && "border-destructive focus-visible:ring-destructive"
          )}
          type={field.variant}
          min={field.props?.min}
          max={field.props?.max}
          value={field.props?.value}
          placeholder={field?.placeholder}
          onChange={(event) => {
            const inputValue = Number(event.target.value);
            const min = field.props?.min ?? -Infinity;
            const max = field.props?.max ?? Infinity;
            const clampedValue = Math.max(min, Math.min(max, inputValue));
            field?.props?.onChange?.(clampedValue);
          }}
        />
      );
    case "select":
      return (
        <Select
          value={field?.props?.value}
          defaultValue={field?.props?.value}
          onValueChange={field?.props?.onValueChange}
          disabled={field?.props?.disabled}
        >
          <SelectTrigger
            id={field.id}
            className={cn(
              "w-full",
              field?.className,
              field.error && "border-destructive focus-visible:ring-destructive"
            )}
          >
            <SelectValue placeholder={field.placeholder} />
          </SelectTrigger>
          <SelectContent className="overflow-y-auto max-h-[15rem]">
            {field?.props?.options?.map((option: SelectOption) => {
              return (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      );
    case "date":
      return (
        <DatePicker
          className={cn(
            "w-full",
            field?.className,
            field.error && "border-destructive focus-visible:ring-destructive"
          )}
          value={
            (field?.props?.value &&
              new Date(field?.props?.value as string | Date | number)) ||
            undefined
          }
          onChange={(value: Date | null) => field?.props?.onDateChange?.(value)}
          placeholder={t("common.placeholders.selectDate")}
          nullable={field?.props?.nullable}
          disabled={field?.props?.disabled}
        />
      );
    case "check":
      return (
        <div className="flex items-center gap-2 h-8">
          <Checkbox
            {...field.props}
            id={field.label}
            checked={field?.props?.value}
            defaultChecked={field?.props?.defaultChecked}
            onCheckedChange={(value) => field?.props?.onCheckedChange?.(value)}
          />
          <Label className={cn("text-sm font-semibold")} htmlFor={field.label}>
            {field.label}
          </Label>
        </div>
      );
    case "password":
      return (
        <PasswordField
          {...field.props}
          className={cn(
            "pr-10",
            field.error && "border-destructive focus-visible:ring-destructive",
            field?.className
          )}
          value={field?.props?.value as string}
          onChange={(e) => field?.props?.onChange?.(e.target.value)}
        />
      );
    case "switch":
      return (
        <div className={cn("flex items-center gap-2", field?.className)}>
          <Switch
            {...field.props}
            id={field.label}
            checked={field?.props?.value}
            defaultChecked={field?.props?.defaultChecked}
            onCheckedChange={(value) => field?.props?.onCheckedChange?.(value)}
          />{" "}
          <Label className="text-xs font-light">{field.description}</Label>
        </div>
      );
    case "textarea":
      return (
        <Textarea
          {...field.props}
          id={field.id}
          className={cn(
            !field.props?.resizable && "resize-none",
            field?.className
          )}
          placeholder={field.placeholder}
          value={field.props?.value}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            field?.props?.onChange?.(e.target.value)
          }
        />
      );
    case "checkbox":
      return (
        <div className="flex flex-col gap-2 my-1">
          {field.props?.selectOptions?.map((option: SelectOption) => (
            <div key={option.label} className="flex items-center gap-2">
              <Checkbox
                id={option.label}
                className={field?.className}
                checked={field.props?.value as CheckedState}
                onCheckedChange={(value: CheckedState) =>
                  field?.props?.onCheckedChange?.(value)
                }
              />
              <Label className="text-sm font-semibold">{option.label}</Label>
            </div>
          ))}
        </div>
      );
    case "file":
      return (
        <div className={cn("flex flex-col gap-2", field?.className)}>
          <Input
            {...field.props}
            id={field.id}
            type="file"
            accept={field.props?.accept}
            className={cn(
              "my-5 flex items-center",
              field?.className,
              field.error && "border-destructive focus-visible:ring-destructive"
            )}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0];
              if (file) {
                field?.props?.onFileChange?.(file);
                if (field.props?.onUpload) {
                  field.props.onUpload(file, (percent: number) => {
                    field.props.progress = percent;
                  });
                }
              }
            }}
          />
          {typeof field.props?.progress === "number" && (
            <div className="space-y-1">
              <Progress value={field.props.progress} />
              <span className="text-xs text-muted-foreground text-center">
                {field.props.progress}%
              </span>
            </div>
          )}
        </div>
      );
    case "image":
      return (
        <div
          className={cn("flex flex-col gap-2 items-center", field?.className)}
        >
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0];
              if (file) {
                field?.props?.onFileChange?.(file);
                if (field.props?.onUpload) {
                  field.props.onUpload(file, (percent: number) => {
                    field.props.progress = percent;
                  });
                }
              }
            }}
          />
          <Avatar
            className="w-24 h-24 cursor-pointer hover:opacity-80 transition"
            onClick={() => fileInputRef.current?.click()}
          >
            <AvatarImage
              src={field.props?.value || "https://github.com/shadcn.png"}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      );
    case "custom":
      return (
        <div className={cn("flex flex-col gap-2", field?.className)}>
          {field.props?.children}
        </div>
      );
    case "empty":
      return null;
    default:
      return (
        <span className="text-xs text-red-500">Cannot Render Element</span>
      );
  }
};
