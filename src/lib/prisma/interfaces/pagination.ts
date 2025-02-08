export interface PageMeta {
    page: number;
    take: number;
    itemCount: number;
    pageCount: number;
    hasPreviousPage?: boolean;
    hasNextPage?: boolean;
}

export interface Paginated<T> {
    data: T[];
    meta: PageMeta;
}