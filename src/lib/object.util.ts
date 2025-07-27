export const createSearchFilterExpression = (
  structure: Object,
  operator: string,
  value: string,
  seperator: string
): string => {
  return `(${Object.values(structure)
    .map((svalue) => `${svalue}${operator}${value}`)
    .join(seperator)}})`;
};

export const parseBooleanField = (
  field: string | string[] | boolean | undefined
): boolean => {
  if (typeof field === "string") {
    return field === "true";
  }
  if (Array.isArray(field)) {
    return field[0] === "true";
  }
  return false;
};

export const parseIntField = (field: string | string[] | number | undefined): number => {
  if (typeof field === "string") {
    return parseInt(field, 10);
  }
  if (Array.isArray(field)) {
    return parseInt(field[0], 10);
  }
  return 0;
};

export const parseStringField = (
  field: string | string[] | number | undefined
): string => {
  if (typeof field === "string") {
    return field;
  }
  if (Array.isArray(field)) {
    return field[0];
  }
  return "";
};


export const setDeepValue = <T>(obj: any, path: string, value: T): any => {
  const keys = path.split(".");
  const lastKey = keys.pop();
  const nested = keys.reduce((acc, key) => {
    if (typeof acc[key] !== "object" || acc[key] === null) {
      acc[key] = {};
    }
    return acc[key];
  }, obj);
  if (lastKey) nested[lastKey] = value;
  return obj;
};