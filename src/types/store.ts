export interface Store {
  id: string;
  description: string;
  value: any;
}

export interface UpdateStoreDto extends Store {}
