import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/auth/jwt'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const accessToken = req.cookies.get('accessToken')?.value
    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyAccessToken(accessToken)
    const reviewedById = payload.id

    const staff = await prisma.staff.findUnique({ where: { id: reviewedById } })
    if (!staff) {
      return NextResponse.json({ error: 'Authenticated staff user not found' }, { status: 401 })
    }

    const { rejectionReason } = await req.json()
     const { requestId } = await params

    const existingRequest = await prisma.registrationRequest.findUnique({
      where: { id: requestId },
    })

    if (!existingRequest) {
      return NextResponse.json({ error: 'Registration request not found' }, { status: 404 })
    }

    if (existingRequest.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'This registration request has already been reviewed' },
        { status: 400 }
      )
    }

    const updatedRequest = await prisma.registrationRequest.update({
      where: { id: requestId },
      data: {
        status: 'REJECTED',
        rejectionReason,
        reviewedById,
        reviewedAt: new Date(),
      },
    })

    return NextResponse.json({ message: 'Registration request rejected', request: updatedRequest })
  } catch (error) {
    console.error('[REJECT_REGISTRATION_REQUEST]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
