import { PrivilegedFile } from "@/types";
import { create } from "zustand";

interface ResourceData {
  files: PrivilegedFile[];
}

interface ResourceStore extends ResourceData {
  addFile: (file: PrivilegedFile) => void;
  removeFile: (file: PrivilegedFile) => void;
  setFiles: (files: PrivilegedFile[]) => void;
  set: (attribute: keyof ResourceData, value: unknown) => void;
  reset: () => void;
}

const ResourceDataDefaults: ResourceData = {
  files: [],
};

export const useResourceStore = create<ResourceStore>((set) => ({
  ...ResourceDataDefaults,
  addFile: (file: PrivilegedFile) =>
    set((state) => ({
      files: [...state.files, file],
    })),
  removeFile: (file: PrivilegedFile) =>
    set((state) => ({
      files: state.files.filter(
        (f) =>
          f.file.name !== file.file.name ||
          f.file.size !== file.file.size ||
          f.file.type !== file.file.type
      ),
    })),
  setFiles: (files: PrivilegedFile[]) => {
    set({ files });
  },
  set: (attribute: keyof ResourceData, value: any) =>
    set((state) => ({
      ...state,
      [attribute]: value,
    })),
  reset: () => {
    set(ResourceDataDefaults);
  },
}));
