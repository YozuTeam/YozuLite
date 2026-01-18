import { ThemeToggle } from "@/design-system/atoms/ThemeToggle";
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
            <div style={{ position: "absolute", top: "1rem", right: "1rem", zIndex: 1000 }}>
              <ThemeToggle />
            </div>
            {children}
          </ThemeProvider>
        </ClientOnlyProvider>
      </body>
    </html>
  );
}
