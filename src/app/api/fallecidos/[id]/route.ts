import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const fallecido = await prisma.personaFallecida.findUnique({
    where: { id: params.id },
    include: {
      fosa: true,
      nicho: true,
      panteon: true,
      deposito: true,
      historialMovimientos: { orderBy: { fecha: "desc" } },
      tramites: true,
      documentos: true,
    },
  });
  if (!fallecido) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(fallecido);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  try {
    const fallecido = await prisma.personaFallecida.update({
      where: { id: params.id },
      data: {
        apellido: body.apellido,
        nombre: body.nombre,
        dni: body.dni || null,
        fechaNacimiento: body.fechaNacimiento ? new Date(body.fechaNacimiento) : null,
        fechaFallecimiento: body.fechaFallecimiento ? new Date(body.fechaFallecimiento) : undefined,
        nroActaDefuncion: body.nroActaDefuncion || null,
        observaciones: body.observaciones || null,
        tipoSepultura: body.tipoSepultura,
        estadoActual: body.estadoActual,
      },
    });
    return NextResponse.json(fallecido);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.historialMovimiento.deleteMany({ where: { fallecidoId: params.id } });
    await prisma.personaFallecida.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
