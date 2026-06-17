import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Returns the full spatial map data for the cemetery plan + listings.
export async function GET(req: NextRequest) {
  const tipo = req.nextUrl.searchParams.get("tipo");

  if (tipo === "terrenos") {
    const sectores = await prisma.sector.findMany({
      include: {
        manzanas: {
          include: { filas: { include: { fosas: { include: { titular: true, fallecidos: true } } } } },
        },
      },
    });
    return NextResponse.json(sectores);
  }
  if (tipo === "nichos") {
    const pabellones = await prisma.pabellon.findMany({
      include: {
        bloques: { include: { filas: { include: { nichos: { include: { titular: true, fallecidos: true } } } } } },
      },
    });
    return NextResponse.json(pabellones);
  }
  if (tipo === "panteones") {
    const panteones = await prisma.panteon.findMany({ include: { titular: true, fallecidos: true } });
    return NextResponse.json(panteones);
  }
  if (tipo === "deposito") {
    const depositos = await prisma.deposito.findMany({ include: { fallecidos: true } });
    return NextResponse.json(depositos);
  }

  // Full map payload
  const [sectores, pabellones, panteones, depositos] = await Promise.all([
    prisma.sector.findMany({
      include: { manzanas: { include: { filas: { include: { fosas: { include: { titular: true, fallecidos: true } } } } } } },
    }),
    prisma.pabellon.findMany({
      include: { bloques: { include: { filas: { include: { nichos: { include: { titular: true, fallecidos: true } } } } } } },
    }),
    prisma.panteon.findMany({ include: { titular: true, fallecidos: true } }),
    prisma.deposito.findMany({ include: { fallecidos: true } }),
  ]);
  return NextResponse.json({ sectores, pabellones, panteones, depositos });
}

// Update the estado of a space
export async function PATCH(req: NextRequest) {
  const { tipo, id, estado } = await req.json();
  try {
    if (tipo === "fosa") await prisma.fosa.update({ where: { id }, data: { estado } });
    else if (tipo === "nicho") await prisma.nicho.update({ where: { id }, data: { estado } });
    else if (tipo === "panteon") await prisma.panteon.update({ where: { id }, data: { estado } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
