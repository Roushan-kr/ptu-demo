import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (!token) {
    return NextResponse.json({ valid: false, error: 'Missing token' }, { status: 400 });
  }

  const alumni = await prisma.alumni.findFirst({
    where: {
      inviteToken: token,
      inviteStatus: { in: ['PENDING', 'INVITED'] },
    },
    select: {
      id: true,
      name: true,
      batchYear: true,
      branch: true,
      college: true,
      email: true,
      originalInvitedEmail: true,
    },
  });

  if (!alumni) {
    return NextResponse.json({ valid: false, error: 'Invalid or expired token' }, { status: 404 });
  }

  return NextResponse.json({
    valid: true,
    alumni: {
      id: alumni.id,
      name: alumni.name,
      batchYear: alumni.batchYear,
      branch: alumni.branch,
      college: alumni.college,
      email: alumni.email,
    },
  });
}
