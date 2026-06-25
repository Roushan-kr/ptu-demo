import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAlumniAccessToken } from '@/lib/auth/alumni-jwt';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('alumniAccessToken')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let alumni;
  try {
    const payload = verifyAlumniAccessToken(token);
    alumni = await prisma.alumni.findUnique({ where: { id: payload.id } });
    if (!alumni) {
      return NextResponse.json({ error: 'Alumni not found' }, { status: 404 });
    }
  } catch {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const sort = searchParams.get('sort') || 'date';
    const skip = (page - 1) * limit;

    const whereClause: any = {
      isPublished: true,
    };

    if (category && category !== 'All') {
      whereClause.category = category;
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { venue: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy: any =
      sort === 'newest' ? { createdAt: 'desc' } : { eventDate: 'asc' };

    const [events, totalCount] = await Promise.all([
      prisma.event.findMany({
        where: whereClause,
        orderBy,
        skip,
        take: limit,
        include: {
          postedByAlumni: {
            select: { id: true, name: true, avatarUrl: true, currentRole: true },
          },
          postedByStaff: {
            select: { id: true, name: true },
          },
        },
      }),
      prisma.event.count({ where: whereClause }),
    ]);

    const eventsWithRsvps = await Promise.all(
      events.map(async (event) => {
        const [attendingCount, myRsvp] = await Promise.all([
          prisma.rsvp.count({ where: { eventId: event.id, status: 'ATTENDING' } }),
          prisma.rsvp.findUnique({
            where: { alumniId_eventId: { alumniId: alumni.id, eventId: event.id } },
            select: { status: true, message: true },
          }),
        ]);

        return {
          ...event,
          attendingCount,
          myRsvp: myRsvp || null,
          postedByMe: event.postedByAlumniId === alumni.id,
        };
      })
    );

    return NextResponse.json({
      events: eventsWithRsvps,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching alumni events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}
