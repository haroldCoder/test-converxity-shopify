export function sanitizeInput(
  value: string
) {
  return value
    .trim()
    .replace(/[<>]/g, "");
}