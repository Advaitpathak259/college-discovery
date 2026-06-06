import  prisma  from "@/lib/prisma";

type Props = {
  searchParams: Promise<{
    college1?: string;
    college2?: string;
  }>;
};

export default async function ComparePage({
  searchParams,
}: Props) {
  const params = await searchParams;

  const colleges = await prisma.college.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const college1 = params.college1
    ? await prisma.college.findUnique({
        where: {
          slug: params.college1,
        },
        include: {
          stats: true,
          rankings: true,
        },
      })
    : null;

  const college2 = params.college2
    ? await prisma.college.findUnique({
        where: {
          slug: params.college2,
        },
        include: {
          stats: true,
          rankings: true,
        },
      })
    : null;

  const stats1 =
    college1?.stats.sort(
      (a, b) => b.year - a.year
    )[0];

  const stats2 =
    college2?.stats.sort(
      (a, b) => b.year - a.year
    )[0];

  return (
    <main className="max-w-7xl mx-auto px-6 py-10 min-h-[calc(100vh-200px)]">

      <h1 className="text-4xl font-bold mb-8">
        Compare Colleges
      </h1>

      {/* Form */}

      <form className="grid md:grid-cols-2 gap-4 mb-10">

        <select
          name="college1"
          defaultValue={params.college1}
          className="border rounded-xl p-3"
        >
          <option value="">
            Select First College
          </option>

          {colleges.map((college) => (
            <option
              key={college.id}
              value={college.slug}
            >
              {college.shortName ??
                college.name}
            </option>
          ))}
        </select>

        <select
          name="college2"
          defaultValue={params.college2}
          className="border rounded-xl p-3"
        >
          <option value="">
            Select Second College
          </option>

          {colleges.map((college) => (
            <option
              key={college.id}
              value={college.slug}
            >
              {college.shortName ??
                college.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="
            md:col-span-2
            bg-black
            text-white
            rounded-xl
            py-3
          "
        >
          Compare
        </button>

      </form>

      {/* Comparison */}

      {college1 && college2 && (
        <div className="overflow-x-auto">

          <table className="w-full border rounded-xl">

            <thead>

              <tr className="bg-stone-100">

                <th className="p-4 text-left">
                  Metric
                </th>

                <th className="p-4 text-left">
                  {college1.shortName ??
                    college1.name}
                </th>

                <th className="p-4 text-left">
                  {college2.shortName ??
                    college2.name}
                </th>

              </tr>

            </thead>

            <tbody>

              <ComparisonRow
                label="Established"
                value1={college1.establishedYear}
                value2={college2.establishedYear}
              />

              <ComparisonRow
                label="Ownership"
                value1={college1.ownershipType}
                value2={college2.ownershipType}
              />

              <ComparisonRow
                label="Lowest Fees"
                value1={stats1?.lowestFees
                  ? `₹${stats1.lowestFees.toLocaleString()}`
                  : "-"}
                value2={stats2?.lowestFees
                  ? `₹${stats2.lowestFees.toLocaleString()}`
                  : "-"}
              />

              <ComparisonRow
                label="Highest Fees"
                value1={stats1?.highestFees
                  ? `₹${stats1.highestFees.toLocaleString()}`
                  : "-"}
                value2={stats2?.highestFees
                  ? `₹${stats2.highestFees.toLocaleString()}`
                  : "-"}
              />

              <ComparisonRow
                label="Average Package"
                value1={stats1?.averagePackage
                  ? `${stats1.averagePackage} LPA`
                  : "-"}
                value2={stats2?.averagePackage
                  ? `${stats2.averagePackage} LPA`
                  : "-"}
              />

              <ComparisonRow
                label="Rating"
                value1={stats1?.overallRating}
                value2={stats2?.overallRating}
              />

              <ComparisonRow
                label="Reviews"
                value1={stats1?.reviewCount}
                value2={stats2?.reviewCount}
              />

              <ComparisonRow
                label="NIRF Rank"
                value1={
                  college1.rankings.find(
                    (r) => r.source === "NIRF"
                  )?.rank ?? "-"
                }
                value2={
                  college2.rankings.find(
                    (r) => r.source === "NIRF"
                  )?.rank ?? "-"
                }
              />

            </tbody>

          </table>

        </div>
      )}

    </main>
  );
}

function ComparisonRow({
  label,
  value1,
  value2,
}: {
  label: string;
  value1: any;
  value2: any;
}) {
  return (
    <tr className="border-t">
      <td className="p-4 font-medium">
        {label}
      </td>

      <td className="p-4">
        {value1 ?? "-"}
      </td>

      <td className="p-4">
        {value2 ?? "-"}
      </td>
    </tr>
  );
}