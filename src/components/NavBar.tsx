"use client";

import Image from "next/image";
import Link from "next/link";

import logo from "@/assets/logo.png";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import { useState, useEffect } from "react";

import ThemeToggleButton from "@/components/ThemeToggleButton";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const [mounted, setMounted] = useState(false);
  const path = usePathname();
  const { theme } = useTheme();
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return "";
  }

  return (
    <>
      <div className="relative z-50 bg-primary p-4 text-white">
        <div className="m-auto flex w-full items-center justify-between text-white">
          <Link href="/" className="flex items-center gap-1">
            <Image src={logo} alt="logo" width={40} height={40} />
            <span className="font-bold">Brain</span>
          </Link>
          <div className="flex items-center justify-center gap-x-8 font-semibold">
            <Link
              href="/"
              className={
                path === "/"
                  ? "font-bold  transition-all duration-300 ease-in-out"
                  : ""
              }
            >
              Home
            </Link>
            <Link
              href="/dashboard/notes"
              className={
                path === "/dashboard/notes"
                  ? "font-bold  transition-all duration-300 ease-in-out"
                  : ""
              }
            >
              Dashboard
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center justify-end md:flex md:flex-1 lg:w-0">
              <SignedIn>
                <div className="flex items-center gap-2">
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      baseTheme: theme === "dark" ? dark : undefined,
                      elements: {
                        avatarBox: { width: "2.5rem", height: "2.5rem" },
                      },
                    }}
                  />
                </div>
              </SignedIn>
              <SignedOut>
                <Button asChild>
                  <Link href="/sign-in">Login</Link>
                </Button>
              </SignedOut>
            </div>
            {/*    <ThemeToggleButton /> */}
          </div>
        </div>
      </div>
    </>
  );
}
