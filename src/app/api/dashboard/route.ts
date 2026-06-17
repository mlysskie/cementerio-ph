import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [fallecidos, titulares, tramites, fosas, nichos, panteones] = await Promise.all([
    prisma.personaFallecida.count(),
    prisma.titular.count(),
    prisma.tramite.count(),
    prisma.fosa.count(),
    prisma.nicho.count(),
    prisma.panteon.count(),
  ]);
  return NextResponse.json({
    fallecidos,
    titulares,
    tramites,
    espacios: fosas + nichos + panteones,
  });
}
