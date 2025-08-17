import React from "react";
import { AlertCircle, Search, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import JSONForm from "@/components/ui/json-editor";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useIntro } from "@/contexts/IntroContext";
import { useFooter } from "@/contexts/FooterContext";
import { Store } from "@/types";
import { deepEqual, safeStringify, stableStringify } from "@/lib/object.util";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";

export const AppProperties = () => {
  const [textBuffers, setTextBuffers] = React.useState<Record<string, string>>(
    {}
  );

  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setIntro, clearIntro } = useIntro();
  const { setContent, clearContent } = useFooter();
  const queryClient = useQueryClient();

  React.useEffect(() => {
    setRoutes?.([
      {
        title: "Content Management",
        href: "/content-management",
      },
      {
        title: "Application Properties",
        href: "/content-management/application-properties",
      },
    ]);
    setIntro?.(
      "Application Properties",
      "Manage and configure application properties in a structured format"
    );

    return () => {
      clearRoutes?.();
      clearIntro?.();
      clearContent?.();
    };
  }, []);

  const {
    data: storesResponse,
    isPending: isStoresPending,
    refetch: refetchStores,
  } = useQuery({
    queryKey: ["stores"],
    queryFn: () => api.admin.store.findAll(),
  });

  const [data, setData] = React.useState<Store[] | null>(
    storesResponse || null
  );
  const [original, setOriginal] = React.useState<Store[] | null>(null);
  const loading = isStoresPending;

  const [query, setQuery] = React.useState("");
  const [showChangedOnly, setShowChangedOnly] = React.useState(false);
  const [expanded, setExpanded] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (storesResponse && !original) {
      setData(storesResponse);
      setOriginal(storesResponse);
      setExpanded(storesResponse.map((s) => s.id));
    }
  }, [storesResponse, original]);

  const changedIds = React.useMemo(() => {
    if (!data || !original) return [];
    const mapOrig = new Map(original.map((s) => [s.id, s.value]));
    return data
      .filter((s) => {
        const o = mapOrig.get(s.id);
        return !deepEqual(s.value, o);
      })
      .map((s) => s.id);
  }, [data, original]);

  const filtered = React.useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    const base = data.filter((s) =>
      q
        ? s.id.toLowerCase().includes(q) ||
          stableStringify(s.value).toLowerCase().includes(q)
        : true
    );
    return showChangedOnly
      ? base.filter((s) => changedIds.includes(s.id))
      : base;
  }, [data, query, showChangedOnly, changedIds]);

  const handleValueChange = (storeId: string, newValue: any) => {
    setData?.((prev) =>
      (prev ?? []).map((s) =>
        s.id === storeId ? { ...s, value: newValue } : s
      )
    );
  };

  const handleResetStore = (storeId: string) => {
    if (!original) return;
    const orig = original.find((s) => s.id === storeId);
    if (!orig) return;
    setData?.((prev) =>
      (prev ?? []).map((s) =>
        s.id === storeId ? { ...s, value: orig.value } : s
      )
    );
  };

  const handleResetAll = React.useCallback(() => {
    if (!original) return;
    setData?.(original.map((s) => ({ ...s, value: s.value })));
  }, [original, setData]);

  React.useEffect(() => {
    setContent?.(
      <div className="flex items-end justify-end gap-2">
        <Button>Save Changes</Button>
        <Button variant={"secondary"} onClick={handleResetAll}>
          Reset
        </Button>
      </div>
    );
  }, []);

  const handleSaveAll = () => {
    if (!data) return;
    setOriginal(data.map((s) => ({ ...s })));
  };

  const allExpanded = React.useMemo(() => {
    if (!data) return false;
    return expanded.length === data.length;
  }, [expanded, data]);

  const toggleAll = () => {
    if (!data) return;
    setExpanded((prev) =>
      prev.length === data.length ? [] : data.map((s) => s.id)
    );
  };

  return (
    <main className={cn("flex flex-col flex-1 container overflow-hidden p-1")}>
      {/* Page header */}
      <div className="w-full mb-2">
        {/* Toolbar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stores or keys (e.g., 'theme' or 'auth')"
            className="pl-9"
          />
        </div>

        {/* Change status */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={changedIds.length ? "default" : "secondary"}>
              {changedIds.length
                ? `${changedIds.length} store(s) changed`
                : "No pending changes"}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={showChangedOnly ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setShowChangedOnly(!showChangedOnly)}
              disabled={loading || !data?.length}
            >
              Show changed only
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleAll}
              disabled={loading || !data?.length}
            >
              {allExpanded ? "Collapse all" : "Expand all"}
            </Button>
          </div>
        </div>
      </div>

      <Separator />
      <section className="flex flex-col flex-1 overflow-auto no-scrollbar py-4">
        {/* Loading state */}
        {loading && (
          <div className="flex flex-col gap-4">
            {[0, 1, 2].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-56" />
                  </div>
                  <Skeleton className="h-6 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-44 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>No results</CardTitle>
              <CardDescription>
                Try adjusting your search or filter. There are no stores
                matching your criteria.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Showing 0 items.
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content */}
        {!loading && filtered.length > 0 && (
          <Accordion
            type="multiple"
            value={expanded}
            onValueChange={(v) => setExpanded(Array.isArray(v) ? v : [])}
            className="space-y-4 border-none"
          >
            {filtered.map((store) => {
              const isChanged = changedIds.includes(store.id);
              const subtitle = "Global application configuration";

              return (
                <AccordionItem
                  value={store.id}
                  key={store.id}
                  className="bg-card border rounded-lg px-2"
                >
                  <AccordionTrigger className="px-2">
                    <div className="flex w-full items-center justify-between pr-2">
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-semibold tracking-tight">
                            {store.id.toUpperCase()}
                          </span>
                          {isChanged && (
                            <Badge variant="outline">Changed</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {subtitle}
                        </p>
                      </div>
                      <div className="hidden md:flex items-center gap-3">
                        <Button
                          variant="secondary"
                          size="sm"
                          disabled={!isChanged}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResetStore(store.id);
                          }}
                        >
                          <Undo2 className="mr-2 h-4 w-4" />
                          Reset store
                        </Button>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-2 md:p-4">
                      <div className="flex flex-col md:flex-row gap-4">
                        <JSONForm
                          value={store.value}
                          onChange={(val) => handleValueChange(store.id, val)}
                          className="w-full md:w-2/3"
                        />
                        <Textarea
                          className="w-full md:w-1/3 resize-none font-bold"
                          value={
                            textBuffers[store.id] ?? safeStringify(store.value)
                          }
                        />
                      </div>

                      {/* Mobile actions */}
                      <div className="mt-3 flex md:hidden items-center justify-end gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          disabled={!isChanged}
                          onClick={() => handleResetStore(store.id)}
                        >
                          <Undo2 className="mr-2 h-4 w-4" />
                          Reset store
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </section>
    </main>
  );
};
