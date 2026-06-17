import Link from "next/link";
import { ArrowLeft, FileText, MapPin, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui";
import { formatDate, estadoBadgeClass, tramiteEstadoClass } from "@/lib/utils";
import DeleteButton from "./DeleteButton";

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

function deriveUbicacion(p: any): string {
  if (p.fosa) return `Fosa ${p.fosa.codigo ?? p.fosa.numero ?? p.fosa.id}`;
  if (p.nicho) return `Nicho ${p.nicho.codigo ?? p.nicho.numero ?? p.nicho.id}`;
  if (p.panteon) return `Panteón ${p.panteon.nombre ?? p.panteon.codigo ?? p.panteon.id}`;
  if (p.deposito) return `Depósito ${p.deposito.codigo ?? p.deposito.numero ?? p.deposito.id}`;
  return "Sin ubicación asignada";
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-800">{value ?? "-"}</dd>
    </div>
  );
}

export default async function FallecidoDetailPage({ params }: { params: { id: string } }) {
  const p: any = await prisma.personaFallecida.findUnique({
    where: { id: params.id },
    include: {
      fosa: true,
      nicho: true,
      panteon: true,
      deposito: true,
      historialMovimientos: { orderBy: { fecha: "desc" } },
      tramites: true,
    },
  });

  if (!p) {
    return (
      <div className="space-y-6">
        <Link href="/fallecidos">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
        </Link>
        <Card>
          <CardContent className="py-12 text-center text-gray-500">No encontrado</CardContent>
        </Card>
      </div>
    );
  }

  const movimientos = p.historialMovimientos ?? [];
  const tramites = p.tramites ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/fallecidos">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#1e3a5f]">
              {p.apellido}, {p.nombre}
            </h1>
            <div className="mt-1 flex items-center gap-2">
              <Badge className={estadoBadgeClass(p.estadoActual)}>
                {ESTADO_LABELS[p.estadoActual] ?? p.estadoActual}
              </Badge>
              <span className="flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="h-3.5 w-3.5" />
                {deriveUbicacion(p)}
              </span>
            </div>
          </div>
        </div>
        <DeleteButton id={p.id} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos de la Persona</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-5 md:grid-cols-3">
            <Field label="Apellido" value={p.apellido} />
            <Field label="Nombre" value={p.nombre} />
            <Field label="DNI" value={p.dni} />
            <Field label="Fecha de Nacimiento" value={formatDate(p.fechaNacimiento)} />
            <Field label="Fecha de Fallecimiento" value={formatDate(p.fechaFallecimiento)} />
            <Field label="N° Acta de Defunción" value={p.nroActaDefuncion} />
            <Field label="Tipo de Sepultura" value={TIPO_LABELS[p.tipoSepultura] ?? p.tipoSepultura} />
            <Field
              label="Estado Actual"
              value={
                <Badge className={estadoBadgeClass(p.estadoActual)}>
                  {ESTADO_LABELS[p.estadoActual] ?? p.estadoActual}
                </Badge>
              }
            />
            <Field label="Fecha de Ingreso" value={formatDate(p.fechaIngreso)} />
            <Field label="Ubicación" value={deriveUbicacion(p)} />
            <div className="col-span-2 md:col-span-3">
              <Field label="Observaciones" value={p.observaciones || "-"} />
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Historial de Movimientos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {movimientos.length === 0 ? (
            <p className="text-sm text-gray-400">Sin movimientos registrados.</p>
          ) : (
            <ol className="relative space-y-6 border-l border-gray-200 pl-6">
              {movimientos.map((m: any) => (
                <li key={m.id} className="relative">
                  <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-white bg-[#1e3a5f]" />
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-[#1e3a5f]">{m.tipo}</span>
                    <span className="text-xs text-gray-400">{formatDate(m.fecha)}</span>
                  </div>
                  {m.descripcion && <p className="mt-1 text-sm text-gray-700">{m.descripcion}</p>}
                  {(m.ubicacionAnterior || m.ubicacionNueva) && (
                    <p className="mt-1 text-xs text-gray-500">
                      {m.ubicacionAnterior && <>De: {m.ubicacionAnterior} </>}
                      {m.ubicacionNueva && <>→ A: {m.ubicacionNueva}</>}
                    </p>
                  )}
                  {m.responsable && (
                    <p className="mt-1 text-xs text-gray-400">Responsable: {m.responsable}</p>
                  )}
                </li>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Trámites
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tramites.length === 0 ? (
            <p className="text-sm text-gray-400">Sin trámites asociados.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {tramites.map((t: any) => (
                <li key={t.id} className="flex items-center justify-between py-3">
                  <div>
                    <Link
                      href={`/tramites/${t.id}`}
                      className="text-sm font-medium text-[#2563eb] hover:underline"
                    >
                      {t.expediente}
                    </Link>
                    <p className="text-xs text-gray-500">{t.tipo}</p>
                  </div>
                  <Badge className={tramiteEstadoClass(t.estado)}>{t.estado}</Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
