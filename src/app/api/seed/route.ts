import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Lightweight health/seed-status endpoint. Full seeding is done via `npm run seed`.
export async function GET() {
  const usuarios = await prisma.usuario.count();
  const fallecidos = await prisma.personaFallecida.count();
  return NextResponse.json({
    seeded: usuarios > 0,
    usuarios,
    fallecidos,
    mensaje:
      usuarios > 0
        ? "La base de datos contiene datos. Ejecute `npm run seed` para recargar."
        : "Base vacía. Ejecute `npm run seed`.",
  });
}
