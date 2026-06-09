import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const requests = await prisma.registrationRequest.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(requests)
  } catch (error) {
    console.error('[ADMIN_REGISTRATION_REQUESTS_GET]', error)
    return NextResponse.json({ error: 'Failed to fetch registration requests' }, { status: 500 })
  }
}
