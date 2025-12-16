import type { ProjectPriority, ProjectStatus } from "../types/types"

export function statusClasses(status: ProjectStatus) {
  return {
    "bg-blue-50 text-blue-700 border-blue-100": status === "PLANNED",
    "bg-amber-50 text-amber-700 border-amber-100": status === "IN_PROGRESS",
    "bg-green-50 text-green-700 border-green-100": status === "COMPLETED",
    "bg-gray-100 text-gray-700 border-gray-200": status === "ON_HOLD",
  }
}

export function priorityClasses(priority: ProjectPriority) {
  return {
    "bg-green-50 text-green-700 border-green-100": priority === "LOW",
    "bg-amber-50 text-amber-700 border-amber-100": priority === "MEDIUM",
    "bg-red-50 text-red-700 border-red-100": priority === "HIGH",
  }
}
