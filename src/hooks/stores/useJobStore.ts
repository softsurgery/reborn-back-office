import { create } from "zustand";
import { CreateJobDto, ResponseJobDto, UpdateJobDto } from "@/types";
import { setDeepValue } from "@/lib/object.util";
import { ImageFile } from "@/components/shared/form-builder/types";

interface JobStoreData {
  response?: ResponseJobDto;
  createDto: CreateJobDto;
  updateDto: UpdateJobDto;
  images: ImageFile[];
  hasInitializedImages: boolean;
  createDtoErrors: Record<string, string[]>;
  updateDtoErrors: Record<string, string[]>;
}

export interface JobStore extends JobStoreData {
  set: <K extends keyof JobStoreData>(name: K, value: JobStoreData[K]) => void;
  setNested: <T>(path: string, value: T) => void;
  reset: () => void;

  setImageProgress: (file: File, progress: number) => void;
  appendUploadId: (
    dto: "create" | "update",
    upload: { id?: number; uploadId: number }
  ) => void;
  updateImages: (dto: "create" | "update", newImages: ImageFile[]) => void;
}

const initialState: JobStoreData = {
  response: undefined,
  createDto: {
    title: "",
    description: "",
    price: 0.0,
    currencyId: undefined,
    jobTagIds: [],
    uploads: [],
  },
  updateDto: {
    title: "",
    description: "",
    price: 0.0,
    currencyId: undefined,
    jobTagIds: [],
    uploads: [],
  },
  images: [],
  hasInitializedImages: false,
  createDtoErrors: {},
  updateDtoErrors: {},
};

export const useJobStore = create<JobStore>((set, get) => ({
  ...initialState,

  set: (name, value) => {
    set((state) => ({
      ...state,
      [name]: value,
    }));
  },

  setNested: (path: string, value: unknown) => {
    if (!path.includes(".")) {
      set((state) => ({
        ...state,
        [path]: value,
      }));
      return;
    }

    // Nested path case
    const [rootKey, ...restPath] = path.split(".");
    const nestedPath = restPath.join(".");

    set((state) => {
      const rootValue = state[rootKey as keyof JobStoreData];
      if (typeof rootValue !== "object" || rootValue === null) {
        throw new Error(`Cannot set nested path on non-object: ${rootKey}`);
      }

      const updatedRoot = setDeepValue(
        { ...(rootValue as object) },
        nestedPath,
        value
      );

      return {
        ...state,
        [rootKey]: updatedRoot,
      };
    });
  },

  setImageProgress: (file, progress) => {
    set((state) => ({
      ...state,
      images: state.images.map((image) =>
        image.image === file ? { ...image, progress } : image
      ),
    }));
  },

  appendUploadId: (dto, upload) => {
    set((state) => ({
      ...state,
      [`${dto}Dto`]: {
        ...state[`${dto}Dto`],
        uploads: [...(state[`${dto}Dto`].uploads ?? []), upload],
      },
    }));
  },

  updateImages: (dto: "create" | "update", newImages: ImageFile[]) => {
    set((state) => {
      const oldImages = state.images;
      const oldUploads = state[`${dto}Dto`].uploads ?? [];

      const uploadMap = new Map<string, { id?: number; uploadId: number }>();
      oldImages.forEach((img, idx) => {
        const upload = oldUploads[idx];
        if (upload?.uploadId) uploadMap.set(img.id, upload);
      });

      const newUploads = newImages
        .map((img) => {
          const existingUpload = uploadMap.get(img.id);
          if (existingUpload) {
            return existingUpload;
          }
          return undefined;
        })
        .filter(Boolean) as { id?: number; uploadId: number }[];

      return {
        ...state,
        images: newImages,
        [`${dto}Dto`]: {
          ...state[`${dto}Dto`],
          uploads: newUploads,
        },
      };
    });
  },

  reset: () => {
    set({ ...initialState });
  },
}));
