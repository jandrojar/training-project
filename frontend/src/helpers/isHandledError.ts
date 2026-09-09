// Function to check if an error has been marked as handled
export function isHandledError(error: unknown): boolean {
  return Boolean(
    error &&
    typeof error === "object" &&
    "handled" in error &&
    (error as { handled?: boolean }).handled,
  );
}
