import { NextRequest, NextResponse } from "next/server";
import prisma from "@/database";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    console.log(id);

    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
    });
    if (post) {
      return NextResponse.json({
        success: true,
        data: post,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Failed to fetch blog posts. Please try again",
      });
    }
  } catch (e) {
    console.log(e);

    return NextResponse.json({
      success: false,
      message: "Something went wrong ! Please try again",
    });
  }
}
