import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  const titulares = await prisma.titular.findMany({
    where: q ? { OR: [{ nombre: { contains: q } }, { dni: { contains: q } }] } : undefined,
    orderBy: { creadoEn: "desc" },
    include: { _count: { select: { fosas: true, nichos: true, panteones: true, herederos: true } } },
  });
  return NextResponse.json(titulares);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const titular = await prisma.titular.create({
      data: {
        nombre: body.nombre,
        dni: body.dni,
        direccion: body.direccion || null,
        telefono: body.telefono || null,
        email: body.email || null,
      },
    });
    return NextResponse.json(titular, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
