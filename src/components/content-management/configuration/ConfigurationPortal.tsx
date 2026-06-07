import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useIntro } from "@/contexts/IntroContext";
import { useConfigurations } from "@/hooks/content/configuration/useConfigurations";
import { useConfigStore } from "@/hooks/stores/userConfigStore";
import { cn } from "@/lib/utils";
import _ from "lodash";
import React from "react";
import { ConfigurationInput } from "./ConfigurationInput";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/api";
import { Loader2, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface ConfigurationPortalProps {
  className?: string;
}

export const ConfigurationPortal = ({
  className,
}: ConfigurationPortalProps) => {
  const { t } = useTranslation("content-management");
  const { setIntro, clearIntro, setFloating, clearFloating } = useIntro();
  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { configurations, isConfigurationsPending, refetchConfigurations } =
    useConfigurations();
  const configStore = useConfigStore();

  const originalValuesRef = React.useRef<{ id: number; value: string }[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    if (configurations && configStore.updateDtos.length === 0) {
      const allParams = configurations.flatMap(
        (namespace) => namespace.params || [],
      );

      const initialUpdateDtos = allParams.map((param) => ({
        id: param.id,
        value: param.value || "",
      }));

      originalValuesRef.current = initialUpdateDtos;
      configStore.set("updateDtos", initialUpdateDtos);
    }
  }, [configurations]);

  const { mutate: updateConfigs, isPending: isSaving } = useMutation({
    mutationFn: async (data: { id: number; value: string }[]) => {
      return api.admin.configuration.update(data);
    },
    onSuccess: () => {
      refetchConfigurations();
      toast.success(t("configuration.messages.updateSuccess"));
    },
    onError: (error) => {
      toast.error(error.message || t("configuration.messages.updateError"));
    },
  });

  const handleSave = () => {
    const latestUpdateDtos = useConfigStore.getState().updateDtos;
    updateConfigs(latestUpdateDtos);
  };

  const handleReset = () => {
    configStore.set("updateDtos", [...originalValuesRef.current]);
    toast.info(t("configuration.messages.resetSuccess"));
  };

  React.useEffect(() => {
    setRoutes?.([
      {
        title: t("configuration.breadcrumbs.contentManagement"),
        href: "/content-management",
      },
      {
        title: t("configuration.breadcrumbs.configuration"),
        href: "/content-management/configuration",
      },
    ]);

    setIntro?.(
      t("configuration.page.title"),
      t("configuration.page.description"),
    );

    setFloating?.(
      <div className="flex gap-2 justify-center">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("configuration.actions.saving")}
            </>
          ) : (
            t("configuration.actions.saveChanges")
          )}
        </Button>
        <Button variant={"secondary"} onClick={handleReset} disabled={isSaving}>
          {t("configuration.actions.resetAll")}
        </Button>
      </div>,
    );

    return () => {
      clearRoutes?.();
      clearIntro?.();
      clearFloating?.();
    };
  }, []);

  const filteredConfigs = React.useMemo(
    () =>
      configurations
        ?.map((config) => ({
          ...config,
          params: config.params?.filter((param) =>
            param.name?.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
        }))
        .filter((config) => config.params?.length !== 0),
    [configurations, searchQuery],
  );

  if (isConfigurationsPending) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">
          {t("configuration.loading.configurations")}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col flex-1 gap-4 overflow-hidden  container mx-auto p-1 mt-4",
        className,
      )}
    >
      {/* searsh bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search params..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      <Separator />

      <Accordion
        type="multiple"
        className="flex flex-col gap-4 no-scrollbar overflow-auto pb-4"
      >
        {filteredConfigs?.length ? (
          filteredConfigs.map((configuration) => (
            <AccordionItem
              key={configuration.id}
              value={configuration.id}
              className="border-none bg-card px-2 rounded-lg"
            >
              <AccordionTrigger className="pr-6 cursor-pointer flex items-center gap-2">
                <div className="px-4">
                  <p className="text-lg font-bold">
                    {_.capitalize(configuration.name)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {configuration.description}
                  </p>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <CardContent className="flex flex-col gap-8 pt-0">
                  {Object.entries(
                    _.groupBy(
                      configuration.params,
                      (param) => param.name?.split(".")[0],
                    ),
                  ).map(([groupKey, params]) => (
                    <div
                      key={groupKey}
                      className="rounded-md border bg-muted/30 p-4"
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <h3 className="text-sm font-semibold capitalize tracking-tight">
                          {groupKey}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          {t("configuration.groups.count", {
                            count: params.length,
                          })}
                        </span>
                      </div>

                      <div className="space-y-4">
                        {params
                          .sort((a, b) => a.variant.localeCompare(b.variant))
                          .map((param) => (
                            <div
                              key={param.id}
                              className="flex flex-col gap-3 lg:flex-row lg:items-start"
                            >
                              <div className="lg:w-1/4">
                                <Label className="text-sm font-medium">
                                  {_.startCase(
                                    _.camelCase(param.name?.split(".")[1]),
                                  )}
                                </Label>
                                {param.description && (
                                  <p className="text-xs text-muted-foreground">
                                    {param.description}
                                  </p>
                                )}
                              </div>
                              <div className="lg:w-3/4">
                                <ConfigurationInput
                                  configurationParam={param}
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </AccordionContent>
            </AccordionItem>
          ))
        ) : (
          <p className="text-sm text-muted-foreground w-full text-center py-6">
            {searchQuery
              ? "No configutation params match your search"
              : configurations?.length === 0}
          </p>
        )}
      </Accordion>
    </div>
  );
};
