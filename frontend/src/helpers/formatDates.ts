export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-UK", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleString("en-UK", { dateStyle: "short" });
}
