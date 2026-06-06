import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/brevo';

function getInviteLink(token: string, origin: string): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() || origin;
  return `${appUrl}/alumni/register?token=${token}`;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ batchId: string }> }
) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  if (!accessToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    verifyAccessToken(accessToken);
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const { batchId } = await params;
  const batch = await prisma.invitationBatch.findUnique({
    where: { id: batchId },
    include: {
      alumni: {
        where: {
          inviteStatus: 'PENDING',
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
