import { Permission, Role, RolePermission } from "@/types";
import { create } from "zustand";

interface RoleStoreData extends Partial<Role> {}

interface RoleStore extends RoleStoreData {
  set: (name: keyof RoleStoreData, value: any) => void;
  reset: () => void;
  getRole: () => Partial<Role>;
  setRole: (data: Partial<Role>) => void;
  addPermission: (permission: Permission) => void;
  removePermission: (permissionId?: string) => void;
  isPermissionSelected: (permissionId?: string) => boolean;
}

const initialState: RoleStoreData = {
  id: undefined,
  label: "",
  description: "",
  permissions: [],
};

export const useRoleStore = create<RoleStore>((set, get) => ({
  ...initialState,

  set: (name: keyof RoleStore, value: any) => {
    set((state) => ({
      ...state,
      [name]: value,
    }));
  },

  reset: () => {
    set({ ...initialState });
  },

  getRole: () => {
    const data = get();
    return {
      id: data.id,
      label: data.label,
      description: data.description,
    };
  },

  setRole: (data: Partial<Role>) => {
    set((state) => ({
      ...state,
      id: data.id,
      label: data.label,
      description: data.description,
      permissions: data.permissions,
    }));
  },

  addPermission: (permission: Permission) => {
    const { id, permissions } = get();
    if (!permissions?.some((p) => p.permissionId === permission.id)) {
      set((state) => ({
        ...state,
        permissions: [
          ...(permissions || []),
          { permissionId: permission.id, roleId: id } as RolePermission,
        ],
      }));
    }
  },

  removePermission: (permissionId?: string) => {
    set((state) => ({
      ...state,
      permissions: state.permissions?.filter((p) => p.permissionId !== permissionId),
    }));
  },

  isPermissionSelected: (permissionId?: string) => {
    const { permissions } = get();
    return permissions?.some((p) => p.permissionId === permissionId) || false;
  },
}));
