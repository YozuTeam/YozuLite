import { ReactNode } from "react";
import AuthProvider from "@/app/_providers/AuthProvider";

export default function YozuLiteLayout({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
