import ClientOnly from "./_providers/client-only";
import AppThemeProvider from "./_providers/theme";

import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "YOZU Lite",
  description: "Front clean & stable",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <ClientOnly>
          <AppThemeProvider>{children}</AppThemeProvider>
        </ClientOnly>
      </body>
    </html>
  );
}
