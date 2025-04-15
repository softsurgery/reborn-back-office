export function splitCamelOrPascal(input: string): string {
  return input.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^([A-Z])/, "$1");
}
