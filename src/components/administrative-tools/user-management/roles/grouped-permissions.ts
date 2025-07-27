import { ResponsePermissionDto } from "@/types";

export const groupedPermissions = (permissions: ResponsePermissionDto[]) =>
  permissions?.reduce((groups, permission) => {
    const [_, ...rest] = permission?.label?.split("_") || [];
    const entity = rest.join("_");
    if (!groups[entity]) {
      groups[entity] = [];
    }
    groups[entity].push(permission);
    return groups;
  }, {} as Record<string, ResponsePermissionDto[]>);

export const sortedGroupedPermissions = (
  permissions: ResponsePermissionDto[]
) =>
  Object.entries(groupedPermissions(permissions) || {})
    .sort(([entityA], [entityB]) => entityA.localeCompare(entityB))
    .reduce((sortedGroups, [entity, permissions]) => {
      sortedGroups[entity] = permissions;
      return sortedGroups;
    }, {} as Record<string, ResponsePermissionDto[]>);
