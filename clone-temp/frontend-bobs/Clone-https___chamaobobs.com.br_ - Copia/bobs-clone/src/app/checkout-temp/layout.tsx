import type { Metadata } from "next";
import "../globals.css";
import { Providers } from "../providers";

export const metadata: Metadata = {
  title: "Checkout - Bob's",
  description: "Finalize seu pedido no Bob's.",
  icons: {
    icon: "/images/bobs-logo.png",
  },
};

export default function CheckoutTempLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
} 