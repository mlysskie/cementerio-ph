import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, Table, Th, Td } from "@/components/ui";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const ROL_LABELS: Record<string, string> = {
  administrador: "Administrador",
  operador: "Operador",
  mesa_entradas: "Mesa de Entradas",
  consulta: "Consulta",
};

export default async function UsuariosPage() {
  const usuarios = await prisma.usuario.findMany({
    orderBy: { creadoEn: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1e3a5f]">
          Usuarios del Sistema
        </h1>
        <p className="text-sm text-gray-500">
          La gestión de usuarios y sus roles controla el acceso a las distintas
          secciones de SIGECEM.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <thead>
              <tr>
                <Th>Nombre</Th>
                <Th>Email</Th>
                <Th>Rol</Th>
                <Th>Estado</Th>
                <Th>Creado</Th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 ? (
                <tr>
                  <Td className="text-center text-gray-400">
                    No hay usuarios registrados.
                  </Td>
                  <Td /> <Td /> <Td /> <Td />
                </tr>
              ) : (
                usuarios.map((u) => (
                  <tr key={u.id} className="transition-colors hover:bg-gray-50">
                    <Td className="font-medium text-[#1e3a5f]">{u.nombre}</Td>
                    <Td>{u.email}</Td>
                    <Td>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        {ROL_LABELS[u.rol] ?? u.rol}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge
                        className={
                          u.activo
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-gray-100 text-gray-800 border-gray-200"
                        }
                      >
                        {u.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </Td>
                    <Td>{formatDate(u.creadoEn)}</Td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
