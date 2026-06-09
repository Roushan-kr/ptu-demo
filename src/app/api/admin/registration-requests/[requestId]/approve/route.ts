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

    const result = await prisma.$transaction(async (tx) => {
      const updatedRequest = await tx.registrationRequest.update({
        where: { id: requestId },
        data: {
          status: 'APPROVED',
          reviewedById,
          reviewedAt: new Date(),
        },
      })

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
          isRegistered: true,
          inviteStatus: 'REGISTERED',
          registeredAt: new Date(),
          
          // Conditionally mapping the authentication credential variables
          googleId: existingRequest.authProvider === 'GOOGLE' ? existingRequest.providerId : null,
          linkedinId: existingRequest.authProvider === 'LINKEDIN' ? existingRequest.providerId : null,
          passwordHash: existingRequest.authProvider === 'MANUAL' ? existingRequest.passwordHash : null,
          
          alumniRefreshTokens: [], // Initializing scalar array field
        },
      })
      return { updatedRequest, newAlumni }
    })

    return NextResponse.json({ 
      message: 'Registration request approved and alumni account activated.', 
      request: result.updatedRequest,
      alumniId: result.newAlumni.id
    })

  } catch (error) {
    console.error('[APPROVE_REGISTRATION_REQUEST]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}