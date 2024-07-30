import BlogList from "@/components/custom/blog-list";

async function extractAllBlogs() {
  try {
    const res = await fetch(`${process.env.URL}/api/blog/get-all-posts`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch blog posts:", res.statusText);
      return [];
    }

    const data = await res.json();

    if (data.success) {
      return data.data;
    } else {
      console.error("API response was not successful:", data.message);
      return [];
    }
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

export default async function Blogs() {
  const blogPostsList = await extractAllBlogs();

  // Log the data to verify what is being received
  console.log("Blog Posts List:", blogPostsList);

  // Handle cases where the data might be undefined or an empty array
  if (!blogPostsList || blogPostsList.length === 0) {
    return <div>No blog posts available.</div>;
  }

  return <BlogList lists={blogPostsList} />;
}
