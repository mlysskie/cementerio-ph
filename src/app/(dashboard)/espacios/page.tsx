import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui";
import { estadoBadgeClass } from "@/lib/utils";
import { Grid3x3, Layers, Landmark, Archive } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EspaciosPage() {
  const [fosasCount, nichosCount, panteonesCount, depositosCount, fosasPorEstado] =
    await Promise.all([
      prisma.fosa.count(),
      prisma.nicho.count(),
      prisma.panteon.count(),
      prisma.deposito.count(),
      prisma.fosa.groupBy({ by: ["estado"], _count: { _all: true } }) as Promise<any>,
    ]);

  const cards = [
    {
      href: "/espacios/terrenos",
      title: "Terrenos / Fosas",
      count: fosasCount,
      icon: Grid3x3,
      desc: "Fosas en tierra organizadas por sectores, manzanas y filas.",
    },
    {
      href: "/espacios/nichos",
      title: "Nichos",
      count: nichosCount,
      icon: Layers,
      desc: "Nichos distribuidos en pabellones, bloques y filas.",
    },
    {
      href: "/espacios/panteones",
      title: "Panteones",
      count: panteonesCount,
      icon: Landmark,
      desc: "Panteones familiares con su capacidad y ocupación.",
    },
    {
      href: "/espacios/deposito",
      title: "Depósito Municipal",
      count: depositosCount,
      icon: Archive,
      desc: "Espacios de depósito temporal de fallecidos.",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1e3a5f]">Espacios</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link key={c.href} href={c.href}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader className="flex-row items-center justify-between space-y-0">
                  <CardTitle>{c.title}</CardTitle>
                  <Icon className="h-6 w-6 text-[#1e3a5f]" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-[#1e3a5f]">{c.count}</p>
                  <p className="mt-2 text-sm text-gray-500">{c.desc}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumen de estados de fosas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {(fosasPorEstado as any[]).length === 0 && (
              <span className="text-sm text-gray-500">Sin datos de fosas.</span>
            )}
            {(fosasPorEstado as any[]).map((g) => (
              <div key={g.estado} className="flex items-center gap-2">
                <Badge className={estadoBadgeClass(g.estado)}>{g.estado}</Badge>
                <span className="text-sm font-medium text-gray-700">{g._count._all}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
