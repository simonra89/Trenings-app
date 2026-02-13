import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Ugyldig input" }, { status: 400 });

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) return NextResponse.json({ error: "E-post er allerede i bruk" }, { status: 409 });

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  await prisma.user.create({ data: { email: parsed.data.email, passwordHash } });

  return NextResponse.json({ ok: true });
}
