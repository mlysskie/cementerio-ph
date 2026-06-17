"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label, Select, Textarea } from "@/components/ui";
import { ArrowLeft } from "lucide-react";

const TIPOS = [
  { value: "exhumacion", label: "Exhumación" },
  { value: "traslado", label: "Traslado" },
  { value: "cremacion", label: "Cremación" },
  { value: "cambio_titularidad", label: "Cambio de titularidad" },
  { value: "tierra_a_nicho", label: "Tierra a nicho" },
  { value: "renovacion", label: "Renovación" },
  { value: "cesion", label: "Cesión" },
  { value: "otro", label: "Otro" },
];

const ESTADOS = [
  { value: "iniciado", label: "Iniciado" },
  { value: "en_revision", label: "En revisión" },
  { value: "aprobado", label: "Aprobado" },
  { value: "finalizado", label: "Finalizado" },
  { value: "rechazado", label: "Rechazado" },
];

type Fallecido = { id: string; apellido: string; nombre: string };

export default function NuevoTramitePage() {
  const router = useRouter();
  const [fallecidos, setFallecidos] = useState<Fallecido[]>([]);
  const [form, setForm] = useState({
    tipo: "exhumacion",
    solicitante: "",
    fallecidoId: "",
    estado: "iniciado",
    descripcion: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/fallecidos");
        if (!res.ok) return;
        const data = await res.json();
        const list: Fallecido[] = Array.isArray(data) ? data : data?.fallecidos ?? [];
        setFallecidos(list);
      } catch {
        /* ignore */
      }
    }
    load();
  }, []);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const body: any = {
        tipo: form.tipo,
        solicitante: form.solicitante,
        estado: form.estado,
        descripcion: form.descripcion,
      };
      if (form.fallecidoId) body.fallecidoId = form.fallecidoId;

      const res = await fetch("/api/tramites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        let msg = "No se pudo crear el trámite.";
        try {
          const data = await res.json();
          if (data?.error) msg = data.error;
          else if (data?.message) msg = data.message;
        } catch {
          /* ignore */
        }
        throw new Error(msg);
      }
      router.push("/tramites");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1e3a5f]">Nuevo Trámite</h1>
        <Link href="/tramites">
          <Button variant="outline" type="button">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos del trámite</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="tipo">Tipo *</Label>
                <Select
                  id="tipo"
                  name="tipo"
                  value={form.tipo}
                  onChange={handleChange}
                  required
                >
                  {TIPOS.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="solicitante">Solicitante *</Label>
                <Input
                  id="solicitante"
                  name="solicitante"
                  value={form.solicitante}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="fallecidoId">Fallecido</Label>
                <Select
                  id="fallecidoId"
                  name="fallecidoId"
                  value={form.fallecidoId}
                  onChange={handleChange}
                >
                  <option value="">- Sin asignar -</option>
                  {fallecidos.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.apellido}, {f.nombre}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="estado">Estado</Label>
                <Select
                  id="estado"
                  name="estado"
                  value={form.estado}
                  onChange={handleChange}
                >
                  {ESTADOS.map((e) => (
                    <option key={e.value} value={e.value}>
                      {e.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={loading}>
                {loading ? "Guardando..." : "Guardar"}
              </Button>
              <Link href="/tramites">
                <Button variant="outline" type="button">
                  Cancelar
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
