import { NextResponse } from "next/server";
import prisma  from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const college = await prisma.college.findUnique({
    where: {
      slug,
    },

    include: {
      state: true,

      programs: {
        include: {
          fees: true,
          admissions: {
            include: {
              exam: true,
              category: true,
              quota: true,
            },
          },
          placements: true,
        },
      },

      placements: true,
      rankings: true,
      stats: true,
      reviews: true,
    },
  });

  if (!college) {
    return NextResponse.json(
      { error: "College not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(college);
}