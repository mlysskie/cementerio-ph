import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge, Table, Th, Td } from "@/components/ui";
import { estadoBadgeClass } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DepositoPage() {
  const depositos: any[] = await prisma.deposito.findMany({
    orderBy: { codigo: "asc" },
    include: { fallecidos: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/espacios" className="text-gray-500 hover:text-[#1e3a5f]">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-[#1e3a5f]">Depósito Municipal</h1>
      </div>

      {depositos.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-sm text-gray-500">
            No hay depósitos registrados.
          </CardContent>
        </Card>
      )}

      {depositos.map((deposito) => (
        <Card key={deposito.id}>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>{deposito.codigo}</CardTitle>
              {deposito.descripcion && (
                <p className="mt-1 text-sm text-gray-500">{deposito.descripcion}</p>
              )}
            </div>
            <Badge className={estadoBadgeClass(deposito.estado)}>{deposito.estado}</Badge>
          </CardHeader>
          <CardContent>
            <Table>
              <thead>
                <tr>
                  <Th>Apellido</Th>
                  <Th>Nombre</Th>
                  <Th>DNI</Th>
                </tr>
              </thead>
              <tbody>
                {deposito.fallecidos.length === 0 && (
                  <tr>
                    <Td className="text-gray-400">Sin fallecidos en este depósito.</Td>
                    <Td /> <Td />
                  </tr>
                )}
                {deposito.fallecidos.map((f: any) => (
                  <tr key={f.id}>
                    <Td>{f.apellido}</Td>
                    <Td>{f.nombre}</Td>
                    <Td>{f.dni ?? "-"}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
