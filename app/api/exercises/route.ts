import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { exerciseSchema } from "@/lib/validations";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const items = await prisma.exercise.findMany({
    where: { OR: [{ userId: session.user.id }, { userId: null }] },
    orderBy: [{ isArchived: "asc" }, { name: "asc" }],
  });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = exerciseSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const item = await prisma.exercise.create({ data: { ...parsed.data, userId: session.user.id } });
  return NextResponse.json(item);
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, isArchived } = await req.json();

  const found = await prisma.exercise.findFirst({ where: { id, OR: [{ userId: session.user.id }, { userId: null }] } });
  if (!found) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const item = await prisma.exercise.update({ where: { id }, data: { isArchived: Boolean(isArchived) } });
  return NextResponse.json(item);
}
