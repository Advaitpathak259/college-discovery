import Link from "next/link";

async function getCollege(slug: string) {
  const res = await fetch(
    `http://localhost:3000/api/colleges/${slug}`,
    {
      cache: "no-store",
    }
  );

  return res.json();
}


export default async function CollegePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const college = await getCollege(slug);

  return (
    <div className="max-w-6xl mx-auto p-8">
     <Link
  href={`/college/${college.slug}`}
  className="block border rounded-lg p-4 hover:bg-gray-50"
>
  <h3>{college.name}</h3>
  <p>{college.city}</p>
</Link>
    </div>
  );
}