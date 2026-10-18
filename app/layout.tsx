import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js RBAC Demo",
  description: "Authentication with Credentials + GitHub (NextAuth v5)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
