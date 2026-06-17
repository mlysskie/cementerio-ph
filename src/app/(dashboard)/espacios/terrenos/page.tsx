import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge, Table, Th, Td } from "@/components/ui";
import { estadoBadgeClass } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TerrenosPage() {
  const sectores: any[] = await prisma.sector.findMany({
    orderBy: { codigo: "asc" },
    include: {
      manzanas: {
        orderBy: { numero: "asc" },
        include: {
          filas: {
            orderBy: { numero: "asc" },
            include: {
              fosas: {
                orderBy: { numero: "asc" },
                include: { titular: true, fallecidos: true },
              },
            },
          },
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/espacios" className="text-gray-500 hover:text-[#1e3a5f]">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-[#1e3a5f]">Terrenos / Fosas en Tierra</h1>
      </div>

      {sectores.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-sm text-gray-500">
            No hay sectores registrados.
          </CardContent>
        </Card>
      )}

      {sectores.map((sector) => {
        const filasTodas = sector.manzanas.flatMap((m: any) =>
          m.filas.map((f: any) => ({ manzana: m, fila: f }))
        );
        const fosas = filasTodas.flatMap(({ manzana, fila }: any) =>
          fila.fosas.map((fosa: any) => ({ manzana, fosa }))
        );

        return (
          <Card key={sector.id}>
            <CardHeader>
              <CardTitle>
                {sector.nombre} <span className="text-gray-400">({sector.codigo})</span>
              </CardTitle>
              <p className="text-sm text-gray-500">
                Manzanas: {sector.manzanas.map((m: any) => m.numero).join(", ") || "-"}
              </p>
            </CardHeader>
            <CardContent>
              <Table>
                <thead>
                  <tr>
                    <Th>Manzana</Th>
                    <Th>Fosa N°</Th>
                    <Th>Estado</Th>
                    <Th>Titular</Th>
                    <Th>Inhumados</Th>
                  </tr>
                </thead>
                <tbody>
                  {fosas.length === 0 && (
                    <tr>
                      <Td className="text-gray-400">Sin fosas registradas.</Td>
                      <Td /> <Td /> <Td /> <Td />
                    </tr>
                  )}
                  {fosas.map(({ manzana, fosa }: any) => (
                    <tr key={fosa.id}>
                      <Td>{manzana.numero}</Td>
                      <Td>{fosa.numero}</Td>
                      <Td>
                        <Badge className={estadoBadgeClass(fosa.estado)}>{fosa.estado}</Badge>
                      </Td>
                      <Td>{fosa.titular?.nombre ?? "-"}</Td>
                      <Td>{fosa.fallecidos.length}</Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
