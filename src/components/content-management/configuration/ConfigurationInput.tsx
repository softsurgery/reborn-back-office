import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useConfigStore } from "@/hooks/stores/userConfigStore";
import { cn } from "@/lib/utils";
import { ParamVariant, ResponseConfigurationParamDto } from "@/types";
import { useTranslation } from "react-i18next";

interface ConfigurationInputProps {
  className?: string;
  configurationParam: ResponseConfigurationParamDto;
}

export const ConfigurationInput = ({
  className,
  configurationParam,
}: ConfigurationInputProps) => {
  const { t } = useTranslation("content-management");
  const configStore = useConfigStore();

  const currentValue =
    configStore.updateDtos.find((p) => p.id === configurationParam.id)?.value ||
    "";

  const handleChange = (newValue: string) => {
    const newUpdateDtos = configStore.updateDtos.filter(
      (p) => p.id !== configurationParam.id,
    );
    newUpdateDtos.push({ id: configurationParam.id, value: newValue });
    configStore.set("updateDtos", newUpdateDtos);
  };

  switch (configurationParam.variant) {
    case ParamVariant.STRING:
      return (
        <Input
          className={cn("w-full", className)}
          value={currentValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={t("configuration.inputs.enter", {
            name: configurationParam.name,
          })}
        />
      );

    case ParamVariant.NUMBER:
      return (
        <Input
          type="number"
          className={cn("w-full", className)}
          value={currentValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={t("configuration.inputs.enter", {
            name: configurationParam.name,
          })}
        />
      );

    case ParamVariant.SELECT:
      return (
        <Select value={currentValue} onValueChange={handleChange}>
          <SelectTrigger className={cn("w-full", className)}>
            <SelectValue
              placeholder={t("configuration.inputs.select", {
                name: configurationParam.name,
              })}
            />
          </SelectTrigger>
          <SelectContent>
            {configurationParam.options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    default:
      return null;
  }
};
