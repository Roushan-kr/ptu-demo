// src/app/alumni/(protected)/layout.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { verifyAlumniAccessToken } from '@/lib/auth/alumni-jwt';
import { verifyAccessToken } from '@/lib/auth/jwt';
import AlumniBottomNav from '@/components/AlumniBottomNav';

export default async function ProtectedAlumniLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const alumniToken = cookieStore.get('alumniAccessToken')?.value;
  const staffToken = cookieStore.get('accessToken')?.value;

  if (!alumniToken && !staffToken) {
    redirect('/alumni/login');
  }

  let authorized = false;
  if (alumniToken) {
    try {
      verifyAlumniAccessToken(alumniToken);
      authorized = true;
    } catch {}
  }

  if (!authorized && staffToken) {
    try {
      verifyAccessToken(staffToken);
      authorized = true;
    } catch {}
  }

  if (!authorized) {
    redirect('/alumni/login');
  }

  return (
    <div className="min-h-screen bg-slate-50/60 pb-28 antialiased selection:bg-[#C41E3A]/10">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex justify-between items-center">
            <div className="flex items-center gap-3.5">
              {/* Refined Institutional Crest Wrapper */}
              <div className="w-14 h-14 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-md shadow-blue-900/10 tracking-wider">
                <img src="/icon.png" alt="logo" className="w-full h-full object-cover" />
              </div>
              
              <Link href="/" className="group block focus:outline-none">
                <h1 className="text-md font-extrabold tracking-tight text-slate-900 sm:text-lg group-hover:text-[#003D7A] transition-colors">
                  I.K.G. Punjab Technical University
                </h1>
                <p className="text-xs font-medium text-slate-500 tracking-wide uppercase transition-colors group-hover:text-[#C41E3A]">
                  Alumni Relations
                </p>
              </Link>
            </div>

            {/* Quick Live Status Dot */}
            <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/10">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Portal Connected
            </div>
        </div>
      </header>

      {/* Main Content Area - Maximized for High-Density Dashboard Views */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Persistent Navigation */}
      <AlumniBottomNav />
    </div>
  );
}