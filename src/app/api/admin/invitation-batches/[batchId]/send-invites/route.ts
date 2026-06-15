import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/brevo';
import {
  getAuthenticatedStaff,
  resolveCampusScope,
  assertBatchCampusAccess,
  CampusScopeError,
} from '@/lib/auth/staff-auth';

function getInviteLink(token: string, origin: string): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() || origin;
  return `${appUrl}/alumni/login?token=${token}`;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ batchId: string }> }
) {
  const staff = await getAuthenticatedStaff();
  if (!staff) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { batchId } = await params;

  let scopedCampusId: string | null;
  try {
    scopedCampusId = resolveCampusScope(staff, null);
  } catch (err) {
    if (err instanceof CampusScopeError) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    throw err;
  }

  const hasAccess = await assertBatchCampusAccess(batchId, scopedCampusId);
  if (!hasAccess) {
    return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
  }

  const batch = await prisma.invitationBatch.findUnique({
    where: { id: batchId },
    include: {
      alumni: {
        where: {
          inviteStatus: 'PENDING',
          ...(scopedCampusId ? { campusId: scopedCampusId } : {}),
        },
      },
    },
  });

  if (!batch) {
    return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
  }

  if (!batch.alumni.length) {
    return NextResponse.json({
      message: 'No pending alumni found for invitation',
      sent: 0,
      failed: 0,
    });
  }

  let sent = 0;
  let failed = 0;

  for (const alumni of batch.alumni) {
    const inviteLink = getInviteLink(alumni.inviteToken || '', req.nextUrl.origin);
    if (!alumni.inviteToken) {
      failed++;
      continue;
    }

    const emailResult = await sendEmail({
      to: [{ email: alumni.email, name: alumni.name }],
      subject: 'PTU Alumni Invitation',
      htmlContent: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;">
          <h2 style="color:#12388f;margin-bottom:8px;">Welcome to PTU Alumni Connect</h2>
          <p>Hello ${alumni.name},</p>
          <p>You are invited to complete your alumni registration profile.</p>
          <p>
            <a href="${inviteLink}" style="display:inline-block;padding:10px 16px;background:#12388f;color:#fff;text-decoration:none;border-radius:8px;">
              Complete Registration
            </a>
          </p>
          <p>If the button does not work, copy this URL:</p>
          <p>${inviteLink}</p>
        </div>
      `,
      textContent: `Hello ${alumni.name}, complete your PTU alumni registration: ${inviteLink}`,
      tags: ['alumni-invitation', `batch-${batchId}`],
    });

    if (emailResult.ok) {
      sent++;
      await prisma.alumni.update({
        where: { id: alumni.id },
        data: {
          inviteStatus: 'INVITED',
          invitedAt: new Date(),
        },
      });
    } else {
      failed++;
      await prisma.alumni.update({
        where: { id: alumni.id },
        data: {
          inviteStatus: 'BOUNCED',
        },
      });
    }
  }

  await prisma.invitationBatch.update({
    where: { id: batchId },
    data: {
      status: sent > 0 ? ('INVITED' as any) : ('UPLOADED' as any),
      sentCount: { increment: sent },
      failedCount: { increment: failed },
    },
  });

  return NextResponse.json({
    message: 'Invitation dispatch completed',
    sent,
    failed,
  });
}
