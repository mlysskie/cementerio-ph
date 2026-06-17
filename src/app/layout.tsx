import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "SIGECEM - Cementerio Municipal Plaza Huincul",
  description:
    "Sistema Integral de Gestión del Cementerio Municipal de Plaza Huincul",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased bg-[#f8fafc] text-gray-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
