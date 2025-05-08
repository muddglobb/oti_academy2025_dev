"use client";

import { useState } from "react";
import Container from "@/components/container";
import { Button } from "../ui/button";
import Link from "next/link";
import Logo from "./logo";

const navbarItems = [
  { name: "About Us", href: "/about" },
  { name: "Programs", href: "/programs" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <main className="fixed inset-x-0 top-0 z-1000 backdrop-blur-md">
      <div className="bg-[#002B63] text-white text-center text-sm px-5 py-4">
        <div className="lg:hidden pt-10 w-full">
          <span className="text-left inline-block">
            <strong>Special Class Bundling</strong> berakhir setelah{" "}
            <strong>kuota terpenuhi</strong>, jangan sampai ketinggalan!
          </span>
        </div>
        <div className="absolute top-13 right-5 cursor-pointer lg:hidden">
          <a href="#kembali" className="text-white text-xl">
            →
          </a>
        </div>

        <div className="hidden lg:flex justify-center items-center gap-2">
          <span>
            <strong>Special Class Bundling</strong> berakhir setelah{" "}
            <strong>kuota terpenuhi </strong>, jangan sampai ketinggalan!
          </span>
          <Link
            href="/special-class"
            className="underline font-semibold hover:text-blue-300 transition"
          >
            Learn More →
          </Link>
        </div>
      </div>

      <Container className="flex-row items-center justify-between py-4">
        <div className="flex items-end">
          <Link href="/">
            <Logo />
          </Link>
        </div>
        <div className="flex items-end">
          <nav className="hidden lg:flex gap-4 items-center">
            {navbarItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-white text-base hover:bg-neutral-200/20 rounded-md lg:px-3 lg:py-2 active:font-bold"
              >
                {item.name}
              </a>
            ))}
            <Link
              href="/login"
              className="text-white text-base hover:bg-neutral-200/20 rounded-md lg:px-3 lg:py-2 active:font-bold"
            >
              Log In
            </Link>

            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </nav>

          <button
            onClick={toggleMenu}
            className="lg:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </Container>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 text-white flex flex-col justify-between p-6">
          <div className="flex justify-end">
            <button onClick={toggleMenu} aria-label="Close menu">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col gap-6 mt-10">
            <Link href="/">
              <span className="text-lg">Home</span>
            </Link>
            {navbarItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <span className="text-lg">{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3 mt-80">
            <Link href="/register">
              <Button className="w-full">Get Started</Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                className="w-full text-white border hover:bg-white hover:text-black"
              >
                Log In
              </Button>
            </Link>
          </div>
        </div>
      )}
    </main>
  );
};

export default Navbar;
