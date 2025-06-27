import clientPromise from "@/lib/mongodb";
import crypto from 'crypto';

export async function GET(req, { params }) {
  const client = await clientPromise;
  const db = client.db("infotree");
  const user = await db.collection("users").findOne({ slug: params.slug });

  if (user) return Response.json({ exists: true, user });
  return Response.json({ exists: false });
}

export async function POST(req, { params }) {
  const body = await req.json();
  const client = await clientPromise;
  const db = client.db("infotree");

  const existing = await db.collection("users").findOne({ slug: params.slug });
  if (existing) return Response.json({ success: false, message: "User already exists" });

  let hashedPassword = null;
  if (body.password) {
    hashedPassword = crypto.createHash('sha256').update(body.password).digest('hex');
  }

  await db.collection("users").insertOne({
    slug: params.slug,
    profileImage: body.profileImage,
    handleName: body.handleName,
    description: body.description,
    links: body.links,
    ...(hashedPassword && { password: hashedPassword })
  });

  return Response.json({ success: true });
}

export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db("infotree");

    const updateData = {
      profileImage: body.profileImage,
      handleName: body.handleName,
      description: body.description,
      links: body.links,
    };

    if (body.password && body.password.length >= 8) {
      updateData.password = crypto.createHash("sha256").update(body.password).digest("hex");
    }

    const result = await db.collection("users").updateOne(
      { slug: params.slug },
      { $set: updateData }
    );

    return Response.json({ success: result.modifiedCount > 0 });
  } catch (err) {
    return Response.json({ success: false, message: err.message });
  }
}

