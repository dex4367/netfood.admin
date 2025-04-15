import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import MainLayout from "@/components/layout/MainLayout";

export const metadata: Metadata = {
  title: "Bob's",
  description: "Uma marca renovada, jovem, aberta, que entende a contemporaneidade. Nossa trajetória de 70 anos nos dá experiência e solidez para ousar e inovar. Aproveite o melhor do Bob's com melhores ofertas e benefícios exclusivas sendo um Bobs fã.",
  icons: {
    icon: "/images/bobs-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="/fonts/fonts.css" />
      </head>
      <body>
        <Providers>
          <MainLayout>
            {children}
          </MainLayout>
        </Providers>
      </body>
    </html>
  );
}
