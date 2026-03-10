import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TarımSis — Tarım Yönetim Platformu",
  description:
    "Arazilerinizi yönetin, gelir-giderlerinizi takip edin, AI destekli hastalık teşhisi yapın.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
