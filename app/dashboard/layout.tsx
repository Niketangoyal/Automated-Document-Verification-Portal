"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="container flex-1 py-8">{children}</div>
      <Footer />
    </div>
  );
} 