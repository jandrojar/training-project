import { BadRequestError } from "../errors/AppError";

/** Parse a user-supplied deadline into a Date, or throw 400. */
export function parseDeadline(value: string | Date): Date {
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    throw new BadRequestError("Invalid deadline date", "invalid-deadline");
  }
  return date;
}

/**
 * Normalize an incoming deadline. `null` and `""` mean "clear it"; anything
 * else is parsed. Only call this when the field was present in the request
 * (i.e. `value !== undefined`).
 */
export function normalizeDeadline(value: string | Date | null): Date | null {
  if (value === null || value === "") return null;
  return parseDeadline(value);
}
