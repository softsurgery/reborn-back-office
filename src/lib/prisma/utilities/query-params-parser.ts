import { ILooseObject, IOptionsObject } from "../interfaces/query-params";

function parseCondition(
  condition: string,
  options: IOptionsObject
): ILooseObject {
  const [field, operator, value] = condition.split(
    options.LOOKUP_DELIMITER || "||"
  );
  const parsedValue = parseValue(value, operator);

  let conditionObj: ILooseObject = {};

  switch (operator) {
    case options.EXACT || "$eq":
      conditionObj[field] = parsedValue;
      break;
    case options.NOT || "!":
      conditionObj[field] = { not: parsedValue };
      break;
    case options.CONTAINS || "$cont":
      conditionObj[field] = { contains: parsedValue };
      break;
    case options.IS_NULL || "$isnull":
      conditionObj[field] = { is: null };
      break;
    case options.GT || "$gt":
      conditionObj[field] = { gt: parsedValue };
      break;
    case options.GTE || "$gte":
      conditionObj[field] = { gte: parsedValue };
      break;
    case options.LT || "$lt":
      conditionObj[field] = { lt: parsedValue };
      break;
    case options.LTE || "$lte":
      conditionObj[field] = { lte: parsedValue };
      break;
    case options.STARTS_WITH || "$starts":
      conditionObj[field] = { startsWith: parsedValue };
      break;
    case options.ENDS_WITH || "$ends":
      conditionObj[field] = { endsWith: parsedValue };
      break;
    case options.IN || "$in":
      conditionObj[field] = { in: parsedValue };
      break;
    case options.BETWEEN || "$between":
      const [start, end] = parsedValue.split(",");
      conditionObj[field] = { gte: start, lte: end };
      break;
    default:
      conditionObj[field] = parsedValue;
  }

  return conditionObj;
}

export function parseFilters(
  filter?: string,
  options: IOptionsObject = {},
  search?: string,
  searchableFields?: string[]
): object {
  const where: ILooseObject = {};

  if (filter) {
    let andConditions: ILooseObject[] = [];
    let orConditions: ILooseObject[] = [];

    const tokens = filter.split(";");

    let insideParentheses = false;
    let tempGroup: string[] = [];

    tokens.forEach((token) => {
      if (token.startsWith("(")) {
        insideParentheses = true;
        tempGroup.push(token.slice(1));
      } else if (token.endsWith(")")) {
        tempGroup.push(token.slice(0, -1));
        orConditions.push(
          ...tempGroup.map((tg) => parseCondition(tg, options))
        );
        insideParentheses = false;
        tempGroup = [];
      } else if (insideParentheses) {
        tempGroup.push(token);
      } else {
        andConditions.push(parseCondition(token, options));
      }
    });

    if (orConditions.length > 0) {
      where.OR = orConditions;
    }

    if (andConditions.length > 0) {
      where.AND = andConditions;
    }
  }

  if (search && searchableFields && searchableFields.length > 0) {
    const searchConditions = searchableFields.map((field) => ({
      [field]: {
        contains: search,
      },
    }));

    if (!where.AND) {
      where.AND = [];
    }

    where.AND.push({ OR: searchConditions });
  }

  return where;
}

export function parseSort(sort?: string): object[] | undefined {
  if (!sort) return undefined;

  const sortFields = sort.split(",");
  const orderBy: object[] = sortFields.map((sortField) => {
    const [field, direction] = sortField.split(":");
    return {
      [field]: direction.toLowerCase() === "desc" ? "desc" : "asc",
    };
  });

  return orderBy;
}

function inferType(value: string): any {
  if (!isNaN(Number(value))) {
    return Number(value);
  } else if (value === "true" || value === "false") {
    return value === "true";
  } else if (Date.parse(value)) {
    return new Date(value);
  }
  return value;
}

function parseValue(value: string, operator: string): any {
  if (operator === "$in" || operator === "$or") {
    return value.split(",").map((v) => inferType(v));
  } else if (operator === "$between") {
    return value;
  }
  return inferType(value);
}

export function parseSelect(select?: string): object | undefined {
  if (!select) return undefined;

  const fields = select.split(",");
  const selectObject: ILooseObject = {};

  fields.forEach((field) => {
    selectObject[field.trim()] = true;
  });

  return selectObject;
}

export function parseJoin(join?: string): ILooseObject | undefined {
  if (!join) return undefined;

  const relations = join.split(",");
  const includeObject: ILooseObject = {};

  relations.forEach((relation) => {
    const parts = relation.split(".");
    let currentLevel: any = includeObject;

    parts.forEach((part, index) => {
      if (!currentLevel[part]) {
        if (index === parts.length - 1) {
          currentLevel[part] = true;
        } else {
          currentLevel[part] = { include: {} };
        }
      }
      currentLevel =
        (currentLevel[part] as ILooseObject).include || currentLevel[part];
    });
  });

  return includeObject;
}
