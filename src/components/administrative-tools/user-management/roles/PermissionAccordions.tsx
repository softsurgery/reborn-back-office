import { ResponsePermissionDto } from "@/types";
import { sortedGroupedPermissions } from "./grouped-permissions";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import { useRoleStore } from "@/hooks/stores/useRoleStore";

interface PermissionAccordionsProps {
  permissions?: ResponsePermissionDto[];
  type: "create" | "update";
}
export const PermissionAccordions = ({
  permissions,
  type,
}: PermissionAccordionsProps) => {
  const roleStore = useRoleStore();

  if (!permissions) return [];
  return Object.entries(sortedGroupedPermissions(permissions)).map(
    ([entity, permissions]) => (
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
              <div className="grid grid-cols-2 gap-2">
                {permissions.map((permission) => {
                  const isSelected = roleStore.isPermissionSelected(
                    permission?.id,
                    type
                  );
                  return (
                    <Toggle
                      key={permission.id}
                      defaultPressed={isSelected}
                      value={permission?.id?.toString()}
                      onClick={() => {
                        if (isSelected) {
                          roleStore.removePermission(permission?.id, type);
                        } else {
                          roleStore.addPermission(permission, type);
                        }
                      }}
                      className="border"
                    >
                      {permission?.label}
                    </Toggle>
                  );
                })}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    )
  );
};
