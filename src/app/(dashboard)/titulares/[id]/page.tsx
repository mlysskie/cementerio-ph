import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge, Table, Th, Td } from "@/components/ui";
import { ESTADO_COLORS } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

function estadoBadge(estado: string) {
  const color = ESTADO_COLORS[estado] || "#6b7280";
  return (
    <Badge className="border-transparent text-white" >
      <span style={{ backgroundColor: color }} className="rounded-full px-2 py-0.5">
        {estado}
      </span>
    </Badge>
  );
}

export default async function TitularDetallePage({
  params,
}: {
  params: { id: string };
}) {
  const titular = await prisma.titular.findUnique({
    where: { id: params.id },
    include: {
      herederos: true,
      fosas: { include: { fila: { include: { manzana: { include: { sector: true } } } } } },
      nichos: true,
      panteones: true,
      historial: true,
    },
  });

  if (!titular) {
    return (
      <div className="space-y-6">
        <Link href="/titulares">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
        </Link>
        <Card>
          <CardContent className="pt-6 text-center text-gray-500">
            No encontrado
          </CardContent>
        </Card>
      </div>
    );
  }

  type Espacio = { tipo: string; numero: string; estado: string };
  const espacios: Espacio[] = [
    ...titular.fosas.map((f) => ({ tipo: "Fosa", numero: f.numero, estado: f.estado })),
    ...titular.nichos.map((n) => ({ tipo: "Nicho", numero: n.numero, estado: n.estado })),
    ...titular.panteones.map((p) => ({ tipo: "Panteón", numero: p.numero, estado: p.estado })),
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1e3a5f]">{titular.nombre}</h1>
        <Link href="/titulares">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos personales</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">DNI</dt>
              <dd className="text-gray-800">{titular.dni}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Estado</dt>
              <dd className="text-gray-800">{titular.activo ? "Activo" : "Inactivo"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Dirección</dt>
              <dd className="text-gray-800">{titular.direccion || "-"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
              <dd className="text-gray-800">{titular.telefono || "-"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="text-gray-800">{titular.email || "-"}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Espacios a su nombre</CardTitle>
        </CardHeader>
        <CardContent>
          {espacios.length === 0 ? (
            <p className="text-sm text-gray-500">Sin espacios asignados.</p>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Tipo</Th>
                  <Th>Número</Th>
                  <Th>Estado</Th>
                </tr>
              </thead>
              <tbody>
                {espacios.map((e, i) => (
                  <tr key={`${e.tipo}-${e.numero}-${i}`}>
                    <Td>{e.tipo}</Td>
                    <Td className="font-medium">{e.numero}</Td>
                    <Td>{estadoBadge(e.estado)}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Herederos</CardTitle>
        </CardHeader>
        <CardContent>
          {titular.herederos.length === 0 ? (
            <p className="text-sm text-gray-500">Sin herederos registrados.</p>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Nombre</Th>
                  <Th>DNI</Th>
                  <Th>Relación</Th>
                  <Th>Teléfono</Th>
                </tr>
              </thead>
              <tbody>
                {titular.herederos.map((h) => (
                  <tr key={h.id}>
                    <Td className="font-medium">{h.nombre}</Td>
                    <Td>{h.dni}</Td>
                    <Td>{h.relacion}</Td>
                    <Td>{h.telefono || "-"}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
