import { Permission } from "@/types";

const entities = [
  "Permission",
  "Role",
  "User",
  "Feedback",
  "Bug",
  "DeviceInfo",
  "Region",
];

const actions = ["create", "read", "update", "delete"];

export const seedPermissionsData: Permission[] = (entities.flatMap((entity) => {
  return actions.map((action) => {
    const id = `${action.toUpperCase()}_${entity.toUpperCase()}`;
    
    const label = id;
    const description = `Can ${action} ${entity.charAt(0).toUpperCase() + entity.slice(1)}`;
    
    return {
      id,
      label,
      description,
    };
  });
}) as Permission[]);
