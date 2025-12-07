import type { Metadata } from "next";
import type { ReactNode } from "react";
import ClientOnlyProvider from "./_providers/ClientOnlyProvider";
import { ThemeProvider } from "./_providers/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "YOZU Lite",
  description: "Front clean & stable",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <ClientOnlyProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </ClientOnlyProvider>
      </body>
    </html>
  );
}
