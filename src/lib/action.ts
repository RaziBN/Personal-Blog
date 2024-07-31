"use server";
import prisma from "@/database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
export async function deleteBlogPost(id: number) {
  await prisma.post.delete({
    where: {
      id,
    },
  });
  revalidatePath("/blogs");
  redirect("/blogs");
}
