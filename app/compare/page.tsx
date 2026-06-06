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
        rankings: true,
        placements: true,
        reviews: true,
        programs: {
          include: {
            fees: true,
            admissions: true,
          },
        },
      },
    })
  : null;

const college2 = params.college2
  ? await prisma.college.findUnique({
      where: {
        slug: params.college2,
      },
      include: {
        rankings: true,
        placements: true,
        reviews: true,
        programs: {
          include: {
            fees: true,
            admissions: true,
          },
        },
      },
    })
  : null;

const latestPlacement1 =
  college1?.placements.sort(
    (a, b) => b.year - a.year
  )[0];

const latestPlacement2 =
  college2?.placements.sort(
    (a, b) => b.year - a.year
  )[0];

const fees1 =
  college1?.programs.flatMap((p) =>
    p.fees.map((f) => f.amount)
  ) ?? [];

const fees2 =
  college2?.programs.flatMap((p) =>
    p.fees.map((f) => f.amount)
  ) ?? [];

const lowestFees1 =
  fees1.length > 0
    ? Math.min(...fees1)
    : null;

const lowestFees2 =
  fees2.length > 0
    ? Math.min(...fees2)
    : null;

const highestFees1 =
  fees1.length > 0
    ? Math.max(...fees1)
    : null;

const highestFees2 =
  fees2.length > 0
    ? Math.max(...fees2)
    : null;

const totalSeats1 =
  college1?.programs.reduce(
    (sum, p) => sum + (p.seats ?? 0),
    0
  ) ?? 0;

const totalSeats2 =
  college2?.programs.reduce(
    (sum, p) => sum + (p.seats ?? 0),
    0
  ) ?? 0;

const programCount1 =
  college1?.programs.length ?? 0;

const programCount2 =
  college2?.programs.length ?? 0;

const latestRank1 =
  college1?.rankings.sort(
    (a, b) => b.year - a.year
  )[0];

const latestRank2 =
  college2?.rankings.sort(
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
    label="City"
    value1={college1.city}
    value2={college2.city}
  />

  <ComparisonRow
    label="Ownership"
    value1={college1.ownershipType}
    value2={college2.ownershipType}
  />

  <ComparisonRow
    label="Programs Offered"
    value1={programCount1}
    value2={programCount2}
  />

  <ComparisonRow
    label="Total Seats"
    value1={totalSeats1}
    value2={totalSeats2}
  />

  <ComparisonRow
    label="Lowest Fees"
    value1={
      lowestFees1
        ? `₹${lowestFees1.toLocaleString()}`
        : "-"
    }
    value2={
      lowestFees2
        ? `₹${lowestFees2.toLocaleString()}`
        : "-"
    }
  />

  <ComparisonRow
    label="Highest Fees"
    value1={
      highestFees1
        ? `₹${highestFees1.toLocaleString()}`
        : "-"
    }
    value2={
      highestFees2
        ? `₹${highestFees2.toLocaleString()}`
        : "-"
    }
  />

  <ComparisonRow
    label="Average Package"
    value1={
      latestPlacement1?.averagePackage
        ? `${latestPlacement1.averagePackage} LPA`
        : "-"
    }
    value2={
      latestPlacement2?.averagePackage
        ? `${latestPlacement2.averagePackage} LPA`
        : "-"
    }
  />

  <ComparisonRow
    label="Median Package"
    value1={
      latestPlacement1?.medianPackage
        ? `${latestPlacement1.medianPackage} LPA`
        : "-"
    }
    value2={
      latestPlacement2?.medianPackage
        ? `${latestPlacement2.medianPackage} LPA`
        : "-"
    }
  />

  <ComparisonRow
    label="Highest Package"
    value1={
      latestPlacement1?.highestPackage
        ? `${latestPlacement1.highestPackage} LPA`
        : "-"
    }
    value2={
      latestPlacement2?.highestPackage
        ? `${latestPlacement2.highestPackage} LPA`
        : "-"
    }
  />

  <ComparisonRow
    label="Placement Rate"
    value1={
      latestPlacement1?.placementRate
        ? `${latestPlacement1.placementRate}%`
        : "-"
    }
    value2={
      latestPlacement2?.placementRate
        ? `${latestPlacement2.placementRate}%`
        : "-"
    }
  />

  <ComparisonRow
    label="NIRF Rank"
    value1={latestRank1?.rank ?? "-"}
    value2={latestRank2?.rank ?? "-"}
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
  value1: React.ReactNode;
  value2: React.ReactNode;
}) {
  return (
    <tr className="border-t hover:bg-stone-50 transition-colors">
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