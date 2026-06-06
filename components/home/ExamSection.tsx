import Link from "next/link";
import { TiltCard } from "@/components/unlumen-ui/tilt-card"
const exams = [
  {
    name: "JEE Main",
    slug: "jee-main",
    colleges: "NITs • IIITs • GFTIs",
  },
  {
    name: "JEE Advanced",
    slug: "jee-advanced",
    colleges: "IIT Admissions",
  },
  {
    name: "BITSAT",
    slug: "bitsat",
    colleges: "BITS Pilani",
  },
  {
    name: "VITEEE",
    slug: "viteee",
    colleges: "VIT Campuses",
  },
  {
    name: "NEET",
    slug: "neet",
    colleges: "Medical Colleges",
  },
  {
    name: "CAT",
    slug: "cat",
    colleges: "IIMs & MBA Colleges",
  },
];

export default function ExamSection() {
  return (
    <section className="py-16 max-w-6xl mx-auto px-4"> 
      {/* max-w-6xl keeping everything centered and compact */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">
          Browse Colleges by Entrance Exam
        </h2>
        <p className="text-gray-500 mt-2">
          Explore colleges, cutoffs, placements and fees based on your exam.
        </p>
      </div>

      {/* Adjusted grid system from 6 cols to a maximum of 4 cols */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 w-full max-w-7xl mx-auto px-4">
        {exams.map((exam) => (
          <Link 
            key={exam.slug} 
            href={`/exams/${exam.slug}`}
            className="group h-full block" 
          >
            <TiltCard 
              title={exam.name} 
              badgeVariant="warning"
              className="h-full flex flex-col justify-between" 
              // Uses full height and pushes 'Explore' down if text lengths vary
            >
              <div className="flex flex-col gap-2 pt-2">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {exam.colleges}
                </p>
                
                <span className="text-sm font-medium text-blue-600 mt-4 inline-flex items-center group-hover:underline">
                  Explore →
                </span>
              </div>
            </TiltCard>
          </Link>
        ))}
      </div>
    </section>
  );
}