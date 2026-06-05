import Link from "next/link";

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
    <section className="py-16">
      <div className="mb-8">
        <h2 className="text-3xl font-bold">
          Browse Colleges by Entrance Exam
        </h2>

        <p className="text-gray-500 mt-2">
          Explore colleges, cutoffs, placements and fees
          based on your exam.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
        {exams.map((exam) => (
          <Link
            key={exam.slug}
            href={`/exams/${exam.slug}`}
            className="
              group
              border
              rounded-2xl
              p-5
              hover:shadow-lg
              transition-all
              hover:-translate-y-1
              bg-white
            "
          >
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-lg">
                {exam.name}
              </h3>

              <p className="text-sm text-gray-500">
                {exam.colleges}
              </p>

              <span className="text-sm font-medium text-blue-600 mt-2">
                Explore →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}