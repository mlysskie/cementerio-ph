import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  const fallecidos = await prisma.personaFallecida.findMany({
    where: q
      ? {
          OR: [
            { apellido: { contains: q } },
            { nombre: { contains: q } },
            { dni: { contains: q } },
          ],
        }
      : undefined,
    orderBy: { creadoEn: "desc" },
    include: { fosa: true, nicho: true, panteon: true, deposito: true },
  });
  return NextResponse.json(fallecidos);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const data: any = {
      apellido: body.apellido,
      nombre: body.nombre,
      dni: body.dni || null,
      fechaNacimiento: body.fechaNacimiento ? new Date(body.fechaNacimiento) : null,
      fechaFallecimiento: new Date(body.fechaFallecimiento),
      nroActaDefuncion: body.nroActaDefuncion || null,
      observaciones: body.observaciones || null,
      tipoSepultura: body.tipoSepultura,
      estadoActual: body.estadoActual || "sepultado",
      fosaId: body.fosaId || null,
      nichoId: body.nichoId || null,
      panteonId: body.panteonId || null,
      depositoId: body.depositoId || null,
    };
    const fallecido = await prisma.personaFallecida.create({ data });

    await prisma.historialMovimiento.create({
      data: {
        fallecidoId: fallecido.id,
        fecha: data.fechaFallecimiento,
        tipo: "inhumacion",
        descripcion: `Registro de inhumación en ${data.tipoSepultura}`,
        ubicacionNueva: data.tipoSepultura,
      },
    });

    // mark space occupied
    if (data.fosaId) await prisma.fosa.update({ where: { id: data.fosaId }, data: { estado: "ocupado" } });
    if (data.nichoId) await prisma.nicho.update({ where: { id: data.nichoId }, data: { estado: "ocupado" } });

    return NextResponse.json(fallecido, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
