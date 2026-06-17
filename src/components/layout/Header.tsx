"use client";

import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut, UserCircle } from "lucide-react";

const ROL_LABEL: Record<string, string> = {
  administrador: "Administrador",
  operador: "Operador",
  mesa_entradas: "Mesa de Entradas",
  consulta: "Consulta",
};

export default function Header({ title }: { title?: string }) {
  const { data: session } = useSession();
  const rol = (session?.user as any)?.rol as string | undefined;

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3.5">
      <div>
        <h1 className="text-lg font-semibold text-[#1e3a5f]">
          {title ?? "Sistema de Gestión del Cementerio"}
        </h1>
        <p className="text-xs text-gray-400">Plaza Huincul · Neuquén</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-right">
          <UserCircle className="h-8 w-8 text-[#2563eb]" />
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-700">
              {session?.user?.name ?? "Usuario"}
            </p>
            <p className="text-xs text-gray-400">{rol ? ROL_LABEL[rol] : ""}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/login" })}>
          <LogOut className="h-4 w-4" />
          Salir
        </Button>
      </div>
    </header>
  );
}
