"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ModeToggle } from "../ui/mode-toggler";
import { Button } from "../ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function NavBar() {
  const [navbar, setNavbar] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div>
      <nav className="w-full bg-black fixed top-0 left-0 right-0 z-10">
        <div className="justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8">
          <div className="flex items-center justify-between py-3 md:py-5 md:justify-between">
            {/* LOGO */}
            <Link href="/">
              <h2 className="text-2xl text-cyan-600 font-bold cursor-pointer">
                RAZIEH
              </h2>
            </Link>
            {/* HAMBURGER BUTTON FOR MOBILE */}
            <div className="flex items-center">
              <div className="md:hidden">
                <button
                  className="p-2 text-gray-700 rounded-md outline-none focus:border-gray-400 focus:border"
                  onClick={() => setNavbar(!navbar)}
                >
                  {navbar ? (
                    <Image
                      src="/close.svg"
                      width={30}
                      height={30}
                      alt="close"
                    />
                  ) : (
                    <Image
                      src="/hamburger-menu.svg"
                      width={30}
                      height={30}
                      alt="menu"
                    />
                  )}
                </button>
              </div>
              {/* Buttons and ModeToggle for all screens, but only visible on small screens next to hamburger */}
              <div className="flex items-center space-x-3 ml-4 md:hidden">
                {session !== null ? (
                  <Button asChild>
                    <Link href="/create">Create</Link>
                  </Button>
                ) : null}
                <Button
                  asChild
                  onClick={session !== null ? () => signOut() : () => signIn()}
                >
                  <Link href="#login">
                    {session !== null ? "Logout" : "Login"}
                  </Link>
                </Button>
                <ModeToggle />
              </div>
            </div>
          </div>
          {/* Conditional Menu Items */}
          <div
            className={`flex-1 justify-self-center pb-3 mt-8 md:flex md:pb-0 md:mt-0 ${
              navbar ? "block" : "hidden"
            } md:block`}
          >
            <ul className="items-center justify-center space-x-4 md:flex md:flex-row md:flex-1">
              {/* Menu Items */}
              <li className="text-xl text-white py-4 px-6 text-center hover:bg-purple-600 md:hover:text-purple-600 md:hover:bg-transparent">
                <Link href="#about" onClick={() => setNavbar(false)}>
                  About
                </Link>
              </li>
              <li className="text-xl text-white py-4 px-6 text-center hover:bg-purple-600 md:hover:text-purple-600 md:hover:bg-transparent">
                <Link href="/blogs" onClick={() => setNavbar(false)}>
                  Blogs
                </Link>
              </li>
              <li className="text-xl text-white py-4 px-6 text-center hover:bg-purple-600 md:hover:text-purple-600 md:hover:bg-transparent">
                <Link href="#projects" onClick={() => setNavbar(false)}>
                  Projects
                </Link>
              </li>
              <li className="text-xl text-white py-4 px-6 text-center hover:bg-purple-600 md:hover:text-purple-600 md:hover:bg-transparent">
                <Link href="#contact" onClick={() => setNavbar(false)}>
                  Contact
                </Link>
              </li>
            </ul>
            {/* Buttons and ModeToggle for larger screens, aligned to the right */}
            <div className="hidden md:flex items-center space-x-3">
              {session !== null ? (
                <Button asChild>
                  <Link href="/create">Create</Link>
                </Button>
              ) : null}
              <Button
                asChild
                onClick={session !== null ? () => signOut() : () => signIn()}
              >
                <Link href="#login">
                  {session !== null ? "Logout" : "Login"}
                </Link>
              </Button>
              <ModeToggle />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
export default NavBar;
