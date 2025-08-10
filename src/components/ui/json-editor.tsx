"use client";

import type React from "react";
import { createContext, useContext, type HTMLAttributes } from "react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type JSONPrimitive = string | number | boolean | null;
export type JSONValue =
  | JSONPrimitive
  | JSONValue[]
  | { [k: string]: JSONValue };

type SchemaNode =
  | { kind: "string" }
  | { kind: "number" }
  | { kind: "boolean" }
  | { kind: "null" }
  | { kind: "object"; properties: Record<string, SchemaNode>; order: string[] }
  | { kind: "array"; element?: SchemaNode }; // undefined element means initial array was empty (unknown type)

type PathSegment = string | number;
type Path = PathSegment[];

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function deriveSchemaFromData(value: JSONValue): SchemaNode {
  if (value === null) return { kind: "null" };
  if (Array.isArray(value)) {
    const first = value.find((v) => v !== null);
    if (first === undefined) return { kind: "array" };
    return { kind: "array", element: deriveSchemaFromData(first as JSONValue) };
  }
  switch (typeof value) {
    case "string":
      return { kind: "string" };
    case "number":
      return { kind: "number" };
    case "boolean":
      return { kind: "boolean" };
    case "object": {
      const props: Record<string, SchemaNode> = {};
      const order: string[] = [];
      for (const key of Object.keys(value as Record<string, JSONValue>)) {
        order.push(key);
        props[key] = deriveSchemaFromData(
          (value as Record<string, JSONValue>)[key]
        );
      }
      return { kind: "object", properties: props, order };
    }
    default:
      return { kind: "null" };
  }
}

function defaultValueForSchema(schema: SchemaNode): JSONValue {
  switch (schema.kind) {
    case "string":
      return "";
    case "number":
      return 0;
    case "boolean":
      return false;
    case "null":
      return null;
    case "object": {
      const obj: Record<string, JSONValue> = {};
      for (const key of schema.order) {
        obj[key] = defaultValueForSchema(schema.properties[key]);
      }
      return obj;
    }
    case "array":
      return [];
  }
}

function defaultItemForSchema(schema?: SchemaNode): JSONValue {
  if (!schema) return null;
  switch (schema.kind) {
    case "string":
      return "";
    case "number":
      return 0;
    case "boolean":
      return false;
    case "null":
      return null;
    case "object": {
      const obj: Record<string, JSONValue> = {};
      for (const key of schema.order) {
        obj[key] = defaultValueForSchema(schema.properties[key]);
      }
      return obj;
    }
    case "array":
      return [];
  }
}

// Create a new item by cloning an example's shape while resetting leaves to type defaults.
function cloneWithDefaultsFromExample(example: JSONValue): JSONValue {
  if (example === null) return null;
  if (Array.isArray(example)) {
    // For nested arrays, default to empty rather than guessing item type
    return [];
  }
  if (typeof example === "object") {
    const out: Record<string, JSONValue> = {};
    for (const key of Object.keys(example as Record<string, JSONValue>)) {
      out[key] = cloneWithDefaultsFromExample(
        (example as Record<string, JSONValue>)[key]
      );
    }
    return out;
  }
  switch (typeof example) {
    case "string":
      return "";
    case "number":
      return 0;
    case "boolean":
      return false;
    default:
      return null;
  }
}

function updateAtPath(
  data: JSONValue,
  path: Path,
  updater: (curr: JSONValue) => JSONValue
): JSONValue {
  if (path.length === 0) return updater(data);
  const [head, ...rest] = path;
  if (typeof head === "number") {
    const arr = Array.isArray(data) ? (data as JSONValue[]) : [];
    const copy = arr.slice();
    copy[head] = updateAtPath(arr[head], rest, updater);
    return copy;
  } else {
    const obj = isObject(data) ? (data as Record<string, JSONValue>) : {};
    return {
      ...obj,
      [head]: updateAtPath(obj[head], rest, updater),
    };
  }
}

function pathToId(path: Path) {
  return [
    "root",
    ...path.map((seg) =>
      typeof seg === "number" ? `i${seg}` : seg.replace(/[^a-zA-Z0-9_-]/g, "_")
    ),
  ].join("__");
}

function pathToLabel(path: Path) {
  if (path.length === 0) return "root";
  return path
    .map((seg) => (typeof seg === "number" ? `[${seg}]` : seg))
    .join(".")
    .replace(".[", "[");
}

type JSONFormProps = {
  value: JSONValue;
  onChange: (next: JSONValue) => void;
  title?: string;
  description?: string;
};

export default function JSONForm(props: JSONFormProps) {
  const { value, onChange, title = "JSON", description } = props;
  // Freeze schema on initial render to lock structure and keys
  const schema = useMemo(() => deriveSchemaFromData(value), []);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <div className="text-lg font-medium">{title}</div>
        {description ? (
          <div className="text-sm text-muted-foreground">{description}</div>
        ) : null}
      </div>
      <FormNode
        value={value}
        onChange={onChange}
        schema={schema}
        path={[]}
        depth={0}
        sensors={sensors}
      />
    </div>
  );
}

function FormNode({
  value,
  schema,
  onChange,
  path,
  depth,
  sensors,
}: {
  value: JSONValue;
  schema: SchemaNode;
  onChange: (next: JSONValue) => void;
  path: Path;
  depth: number;
  sensors: ReturnType<typeof useSensors>;
}) {
  switch (schema.kind) {
    case "object":
      return (
        <div
          className={cn(
            "space-y-4 rounded-lg border p-4",
            depth === 0 ? "" : "bg-muted/20"
          )}
        >
          {schema.order.map((key) => {
            const childSchema = schema.properties[key];
            const childPath = [...path, key];
            const id = pathToId(childPath);
            const childVal = isObject(value)
              ? (value as Record<string, JSONValue>)[key]
              : undefined;

            return (
              <div key={key} className="space-y-2">
                <Label htmlFor={id} className="text-base">
                  {key}
                </Label>
                <FormNode
                  value={childVal as JSONValue}
                  schema={childSchema}
                  onChange={(nextChild) => {
                    // Update this object by replacing only the specific child
                    const nextObj = updateAtPath(value, [key], () => nextChild);
                    onChange(nextObj);
                  }}
                  path={childPath}
                  depth={depth + 1}
                  sensors={sensors}
                />
              </div>
            );
          })}
        </div>
      );

    case "array": {
      const arr = Array.isArray(value) ? (value as JSONValue[]) : [];
      const canAdd = !!schema.element;
      const label = pathToLabel(path);
      const baseId = pathToId(path);
      const items = arr.map((_, i) => `${baseId}__${i}`);

      const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = (active.data.current as any)?.sortable
          ?.index as number;
        const newIndex = (over.data.current as any)?.sortable?.index as number;
        if (typeof oldIndex !== "number" || typeof newIndex !== "number")
          return;
        const nextArr = arrayMove(arr, oldIndex, newIndex);
        onChange(nextArr);
      };

      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">{label}</div>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => {
                if (!canAdd) return;
                const item =
                  arr.length > 0
                    ? cloneWithDefaultsFromExample(arr[arr.length - 1])
                    : defaultItemForSchema(schema.element);
                onChange([...arr, item]);
              }}
              disabled={!canAdd}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add item
            </Button>
          </div>
          {!canAdd ? (
            <p className="text-xs text-muted-foreground">
              Element type is unknown (initial array was empty). Seed the
              initial JSON to enable adding items.
            </p>
          ) : null}

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {arr.map((item, index) => {
                  const id = `${baseId}__${index}`;
                  return (
                    <SortableArrayItem key={id} id={id}>
                      <ArrayItemCard
                        index={index}
                        onRemove={() => {
                          const next = arr.slice();
                          next.splice(index, 1);
                          onChange(next);
                        }}
                      >
                        {schema.element ? (
                          <FormNode
                            value={item}
                            schema={schema.element}
                            onChange={(nextItem) => {
                              const next = arr.slice();
                              next[index] = nextItem;
                              onChange(next);
                            }}
                            path={[...path, index]}
                            depth={depth + 1}
                            sensors={sensors}
                          />
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            Unknown item type
                          </p>
                        )}
                      </ArrayItemCard>
                    </SortableArrayItem>
                  );
                })}
                {arr.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No items</p>
                ) : null}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      );
    }

    case "string": {
      const id = pathToId(path);
      const str = typeof value === "string" ? value : "";
      return (
        <Input
          id={id}
          value={str}
          onChange={(e) => {
            onChange(e.target.value);
          }}
          placeholder="Text"
        />
      );
    }

    case "number": {
      const id = pathToId(path);
      const num = typeof value === "number" ? value : 0;
      return (
        <Input
          id={id}
          type="number"
          step="any"
          value={Number.isFinite(num) ? String(num) : ""}
          onChange={(e) => {
            const v = e.target.value;
            const parsed = v === "" ? 0 : Number(v);
            onChange(Number.isFinite(parsed) ? parsed : 0);
          }}
          placeholder="Number"
        />
      );
    }

    case "boolean": {
      const id = pathToId(path);
      const bool = typeof value === "boolean" ? value : false;
      return (
        <div className="flex items-center gap-3">
          <Switch
            id={id}
            checked={bool}
            onCheckedChange={(checked) => {
              onChange(checked);
            }}
          />
          <Label htmlFor={id} className="text-sm text-muted-foreground">
            {pathToLabel(path)}
          </Label>
        </div>
      );
    }

    case "null": {
      return (
        <div className="flex items-center gap-2">
          <Badge variant="secondary">null</Badge>
          <span className="text-xs text-muted-foreground">
            Value is null (type locked). Change requires schema change.
          </span>
        </div>
      );
    }

    default:
      return (
        <div className="text-xs text-muted-foreground">
          Unsupported node
          <Separator className="my-2" />
        </div>
      );
  }
}

function SortableArrayItem({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <SortableHandleContext.Provider value={{ attributes, listeners }}>
        {children}
      </SortableHandleContext.Provider>
    </div>
  );
}

type HandleProps = {
  attributes: HTMLAttributes<any>;
  listeners: any;
};
const SortableHandleContext = createContext<HandleProps | null>(null);
function useSortableHandle() {
  return useContext(SortableHandleContext);
}

function ArrayItemCard({
  index,
  onRemove,
  children,
}: {
  index: number;
  onRemove: () => void;
  children: React.ReactNode;
}) {
  const handle = useSortableHandle();
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="cursor-grab active:cursor-grabbing"
            aria-label="Drag to reorder"
            {...(handle?.attributes ?? {})}
            {...(handle?.listeners ?? {})}
          >
            <GripVertical className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium">Item {index + 1}</div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          aria-label={`Remove item ${index + 1}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <CardContent className="p-3">{children}</CardContent>
    </Card>
  );
}
