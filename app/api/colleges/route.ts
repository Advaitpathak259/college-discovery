import { NextRequest, NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const search =
    req.nextUrl.searchParams.get("search") || "";

  const colleges = await prisma.college.findMany({
    where: {
      name: {
        contains: search,
        mode: "insensitive",
      },
    },

    take: 20,
  });

  return NextResponse.json(colleges);
}