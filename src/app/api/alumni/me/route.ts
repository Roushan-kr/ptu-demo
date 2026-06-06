import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAlumniAccessToken } from '@/lib/auth/alumni-jwt';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('alumniAccessToken')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const payload = verifyAlumniAccessToken(token);
    const alumni = await prisma.alumni.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        name: true,
        email: true,
        batchYear: true,
        branch: true,
        college: true,
        course: true,
        currentRole: true,
        currentCompany: true,
        city: true,
        avatarUrl: true,
      },
    });
    if (!alumni) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json({ user: alumni });
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}