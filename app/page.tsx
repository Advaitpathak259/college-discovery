import SearchBar from "@/component/SearchBar";

export default function HomePage() {
  return (
    <main className="max-w-5xl mx-auto p-10">
      <h1 className="text-4xl font-bold mb-6">
        College Discovery Platform
      </h1>

      <SearchBar />
    </main>
  );
}