import Link from "next/link";
import  prisma  from "@/lib/prisma";

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

  const merged = {
    ...currentFilters,
    ...updates,
  };

  Object.entries(merged).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });

  return `/exams/${slug}?${params.toString()}`;
}

export default async function ExamDetailPage({
  params,
  searchParams,
}: Props) {
  const { slug } = await params;
  const filters = await searchParams;

  const exam = await prisma.exam.findUnique({
    where: {
      slug,
    },
  });

  if (!exam) {
    return (
      <div className="max-w-7xl mx-auto p-10">
        <h1 className="text-3xl font-bold">
          Exam Not Found
        </h1>
      </div>
    );
  }

  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const quotas = await prisma.quota.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const admissions = await prisma.admission.findMany({
    where: {
      examId: exam.id,

      ...(filters.category && {
        category: {
          name: filters.category,
        },
      }),

      ...(filters.quota && {
        quota: {
          name: filters.quota,
        },
      }),

      ...(filters.year && {
        year: Number(filters.year),
      }),
    },

    include: {
      category: true,
      quota: true,

      program: {
        include: {
          college: true,
        },
      },
    },

    orderBy: [
      {
        year: "desc",
      },
      {
        closingValue: "asc",
      },
    ],
  });

  const years = [...new Set(admissions.map((a) => a.year))]
    .sort((a, b) => b - a);

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">

      {/* Header */}

      <div className="mb-10">
        <h1 className="text-4xl font-bold">
          {exam.name} Cutoffs
        </h1>

        <p className="text-gray-500 mt-2">
          Explore colleges, branches and admission
          cutoffs through {exam.name}.
        </p>
      </div>

      {/* CATEGORY FILTER */}

      <div className="mb-8">
        <h2 className="font-semibold mb-3">
          Category
        </h2>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/exams/${slug}`}
            className="border px-4 py-2 rounded-lg"
          >
            All
          </Link>

          {categories.map((category) => (
            <Link
              key={category.id}
              href={createFilterUrl(
                slug,
                filters,
                {
                  category: category.name,
                }
              )}
              className={`border px-4 py-2 rounded-lg ${
                filters.category === category.name
                  ? "bg-black text-white"
                  : ""
              }`}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>

      {/* QUOTA FILTER */}

      <div className="mb-8">
        <h2 className="font-semibold mb-3">
          Quota
        </h2>

        <div className="flex flex-wrap gap-3">
          {quotas.map((quota) => (
            <Link
              key={quota.id}
              href={createFilterUrl(
                slug,
                filters,
                {
                  quota: quota.name,
                }
              )}
              className={`border px-4 py-2 rounded-lg ${
                filters.quota === quota.name
                  ? "bg-black text-white"
                  : ""
              }`}
            >
              {quota.name}
            </Link>
          ))}
        </div>
      </div>

      {/* YEAR FILTER */}

      <div className="mb-10">
        <h2 className="font-semibold mb-3">
          Year
        </h2>

        <div className="flex flex-wrap gap-3">
          {years.map((year) => (
            <Link
              key={year}
              href={createFilterUrl(
                slug,
                filters,
                {
                  year: String(year),
                }
              )}
              className={`border px-4 py-2 rounded-lg ${
                filters.year === String(year)
                  ? "bg-black text-white"
                  : ""
              }`}
            >
              {year}
            </Link>
          ))}
        </div>
      </div>

      {/* RESULTS */}

      <div className="mb-4">
        <h2 className="text-xl font-semibold">
          Results ({admissions.length})
        </h2>
      </div>

      <div className="overflow-x-auto border rounded-xl">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>
              <th className="p-4 text-left">
                College
              </th>

              <th className="p-4 text-left">
                Program
              </th>

              <th className="p-4 text-left">
                Category
              </th>

              <th className="p-4 text-left">
                Quota
              </th>

              <th className="p-4 text-left">
                Opening Rank
              </th>

              <th className="p-4 text-left">
                Closing Rank
              </th>

              <th className="p-4 text-left">
                Year
              </th>
            </tr>

          </thead>

          <tbody>

            {admissions.map((admission) => (
              <tr
                key={admission.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-4">

                  <Link
                    href={`/college/${admission.program.college.slug}`}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    {admission.program.college.shortName ??
                      admission.program.college.name}
                  </Link>

                </td>

                <td className="p-4">
                  {admission.program.name}
                </td>

                <td className="p-4">
                  {admission.category.name}
                </td>

                <td className="p-4">
                  {admission.quota.name}
                </td>

                <td className="p-4">
                  {admission.openingValue}
                </td>

                <td className="p-4">
                  {admission.closingValue}
                </td>

                <td className="p-4">
                  {admission.year}
                </td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>
    </main>
  );
}