import JSONForm, { JSONValue } from "@/components/shared/JsonEditor";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Check, Text } from "lucide-react";
import React from "react";

interface RefParamExtrasProps {
  className?: string;
  value: JSONValue;
  onChange: (next: JSONValue) => void;
}

export const RefParamExtras = ({
  className,
  value,
  onChange,
}: RefParamExtrasProps) => {
  const [jsonText, setJsonText] = React.useState(
    JSON.stringify(value, null, 2),
  );
  const lineNumbers = React.useMemo(
    () => (jsonText.match(/\n/g) || []).length + 8,
    [jsonText],
  );
  const [error, setError] = React.useState<string | null>(null);

  const handleApply = () => {
    try {
      const parsed = JSON.parse(jsonText);
      onChange(parsed);
      setError(null);
    } catch (err) {
      setError("Invalid JSON format. Please fix and try again.");
    }
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (err) {
      setError("Invalid JSON format. Please fix and try again.");
    }
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="w-full flex flex-row gap-2">
        <div className="w-full">
          <Textarea
            className="font-mono text-sm resize-none"
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Tab") {
                e.preventDefault();
                const target = e.target as HTMLTextAreaElement;
                const start = target.selectionStart;
                const end = target.selectionEnd;

                const tab = "\t";
                const newValue =
                  jsonText.substring(0, start) + tab + jsonText.substring(end);

                setJsonText(newValue);

                requestAnimationFrame(() => {
                  target.selectionStart = target.selectionEnd =
                    start + tab.length;
                });
              }
            }}
            rows={lineNumbers}
          />
          {error && (
            <p className="text-red-500 text-xs font-bold mt-1">{error}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            size={"sm"}
            onClick={handleApply}
          >
            <Check />
            Apply JSON
          </Button>
          <Button
            type="button"
            variant="outline"
            size={"sm"}
            onClick={handleFormat}
          >
            <Text />
            Format JSON
          </Button>
        </div>
      </div>

      <JSONForm
        value={value as JSONValue}
        className="w-full"
        onChange={(next: JSONValue) => {
          onChange(next);
          // Keep text in sync
          setJsonText(JSON.stringify(next, null, 2));
        }}
      />
    </div>
  );
};
