/**
 * Prepare a create/update payload for the API: drop a `deadline` that was not
 * provided, and send any `Date` as an ISO string. Shared by the project and
 * task services.
 */
export function normalizePayload<T extends { deadline?: string | Date | null }>(
  payload: T,
): Omit<T, "deadline"> & { deadline?: string | null } {
  const { deadline, ...rest } = payload;

  if (deadline === undefined) {
    return rest as Omit<T, "deadline">;
  }

  return {
    ...rest,
    deadline: deadline instanceof Date ? deadline.toISOString() : deadline,
  };
}
