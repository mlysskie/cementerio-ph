import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const estado = req.nextUrl.searchParams.get("estado");
  const tramites = await prisma.tramite.findMany({
    where: estado && estado !== "todos" ? { estado } : undefined,
    orderBy: { creadoEn: "desc" },
    include: { fallecido: true },
  });
  return NextResponse.json(tramites);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const count = await prisma.tramite.count();
    const expediente = body.expediente || `EXP-2026-${String(100 + count + 1).padStart(4, "0")}`;
    const tramite = await prisma.tramite.create({
      data: {
        expediente,
        tipo: body.tipo,
        estado: body.estado || "iniciado",
        fallecidoId: body.fallecidoId || null,
        solicitante: body.solicitante,
        descripcion: body.descripcion || null,
      },
    });
    return NextResponse.json(tramite, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  const { id, estado } = await req.json();
  try {
    const tramite = await prisma.tramite.update({
      where: { id },
      data: { estado, fechaFin: estado === "finalizado" ? new Date() : null },
    });
    return NextResponse.json(tramite);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
