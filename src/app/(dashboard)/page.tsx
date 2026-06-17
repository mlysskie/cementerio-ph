import { prisma } from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import StatsCard from "@/components/dashboard/StatsCard";
import {
  SectorBarChart,
  SepulturaPieChart,
  TramitesLineChart,
} from "@/components/dashboard/OccupancyChart";
import { Users, UserSquare, FileText, Grid3x3 } from "lucide-react";
import { Badge } from "@/components/ui";
import { formatDate, tramiteEstadoClass } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

export default async function DashboardPage() {
  const [
    totalFallecidos,
    totalTitulares,
    totalTramites,
    fosas,
    nichos,
    panteones,
    sectores,
    tramites,
    movimientos,
  ] = await Promise.all([
    prisma.personaFallecida.count(),
    prisma.titular.count(),
    prisma.tramite.count(),
    prisma.fosa.findMany({ include: { fila: { include: { manzana: { include: { sector: true } } } } } }),
    prisma.nicho.findMany(),
    prisma.panteon.findMany(),
    prisma.sector.findMany(),
    prisma.tramite.findMany({ orderBy: { creadoEn: "desc" }, take: 6, include: { fallecido: true } }),
    prisma.historialMovimiento.findMany({ orderBy: { fecha: "desc" }, take: 6, include: { fallecido: true } }),
  ]);

  const totalEspacios = fosas.length + nichos.length + panteones.length;
  const ocupados =
    fosas.filter((f) => f.estado === "ocupado").length +
    nichos.filter((n) => n.estado === "ocupado").length +
    panteones.filter((p) => p.ocupacionActual > 0).length;
  const tasaOcupacion = totalEspacios ? Math.round((ocupados / totalEspacios) * 100) : 0;

  // Sector occupancy
  const sectorData = sectores.map((s) => {
    const fSector = fosas.filter((f) => f.fila.manzana.sector.id === s.id);
    return {
      sector: s.codigo,
      ocupado: fSector.filter((f) => f.estado === "ocupado" || f.estado === "vencido").length,
      libre: fSector.filter((f) => f.estado === "libre" || f.estado === "reservado").length,
    };
  });

  // Sepultura type pie
  const fallecidos = await prisma.personaFallecida.groupBy({
    by: ["tipoSepultura"],
    _count: true,
  });
  const pieData = fallecidos.map((f) => ({
    name: f.tipoSepultura.charAt(0).toUpperCase() + f.tipoSepultura.slice(1),
    value: f._count,
  }));

  // Tramites por mes
  const allTramites = await prisma.tramite.findMany({ select: { fechaInicio: true } });
  const lineData = MESES.map((mes, i) => ({
    mes,
    tramites: allTramites.filter((t) => new Date(t.fechaInicio).getMonth() === i).length,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1e3a5f]">Panel Principal</h2>
        <p className="text-sm text-gray-500">Resumen general del cementerio municipal</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Personas Fallecidas" value={totalFallecidos} icon={Users} color="#1e3a5f" />
        <StatsCard title="Titulares Activos" value={totalTitulares} icon={UserSquare} color="#2563eb" />
        <StatsCard
          title="Ocupación"
          value={`${tasaOcupacion}%`}
          icon={Grid3x3}
          color="#0ea5e9"
          subtitle={`${ocupados} de ${totalEspacios} espacios`}
        />
        <StatsCard title="Trámites" value={totalTramites} icon={FileText} color="#22c55e" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ocupación por Sector (Terrenos)</CardTitle>
          </CardHeader>
          <CardContent>
            <SectorBarChart data={sectorData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tipos de Sepultura</CardTitle>
          </CardHeader>
          <CardContent>
            <SepulturaPieChart data={pieData} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Trámites por Mes (2026)</CardTitle>
          </CardHeader>
          <CardContent>
            <TramitesLineChart data={lineData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trámites Recientes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tramites.map((t) => (
              <Link
                key={t.id}
                href={`/tramites/${t.id}`}
                className="block rounded-lg border border-gray-100 p-3 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{t.expediente}</span>
                  <Badge className={tramiteEstadoClass(t.estado)}>{t.estado.replace(/_/g, " ")}</Badge>
                </div>
                <p className="mt-1 text-xs capitalize text-gray-500">{t.tipo.replace(/_/g, " ")}</p>
              </Link>
            ))}
            {tramites.length === 0 && <p className="text-sm text-gray-400">Sin trámites.</p>}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {movimientos.map((m) => (
            <div key={m.id} className="flex items-center justify-between border-b border-gray-50 py-2 text-sm last:border-0">
              <div>
                <span className="font-medium capitalize text-gray-700">{m.tipo.replace(/_/g, " ")}</span>
                <span className="text-gray-500"> · {m.fallecido.apellido}, {m.fallecido.nombre}</span>
              </div>
              <span className="text-xs text-gray-400">{formatDate(m.fecha)}</span>
            </div>
          ))}
          {movimientos.length === 0 && <p className="text-sm text-gray-400">Sin actividad.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
