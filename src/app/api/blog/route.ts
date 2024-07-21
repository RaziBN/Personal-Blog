export const dynamic = "force-dynamic";

let blogPosts = [
  {
    id: 1,
    title: "First Post",
    content: "This is the content of the first post.",
    author: "John Doe",
    date: "2022-01-01",
  },
];
export async function GET(req: Request) {
  return {
    status: 200,
    body: JSON.stringify(blogPosts),
  };
}

export const POST = async (req:, res) => {
  try {
    const newPost = JSON.parse(req.body);
    blogPosts.push(newPost);

    res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    res.status(400).json({ message: "Invalid request data" });
  }
};
