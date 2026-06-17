import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, Table, Th, Td } from "@/components/ui";
import { estadoBadgeClass } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PanteonesPage() {
  const panteones: any[] = await prisma.panteon.findMany({
    orderBy: { numero: "asc" },
    include: { titular: true, fallecidos: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/espacios" className="text-gray-500 hover:text-[#1e3a5f]">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-[#1e3a5f]">Panteones</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <thead>
              <tr>
                <Th>N°</Th>
                <Th>Familia</Th>
                <Th>Titular</Th>
                <Th>Ocupación</Th>
                <Th>Estado</Th>
                <Th>Inhumados</Th>
              </tr>
            </thead>
            <tbody>
              {panteones.length === 0 && (
                <tr>
                  <Td className="text-gray-400">No hay panteones registrados.</Td>
                  <Td /> <Td /> <Td /> <Td /> <Td />
                </tr>
              )}
              {panteones.map((p) => (
                <tr key={p.id}>
                  <Td>{p.numero}</Td>
                  <Td>{p.familia}</Td>
                  <Td>{p.titular?.nombre ?? "-"}</Td>
                  <Td>
                    {p.ocupacionActual}/{p.capacidadMaxima}
                  </Td>
                  <Td>
                    <Badge className={estadoBadgeClass(p.estado)}>{p.estado}</Badge>
                  </Td>
                  <Td>{p.fallecidos.length}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
