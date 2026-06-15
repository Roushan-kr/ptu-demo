import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { prisma } from '@/lib/prisma';

// Helper to check if current user is ADMIN
async function isAdmin(req: NextRequest): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;
  if (!token) return false;
  try {
    const payload = verifyAccessToken(token);
    const staff = await prisma.staff.findUnique({ where: { id: payload.id } });
    return staff?.role === 'ADMIN';
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const campuses = await prisma.campus.findMany({ orderBy: { name: 'asc' } });
  return NextResponse.json(campuses);
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { name, code } = await req.json();
  if (!name || !code) {
    return NextResponse.json({ error: 'Name and code are required' }, { status: 400 });
  }
  const existing = await prisma.campus.findFirst({
    where: { OR: [{ name }, { code }] },
  });
  if (existing) {
    return NextResponse.json({ error: 'Campus name or code already exists' }, { status: 400 });
  }
  const campus = await prisma.campus.create({ data: { name, code } });
  return NextResponse.json(campus);
}