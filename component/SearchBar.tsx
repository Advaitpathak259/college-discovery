"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaviconSearch } from "@/components/unlumen-ui/favicon-search";

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchColleges = async () => {
      if (!search.trim()) {
        setColleges([]);
        return;
      }

      try {
        setLoading(true);

        const res = await fetch(
          `/api/colleges?search=${encodeURIComponent(search)}`
        );

        const data = await res.json();
        setColleges(data);
      } catch (error) {
        console.error("Failed to fetch colleges:", error);
        setColleges([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchColleges, 300); // debounce

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="w-full space-y-4">
      <FaviconSearch
        value={search}
        placeholder="Search for colleges..."
        onChange={setSearch}
        onSearch={(value) => {
          console.log("Searching:", value);
        }}
      />

      {loading && (
        <div className="text-sm text-muted-foreground">
          Searching colleges...
        </div>
      )}

      {!loading && colleges.length > 0 && (
        <div className="space-y-2">
          {colleges.map((college) => (
            <Link
              key={college.id}
              href={`/college/${college.slug}`}
              className="block rounded-lg border p-4 transition-colors hover:bg-muted"
            >
              <h3 className="font-semibold">
                {college.shortName || college.name}
              </h3>

              <p className="text-sm text-muted-foreground">
                {college.city}
              </p>
            </Link>
          ))}
        </div>
      )}

      {!loading &&
        search.trim() &&
        colleges.length === 0 && (
          <div className="text-sm text-muted-foreground">
            No colleges found.
          </div>
        )}
    </div>
  );
}