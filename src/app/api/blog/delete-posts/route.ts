import prisma from "@/database";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const extractIdOfBlogItemToBeDeleted = url.searchParams.get("id");

    if (!extractIdOfBlogItemToBeDeleted) {
      return NextResponse.json({
        success: false,
        message: "ID parameter is missing",
      });
    }

    const id = Number(extractIdOfBlogItemToBeDeleted);

    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        message: "Invalid ID parameter",
      });
    }

    // Check if the post exists
    const post = await prisma.post.findUnique({
      where: { id: id },
    });

    if (!post) {
      return NextResponse.json({
        success: false,
        message: "Post not found",
      });
    }

    // Delete the post
    await prisma.post.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (e) {
    console.error(e);

    return NextResponse.json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
}
