import Link from "next/link";
import { Plus, Eye } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, Table, Th, Td } from "@/components/ui";
import { formatDate, estadoBadgeClass } from "@/lib/utils";

export const dynamic = "force-dynamic";

const TIPO_LABELS: Record<string, string> = {
  tierra: "Tierra",
  nicho: "Nicho",
  panteon: "Panteón",
  osario: "Osario",
  deposito: "Depósito",
  cremado: "Cremado",
};

const ESTADO_LABELS: Record<string, string> = {
  sepultado: "Sepultado",
  exhumado: "Exhumado",
  trasladado: "Trasladado",
  cremado: "Cremado",
  en_deposito: "En depósito",
  entregado: "Entregado",
};

export default async function FallecidosPage() {
  const fallecidos = await prisma.personaFallecida.findMany({
    orderBy: { creadoEn: "desc" },
    include: { fosa: true, nicho: true, panteon: true, deposito: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e3a5f]">Personas Fallecidas</h1>
          <p className="text-sm text-gray-500">
            {fallecidos.length} {fallecidos.length === 1 ? "registro" : "registros"}
          </p>
        </div>
        <Link href="/fallecidos/nuevo">
          <Button>
            <Plus className="h-4 w-4" />
            Nueva Persona
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <thead>
              <tr>
                <Th>Apellido y Nombre</Th>
                <Th>DNI</Th>
                <Th>Fallecimiento</Th>
                <Th>Tipo Sepultura</Th>
                <Th>Estado</Th>
                <Th className="text-right">Acciones</Th>
              </tr>
            </thead>
            <tbody>
              {fallecidos.length === 0 ? (
                <tr>
                  <Td className="text-center text-gray-400">
                    No hay personas registradas.
                  </Td>
                  <Td /> <Td /> <Td /> <Td /> <Td />
                </tr>
              ) : (
                fallecidos.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-gray-50">
                    <Td>
                      <Link
                        href={`/fallecidos/${p.id}`}
                        className="font-medium text-[#1e3a5f] hover:underline"
                      >
                        {p.apellido}, {p.nombre}
                      </Link>
                    </Td>
                    <Td>{p.dni || "-"}</Td>
                    <Td>{formatDate(p.fechaFallecimiento)}</Td>
                    <Td>{TIPO_LABELS[p.tipoSepultura] ?? p.tipoSepultura}</Td>
                    <Td>
                      <Badge className={estadoBadgeClass(p.estadoActual)}>
                        {ESTADO_LABELS[p.estadoActual] ?? p.estadoActual}
                      </Badge>
                    </Td>
                    <Td className="text-right">
                      <Link
                        href={`/fallecidos/${p.id}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-[#2563eb] hover:underline"
                      >
                        <Eye className="h-4 w-4" />
                        Ver
                      </Link>
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
