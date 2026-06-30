import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('alumniRefreshToken')?.value;

  if (refreshToken) {
    // Remove only THIS device's token — preserve all other sessions
    const alumni = await prisma.alumni.findFirst({
      where: { alumniRefreshTokens: { has: refreshToken } },
      select: { id: true, alumniRefreshTokens: true },
    });

    if (alumni) {
      const updatedTokens = alumni.alumniRefreshTokens.filter(
        (t) => t !== refreshToken
      );
      await prisma.alumni.update({
        where: { id: alumni.id },
        data: { alumniRefreshTokens: updatedTokens },
      });
    }
  }

  const response = NextResponse.json({ success: true });
  response.cookies.delete('alumniAccessToken');
  response.cookies.delete('alumniRefreshToken');
  return response;
}
