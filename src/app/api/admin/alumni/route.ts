import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try { verifyAccessToken(token); } catch { return NextResponse.json({ error: 'Invalid token' }, { status: 401 }); }

  const { searchParams } = new URL(req.url);
  const batchYear = searchParams.get('batchYear');
  const branch = searchParams.get('branch');
  const college = searchParams.get('college');
  const course = searchParams.get('course');
  const status = searchParams.get('status');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const skip = (page - 1) * limit;

  const where: any = {};
  if (batchYear) where.batchYear = parseInt(batchYear);
  if (branch) where.branch = { contains: branch, mode: 'insensitive' };
  if (college) where.college = { contains: college, mode: 'insensitive' };
  if (course) where.course = { contains: course, mode: 'insensitive' };
  if (status) where.inviteStatus = status as any;

  const [alumni, total] = await Promise.all([
    prisma.alumni.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        originalInvitedEmail: true,
        enrollmentNo: true,
        batchYear: true,
        branch: true,
        college: true,
        course: true,
        phone: true,
        inviteStatus: true,
        isRegistered: true,
        registeredAt: true,
        createdAt: true,
        batch: {
          select: { label: true }
        },
      }
    }),
    prisma.alumni.count({ where }),
  ]);

  return NextResponse.json({
    data: alumni,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}