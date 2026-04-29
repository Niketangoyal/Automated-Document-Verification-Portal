"use client";

import Link from "next/link";
import { FileCheck } from "lucide-react";
import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useAuth } from "@clerk/nextjs";  // Get userId after login
import {
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { useEffect } from "react";
export function Header() {
  const { isSignedIn } = useAuth();  // Clerk auth hook

  useEffect(() => {
    const syncUser = async () => {
      if (isSignedIn) {
        await fetch("/api/users/sync", { method: "POST" });
      }
    };
    syncUser();
  }, [isSignedIn]);  // Sync user only when signed in
  const pathname = usePathname();
  const isHome = pathname === "/";
  const showAuthButtons = isHome;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col gap-4 py-4">
                <MainNav />
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/" className="hidden items-center space-x-2 md:flex">
            <FileCheck className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              DocVerify
            </span>
          </Link>
          <div className="hidden md:flex">
            <MainNav />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {showAuthButtons && (
            <>
             <SignedOut>
             <Link href="/sign-in">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm">Sign up</Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
              
            </>
          )}
        </div>
      </div>
    </header>
  );
} 