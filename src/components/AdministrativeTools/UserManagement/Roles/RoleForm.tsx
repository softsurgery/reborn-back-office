import { Label } from "@/components/ui/label";
import { useRoleManager } from "./hooks/useRoleManager";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { Toggle } from "@/components/ui/toggle";
import { Permission } from "@/types/user-management";

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
  const roleManager = useRoleManager();

  const groupedPermissions = permissions?.reduce((groups, permission) => {
    const [_, entity] = permission.label?.split("_") || ["action", "model"];
    if (!groups[entity]) {
      groups[entity] = [];
    }
    groups[entity].push(permission);
    return groups;
  }, {} as Record<string, Permission[]>);

  const permissionFormFragment = React.useMemo(() => {
    if (groupedPermissions)
      return Object.entries(groupedPermissions).map(([entity, permissions]) => (
        <div key={entity}>
          {/* Entity Label */}
          <Label className="mb-2">{entity.toUpperCase()}</Label>
          {/* Toggles for Permissions */}
          <div className="flex flex-wrap gap-2 my-2">
            {permissions.map((permission) => {
              const isSelected = roleManager.isPermissionSelected(
                permission?.id
              );
              return (
                <Toggle
                  key={permission.id}
                  defaultPressed={isSelected}
                  value={permission?.id?.toString()}
                  onClick={() => {
                    if (isSelected) {
                      roleManager.removePermission(permission?.id);
                    } else {
                      roleManager.addPermission(permission);
                    }
                  }}
                  className="border"
                >
                  {permission?.label?.toUpperCase()}
                </Toggle>
              );
            })}
          </div>
        </div>
      ));
  }, [roleManager.permissions]);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* Label */}
      <div>
        <Label>Label (*)</Label>
        <div className="mt-1">
          <Input
            placeholder="Ex. Awesome Administrator"
            value={roleManager.label}
            onChange={(e) => roleManager.set("label", e.target.value)}
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
            value={roleManager.description}
            onChange={(e) => roleManager.set("description", e.target.value)}
            rows={7}
          />
        </div>
      </div>

      {/* Permissions */}
      <div>
        <Label>Permissions (*)</Label>
        <div className="flex flex-col gap-4 mt-2">{permissionFormFragment}</div>
      </div>
    </div>
  );
};
