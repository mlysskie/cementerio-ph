import { prisma } from "@/lib/prisma";
import CemeteryMap from "@/components/map/CemeteryMap";

export const dynamic = "force-dynamic";

export default async function PlanoPage() {
  const [sectores, pabellones, panteones, depositos] = await Promise.all([
    prisma.sector.findMany({
      orderBy: { codigo: "asc" },
      include: {
        manzanas: {
          orderBy: { numero: "asc" },
          include: { filas: { include: { fosas: { orderBy: { numero: "asc" }, include: { titular: true, fallecidos: true } } } } },
        },
      },
    }),
    prisma.pabellon.findMany({
      include: { bloques: { include: { filas: { include: { nichos: { include: { titular: true, fallecidos: true } } } } } } },
    }),
    prisma.panteon.findMany({ orderBy: { numero: "asc" }, include: { titular: true, fallecidos: true } }),
    prisma.deposito.findMany({ include: { fallecidos: true } }),
  ]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-[#1e3a5f]">Plano del Cementerio</h2>
        <p className="text-sm text-gray-500">
          Vista interactiva. Haga clic en cualquier espacio para ver su detalle, titular e inhumaciones.
        </p>
      </div>
      <CemeteryMap
        data={JSON.parse(JSON.stringify({ sectores, pabellones, panteones, depositos }))}
      />
    </div>
  );
}
