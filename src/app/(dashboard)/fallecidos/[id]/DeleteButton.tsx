"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (!confirm("¿Está seguro que desea eliminar este registro? Esta acción no se puede deshacer.")) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/fallecidos/${id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("No se pudo eliminar el registro.");
      }
      router.push("/fallecidos");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button variant="destructive" onClick={handleDelete} disabled={loading}>
        <Trash2 className="h-4 w-4" />
        {loading ? "Eliminando..." : "Eliminar"}
      </Button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
