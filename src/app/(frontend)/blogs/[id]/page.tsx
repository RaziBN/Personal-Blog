import BlogDetailsHome from "@/components/custom/blog-details";

interface Param {
  id: string;
}

async function extractBlogDetails(id: string) {
  const res = await fetch(
    `${process.env.URL}/api/blog/blog-details?blogID=${id}`,
    {
      method: "GET",
      next: {
        revalidate: 0,
      },
    }
  );

  const data = await res.json();

  if (data.success) return data.data;
}

export default async function BlogDetails({ params }: { params: Param }) {
  const { id } = params;

  const blogData = await extractBlogDetails(id);

  return <BlogDetailsHome blogData={blogData} />;
}
