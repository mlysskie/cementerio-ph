const ITEMS = [
  { color: "#22c55e", label: "Libre" },
  { color: "#ef4444", label: "Ocupado" },
  { color: "#eab308", label: "Reservado" },
  { color: "#f97316", label: "Vencido" },
  { color: "#1f2937", label: "Abandonado" },
  { color: "#2563eb", label: "Panteón" },
  { color: "#6b7280", label: "Depósito" },
];

export default function MapLegend() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 rounded-lg border border-gray-200 bg-white px-4 py-3">
      {ITEMS.map((it) => (
        <div key={it.label} className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded-sm border border-black/10" style={{ backgroundColor: it.color }} />
          <span className="text-xs font-medium text-gray-600">{it.label}</span>
        </div>
      ))}
    </div>
  );
}
