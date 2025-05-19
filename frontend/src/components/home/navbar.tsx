"use client";

import { useState } from "react";
import Container from "@/components/container";
import { Button } from "../ui/button";
import Link from "next/link";
import Logo from "./logo";
import { ArrowRight } from "lucide-react";

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
    <main className="w-full fixed z-10 backdrop-blur-md">
      <div className="bg-[#06163c] text-white text-center text-sm px-5 py-4">
        {/* <div className="lg:hidden w-[90%] flex items-center justify-between">
          <span className="text-left inline-block">
            <strong>Special Class Bundling</strong> berakhir setelah{" "}
            <strong>kuota terpenuhi</strong>, jangan sampai ketinggalan!
          </span>

          <ArrowRight />
        </div> */}
        {/* <div className="absolute top-13 right-5 cursor-pointer lg:hidden">
          <a href="#kembali" className="text-white text-xl">
            →
          </a>
        </div> */}

        <div className="flex justify-center items-center gap-2">
          <span>
            <strong>Special Class Bundling</strong> berakhir setelah{" "}
            <strong>kuota terpenuhi </strong>, jangan sampai ketinggalan!
          </span>
          <button>
            <Link
              href="/programs"
              className="hidden lg:flex underline font-semibold hover:text-blue-300 transition items-center"
            >
              Learn More
              <ArrowRight />
            </Link>
          </button>

          <button>
            <Link
              href="/programs"
              className="lg:hidden underline font-semibold hover:text-blue-300 transition"
            >
              <ArrowRight />
            </Link>
          </button>
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
        <div className="fixed top-0 left-0 w-1/4 h-screen z-[1000] bg-[#050c1a] text-white flex flex-col justify-between px-6 py-8">
          <div className="flex justify-end">
            <button onClick={toggleMenu}>
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

          <nav className="flex flex-col gap-2 mb-80">
            <Link href="/">
              <span className="text-lg">Home</span>
            </Link>
            {navbarItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <span className="text-lg">{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3">
            <Link href="/register">
              <Button className="w-full bg-[#113EA7] text-white hover:bg-[#0d2d7a]">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                className="w-full bg-white text-[#113EA7] border border-[#113EA7] hover:bg-[#113EA7] hover:text-white"
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
