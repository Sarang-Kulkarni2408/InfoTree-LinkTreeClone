import clientPromise from "@/lib/mongodb";
import crypto from 'crypto';

// ✅ GET Handler: used to fetch user data
export async function GET(req, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db("infotree");

    const user = await db.collection("users").findOne({ slug: params.slug });

    if (user) {
      return Response.json({ exists: true, user });
    } else {
      return Response.json({ exists: false });
    }
  } catch (err) {
    return Response.json({ exists: false, error: err.message });
  }
}

// ✅ POST Handler: used to create new user data
export async function POST(req, { params }) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db("infotree");

    const existing = await db.collection("users").findOne({ slug: params.slug });
    if (existing) {
      return Response.json({ success: false, message: "User already exists" });
    }

    // Hash password if present
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
  } catch (err) {
    return Response.json({ success: false, message: err.message });
  }
}

export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db("infotree");

    const result = await db.collection("users").updateOne(
      { slug: params.slug },
      {
        $set: {
          profileImage: body.profileImage,
          handleName: body.handleName,
          description: body.description,
          links: body.links,
        },
      }
    );

    return Response.json({ success: result.modifiedCount > 0 });
  } catch (err) {
    return Response.json({ success: false, message: err.message });
  }
}


