"use client";

import { useMemo, useState } from "react";
import { ESTADO_COLORS } from "@/lib/utils";
import SpaceDetail, { SelectedSpace } from "./SpaceDetail";
import MapLegend from "./MapLegend";

type Fosa = {
  id: string;
  numero: string;
  estado: string;
  titular?: { nombre: string; dni: string } | null;
  fallecidos?: any[];
};
type Manzana = { id: string; numero: string; filas: { fosas: Fosa[] }[] };
type Sector = { id: string; nombre: string; codigo: string; manzanas: Manzana[] };
type Nicho = { id: string; numero: string; estado: string; titular?: any; fallecidos?: any[] };
type Pabellon = { id: string; nombre: string; bloques: { filas: { nichos: Nicho[] }[] }[] };
type Panteon = {
  id: string;
  numero: string;
  familia: string;
  estado: string;
  ocupacionActual: number;
  capacidadMaxima: number;
  titular?: any;
  fallecidos?: any[];
};
type Deposito = { id: string; codigo: string; estado: string; descripcion?: string; fallecidos?: any[] };

type MapData = {
  sectores: Sector[];
  pabellones: Pabellon[];
  panteones: Panteon[];
  depositos: Deposito[];
};

const CELL = 16;
const GAP = 3;

export default function CemeteryMap({ data }: { data: MapData }) {
  const [selected, setSelected] = useState<SelectedSpace | null>(null);
  const [hover, setHover] = useState<string | null>(null);

  function fillFor(estado: string) {
    return ESTADO_COLORS[estado] ?? "#94a3b8";
  }

  // Layout sectors in a 2-column grid
  const layout = useMemo(() => {
    return data.sectores.map((s, i) => ({
      sector: s,
      col: i % 2,
      row: Math.floor(i / 2),
    }));
  }, [data.sectores]);

  const sectorBoxW = 260;
  const sectorBoxH = 200;
  const sectorGapX = 40;
  const sectorGapY = 40;
  const startX = 40;
  const startY = 70;

  const rightColX = startX + 2 * (sectorBoxW + sectorGapX) + 20;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
      <div className="overflow-auto rounded-xl border border-gray-200 bg-gradient-to-br from-[#eef4fb] to-[#f8fafc] p-2">
        <svg viewBox="0 0 1080 620" className="h-auto w-full min-w-[760px]" style={{ fontFamily: "system-ui" }}>
          {/* Background grounds / paths */}
          <rect x="0" y="0" width="1080" height="620" fill="#f1f5f9" />
          {/* Main avenue */}
          <rect x={startX - 20} y={startY - 40} width={2 * sectorBoxW + sectorGapX + 40} height="26" fill="#d6c9a8" rx="4" />
          <text x={startX - 12} y={startY - 22} fontSize="11" fill="#7c6f4f" fontWeight="600">
            Avenida Central
          </text>
          {/* Entrance */}
          <rect x="490" y="588" width="100" height="26" fill="#1e3a5f" rx="4" />
          <text x="540" y="605" fontSize="11" fill="white" textAnchor="middle" fontWeight="600">
            INGRESO
          </text>

          {/* Oficinas */}
          <g>
            <rect x="40" y="560" width="120" height="44" fill="#1e3a5f" rx="6" />
            <text x="100" y="580" fontSize="11" fill="white" textAnchor="middle" fontWeight="700">
              Oficinas
            </text>
            <text x="100" y="595" fontSize="9" fill="#cbd5e1" textAnchor="middle">
              Administración
            </text>
          </g>

          {/* Sectors with manzanas */}
          {layout.map(({ sector, col, row }) => {
            const bx = startX + col * (sectorBoxW + sectorGapX);
            const by = startY + row * (sectorBoxH + sectorGapY);
            return (
              <g key={sector.id}>
                <rect
                  x={bx}
                  y={by}
                  width={sectorBoxW}
                  height={sectorBoxH}
                  fill="#ffffff"
                  stroke="#cbd5e1"
                  strokeWidth="1.5"
                  rx="8"
                />
                <text x={bx + 12} y={by + 20} fontSize="13" fontWeight="700" fill="#1e3a5f">
                  {sector.nombre}
                </text>
                {/* manzanas */}
                {sector.manzanas.map((mz, mi) => {
                  const perRow = 2;
                  const mcol = mi % perRow;
                  const mrow = Math.floor(mi / perRow);
                  const mzW = 110;
                  const mzH = 78;
                  const mx = bx + 12 + mcol * (mzW + 12);
                  const my = by + 30 + mrow * (mzH + 8);
                  const fosas = mz.filas.flatMap((f) => f.fosas);
                  return (
                    <g key={mz.id}>
                      <rect x={mx} y={my} width={mzW} height={mzH} fill="#f8fafc" stroke="#e2e8f0" rx="4" />
                      <text x={mx + 4} y={my + 12} fontSize="8.5" fill="#64748b" fontWeight="600">
                        Mz {mz.numero}
                      </text>
                      {fosas.map((fosa, fi) => {
                        const fx = mx + 6 + (fi % 5) * (CELL + GAP);
                        const fy = my + 18 + Math.floor(fi / 5) * (CELL + GAP);
                        return (
                          <rect
                            key={fosa.id}
                            x={fx}
                            y={fy}
                            width={CELL}
                            height={CELL}
                            rx="2"
                            fill={fillFor(fosa.estado)}
                            stroke={hover === fosa.id ? "#1e3a5f" : "rgba(0,0,0,0.12)"}
                            strokeWidth={hover === fosa.id ? 2 : 1}
                            className="cursor-pointer transition-opacity hover:opacity-80"
                            onMouseEnter={() => setHover(fosa.id)}
                            onMouseLeave={() => setHover(null)}
                            onClick={() =>
                              setSelected({
                                tipo: "fosa",
                                label: `Fosa ${fosa.numero}`,
                                estado: fosa.estado,
                                ubicacion: `${sector.nombre} · Mz ${mz.numero} · Fosa ${fosa.numero}`,
                                titular: fosa.titular,
                                fallecidos: fosa.fallecidos,
                              })
                            }
                          />
                        );
                      })}
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* Right column: Pabellones de nichos */}
          <text x={rightColX} y={startY - 16} fontSize="13" fontWeight="700" fill="#1e3a5f">
            Pabellones de Nichos
          </text>
          {data.pabellones.map((pab, pi) => {
            const px = rightColX;
            const py = startY + pi * 150;
            const nichos = pab.bloques.flatMap((b) => b.filas.flatMap((f) => f.nichos));
            return (
              <g key={pab.id}>
                <rect x={px} y={py} width="240" height="132" fill="#ffffff" stroke="#cbd5e1" rx="8" />
                <text x={px + 10} y={py + 18} fontSize="11" fontWeight="600" fill="#334155">
                  {pab.nombre}
                </text>
                {nichos.map((n, ni) => {
                  const nx = px + 12 + (ni % 5) * (40 + 4);
                  const ny = py + 28 + Math.floor(ni / 5) * (20 + 4);
                  return (
                    <rect
                      key={n.id}
                      x={nx}
                      y={ny}
                      width="40"
                      height="20"
                      rx="2"
                      fill={fillFor(n.estado)}
                      stroke={hover === n.id ? "#1e3a5f" : "rgba(0,0,0,0.12)"}
                      strokeWidth={hover === n.id ? 2 : 1}
                      className="cursor-pointer hover:opacity-80"
                      onMouseEnter={() => setHover(n.id)}
                      onMouseLeave={() => setHover(null)}
                      onClick={() =>
                        setSelected({
                          tipo: "nicho",
                          label: `Nicho ${n.numero}`,
                          estado: n.estado,
                          ubicacion: `${pab.nombre} · Nicho ${n.numero}`,
                          titular: n.titular,
                          fallecidos: n.fallecidos,
                        })
                      }
                    />
                  );
                })}
              </g>
            );
          })}

          {/* Panteones row */}
          <text x={startX} y={startY + 2 * (sectorBoxH + sectorGapY) - 8} fontSize="13" fontWeight="700" fill="#1e3a5f">
            Sector de Panteones
          </text>
          {data.panteones.map((p, pi) => {
            const px = startX + pi * 100;
            const py = startY + 2 * (sectorBoxH + sectorGapY);
            const full = p.ocupacionActual >= p.capacidadMaxima;
            return (
              <g
                key={p.id}
                className="cursor-pointer"
                onMouseEnter={() => setHover(p.id)}
                onMouseLeave={() => setHover(null)}
                onClick={() =>
                  setSelected({
                    tipo: "panteon",
                    label: `Panteón ${p.numero}`,
                    estado: p.estado,
                    ubicacion: `${p.familia}`,
                    titular: p.titular,
                    fallecidos: p.fallecidos,
                    capacidad: { actual: p.ocupacionActual, max: p.capacidadMaxima },
                  })
                }
              >
                <rect
                  x={px}
                  y={py}
                  width="86"
                  height="58"
                  rx="4"
                  fill={full ? "#1e3a5f" : "#2563eb"}
                  stroke={hover === p.id ? "#0ea5e9" : "rgba(0,0,0,0.15)"}
                  strokeWidth={hover === p.id ? 2.5 : 1}
                  className="hover:opacity-90"
                />
                <polygon points={`${px},${py} ${px + 43},${py - 14} ${px + 86},${py}`} fill="#173050" />
                <text x={px + 43} y={py + 30} fontSize="11" fill="white" textAnchor="middle" fontWeight="700">
                  {p.numero}
                </text>
                <text x={px + 43} y={py + 45} fontSize="8" fill="#cbd5e1" textAnchor="middle">
                  {p.ocupacionActual}/{p.capacidadMaxima}
                </text>
              </g>
            );
          })}

          {/* Deposito */}
          {data.depositos.map((d, di) => {
            const dx = rightColX;
            const dy = startY + data.pabellones.length * 150 + di * 60;
            return (
              <g
                key={d.id}
                className="cursor-pointer"
                onClick={() =>
                  setSelected({
                    tipo: "deposito",
                    label: `Depósito ${d.codigo}`,
                    estado: d.estado,
                    ubicacion: d.descripcion || "Depósito municipal",
                    fallecidos: d.fallecidos,
                  })
                }
              >
                <rect x={dx} y={dy} width="240" height="46" rx="6" fill="#6b7280" className="hover:opacity-90" />
                <text x={dx + 12} y={dy + 20} fontSize="11" fill="white" fontWeight="700">
                  Depósito Municipal {d.codigo}
                </text>
                <text x={dx + 12} y={dy + 35} fontSize="9" fill="#e5e7eb">
                  {d.fallecidos?.length ?? 0} restos · {d.estado}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="space-y-4">
        <MapLegend />
        <SpaceDetail space={selected} onClose={() => setSelected(null)} />
      </div>
    </div>
  );
}
