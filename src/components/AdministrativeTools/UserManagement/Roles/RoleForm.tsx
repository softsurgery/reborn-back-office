import React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { Permission } from "@/types/user-management";
import { useRoleStore } from "@/hooks/stores/useRoleStore";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface RoleFormProps {
  className?: string;
  permissions?: Permission[];
  loading?: boolean;
}

export const RoleForm: React.FC<RoleFormProps> = ({
  className,
  permissions,
  loading,
}) => {
  const roleStore = useRoleStore();

  const groupedPermissions = permissions?.reduce(
    (groups, permission) => {
      const [_, ...rest] = permission?.label?.split('_') || [];
      const entity = rest.join('_');
      if (!groups[entity]) {
        groups[entity] = [];
      }
      groups[entity].push(permission);
      return groups;
    },
    {} as Record<string, Permission[]>
  );

  const sortedGroupedPermissions = Object.entries(groupedPermissions || {})
    .sort(([entityA], [entityB]) => entityA.localeCompare(entityB))
    .reduce(
      (sortedGroups, [entity, permissions]) => {
        sortedGroups[entity] = permissions;
        return sortedGroups;
      },
      {} as Record<string, Permission[]>
    );

  const permissionFormFragment = React.useMemo(() => {
    return Object.entries(sortedGroupedPermissions).map(([entity, permissions]) => (
      <Accordion type="multiple" key={entity} className="mt-0">
        <AccordionItem value={entity}>
          <AccordionTrigger className="text-sm font-extrabold">
            {entity}
          </AccordionTrigger>
          <AccordionContent>
            <div key={entity}>
              {/* Entity Label */}
              <Label className="mb-1"></Label>
              {/* Toggles for Permissions */}
              <div className="flex gap-2">
                {permissions.map((permission) => {
                  const isSelected = roleStore.isPermissionSelected(permission?.id);
                  return (
                    <Toggle
                      key={permission.id}
                      defaultPressed={isSelected}
                      value={permission?.id?.toString()}
                      onClick={() => {
                        if (isSelected) {
                          roleStore.removePermission(permission?.id);
                        } else {
                          roleStore.addPermission(permission);
                        }
                      }}
                      className="border">
                      {(permission?.label)}
                    </Toggle>
                  );
                })}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    ));
  }, [roleStore.permissions]);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* Label */}
      <div>
        <Label>Label (*)</Label>
        <div className="mt-1">
          <Input
            placeholder="Ex. Awesome Administrator"
            value={roleStore.label}
            onChange={(e) => roleStore.set("label", e.target.value)}
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <Label>Description (*)</Label>
        <div className="mt-1">
          <Textarea
            placeholder="This is awesome!"
            className="resize-none"
            value={roleStore.description || undefined}
            onChange={(e) => roleStore.set("description", e.target.value)}
            rows={7}
          />
        </div>
      </div>

      {/* Permissions */}
      <div>
        <Label>Permissions (*)</Label>
        {permissionFormFragment}
      </div>
    </div>
  );
};
