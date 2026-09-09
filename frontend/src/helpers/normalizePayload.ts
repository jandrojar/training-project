/**
 * Prepare a create/update payload for the API:
 * - a `deadline` that was not provided (`undefined`) is dropped ("leave it as is")
 * - an empty `deadline` (`null` or `""`) is sent as `null` ("clear it")
 * - a `Date` is sent as an ISO string
 *
 * Shared by the project and task services.
 */
export function normalizePayload<T extends { deadline?: string | Date | null }>(
  payload: T,
): Omit<T, "deadline"> & { deadline?: string | null } {
  const { deadline, ...rest } = payload;

  if (deadline === undefined) {
    return rest as Omit<T, "deadline">;
  }

  if (deadline === null || deadline === "") {
    return { ...rest, deadline: null };
  }

  return {
    ...rest,
    deadline: deadline instanceof Date ? deadline.toISOString() : deadline,
  };
}
