import { cookies } from 'next/headers';
import { verifyAlumniAccessToken } from '@/lib/auth/alumni-jwt';
import { verifyAccessToken } from '@/lib/auth/jwt';
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

/**
 * Extended auth helper that accepts EITHER an alumni token OR a staff token.
 * Returns a normalized identity:
 *   - `isAdmin: false` → authenticated alumni (full alumni record)
 *   - `isAdmin: true`  → authenticated staff member (no alumni record)
 *
 * Use this in routes/actions that should be accessible by both alumni AND admin/staff.
 */
export async function getCurrentAlumniOrStaff(): Promise<
  | { isAdmin: false; alumni: NonNullable<Awaited<ReturnType<typeof getCurrentAlumni>>> }
  | { isAdmin: true; staffId: string }
  | null
> {
  try {
    const cookieStore = await cookies();
    const alumniToken = cookieStore.get('alumniAccessToken')?.value;
    const staffToken = cookieStore.get('accessToken')?.value;

    // Prefer staff token FIRST — avoids email collision with alumni records
    if (staffToken) {
      try {
        const payload = verifyAccessToken(staffToken);
        if (payload?.id) {
          return { isAdmin: true, staffId: payload.id };
        }
      } catch {
        // invalid staff token, fall through to alumni check
      }
    }

    // Try alumni token
    if (alumniToken) {
      try {
        const payload = verifyAlumniAccessToken(alumniToken);
        if (payload?.id) {
          const alumni = await prisma.alumni.findUnique({ where: { id: payload.id } });
          if (alumni) return { isAdmin: false, alumni };
        }
      } catch {
        // invalid alumni token too
      }
    }

    return null;
  } catch (error) {
    console.error('Error in getCurrentAlumniOrStaff:', error);
    return null;
  }
}
