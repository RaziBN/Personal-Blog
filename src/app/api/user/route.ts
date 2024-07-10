export const dynamic = "force-dynamic";

export async function GET() {}

export const POST = async (req, res) => {
  res.status(200).json({ message: "Data received" });
};
