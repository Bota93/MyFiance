import type { Metadata } from "next";
import {Inter} from "next/font/google";
import "./globals.css";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "MyFiance",
  description: "Tu aplicación para la gestión de finanzas.",
};

/** 
 * RootLayout es el componente principal que envuelve toda la aplicación.
 * Define la estructura HTML base (<html> y <body>) y aplica estilos globales.
 * @param {object} props - Las propiedades del componente.
 * @param {React.ReactNode} props.children - Los componentes hijos que serán renderizados dentro de este layout (las páginas).
 * @returns {JSX.Element} El layout principal de la aplicación
*/
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
