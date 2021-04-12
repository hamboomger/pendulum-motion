export const THETA_UTF8_SYMBOL = "\u03b8"
export const DOT_THETA_UTF8_SYMBOL = "\u03b8\u0307"
export const DEGREE_UTF8_SYMBOL = "\u00b0"

export function precision(val: number) {
  if (!isFinite(val)) return 0;
  let e = 1, p = 0;
  while (Math.round(val * e) / e !== val) { e *= 10; p++; }
  return p;
}
