import Link from "next/link";
import prisma from "@/lib/prisma";
import { 
  Filter, 
  Layers, 
  UserCheck, 
  Calendar, 
  GraduationCap, 
  MapPin, 
  TrendingUp, 
  ArrowUpRight 
} from "lucide-react";

type Props = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    category?: string;
    quota?: string;
    year?: string;
  }>;
};

function createFilterUrl(
  slug: string,
  currentFilters: {
    category?: string;
    quota?: string;
    year?: string;
  },
  updates: Record<string, string | undefined>
) {
  const params = new URLSearchParams();
  const merged = { ...currentFilters, ...updates };

  Object.entries(merged).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  return `/exams/${slug}?${params.toString()}`;
}

export default async function ExamDetailPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const filters = await searchParams;

  const exam = await prisma.exam.findUnique({
    where: { slug },
  });

  if (!exam) {
    return (
      <div className="min-h-screen w-full bg-[#FDFBF7] flex items-center justify-center font-sans">
        <div className="text-center p-8 border border-stone-200/60 bg-white rounded-2xl max-w-sm shadow-sm">
          <h1 className="text-xl font-semibold text-stone-900">Exam Not Found</h1>
          <p className="text-stone-400 text-sm mt-2">The metric endpoint you are looking for does not exist.</p>
          <Link href="/" className="mt-5 inline-block text-xs font-medium px-4 py-2 bg-stone-950 text-white rounded-lg">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const [categories, quotas, admissions] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.quota.findMany({ orderBy: { name: "asc" } }),
    prisma.admission.findMany({
      where: {
        examId: exam.id,
        ...(filters.category && { category: { name: filters.category } }),
        ...(filters.quota && { quota: { name: filters.quota } }),
        ...(filters.year && { year: Number(filters.year) }),
      },
      include: {
        category: true,
        quota: true,
        program: { include: { college: true } },
      },
      orderBy: [{ year: "desc" }, { closingValue: "asc" }],
    }),
  ]);

  const years = [...new Set(admissions.map((a) => a.year))].sort((a, b) => b - a);

  // Derive dashboard insights safely
  const totalAllocations = admissions.length;
  const topClosingRank = admissions[0]?.closingValue ?? "N/A";
  const floorOpeningRank = admissions[admissions.length - 1]?.openingValue ?? "N/A";

  return (
    <div className="min-h-screen w-full bg-[#FDFBF7] text-stone-900 font-sans antialiased bg-[radial-gradient(#F3EDE0_1px,transparent_1px)] [background-size:24px_24px]">
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        
        {/* --- 1. DASHBOARD HERO HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-stone-200/60 pb-8 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#B4975A]/10 text-[#B4975A] text-xs font-medium mb-3">
              <TrendingUp className="w-3.5 h-3.5" />
              Cutoff Engine Analytics
            </div>
            <h1 className="text-3xl md:text-5xl font-sans tracking-tight text-stone-950 font-normal">
              {exam.name} 
            </h1>
            <p className="text-stone-500 text-sm md:text-base mt-2 max-w-2xl leading-relaxed">
              Explore hyper-detailed historical trends, course structural openings, and real-time eligibility indexes computed across affiliated universities.
            </p>
          </div>

         
        </div>

        {/* --- 2. GRID CONTROL SYSTEM INTERFACE --- */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Left Controls/Filters Panel */}
          <div className="lg:col-span-1 space-y-6 bg-white/70 backdrop-blur-md border border-stone-200/60 p-5 rounded-2xl shadow-sm sticky top-6">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-200/40 text-stone-900 font-medium text-sm">
              <Filter className="w-4 h-4 text-[#B4975A]" />
              Control Matrix
            </div>

            {/* CATEGORY FILTER */}
            <div>
              <label className="text-[11px] font-bold tracking-widest text-stone-400 uppercase flex items-center gap-1.5 mb-2.5">
                <Layers className="w-3 h-3" /> Category
              </label>
              <div className="flex flex-col gap-1.5">
                <Link
                  href={`/exams/${slug}`}
                  className={`text-xs px-3 py-2 rounded-lg transition-colors border ${
                    !filters.category 
                      ? "bg-stone-950 text-white border-stone-950 shadow-sm" 
                      : "bg-white/50 text-stone-600 border-stone-200/60 hover:bg-stone-50"
                  }`}
                >
                  All Categories
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={createFilterUrl(slug, filters, { category: cat.name })}
                    className={`text-xs px-3 py-2 rounded-lg transition-all border ${
                      filters.category === cat.name
                        ? "bg-stone-950 text-white border-stone-950 font-medium shadow-sm"
                        : "bg-white/50 text-stone-600 border-stone-200/60 hover:bg-stone-50"
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* QUOTA FILTER */}
            <div className="pt-4 border-t border-stone-200/40">
              <label className="text-[11px] font-bold tracking-widest text-stone-400 uppercase flex items-center gap-1.5 mb-2.5">
                <UserCheck className="w-3 h-3" /> Quota Allocations
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {quotas.map((q) => (
                  <Link
                    key={q.id}
                    href={createFilterUrl(slug, filters, { quota: q.name })}
                    className={`text-center text-xs px-2 py-2 rounded-lg border truncate transition-all ${
                      filters.quota === q.name
                        ? "bg-stone-950 text-white border-stone-950 font-medium shadow-sm"
                        : "bg-white/50 text-stone-600 border-stone-200/60 hover:bg-stone-50"
                    }`}
                  >
                    {q.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* YEAR FILTER */}
            <div className="pt-4 border-t border-stone-200/40">
              <label className="text-[11px] font-bold tracking-widest text-stone-400 uppercase flex items-center gap-1.5 mb-2.5">
                <Calendar className="w-3 h-3" /> Admission Cycle
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {years.map((yr) => (
                  <Link
                    key={yr}
                    href={createFilterUrl(slug, filters, { year: String(yr) })}
                    className={`text-center text-xs px-2 py-2 rounded-lg border transition-all ${
                      filters.year === String(yr)
                        ? "bg-stone-950 text-white border-stone-950 font-medium shadow-sm"
                        : "bg-white/50 text-stone-600 border-stone-200/60 hover:bg-stone-50"
                    }`}
                  >
                    {yr}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* --- 3. RESULTS DISPLAY SEGMENT --- */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-base font-medium text-stone-800">
               ({totalAllocations})
              </h2>
              {Object.keys(filters).length > 0 && (
                <Link href={`/exams/${slug}`} className="text-xs text-[#B4975A] hover:underline font-medium">
                  Reset Parameters
                </Link>
              )}
            </div>

            {totalAllocations > 0 ? (
              <div className="overflow-hidden border border-stone-200/60 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-stone-50/70 border-b border-stone-200/60 text-stone-400 text-[11px] font-bold tracking-wider uppercase">
                        <th className="p-4 pl-6">Institution</th>
                        <th className="p-4">Academic Program</th>
                        <th className="p-4">Demographics</th>
                        <th className="p-4 text-right">Opening Range</th>
                        <th className="p-4 text-right pr-6">Closing Boundary</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 font-sans text-sm text-stone-700">
                      {admissions.map((admission) => (
                        <tr key={admission.id} className="hover:bg-stone-50/50 group transition-colors">
                          
                          {/* College Anchor Row */}
                          <td className="p-4 pl-6 max-w-xs">
                            <Link
                              href={`/college/${admission.program.college.slug}`}
                              className="inline-flex items-center gap-1.5 text-stone-950 font-medium hover:text-[#B4975A] group-hover:underline transition-colors"
                            >
                              <GraduationCap className="w-4 h-4 text-stone-400 shrink-0" />
                              <span className="truncate">
                                {admission.program.college.shortName ?? admission.program.college.name}
                              </span>
                              <ArrowUpRight className="w-3 h-3 text-stone-300 opacity-0 group-hover:opacity-100 group-hover:text-[#B4975A] transition-all" />
                            </Link>
                            <span className="flex items-center gap-1 text-[11px] text-stone-400 mt-0.5">
                              <MapPin className="w-3 h-3" />
                              {admission.program.college.city}
                            </span>
                          </td>

                          {/* Program details */}
                          <td className="p-4">
                            <span className="font-normal text-stone-900 block max-w-xs truncate">
                              {admission.program.name}
                            </span>
                            <span className="inline-block px-1.5 py-0.5 bg-stone-100 text-[10px] text-stone-500 rounded font-medium mt-1">
                              Cycle {admission.year}
                            </span>
                          </td>

                          {/* Quota & Categories Tags */}
                          <td className="p-4 space-y-1">
                            <div className="text-xs text-stone-800 font-medium">
                              {admission.category.name}
                            </div>
                            <div className="text-[11px] text-stone-400 font-normal">
                              {admission.quota.name} Quota
                            </div>
                          </td>

                          {/* Opening Metric */}
                          <td className="p-4 text-right font-mono text-stone-600">
                            {admission?.openingValue?.toLocaleString()}
                          </td>

                          {/* Closing Boundary Metric Highlighted */}
                          <td className="p-4 text-right pr-6 font-mono font-medium text-stone-950">
                            <span className="px-2 py-1 bg-stone-50 border border-stone-200/50 rounded-lg group-hover:bg-white group-hover:border-stone-200 transition-colors">
                              {admission?.closingValue?.toLocaleString()}
                            </span>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* High-end Dashboard Empty State Context */
              <div className="border border-dashed border-stone-200 rounded-2xl bg-white/40 p-16 text-center">
                <div className="size-12 rounded-xl bg-stone-100 flex items-center justify-center text-stone-400 mx-auto mb-4">
                  <Filter className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-medium text-stone-900">No records found</h3>
                <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
                  Try adjusting your structural category configurations or choose an alternate year index.
                </p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}