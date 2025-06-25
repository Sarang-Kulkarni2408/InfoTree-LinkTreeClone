import clientPromise from "@/lib/mongodb";
import crypto from "crypto";

export async function POST(req, { params }) {
  try {
    const { password } = await req.json();

    const client = await clientPromise;
    const db = client.db("infotree");

    const user = await db.collection("users").findOne({ slug: params.slug });
    if (!user || !user.password) {
      return Response.json({ success: false, message: "User or password not found" });
    }

    const hashed = crypto.createHash('sha256').update(password).digest('hex');
    if (hashed === user.password) {
      return Response.json({ success: true });
    } else {
      return Response.json({ success: false });
    }
  } catch (err) {
    return Response.json({ success: false, message: err.message });
  }
}
