import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge, Table, Th, Td } from "@/components/ui";
import { estadoBadgeClass } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NichosPage() {
  const pabellones: any[] = await prisma.pabellon.findMany({
    orderBy: { codigo: "asc" },
    include: {
      bloques: {
        orderBy: { nombre: "asc" },
        include: {
          filas: {
            orderBy: { numero: "asc" },
            include: {
              nichos: {
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
        <h1 className="text-2xl font-bold text-[#1e3a5f]">Nichos</h1>
      </div>

      {pabellones.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-sm text-gray-500">
            No hay pabellones registrados.
          </CardContent>
        </Card>
      )}

      {pabellones.map((pabellon) => {
        const nichos = pabellon.bloques.flatMap((b: any) =>
          b.filas.flatMap((f: any) =>
            f.nichos.map((n: any) => ({ bloque: b, nicho: n }))
          )
        );

        return (
          <Card key={pabellon.id}>
            <CardHeader>
              <CardTitle>
                {pabellon.nombre} <span className="text-gray-400">({pabellon.codigo})</span>
              </CardTitle>
              <p className="text-sm text-gray-500">
                Bloques: {pabellon.bloques.map((b: any) => b.nombre).join(", ") || "-"}
              </p>
            </CardHeader>
            <CardContent>
              <Table>
                <thead>
                  <tr>
                    <Th>Nicho N°</Th>
                    <Th>Estado</Th>
                    <Th>Titular</Th>
                    <Th>Inhumados</Th>
                  </tr>
                </thead>
                <tbody>
                  {nichos.length === 0 && (
                    <tr>
                      <Td className="text-gray-400">Sin nichos registrados.</Td>
                      <Td /> <Td /> <Td />
                    </tr>
                  )}
                  {nichos.map(({ nicho }: any) => (
                    <tr key={nicho.id}>
                      <Td>{nicho.numero}</Td>
                      <Td>
                        <Badge className={estadoBadgeClass(nicho.estado)}>{nicho.estado}</Badge>
                      </Td>
                      <Td>{nicho.titular?.nombre ?? "-"}</Td>
                      <Td>{nicho.fallecidos.length}</Td>
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
