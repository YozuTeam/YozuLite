import type { Metadata } from "next";
import "./globals.css";
import AppThemeProvider from "./_providers/AppThemeProvider";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "YOZU Lite",
  description: "Front clean & stable",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <AppThemeProvider>
          {children}
        </AppThemeProvider>
      </body>
    </html>
  );
}
