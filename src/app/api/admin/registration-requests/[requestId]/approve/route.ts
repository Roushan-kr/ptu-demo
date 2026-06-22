import { NextRequest, NextResponse } from 'next/server';
import { StaffRole } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedStaff, CampusScopeError } from '@/lib/auth/staff-auth';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const staff = await getAuthenticatedStaff();
    if (!staff) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const modules = Array.isArray(staff.modules) ? (staff.modules as string[]) : [];
    if (staff.role !== StaffRole.ADMIN && !modules.includes('requests')) {
      return NextResponse.json({ error: 'Forbidden: Access denied to registration requests' }, { status: 403 });
    }

    const { requestId } = await params;
    const body = await req.json().catch(() => ({}));
    const overrideCampusId = typeof body.campusId === 'string' ? body.campusId.trim() : '';

    const existingRequest = await prisma.registrationRequest.findUnique({
      where: { id: requestId },
      include: { campus: { select: { id: true, name: true } } },
    });

    if (!existingRequest) {
      return NextResponse.json({ error: 'Registration request not found' }, { status: 404 });
    }

    if (existingRequest.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'This registration request has already been reviewed' },
        { status: 400 }
      );
    }

    let finalCampusId: string | null;

    if (staff.role === StaffRole.ADMIN) {
      finalCampusId = overrideCampusId || existingRequest.campusId;
    } else {
      if (!staff.campusId) {
        return NextResponse.json({ error: 'Your account is not linked to any campus' }, { status: 403 });
      }
      if (existingRequest.campusId && existingRequest.campusId !== staff.campusId) {
        return NextResponse.json({ error: 'Forbidden: You can only approve requests for your assigned campus' }, { status: 403 });
      }
      finalCampusId = staff.campusId;
    }

    if (!finalCampusId) {
      return NextResponse.json(
        { error: 'Campus assignment is required. The request has no campus — please assign one when approving.' },
        { status: 400 }
      );
    }

    const campus = await prisma.campus.findUnique({ where: { id: finalCampusId } });
    if (!campus) {
      return NextResponse.json({ error: 'Invalid campus' }, { status: 400 });
    }

    const duplicateAlumni = await prisma.alumni.findFirst({
      where: {
        OR: [
          { email: existingRequest.email },
          { originalInvitedEmail: existingRequest.email },
        ],
      },
    });
    
    if (duplicateAlumni) {
      return NextResponse.json(
        { error: 'An alumni account with this email already exists' },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedRequest = await tx.registrationRequest.update({
        where: { id: requestId },
        data: {
          status: 'APPROVED',
          campusId: finalCampusId,
          reviewedById: staff.id,
          reviewedAt: new Date(),
        },
      });

      const newAlumni = await tx.alumni.create({
        data: {
          name: existingRequest.name,
          email: existingRequest.email,
          enrollmentNo: existingRequest.enrollmentNo,
          batchYear: existingRequest.batchYear,
          branch: existingRequest.branch,
          college: existingRequest.college,
          course: existingRequest.course,
          phone: existingRequest.phone,
          campusId: finalCampusId,
          isRegistered: true,
          inviteStatus: 'REGISTERED',
          registeredAt: new Date(),
          googleId: existingRequest.authProvider === 'GOOGLE' ? existingRequest.providerId : null,
          linkedinId: existingRequest.authProvider === 'LINKEDIN' ? existingRequest.providerId : null,
          passwordHash: existingRequest.authProvider === 'MANUAL' ? existingRequest.passwordHash : null,
          alumniRefreshTokens: [],
          currentRole: existingRequest.currentRole,
          currentCompany: existingRequest.currentCompany,
        },
      });

      if (existingRequest.currentRole || existingRequest.currentCompany) {
        await tx.workExperience.create({
          data: {
            alumniId: newAlumni.id,
            company: existingRequest.currentCompany || 'Not Specified',
            title: existingRequest.currentRole || 'Not Specified',
            location: existingRequest.city || null,
            startDate: new Date(),
            isCurrent: true,
          },
        });
      }

      return { updatedRequest, newAlumni };
    });

    return NextResponse.json({
      message: 'Registration request approved and alumni account activated.',
      request: result.updatedRequest,
      alumniId: result.newAlumni.id,
      campus: { id: campus.id, name: campus.name },
    });
  } catch (error) {
    if (error instanceof CampusScopeError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('[APPROVE_REGISTRATION_REQUEST]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
