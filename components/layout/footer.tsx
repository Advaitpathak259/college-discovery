import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white">

      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid md:grid-cols-4 gap-10">

          {/* Brand */}

          <div>
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-5 h-5 text-[#B4975A]" />

              <span className="font-semibold">
                CollegeDiscovery
              </span>
            </div>

            <p className="text-sm text-stone-500 leading-relaxed">
              Explore colleges, compare institutions,
              analyze cutoffs and make informed
              admission decisions.
            </p>
          </div>

          {/* Colleges */}

          <div>
            <h3 className="font-medium mb-4">
              Colleges
            </h3>

            <div className="space-y-2 text-sm text-stone-500">

              <Link
                href="/colleges"
                className="block hover:text-stone-900"
              >
                All Colleges
              </Link>

              <Link
                href="/compare"
                className="block hover:text-stone-900"
              >
                Compare Colleges
              </Link>

            </div>
          </div>

          {/* Exams */}

          <div>
            <h3 className="font-medium mb-4">
              Exams
            </h3>

            <div className="space-y-2 text-sm text-stone-500">

              <Link
                href="/exams"
                className="block hover:text-stone-900"
              >
                All Exams
              </Link>

              <Link
                href="/predictor"
                className="block hover:text-stone-900"
              >
                Rank Predictor
              </Link>

            </div>
          </div>

          {/* Legal */}

          <div>
            <h3 className="font-medium mb-4">
              Platform
            </h3>

            <div className="space-y-2 text-sm text-stone-500">

              <Link
                href="/about"
                className="block hover:text-stone-900"
              >
                About
              </Link>

              <Link
                href="/contact"
                className="block hover:text-stone-900"
              >
                Contact
              </Link>

            </div>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-stone-200 text-sm text-stone-500 flex flex-col md:flex-row justify-between gap-4">
          <p>
            © {new Date().getFullYear()} CollegeDiscovery.
          </p>

          <p>
            Built with Next.js, Prisma & PostgreSQL.
          </p>
        </div>

      </div>

    </footer>
  );
}