import { parseBody } from "next-sanity/webhook";
import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ message: "SANITY_REVALIDATE_SECRET is not set" }, { status: 500 });
  }

  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret, true);
    if (!isValidSignature) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    }
    if (!body?._type) {
      return NextResponse.json({ message: "Missing _type in body" }, { status: 400 });
    }

    revalidateTag(body._type, "max");
    return NextResponse.json({ revalidated: body._type });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
  }
}
