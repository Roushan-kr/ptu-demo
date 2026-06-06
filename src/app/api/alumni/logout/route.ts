import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('alumniRefreshToken')?.value;
  
  if (refreshToken) {
    // Remove the refresh token from the database (optional)
    await prisma.alumni.updateMany({
      where: { alumniRefreshTokens: { has: refreshToken } },
      data: { alumniRefreshTokens: [] },
    });
  }
  
  const response = NextResponse.json({ success: true });
  response.cookies.delete('alumniAccessToken');
  response.cookies.delete('alumniRefreshToken');
  return response;
}