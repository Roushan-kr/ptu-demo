import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAlumni } from '@/lib/auth/getCurrentAlumni';
import { startupSchema } from '@/schemas/startup';
import { Prisma } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const industry = searchParams.get('industry') || '';
    const designation = searchParams.get('designation') || '';
    const location = searchParams.get('location') || '';
    const sort = searchParams.get('sort') || 'Name';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '8', 10);

    const skip = (page - 1) * limit;

    // Build Where Clause
    const whereClause: Prisma.StartUpWhereInput = {};

    if (industry && industry !== 'All') {
      whereClause.industry = industry;
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Filter by founder characteristics (designation or location/city)
    if ((designation && designation !== 'All') || (location && location !== 'All')) {
      whereClause.founder = {
        currentRole: designation && designation !== 'All' ? designation : undefined,
        city: location && location !== 'All' ? location : undefined,
      };
    }

    // Build Order By
    let orderBy: Prisma.StartUpOrderByWithRelationInput = { name: 'asc' };
    if (sort === 'Newest') {
      orderBy = { createdAt: 'desc' };
    }

    // Fetch startups, total count, and unique filter metadata in parallel
    const [startups, totalCount, distinctIndustries, distinctFounders] = await Promise.all([
      prisma.startUp.findMany({
        where: whereClause,
        orderBy,
        skip,
        take: limit,
        include: {
          founder: {
            select: {
              id: true,
              name: true,
              currentRole: true,
              avatarUrl: true,
              city: true,
            },
          },
        },
      }),
      prisma.startUp.count({ where: whereClause }),
      prisma.startUp.findMany({
        where: { industry: { not: null } },
        distinct: ['industry'],
        select: { industry: true },
      }),
      prisma.alumni.findMany({
        where: {
          startups: { some: {} },
        },
        distinct: ['city', 'currentRole'],
        select: {
          city: true,
          currentRole: true,
        },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    // Extract lists of values for filter panels
    const industriesList = Array.from(new Set(distinctIndustries.map((item) => item.industry).filter(Boolean))) as string[];
    const locationsList = Array.from(new Set(distinctFounders.map((item) => item.city).filter(Boolean))) as string[];
    const designationsList = Array.from(new Set(distinctFounders.map((item) => item.currentRole).filter(Boolean))) as string[];

    return NextResponse.json({
      startups,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
      },
      filters: {
        industries: industriesList,
        locations: locationsList,
        designations: designationsList,
      },
    });
  } catch (error) {
    console.error('Error fetching startups:', error);
    return NextResponse.json({ error: 'Failed to fetch startups' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const alumni = await getCurrentAlumni();
    if (!alumni) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validated = startupSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const startup = await prisma.startUp.create({
      data: {
        name: validated.data.name,
        description: validated.data.description,
        industry: validated.data.industry,
        websiteUrl: validated.data.websiteUrl || null,
        logoUrl: validated.data.logoUrl || null,
        foundedYear: validated.data.foundedYear || null,
        founderId: alumni.id,
      },
    });

    return NextResponse.json({ success: true, startup }, { status: 201 });
  } catch (error) {
    console.error('Error creating startup:', error);
    return NextResponse.json({ error: 'Failed to register startup' }, { status: 500 });
  }
}
