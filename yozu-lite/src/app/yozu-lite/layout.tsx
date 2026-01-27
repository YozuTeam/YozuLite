"use client";

import { AuthGuard } from "@/auth";
import { AuthProvider } from "@/auth/providers/AuthProvider";
import { ReactNode } from "react";

export default function YozuLiteLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AuthGuard>{children}</AuthGuard>
    </AuthProvider>
  );
}
