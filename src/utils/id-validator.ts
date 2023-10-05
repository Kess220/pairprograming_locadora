export function isValid(id: number) {
  return !isNaN(id) && id > 0;
}