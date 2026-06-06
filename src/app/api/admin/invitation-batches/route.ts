import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { prisma } from '@/lib/prisma';

type InviteStatusFilter = 'PENDING' | 'COMPLETED';

function mapInviteStatus(batchStatus: string): InviteStatusFilter {
  return batchStatus === 'INVITED' ? 'COMPLETED' : 'PENDING';
}

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    verifyAccessToken(accessToken);
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const label = searchParams.get('label')?.trim() || '';
  const status = (searchParams.get('status') || 'ALL').toUpperCase();
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(50, Math.max(5, parseInt(searchParams.get('limit') || '10', 10)));
  const skip = (page - 1) * limit;

  const where: any = {};
  if (label) {
    where.label = { contains: label, mode: 'insensitive' };
  }
  if (status === 'PENDING') {
    where.status = { in: ['PROCESSING', 'UPLOADED'] };
  } else if (status === 'COMPLETED') {
    where.status = 'INVITED';
  }

  const [batches, total] = await Promise.all([
    prisma.invitationBatch.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            alumni: true,
          },
        },
        alumni: {
          select: {
            inviteStatus: true,
          },
        },
      },
    }),
    prisma.invitationBatch.count({ where }),
  ]);

  const data = batches.map((batch) => ({
    invitedCount: batch.alumni.filter((a) => a.inviteStatus === 'INVITED' || a.inviteStatus === 'REGISTERED').length,
    id: batch.id,
    label: batch.label,
    csvFilename: batch.csvFilename,
    totalCount: batch.totalCount,
    sentCount: batch.sentCount,
    failedCount: batch.failedCount,
    dbStatus: batch.status,
    inviteStatus: mapInviteStatus(batch.status),
    alumniCount: batch._count.alumni,
    createdAt: batch.createdAt,
    completedAt: batch.completedAt,
  }));

  return NextResponse.json({
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}
