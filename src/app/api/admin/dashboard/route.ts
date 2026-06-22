import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  getAuthenticatedStaff,
  resolveCampusScope,
  CampusScopeError,
} from '@/lib/auth/staff-auth';

export async function GET(req: NextRequest) {
  try {
    const staff = await getAuthenticatedStaff();
    if (!staff) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const modules = Array.isArray(staff.modules) ? (staff.modules as string[]) : [];
    if (staff.role !== 'ADMIN' && !modules.includes('dashboard')) {
      return NextResponse.json({ error: 'Forbidden: Access denied to dashboard module' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    let scopedCampusId: string | null;
    try {
      scopedCampusId = resolveCampusScope(staff, searchParams.get('campusId'));
    } catch (err) {
      if (err instanceof CampusScopeError) {
        return NextResponse.json({ error: err.message }, { status: 403 });
      }
      throw err;
    }

    // Alumni and Registration base filters
    const where: Record<string, any> = {};
    if (scopedCampusId) {
      where.campusId = scopedCampusId;
    }

    // Events filter: Filter events created by staff members or alumni of this campus, or global admin
    const eventWhere: Record<string, any> = {};
    if (scopedCampusId) {
      eventWhere.OR = [
        {
          postedByStaff: {
            campusId: scopedCampusId,
          },
        },
        {
          postedByStaff: {
            campusId: null,
          },
        },
        {
          postedByAlumni: {
            campusId: scopedCampusId,
          },
        },
      ];
    }

    // Perform concurrent count queries
    const [
      totalAlumni,
      registeredAlumni,
      pendingInvites,
      invitedAlumni,
      pendingRequests,
      totalEvents,
      totalRsvps,
      branchRows,
      companyRows,
    ] = await Promise.all([
      prisma.alumni.count({ where }),
      prisma.alumni.count({ where: { ...where, isRegistered: true } }),
      prisma.alumni.count({
        where: { ...where, isRegistered: false, inviteStatus: 'PENDING' },
      }),
      prisma.alumni.count({
        where: { ...where, isRegistered: false, inviteStatus: 'INVITED' },
      }),
      prisma.registrationRequest.count({
        where: { ...where, status: 'PENDING' },
      }),
      prisma.event.count({ where: eventWhere }),
      prisma.rsvp.count({ where: { event: eventWhere } }),
      prisma.alumni.findMany({
        where,
        select: { branch: true },
        distinct: ['branch'],
      }),
      prisma.alumni.findMany({
        where: {
          ...where,
          currentCompany: { not: null, notIn: [''] },
        },
        select: { currentCompany: true },
        distinct: ['currentCompany'],
      }),
    ]);

    const uniqueBranchesCount = branchRows.filter((b) => b.branch).length;
    const uniqueCompaniesCount = companyRows.filter((c) => c.currentCompany).length;

    // Today's stats queries
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [requestsToday, registrationsToday, eventsToday, rsvpsToday] =
      await Promise.all([
        prisma.registrationRequest.count({
          where: { ...where, createdAt: { gte: startOfToday } },
        }),
        prisma.alumni.count({
          where: { ...where, isRegistered: true, registeredAt: { gte: startOfToday } },
        }),
        prisma.event.count({
          where: { ...eventWhere, createdAt: { gte: startOfToday } },
        }),
        prisma.rsvp.count({
          where: { event: eventWhere, respondedAt: { gte: startOfToday } },
        }),
      ]);

    // Trend queries: last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      return d;
    }).reverse();

    const registrationTrend = await Promise.all(
      last7Days.map(async (day) => {
        const nextDay = new Date(day);
        nextDay.setDate(nextDay.getDate() + 1);
        const count = await prisma.alumni.count({
          where: {
            ...where,
            isRegistered: true,
            registeredAt: {
              gte: day,
              lt: nextDay,
            },
          },
        });
        return {
          date: day.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
          }),
          count,
        };
      })
    );

    // Distribution metrics (Donut Chart)
    let distribution: { name: string; count: number }[] = [];
    let distributionType = 'course';

    if (!scopedCampusId) {
      // ADMIN global: distribution by campus
      const campusGroup = await prisma.alumni.groupBy({
        by: ['campusId'],
        where,
        _count: { id: true },
      });
      const campuses = await prisma.campus.findMany({
        select: { id: true, name: true },
      });
      const campusMap = new Map(campuses.map((c) => [c.id, c.name]));
      distribution = campusGroup.map((cg) => ({
        name: cg.campusId ? campusMap.get(cg.campusId) || 'Unknown' : 'Unassigned',
        count: cg._count.id,
      }));
      distributionType = 'campus';
    } else {
      // SUB_ADMIN: distribution by course
      const courseGroup = await prisma.alumni.groupBy({
        by: ['course'],
        where: {
          ...where,
          course: { not: null, notIn: [''] },
        },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5,
      });
      distribution = courseGroup.map((cg) => ({
        name: cg.course || 'Unknown',
        count: cg._count.id,
      }));
      distributionType = 'course';
    }

    // Top Branches (Bar Chart)
    const topBranchesGroup = await prisma.alumni.groupBy({
      by: ['branch'],
      where,
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5,
    });
    const branchDistribution = topBranchesGroup.map((b) => ({
      name: b.branch,
      count: b._count.id,
    }));

    // Top Companies (Bar Chart)
    const topCompaniesGroup = await prisma.alumni.groupBy({
      by: ['currentCompany'],
      where: {
        ...where,
        currentCompany: { not: null, notIn: [''] },
      },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5,
    });
    const companyDistribution = topCompaniesGroup.map((c) => ({
      name: c.currentCompany || 'Unknown',
      count: c._count.id,
    }));

    return NextResponse.json({
      stats: {
        totalAlumni,
        registeredAlumni,
        pendingInvites,
        invitedAlumni,
        pendingRequests,
        totalEvents,
        totalRsvps,
        uniqueBranchesCount,
        uniqueCompaniesCount,
      },
      today: {
        requestsToday,
        registrationsToday,
        eventsToday,
        rsvpsToday,
      },
      charts: {
        registrationTrend,
        distribution,
        distributionType,
        branchDistribution,
        companyDistribution,
      },
    });
  } catch (error) {
    console.error('[GET_ADMIN_DASHBOARD_STATS_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
