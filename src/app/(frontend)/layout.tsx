import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import NextAuthProvider from "@/providers/next-auth-provider";
import { cn } from "@/lib/utils";
import GlobalState from "@/context";
import NavBar from "@/components/custom/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Personal Blog",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        {" "}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextAuthProvider>
            <GlobalState>
              <NavBar />
              {children}
            </GlobalState>
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}