import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedStaff, resolveCampusScope, CampusScopeError } from '@/lib/auth/staff-auth';

export async function GET() {
  try {
    const staff = await getAuthenticatedStaff();
    if (!staff) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let scopedCampusId: string | null;
    try {
      scopedCampusId = resolveCampusScope(staff, null);
    } catch (err) {
      if (err instanceof CampusScopeError) {
        return NextResponse.json({ error: err.message }, { status: 403 });
      }
      throw err;
    }

    const where: Record<string, unknown> = { status: 'PENDING' };
    if (scopedCampusId) {
      where.campusId = scopedCampusId;
    }

    const requests = await prisma.registrationRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        campus: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error('[ADMIN_REGISTRATION_REQUESTS_GET]', error);
    return NextResponse.json({ error: 'Failed to fetch registration requests' }, { status: 500 });
  }
}
