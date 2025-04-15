"use client";

import { ThemeProvider } from "next-themes";
import { CartProvider } from "@/context/CartContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light" enableSystem={false} attribute="class">
      <CartProvider>
        {children}
      </CartProvider>
    </ThemeProvider>
  );
}
