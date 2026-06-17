"use client";

import { Badge, Td, Th, Table } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { estadoBadgeClass, formatDate } from "@/lib/utils";
import { X, MapPin, User, Users } from "lucide-react";

export type SelectedSpace = {
  tipo: "fosa" | "nicho" | "panteon" | "deposito";
  label: string;
  estado: string;
  ubicacion: string;
  titular?: { nombre: string; dni: string } | null;
  fallecidos?: { id: string; apellido: string; nombre: string; fechaFallecimiento: Date | string }[];
  capacidad?: { actual: number; max: number };
};

export default function SpaceDetail({
  space,
  onClose,
}: {
  space: SelectedSpace | null;
  onClose: () => void;
}) {
  if (!space) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-400">
        <MapPin className="mb-2 h-8 w-8" />
        <p className="text-sm">Seleccione un espacio en el plano para ver su detalle.</p>
      </div>
    );
  }

  const tipoLabel = {
    fosa: "Fosa (Tierra)",
    nicho: "Nicho",
    panteon: "Panteón",
    deposito: "Depósito",
  }[space.tipo];

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 bg-[#1e3a5f] px-4 py-3 text-white">
        <div>
          <p className="text-xs uppercase tracking-wide text-white/60">{tipoLabel}</p>
          <p className="text-lg font-bold">{space.label}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10">
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Estado</span>
          <Badge className={estadoBadgeClass(space.estado)}>{space.estado}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Ubicación</span>
          <span className="text-sm font-medium text-gray-700">{space.ubicacion}</span>
        </div>

        {space.capacidad && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Capacidad</span>
            <span className="text-sm font-medium text-gray-700">
              {space.capacidad.actual} / {space.capacidad.max}
            </span>
          </div>
        )}

        <div>
          <p className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-gray-600">
            <User className="h-4 w-4" /> Titular
          </p>
          {space.titular ? (
            <p className="text-sm text-gray-700">
              {space.titular.nombre} <span className="text-gray-400">· DNI {space.titular.dni}</span>
            </p>
          ) : (
            <p className="text-sm text-gray-400">Sin titular asignado</p>
          )}
        </div>

        <div>
          <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-gray-600">
            <Users className="h-4 w-4" /> Personas inhumadas ({space.fallecidos?.length ?? 0})
          </p>
          {space.fallecidos && space.fallecidos.length > 0 ? (
            <Table>
              <thead>
                <tr>
                  <Th>Apellido y Nombre</Th>
                  <Th>Fallecimiento</Th>
                </tr>
              </thead>
              <tbody>
                {space.fallecidos.map((f) => (
                  <tr key={f.id}>
                    <Td>{f.apellido}, {f.nombre}</Td>
                    <Td>{formatDate(f.fechaFallecimiento)}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-sm text-gray-400">Sin inhumaciones registradas.</p>
          )}
        </div>
      </div>
    </div>
  );
}
