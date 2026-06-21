import { cookies } from 'next/headers';
import { verifyAlumniAccessToken } from '@/lib/auth/alumni-jwt';
import { prisma } from '@/lib/prisma';

export async function getCurrentAlumni() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('alumniAccessToken')?.value;
    if (!token) return null;

    const payload = verifyAlumniAccessToken(token);
    if (!payload || !payload.id) return null;

    const alumni = await prisma.alumni.findUnique({
      where: { id: payload.id },
    });

    return alumni;
  } catch (error) {
    console.error('Error in getCurrentAlumni:', error);
    return null;
  }
}
