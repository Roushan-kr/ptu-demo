import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAlumniAccessToken } from '@/lib/auth/alumni-jwt';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const alumniToken = cookieStore.get('alumniAccessToken')?.value;
  const staffToken = cookieStore.get('accessToken')?.value;

  if (!alumniToken && !staffToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let viewerId: string | null = null;
    let isStaff = false;

    if (alumniToken) {
      try {
        const payload = verifyAlumniAccessToken(alumniToken);
        viewerId = payload.id;
      } catch {}
    }

    if (!viewerId && staffToken) {
      try {
        const payload = verifyAccessToken(staffToken);
        viewerId = payload.id;
        isStaff = true;
      } catch {}
    }

    if (!viewerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const targetId = searchParams.get('id') || viewerId;
    const isSelf = !isStaff && (targetId === viewerId);

    const alumni = await prisma.alumni.findUnique({
      where: { id: targetId },
      include: {
        education: {
          orderBy: { startDate: 'desc' },
        },
        workExperience: {
          orderBy: { startDate: 'desc' },
        },
        campus: {
          select: { id: true, name: true },
        },
      },
    });

    if (!alumni) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    let updatedAlumni = alumni;
    const currentExperiences = alumni.workExperience.filter(exp => exp.isCurrent);

    if (currentExperiences.length > 0) {
      // Find the latest current experience (sort by startDate desc, then createdAt desc)
      const latestCurrent = [...currentExperiences].sort((a, b) => {
        const dateA = new Date(a.startDate).getTime();
        const dateB = new Date(b.startDate).getTime();
        if (dateA !== dateB) return dateB - dateA;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      })[0];

      // Check if out of sync
      if (
        alumni.currentRole !== latestCurrent.title ||
        alumni.currentCompany !== latestCurrent.company ||
        alumni.city !== latestCurrent.location
      ) {
        const updated = await prisma.alumni.update({
          where: { id: alumni.id },
          data: {
            currentRole: latestCurrent.title,
            currentCompany: latestCurrent.company,
            city: latestCurrent.location || alumni.city,
          },
          include: {
            education: {
              orderBy: { startDate: 'desc' },
            },
            workExperience: {
              orderBy: { startDate: 'desc' },
            },
            campus: {
              select: { id: true, name: true },
            },
          },
        });
        updatedAlumni = updated;
      }
    } else if (alumni.currentRole || alumni.currentCompany) {
      // No current experience, but professional details exist in Alumni. Create a WorkExperience record.
      await prisma.workExperience.create({
        data: {
          alumniId: alumni.id,
          company: alumni.currentCompany || 'Not Specified',
          title: alumni.currentRole || 'Not Specified',
          location: alumni.city || null,
          startDate: alumni.registeredAt || alumni.createdAt || new Date(),
          isCurrent: true,
        }
      });
      // Refetch
      const refetched = await prisma.alumni.findUnique({
        where: { id: targetId },
        include: {
          education: {
            orderBy: { startDate: 'desc' },
          },
          workExperience: {
            orderBy: { startDate: 'desc' },
          },
          campus: {
            select: { id: true, name: true },
          },
        },
      });
      if (refetched) {
        updatedAlumni = refetched;
      }
    }

    return NextResponse.json({ user: updatedAlumni, isSelf });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}