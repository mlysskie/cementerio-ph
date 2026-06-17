import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

async function main() {
  console.log("Limpiando base de datos...");
  await prisma.historialMovimiento.deleteMany();
  await prisma.exhumacion.deleteMany();
  await prisma.traslado.deleteMany();
  await prisma.cremacion.deleteMany();
  await prisma.cambioTitularidad.deleteMany();
  await prisma.documento.deleteMany();
  await prisma.tramite.deleteMany();
  await prisma.personaFallecida.deleteMany();
  await prisma.heredero.deleteMany();
  await prisma.historialTitularidad.deleteMany();
  await prisma.fosa.deleteMany();
  await prisma.fila.deleteMany();
  await prisma.manzana.deleteMany();
  await prisma.sector.deleteMany();
  await prisma.nicho.deleteMany();
  await prisma.filaNicho.deleteMany();
  await prisma.bloque.deleteMany();
  await prisma.pabellon.deleteMany();
  await prisma.panteon.deleteMany();
  await prisma.deposito.deleteMany();
  await prisma.titular.deleteMany();
  await prisma.auditoria.deleteMany();
  await prisma.usuario.deleteMany();

  console.log("Creando usuarios...");
  const adminPass = await bcrypt.hash("admin123", 10);
  const userPass = await bcrypt.hash("password123", 10);
  const admin = await prisma.usuario.create({
    data: {
      nombre: "Administrador General",
      email: "admin@sigecem.gob.ar",
      password: adminPass,
      rol: "administrador",
    },
  });
  await prisma.usuario.createMany({
    data: [
      { nombre: "Juan Operador", email: "operador@sigecem.gob.ar", password: userPass, rol: "operador" },
      { nombre: "Mesa de Entradas", email: "mesa@sigecem.gob.ar", password: userPass, rol: "mesa_entradas" },
      { nombre: "Consulta Pública", email: "consulta@sigecem.gob.ar", password: userPass, rol: "consulta" },
    ],
  });

  console.log("Creando titulares...");
  const apellidos = ["González", "Rodríguez", "Fernández", "López", "Martínez", "Díaz", "Pérez", "Sánchez", "Romero", "Sosa"];
  const titulares = [];
  for (let i = 0; i < 10; i++) {
    const t = await prisma.titular.create({
      data: {
        nombre: `${pick(["Carlos", "María", "José", "Ana", "Luis", "Laura", "Pedro", "Sofía", "Jorge", "Elena"], i)} ${apellidos[i]}`,
        dni: `${20000000 + i * 1234567}`.slice(0, 8),
        direccion: `Calle ${i + 1} N° ${100 + i * 25}, Plaza Huincul`,
        telefono: `0299-${4000000 + i * 11111}`.slice(0, 12),
        email: `titular${i + 1}@mail.com`,
      },
    });
    titulares.push(t);
    if (i % 3 === 0) {
      await prisma.heredero.create({
        data: {
          titularId: t.id,
          nombre: `Heredero de ${t.nombre}`,
          dni: `${30000000 + i}`,
          relacion: pick(["Hijo/a", "Cónyuge", "Hermano/a", "Nieto/a"], i),
          telefono: `0299-5${i}00000`,
        },
      });
    }
  }

  console.log("Creando sectores, manzanas, filas y fosas...");
  const sectoresData = [
    { nombre: "Sector A", codigo: "A", descripcion: "Sector histórico norte" },
    { nombre: "Sector B", codigo: "B", descripcion: "Sector central" },
    { nombre: "Sector C", codigo: "C", descripcion: "Sector sur ampliación" },
  ];
  const fosas: any[] = [];
  let fosaCount = 0;
  const estadosFosa = ["libre", "ocupado", "reservado", "vencido", "abandonado"];
  let manzanaGlobal = 0;

  for (let s = 0; s < sectoresData.length; s++) {
    const sector = await prisma.sector.create({ data: sectoresData[s] });
    // ~3-4 manzanas per sector -> 10 total
    const numManzanas = s === 0 ? 4 : 3;
    for (let m = 0; m < numManzanas; m++) {
      manzanaGlobal++;
      const manzana = await prisma.manzana.create({
        data: { numero: `${m + 1}`, sectorId: sector.id },
      });
      // 1 fila per manzana with 5 fosas => 50 fosas across 10 manzanas
      const fila = await prisma.fila.create({
        data: { numero: "1", manzanaId: manzana.id },
      });
      for (let f = 0; f < 5; f++) {
        if (fosaCount >= 50) break;
        const estado = pick(estadosFosa, fosaCount + f);
        const titular = estado === "ocupado" || estado === "reservado" ? pick(titulares, fosaCount) : null;
        const fosa = await prisma.fosa.create({
          data: {
            numero: `${f + 1}`,
            filaId: fila.id,
            estado,
            titularId: titular?.id ?? null,
            coordX: s,
            coordY: m * 5 + f,
          },
        });
        fosas.push({ ...fosa, sectorCodigo: sector.codigo, manzanaNumero: manzana.numero });
        fosaCount++;
      }
    }
  }

  console.log("Creando pabellones de nichos...");
  const nichos: any[] = [];
  const pabellon = await prisma.pabellon.create({
    data: { nombre: "Pabellón de Nichos I", codigo: "PN-1" },
  });
  const bloque = await prisma.bloque.create({
    data: { nombre: "Bloque A", pabellonId: pabellon.id },
  });
  for (let fila = 0; fila < 4; fila++) {
    const filaN = await prisma.filaNicho.create({
      data: { numero: `${fila + 1}`, bloqueId: bloque.id },
    });
    for (let n = 0; n < 5; n++) {
      if (nichos.length >= 20) break;
      const estado = pick(["libre", "ocupado", "reservado"], nichos.length);
      const titular = estado !== "libre" ? pick(titulares, nichos.length) : null;
      const nicho = await prisma.nicho.create({
        data: {
          numero: `${fila + 1}-${n + 1}`,
          filaId: filaN.id,
          estado,
          titularId: titular?.id ?? null,
          coordX: n,
          coordY: fila,
        },
      });
      nichos.push(nicho);
    }
  }

  console.log("Creando panteones...");
  const panteones: any[] = [];
  for (let p = 0; p < 5; p++) {
    const panteon = await prisma.panteon.create({
      data: {
        numero: `P-${p + 1}`,
        familia: `Familia ${apellidos[p]}`,
        capacidadMaxima: 10,
        ocupacionActual: (p * 2) % 8,
        titularId: titulares[p].id,
        coordX: p,
        coordY: 0,
      },
    });
    panteones.push(panteon);
  }

  console.log("Creando depósito municipal...");
  const deposito = await prisma.deposito.create({
    data: { codigo: "DEP-01", descripcion: "Depósito municipal transitorio", estado: "disponible" },
  });

  console.log("Creando personas fallecidas...");
  const nombresF = ["Roberto", "Marta", "Héctor", "Beatriz", "Ricardo", "Gladys", "Oscar", "Norma", "Daniel", "Susana", "Raúl", "Mónica", "Alberto", "Teresa", "Eduardo"];
  const ocupadasFosas = fosas.filter((f) => f.estado === "ocupado");
  const ocupadosNichos = nichos.filter((n) => n.estado === "ocupado");
  const fallecidos: any[] = [];

  for (let i = 0; i < 15; i++) {
    let tipoSepultura = "tierra";
    let fosaId: string | null = null;
    let nichoId: string | null = null;
    let panteonId: string | null = null;
    let depositoId: string | null = null;

    if (i < ocupadasFosas.length) {
      tipoSepultura = "tierra";
      fosaId = ocupadasFosas[i].id;
    } else if (i < ocupadasFosas.length + ocupadosNichos.length) {
      tipoSepultura = "nicho";
      nichoId = ocupadosNichos[i - ocupadasFosas.length].id;
    } else if (i % 3 === 0) {
      tipoSepultura = "panteon";
      panteonId = pick(panteones, i).id;
    } else {
      tipoSepultura = "deposito";
      depositoId = deposito.id;
    }

    const fecha = new Date(2018 + (i % 7), i % 12, (i % 27) + 1);
    const f = await prisma.personaFallecida.create({
      data: {
        apellido: pick(apellidos, i),
        nombre: nombresF[i],
        dni: `${10000000 + i * 543210}`.slice(0, 8),
        fechaNacimiento: new Date(1940 + (i % 40), i % 12, (i % 27) + 1),
        fechaFallecimiento: fecha,
        nroActaDefuncion: `ACTA-${2018 + (i % 7)}-${1000 + i}`,
        tipoSepultura,
        estadoActual: tipoSepultura === "deposito" ? "en_deposito" : "sepultado",
        fosaId,
        nichoId,
        panteonId,
        depositoId,
        observaciones: i % 4 === 0 ? "Restos en buen estado de conservación." : null,
      },
    });
    fallecidos.push(f);

    await prisma.historialMovimiento.create({
      data: {
        fallecidoId: f.id,
        fecha,
        tipo: "inhumacion",
        descripcion: `Inhumación inicial en ${tipoSepultura}`,
        ubicacionNueva: tipoSepultura,
        responsable: "Personal de cementerio",
      },
    });
  }

  console.log("Creando trámites...");
  const tiposTramite = ["exhumacion", "traslado", "cremacion", "cambio_titularidad", "tierra_a_nicho"];
  const estadosTramite = ["iniciado", "en_revision", "aprobado", "finalizado", "rechazado"];

  for (let i = 0; i < 5; i++) {
    const tipo = tiposTramite[i];
    const estado = estadosTramite[i];
    const fallecido = pick(fallecidos, i);
    const tramite = await prisma.tramite.create({
      data: {
        expediente: `EXP-2026-${String(100 + i).padStart(4, "0")}`,
        tipo,
        estado,
        fallecidoId: fallecido.id,
        solicitante: pick(titulares, i).nombre,
        descripcion: `Solicitud de ${tipo.replace(/_/g, " ")} correspondiente a ${fallecido.apellido}, ${fallecido.nombre}.`,
        fechaInicio: new Date(2026, i % 6, (i % 27) + 1),
        fechaFin: estado === "finalizado" ? new Date(2026, (i % 6) + 1, 15) : null,
      },
    });

    if (tipo === "exhumacion") {
      await prisma.exhumacion.create({
        data: {
          tramiteId: tramite.id,
          fechaExhumacion: new Date(2026, 3, 10),
          motivo: "Solicitud de familiares",
          destinoRestos: "Osario común",
          personalResponsable: "Equipo técnico municipal",
        },
      });
    } else if (tipo === "traslado") {
      await prisma.traslado.create({
        data: {
          tramiteId: tramite.id,
          origen: "Cementerio Municipal Plaza Huincul",
          destino: "Cementerio de Cutral Có",
          fechaTraslado: new Date(2026, 4, 5),
          empresa: "Servicios Fúnebres del Sur",
          vehiculo: "AB-123-CD",
          conductor: "Mario Suárez",
        },
      });
    } else if (tipo === "cremacion") {
      await prisma.cremacion.create({
        data: {
          tramiteId: tramite.id,
          fechaCremacion: new Date(2026, 2, 20),
          crematorio: "Crematorio Regional Neuquén",
          destinoCenizas: "Entrega a familiares",
          responsable: "Dirección de Cementerios",
        },
      });
    } else if (tipo === "cambio_titularidad") {
      await prisma.cambioTitularidad.create({
        data: {
          tramiteId: tramite.id,
          titularAnterior: titulares[0].nombre,
          titularNuevo: titulares[1].nombre,
          motivo: "Fallecimiento del titular original",
        },
      });
    }
  }

  await prisma.auditoria.create({
    data: {
      usuarioId: admin.id,
      accion: "seed",
      entidad: "sistema",
      detalles: "Carga inicial de datos de prueba",
    },
  });

  console.log("Seed completado con éxito.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
