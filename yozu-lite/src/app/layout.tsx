import type { Metadata } from "next";
import "./globals.css";
import AppThemeProvider from "./_providers/theme";
import ClientOnly from "./_providers/client-only";

export const metadata: Metadata = {
  title: "YOZU Lite",
  description: "Front clean & stable",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
