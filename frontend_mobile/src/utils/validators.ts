export function isValidEmail(value: string) {
  return /.+@.+\..+/.test(value);
}
