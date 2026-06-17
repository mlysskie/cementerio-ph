import Link from "next/link";
import { Plus, Eye } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, Table, Th, Td } from "@/components/ui";
import { formatDate, tramiteEstadoClass } from "@/lib/utils";

export const dynamic = "force-dynamic";

function tipoLabel(tipo: string): string {
  const t = tipo.replace(/_/g, " ");
  return t.charAt(0).toUpperCase() + t.slice(1);
}

export default async function TramitesPage() {
  const tramites = await prisma.tramite.findMany({
    orderBy: { creadoEn: "desc" },
    include: { fallecido: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e3a5f]">Trámites</h1>
          <p className="text-sm text-gray-500">
            {tramites.length} {tramites.length === 1 ? "trámite" : "trámites"}
          </p>
        </div>
        <Link href="/tramites/nuevo">
          <Button>
            <Plus className="h-4 w-4" />
            Nuevo Trámite
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <thead>
              <tr>
                <Th>Expediente</Th>
                <Th>Tipo</Th>
                <Th>Solicitante</Th>
                <Th>Fallecido</Th>
                <Th>Estado</Th>
                <Th>Inicio</Th>
                <Th className="text-right">Acciones</Th>
              </tr>
            </thead>
            <tbody>
              {tramites.length === 0 ? (
                <tr>
                  <Td className="text-center text-gray-400">
                    No hay trámites registrados.
                  </Td>
                  <Td /> <Td /> <Td /> <Td /> <Td /> <Td />
                </tr>
              ) : (
                tramites.map((t) => (
                  <tr key={t.id} className="transition-colors hover:bg-gray-50">
                    <Td>
                      <Link
                        href={`/tramites/${t.id}`}
                        className="font-medium text-[#1e3a5f] hover:underline"
                      >
                        {t.expediente}
                      </Link>
                    </Td>
                    <Td>{tipoLabel(t.tipo)}</Td>
                    <Td>{t.solicitante}</Td>
                    <Td>
                      {t.fallecido
                        ? `${t.fallecido.apellido}, ${t.fallecido.nombre}`
                        : "-"}
                    </Td>
                    <Td>
                      <Badge className={tramiteEstadoClass(t.estado)}>
                        {t.estado.replace(/_/g, " ")}
                      </Badge>
                    </Td>
                    <Td>{formatDate(t.fechaInicio)}</Td>
                    <Td className="text-right">
                      <Link
                        href={`/tramites/${t.id}`}
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
