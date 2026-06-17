"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  UserSquare,
  Map,
  Grid3x3,
  FileText,
  Shield,
  Landmark,
} from "lucide-react";

const nav = [
  { href: "/", label: "Panel Principal", icon: LayoutDashboard },
  { href: "/fallecidos", label: "Personas Fallecidas", icon: Users },
  { href: "/titulares", label: "Titulares", icon: UserSquare },
  { href: "/espacios", label: "Espacios", icon: Grid3x3 },
  { href: "/plano", label: "Plano del Cementerio", icon: Map },
  { href: "/tramites", label: "Trámites", icon: FileText },
  { href: "/usuarios", label: "Usuarios", icon: Shield },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col bg-[#1e3a5f] text-white">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
          <Landmark className="h-6 w-6" />
        </div>
        <div>
          <p className="text-lg font-bold leading-tight">SIGECEM</p>
          <p className="text-[11px] leading-tight text-white/60">Plaza Huincul</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {nav.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-[#2563eb] text-white shadow"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-5 py-4 text-[11px] text-white/50">
        Municipalidad de Plaza Huincul
        <br />
        Provincia del Neuquén
      </div>
    </aside>
  );
}
