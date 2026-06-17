"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label, Select, Textarea } from "@/components/ui";

const TIPOS_SEPULTURA = [
  { value: "tierra", label: "Tierra" },
  { value: "nicho", label: "Nicho" },
  { value: "panteon", label: "Panteón" },
  { value: "osario", label: "Osario" },
  { value: "deposito", label: "Depósito" },
  { value: "cremado", label: "Cremado" },
];

const ESTADOS = [
  { value: "sepultado", label: "Sepultado" },
  { value: "exhumado", label: "Exhumado" },
  { value: "trasladado", label: "Trasladado" },
  { value: "cremado", label: "Cremado" },
  { value: "en_deposito", label: "En depósito" },
  { value: "entregado", label: "Entregado" },
];

export default function NuevoFallecidoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    apellido: "",
    nombre: "",
    dni: "",
    fechaNacimiento: "",
    fechaFallecimiento: "",
    nroActaDefuncion: "",
    tipoSepultura: "tierra",
    estadoActual: "sepultado",
    observaciones: "",
  });

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/fallecidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apellido: form.apellido,
          nombre: form.nombre,
          dni: form.dni || null,
          fechaNacimiento: form.fechaNacimiento || null,
          fechaFallecimiento: form.fechaFallecimiento,
          nroActaDefuncion: form.nroActaDefuncion || null,
          observaciones: form.observaciones || null,
          tipoSepultura: form.tipoSepultura,
          estadoActual: form.estadoActual,
        }),
      });
      if (!res.ok) {
        throw new Error("No se pudo guardar el registro. Verifique los datos.");
      }
      router.push("/fallecidos");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/fallecidos">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-[#1e3a5f]">Nueva Persona Fallecida</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Datos de la Persona</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="apellido">Apellido *</Label>
                <Input
                  id="apellido"
                  required
                  value={form.apellido}
                  onChange={(e) => update("apellido", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  required
                  value={form.nombre}
                  onChange={(e) => update("nombre", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="dni">DNI</Label>
                <Input
                  id="dni"
                  value={form.dni}
                  onChange={(e) => update("dni", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="nroActaDefuncion">N° Acta de Defunción</Label>
                <Input
                  id="nroActaDefuncion"
                  value={form.nroActaDefuncion}
                  onChange={(e) => update("nroActaDefuncion", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
                <Input
                  id="fechaNacimiento"
                  type="date"
                  value={form.fechaNacimiento}
                  onChange={(e) => update("fechaNacimiento", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="fechaFallecimiento">Fecha de Fallecimiento *</Label>
                <Input
                  id="fechaFallecimiento"
                  type="date"
                  required
                  value={form.fechaFallecimiento}
                  onChange={(e) => update("fechaFallecimiento", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tipoSepultura">Tipo de Sepultura *</Label>
                <Select
                  id="tipoSepultura"
                  value={form.tipoSepultura}
                  onChange={(e) => update("tipoSepultura", e.target.value)}
                >
                  {TIPOS_SEPULTURA.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="estadoActual">Estado Actual *</Label>
                <Select
                  id="estadoActual"
                  value={form.estadoActual}
                  onChange={(e) => update("estadoActual", e.target.value)}
                >
                  {ESTADOS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                  id="observaciones"
                  value={form.observaciones}
                  onChange={(e) => update("observaciones", e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Link href="/fallecidos">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={loading}>
                <Save className="h-4 w-4" />
                {loading ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
