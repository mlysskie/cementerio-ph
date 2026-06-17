import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, Th, Td } from "@/components/ui";
import { Plus, Eye } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TitularesPage() {
  const titulares = await prisma.titular.findMany({
    orderBy: { creadoEn: "desc" },
    include: {
      _count: {
        select: { fosas: true, nichos: true, panteones: true, herederos: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1e3a5f]">Titulares</h1>
        <Link href="/titulares/nuevo">
          <Button>
            <Plus className="h-4 w-4" />
            Nuevo Titular
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <thead>
              <tr>
                <Th>Nombre</Th>
                <Th>DNI</Th>
                <Th>Teléfono</Th>
                <Th>Email</Th>
                <Th>Espacios</Th>
                <Th>Herederos</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {titulares.length === 0 ? (
                <tr>
                  <Td className="text-center text-gray-500" >
                    <span className="block py-4">No hay titulares registrados.</span>
                  </Td>
                </tr>
              ) : (
                titulares.map((t) => {
                  const espacios =
                    t._count.fosas + t._count.nichos + t._count.panteones;
                  return (
                    <tr key={t.id}>
                      <Td className="font-medium text-[#1e3a5f]">{t.nombre}</Td>
                      <Td>{t.dni}</Td>
                      <Td>{t.telefono || "-"}</Td>
                      <Td>{t.email || "-"}</Td>
                      <Td>{espacios}</Td>
                      <Td>{t._count.herederos}</Td>
                      <Td>
                        <Link
                          href={`/titulares/${t.id}`}
                          className="inline-flex items-center gap-1 text-[#2563eb] hover:underline"
                        >
                          <Eye className="h-4 w-4" />
                          Ver
                        </Link>
                      </Td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
