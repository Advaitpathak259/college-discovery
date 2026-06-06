import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">

        {/* Logo */}

        <Link
          href="/"
          className="flex items-center gap-2"
        >
          <GraduationCap className="w-6 h-6 text-[#B4975A]" />

          <span className="font-semibold text-lg text-stone-900">
            CollegeDiscovery
          </span>
        </Link>

        {/* Nav Links */}

        <nav className="hidden md:flex items-center gap-8">

          <Link
            href="/colleges"
            className="text-sm text-stone-600 hover:text-stone-950 transition-colors"
          >
            Colleges
          </Link>

          <Link
            href="/exams"
            className="text-sm text-stone-600 hover:text-stone-950 transition-colors"
          >
            Exams
          </Link>

          <Link
            href="/compare"
            className="text-sm text-stone-600 hover:text-stone-950 transition-colors"
          >
            Compare
          </Link>

          <Link
            href="/predictor"
            className="text-sm text-stone-600 hover:text-stone-950 transition-colors"
          >
            Predictor
          </Link>

        </nav>

        {/* CTA */}

        <Link
          href="/colleges"
          className="
            hidden md:flex
            items-center
            px-4
            py-2
            rounded-xl
            bg-stone-950
            text-white
            text-sm
            font-medium
            hover:opacity-90
            transition
          "
        >
          Explore Colleges
        </Link>

      </div>
    </header>
  );
}