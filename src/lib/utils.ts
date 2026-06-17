import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatDateLong(date: Date | string | null | undefined): string {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export const ESTADO_COLORS: Record<string, string> = {
  libre: "#22c55e",
  ocupado: "#ef4444",
  reservado: "#eab308",
  vencido: "#f97316",
  abandonado: "#1f2937",
  panteon: "#2563eb",
  deposito: "#6b7280",
  activo: "#2563eb",
  disponible: "#22c55e",
};

export const ESTADO_LABELS: Record<string, string> = {
  libre: "Libre",
  ocupado: "Ocupado",
  reservado: "Reservado",
  vencido: "Vencido",
  abandonado: "Abandonado",
  activo: "Activo",
  disponible: "Disponible",
};

export function estadoBadgeClass(estado: string): string {
  switch (estado) {
    case "libre":
    case "disponible":
      return "bg-green-100 text-green-800 border-green-200";
    case "ocupado":
      return "bg-red-100 text-red-800 border-red-200";
    case "reservado":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "vencido":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "abandonado":
      return "bg-gray-800 text-white border-gray-900";
    case "activo":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

export function tramiteEstadoClass(estado: string): string {
  switch (estado) {
    case "iniciado":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "en_revision":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "aprobado":
      return "bg-teal-100 text-teal-800 border-teal-200";
    case "finalizado":
      return "bg-green-100 text-green-800 border-green-200";
    case "rechazado":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}
