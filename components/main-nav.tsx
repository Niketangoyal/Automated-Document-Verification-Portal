"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { FileCheck, Home, Upload, User } from "lucide-react";

const navItems = [
  {
    name: "Home",
    href: "/",
    icon: <Home className="mr-2 h-4 w-4" />,
  },
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <FileCheck className="mr-2 h-4 w-4" />,
  },
  {
    name: "Upload",
    href: "/dashboard/upload",
    icon: <Upload className="mr-2 h-4 w-4" />,
  }
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center text-sm font-medium transition-colors hover:text-primary",
            pathname === item.href
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          {item.icon}
          {item.name}
        </Link>
      ))}
    </nav>
  );
} 