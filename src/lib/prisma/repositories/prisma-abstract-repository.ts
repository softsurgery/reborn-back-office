import { PrismaClient } from "@prisma/client";

import { IOptionsObject, IQueryObject } from "../interfaces/query-params";
import {
  parseFilters,
  parseJoin,
  parseSelect,
  parseSort,
} from "../utilities/query-params-parser";
import { Paginated } from "../interfaces/pagination";

export class BaseRepository<T> {
  protected prisma: PrismaClient;
  protected model: any;

  constructor(model: any, prisma: PrismaClient) {
    this.model = model;
    this.prisma = prisma;
  }

  async findPaginated(
    queryObject: IQueryObject,
    options: IOptionsObject = {},
    supportSoftDelete: boolean = false
  ): Promise<Paginated<T>> {
    const {
      filter,
      sort,
      size = options.DEFAULT_LIMIT || "10",
      page = "1",
      fields,
      join,
      search,
    } = queryObject;
    let where = parseFilters(filter, options, search, await this.getFields());
    if (!supportSoftDelete) {
      where = { ...where, deletedAt: null };
    }
    const orderBy = parseSort(sort);
    const take = parseInt(size, 10);
    const skip = (parseInt(page, 10) - 1) * take;
    const select = parseSelect(fields);
    const include = parseJoin(join);

    const [data, itemCount] = await Promise.all([
      this.model.findMany({
        where,
        orderBy,
        skip,
        take,
        select,
        include,
      }),
      this.model.count({ where }),
    ]);

    const parsedPage = parseInt(page) || 0;
    return {
      data,
      meta: {
        itemCount,
        page: parsedPage,
        take,
        hasPreviousPage: parsedPage > 1,
        hasNextPage: itemCount > take * parsedPage,
        pageCount: Math.ceil(itemCount / take),
      },
    };
  }

  async findAll(supportSoftDelete: boolean = false): Promise<T[]> {
    if (!supportSoftDelete) {
      return this.model.findMany({ where: { deletedAt: null } });
    }
    return this.model.findMany();
  }

  async findByCondition(
    queryObject: IQueryObject,
    options: IOptionsObject = {},
    supportSoftDelete: boolean = false
  ): Promise<T[]> {
    const { filter, sort, fields, join, search } = queryObject;

    let where = parseFilters(filter, options, search, await this.getFields());
    if (!supportSoftDelete) {
      where = { ...where, deletedAt: null };
    }
    const orderBy = parseSort(sort);
    const select = parseSelect(fields);
    const include = parseJoin(join);

    return this.model.findMany({
      where,
      orderBy,
      select,
      include,
    });
  }

  async findOneByCondition(
    queryObject: IQueryObject,
    options: IOptionsObject = {},
    supportSoftDelete: boolean = false
  ): Promise<T | null> {
    const models = await this.findByCondition(
      queryObject,
      options,
      supportSoftDelete
    );
    return models.length > 0 ? models[0] : null;
  }

  async findById(
    id: number | string,
    supportSoftDelete: boolean = false
  ): Promise<T | null> {
    if (!supportSoftDelete) {
      return this.model.findUnique({ where: { id, deletedAt: null } });
    }
    return this.model.findUnique({ where: { id } });
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create({ data });
  }

  async createMany(data: Partial<T>[]): Promise<T[]> {
    return this.model.createMany({ data });
  }

  async update(id: number | string, data: Partial<T>): Promise<T> {
    return this.model.update({
      where: { id },
      data,
    });
  }

  async updateAssociations<U extends { id?: number | string }>({
    existingItems,
    updatedItems,
    keys,
    onDelete,
    onCreate,
  }: {
    existingItems: U[];
    updatedItems: U[];
    keys: [keyof U, keyof U];
    onCreate: (item: U) => Promise<any>;
    onDelete: (id: number | string) => Promise<any>;
  }): Promise<{
    keptItems: U[];
    newItems: U[];
    eliminatedItems: U[];
  }> {
    const newItems: U[] = [];
    const keptItems: U[] = [];
    const eliminatedItems: U[] = [];

    const [key1, key2] = keys;

    const isSameCombination = (a: U, b: U) =>
      a[key1] === b[key1] && a[key2] === b[key2];

    for (const existingItem of existingItems) {
      const existsInUpdate = updatedItems.some((updatedItem) =>
        isSameCombination(updatedItem, existingItem)
      );
      if (!existsInUpdate) {
        eliminatedItems.push(await onDelete(existingItem.id!));
      } else {
        keptItems.push(existingItem);
      }
    }

    for (const updatedItem of updatedItems) {
      const existsInExisting = existingItems.some((existingItem) =>
        isSameCombination(updatedItem, existingItem)
      );
      if (!existsInExisting) {
        newItems.push(await onCreate(updatedItem));
      }
    }
    return {
      keptItems,
      newItems,
      eliminatedItems,
    };
  }

  async softDelete(id: number | string): Promise<T> {
    return this.model.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async softDeleteMany(ids: number[] | string[]): Promise<T[]> {
    return this.model.updateMany({
      where: { id: { in: ids } },
      data: { deletedAt: new Date() },
    });
  }

  async restore(id: number | string): Promise<T> {
    return this.model.update({
      where: { id },
      data: { deletedAt: null },
    });
  }

  async restoreMany(ids: number[] | string[]): Promise<T[]> {
    return this.model.updateMany({
      where: { id: { in: ids } },
      data: { deletedAt: null },
    });
  }

  async delete(id: number | string): Promise<T> {
    return this.model.delete({
      where: { id },
    });
  }

  async deleteMany(ids: number[] | string[]): Promise<T[]> {
    return this.model.deleteMany({ where: { id: { in: ids } } });
  }

  async count(where: any = {}): Promise<number> {
    return this.model.count({ where });
  }

  async getFields(): Promise<string[]> {
    const record = await this.model.findFirst();
    if (!record) {
      return [];
    }

    return Object.keys(record).filter((key) => typeof record[key] === "string");
  }
}
