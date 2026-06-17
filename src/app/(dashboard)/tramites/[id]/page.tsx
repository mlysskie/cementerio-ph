import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge, Table, Th, Td } from "@/components/ui";
import { formatDate, tramiteEstadoClass } from "@/lib/utils";
import EstadoControl from "./EstadoControl";

export const dynamic = "force-dynamic";

function tipoLabel(tipo: string): string {
  const t = tipo.replace(/_/g, " ");
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="text-gray-800">{value ?? "-"}</dd>
    </div>
  );
}

export default async function TramiteDetallePage({
  params,
}: {
  params: { id: string };
}) {
  const tramite = await prisma.tramite.findUnique({
    where: { id: params.id },
    include: {
      fallecido: true,
      exhumacion: true,
      traslado: true,
      cremacion: true,
      cambioTitularidad: true,
      documentos: true,
    },
  });

  if (!tramite) {
    return (
      <div className="space-y-6">
        <Link href="/tramites">
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

  const t = tramite as any;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e3a5f]">
            Expediente {t.expediente}
          </h1>
          <p className="text-sm text-gray-500">{tipoLabel(t.tipo)}</p>
        </div>
        <Link href="/tramites">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos generales</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Expediente" value={t.expediente} />
            <Field label="Tipo" value={tipoLabel(t.tipo)} />
            <div>
              <dt className="text-sm font-medium text-gray-500">Estado</dt>
              <dd>
                <Badge className={tramiteEstadoClass(t.estado)}>
                  {t.estado.replace(/_/g, " ")}
                </Badge>
              </dd>
            </div>
            <Field label="Solicitante" value={t.solicitante} />
            <Field
              label="Fallecido"
              value={
                t.fallecido
                  ? `${t.fallecido.apellido}, ${t.fallecido.nombre}`
                  : "-"
              }
            />
            <Field label="Fecha de inicio" value={formatDate(t.fechaInicio)} />
            <Field label="Fecha de fin" value={formatDate(t.fechaFin)} />
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Descripción</dt>
              <dd className="text-gray-800">{t.descripcion || "-"}</dd>
            </div>
          </dl>

          <div className="mt-6 border-t border-gray-100 pt-6">
            <EstadoControl id={t.id} estado={t.estado} />
          </div>
        </CardContent>
      </Card>

      {t.exhumacion && (
        <Card>
          <CardHeader>
            <CardTitle>Datos de exhumación</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Fecha de exhumación"
                value={formatDate(t.exhumacion.fechaExhumacion)}
              />
              <Field label="Motivo" value={t.exhumacion.motivo || "-"} />
              <Field
                label="Destino de los restos"
                value={t.exhumacion.destinoRestos || "-"}
              />
              <Field
                label="Personal responsable"
                value={t.exhumacion.personalResponsable || "-"}
              />
            </dl>
          </CardContent>
        </Card>
      )}

      {t.traslado && (
        <Card>
          <CardHeader>
            <CardTitle>Datos de traslado</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Origen" value={t.traslado.origen} />
              <Field label="Destino" value={t.traslado.destino} />
              <Field
                label="Fecha de traslado"
                value={formatDate(t.traslado.fechaTraslado)}
              />
              <Field label="Empresa" value={t.traslado.empresa || "-"} />
              <Field label="Vehículo" value={t.traslado.vehiculo || "-"} />
              <Field label="Conductor" value={t.traslado.conductor || "-"} />
            </dl>
          </CardContent>
        </Card>
      )}

      {t.cremacion && (
        <Card>
          <CardHeader>
            <CardTitle>Datos de cremación</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Fecha de cremación"
                value={formatDate(t.cremacion.fechaCremacion)}
              />
              <Field label="Crematorio" value={t.cremacion.crematorio || "-"} />
              <Field
                label="Destino de las cenizas"
                value={t.cremacion.destinoCenizas || "-"}
              />
              <Field label="Responsable" value={t.cremacion.responsable || "-"} />
            </dl>
          </CardContent>
        </Card>
      )}

      {t.cambioTitularidad && (
        <Card>
          <CardHeader>
            <CardTitle>Datos de cambio de titularidad</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Titular anterior"
                value={t.cambioTitularidad.titularAnterior}
              />
              <Field
                label="Titular nuevo"
                value={t.cambioTitularidad.titularNuevo}
              />
              <Field
                label="Motivo"
                value={t.cambioTitularidad.motivo || "-"}
              />
            </dl>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Documentos</CardTitle>
        </CardHeader>
        <CardContent>
          {t.documentos.length === 0 ? (
            <p className="text-sm text-gray-500">Sin documentos asociados.</p>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Nombre</Th>
                  <Th>Tipo</Th>
                  <Th>Descripción</Th>
                  <Th className="text-right">Archivo</Th>
                </tr>
              </thead>
              <tbody>
                {t.documentos.map((d: any) => (
                  <tr key={d.id}>
                    <Td className="font-medium">{d.nombre}</Td>
                    <Td>{d.tipo}</Td>
                    <Td>{d.descripcion || "-"}</Td>
                    <Td className="text-right">
                      <a
                        href={d.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-[#2563eb] hover:underline"
                      >
                        Abrir
                      </a>
                    </Td>
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
