"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label, Select } from "@/components/ui";

const ESTADOS = [
  { value: "iniciado", label: "Iniciado" },
  { value: "en_revision", label: "En revisión" },
  { value: "aprobado", label: "Aprobado" },
  { value: "finalizado", label: "Finalizado" },
  { value: "rechazado", label: "Rechazado" },
];

export default function EstadoControl({
  id,
  estado,
}: {
  id: string;
  estado: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(estado);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const nuevo = e.target.value;
    const anterior = value;
    setValue(nuevo);
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/tramites", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, estado: nuevo }),
      });
      if (!res.ok) throw new Error("No se pudo actualizar el estado.");
      router.refresh();
    } catch (err) {
      setValue(anterior);
      setError(err instanceof Error ? err.message : "Error desconocido.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-1.5">
      <Label htmlFor="estado">Cambiar estado</Label>
      <Select
        id="estado"
        value={value}
        onChange={handleChange}
        disabled={loading}
        className="max-w-xs"
      >
        {ESTADOS.map((e) => (
          <option key={e.value} value={e.value}>
            {e.label}
          </option>
        ))}
      </Select>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
