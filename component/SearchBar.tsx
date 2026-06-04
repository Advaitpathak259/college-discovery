"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface College {
  id: string;
  name: string;
  slug: string;
  city: string;
  shortName?: string;
}

export default function SearchBar() {
  const [search, setSearch] = useState("");
  const [colleges, setColleges] = useState<College[]>([]);

  useEffect(() => {
    const fetchColleges = async () => {
      if (!search.trim()) {
        setColleges([]);
        return;
      }

      const res = await fetch(
        `/api/colleges?search=${search}`
      );

      const data = await res.json();

      setColleges(data);
    };

    fetchColleges();
  }, [search]);

  return (
    <div className="w-full">
      <input
        type="text"
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        placeholder="Search IIT Bombay, NIT Trichy..."
        className="w-full border rounded-lg p-4"
      />

      <div className="mt-4 space-y-2">
        {colleges.map((college) => (
          <Link
            key={college.id}
            href={`/college/${college.slug}`}
            className="block border rounded-lg p-4 hover:bg-gray-50"
          >
            <h3 className="font-semibold">
              {college.shortName || college.name}
            </h3>

            <p className="text-sm text-gray-500">
              {college.city}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}