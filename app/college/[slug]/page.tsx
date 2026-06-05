import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card12";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

async function getCollege(slug: string) {
  const college = await prisma.college.findUnique({
    where: { slug },
    include: {
      state: true,
      programs: {
        include: {
          fees: { orderBy: { year: "asc" } },
          admissions: {
            include: { exam: true, category: true, quota: true },
          },
          placements: { orderBy: { year: "asc" } },
        },
      },
      placements: { orderBy: { year: "asc" } },
      rankings: { orderBy: { year: "desc" } },
      reviews: true,
      stats: true,
    },
  });
  return college;
}

export default async function CollegePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const college = await getCollege(slug);

  if (!college) {
    notFound();
  }

  return (
    // Premium warm-cream background matching the Kinto design vibe
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 selection:bg-stone-200 antialiased bg-[radial-gradient(#F5F0E6_1px,transparent_1px)] [background-size:24px_24px]">
      <main className="max-w-5xl mx-auto px-6 py-16 space-y-12">
        
        {/* ================= HEADER SECTION ================= */}
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          {college.rankings?.[0] && (
            <Badge variant="outline" className="border-amber-700/20 bg-amber-50/50 text-amber-800 font-medium px-3 py-1 tracking-wide">
              {college.rankings[0].source} Rank #{college.rankings[0].rank}
            </Badge>
          )}
          
          {/* Using an elegant editorial Serif look for the prominent header */}
          <h1 className="text-4xl md:text-5xl font-serif font-normal tracking-tight text-stone-950">
            {college.name}
          </h1>

          <p className="text-base text-stone-500 font-medium tracking-wide uppercase text-xs">
            {college.city}, {college.state.name} &bull; Established {college.establishedYear}
          </p>

          <div className="flex justify-center gap-2 pt-2">
            <Badge className="bg-stone-900 text-stone-100 hover:bg-stone-800 rounded-full px-4 py-1">
              {college.ownershipType} Institution
            </Badge>
          </div>
        </section>

        {/* ================= OVERVIEW CARD ================= */}
        <Card className="border-stone-200/60 bg-white/70 backdrop-blur-md shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-stone-900">Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-stone-600 leading-relaxed font-normal">
              {college.description || "No dynamic overview description available for this institution at this moment."}
            </p>
          </CardContent>
        </Card>

        {/* ================= TAB NAVIGATION FOR INFO ================= */}
        <Tabs defaultValue="programs" className="w-full space-y-8">
          <div className="flex justify-center">
            <TabsList className="bg-stone-200/50 p-1 rounded-full border border-stone-200/40">
              <TabsTrigger value="programs" className="rounded-full px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">Programs</TabsTrigger>
              <TabsTrigger value="fees" className="rounded-full px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">Fees & Cutoffs</TabsTrigger>
              <TabsTrigger value="placements" className="rounded-full px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">Placements</TabsTrigger>
            </TabsList>
          </div>

          {/* ----- PROGRAMS TAB ----- */}
          <TabsContent value="programs" className="space-y-6 outliner-none">
            <div className="grid sm:grid-cols-2 gap-4">
              {college.programs.map((program) => (
                <Card key={program.id} className="border-stone-200/60 bg-white/60 hover:bg-white transition-colors duration-200 rounded-xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-sans font-semibold text-stone-900">{program.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-stone-600 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-stone-400">Duration</span>
                      <span className="font-medium text-stone-800">{program.durationYears} Years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Seat Capacity</span>
                      <span className="font-medium text-stone-800">{program.seats} seats</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ----- FEES & CUTOFFS TAB ----- */}
          <TabsContent value="fees" className="space-y-10 focus-visible:outline-none">
            {college.programs.map((program) => (
              <div key={program.id} className="space-y-4">
                <h3 className="text-xl font-serif font-medium text-stone-900 border-b border-stone-200/60 pb-2">
                  {program.name} Details
                </h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Fee Sub-table */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400">Fee Structure</h4>
                    <div className="rounded-xl border border-stone-200/60 bg-white overflow-hidden">
                      <Table>
                        <TableHeader className="bg-stone-50">
                          <TableRow>
                            <TableHead className="w-[100px]">Year</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {program.fees.map((fee) => (
                            <TableRow key={fee.id} className="hover:bg-stone-50/50">
                              <TableCell className="font-medium">Year {fee.year}</TableCell>
                              <TableCell className="text-right font-semibold">₹{fee.amount.toLocaleString()}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* Cutoff Sub-table */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400">Entrance Cutoffs</h4>
                    <div className="rounded-xl border border-stone-200/60 bg-white overflow-hidden">
                      <Table>
                        <TableHeader className="bg-stone-50">
                          <TableRow>
                            <TableHead>Exam</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Opening</TableHead>
                            <TableHead className="text-right">Closing</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {program.admissions.map((admission) => (
                            <TableRow key={admission.id} className="hover:bg-stone-50/50">
                              <TableCell className="font-medium">{admission.exam.name}</TableCell>
                              <TableCell><Badge variant="secondary" className="bg-stone-100 text-stone-700 font-normal">{admission.category.name}</Badge></TableCell>
                              <TableCell className="text-right font-mono text-xs">{admission.openingValue}</TableCell>
                              <TableCell className="text-right font-mono text-xs font-semibold">{admission.closingValue}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          {/* ----- PLACEMENTS TAB ----- */}
          <TabsContent value="placements" className="focus-visible:outline-none">
            <Card className="border-stone-200/60 bg-white overflow-hidden rounded-2xl">
              <Table>
                <TableHeader className="bg-stone-50">
                  <TableRow>
                    <TableHead className="py-4 px-6">Academic Year</TableHead>
                    <TableHead className="py-4">Average Package</TableHead>
                    <TableHead className="py-4">Median Package</TableHead>
                    <TableHead className="py-4 text-right px-6">Highest Package</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {college.placements.map((placement) => (
                    <TableRow key={placement.id} className="hover:bg-stone-50/40 transition-colors">
                      <TableCell className="py-4 px-6 font-medium text-stone-900">{placement.year}</TableCell>
                      <TableCell className="py-4 text-stone-700 font-medium">{placement.averagePackage} LPA</TableCell>
                      <TableCell className="py-4 text-stone-600">{placement.medianPackage} LPA</TableCell>
                      <TableCell className="py-4 text-right px-6 font-serif font-semibold text-stone-950">{placement.highestPackage} LPA</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}