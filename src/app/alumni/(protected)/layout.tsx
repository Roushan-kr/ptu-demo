// src/app/alumni/(protected)/layout.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { verifyAlumniAccessToken } from '@/lib/auth/alumni-jwt';
import AlumniBottomNav from '@/components/AlumniBottomNav';

export default async function ProtectedAlumniLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('alumniAccessToken')?.value;

  if (!token) {
    redirect('/alumni/login');
  }

  try {
    verifyAlumniAccessToken(token);
  } catch {
    redirect('/alumni/login');
  }

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24 antialiased selection:bg-[#C41E3A]/10">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3.5">
              {/* Refined Institutional Crest Wrapper */}
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#C41E3A] via-[#003D7A] to-[#002654] font-serif font-bold text-white shadow-md shadow-blue-900/10 ring-2 ring-amber-400/20">
                <span className="text-sm tracking-wider">PTU</span>
                <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-amber-400 ring-2 ring-white" />
              </div>
              
              <Link href="/" className="group block focus:outline-none">
                <h1 className="text-md font-extrabold tracking-tight text-slate-900 sm:text-lg group-hover:text-[#003D7A] transition-colors">
                  I.K. Gujral PTU
                </h1>
                <p className="text-xs font-medium text-slate-500 tracking-wide uppercase transition-colors group-hover:text-[#C41E3A]">
                  Alumni Relations Engine
                </p>
              </Link>
            </div>

            {/* Quick Live Status Dot */}
            <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/10">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Portal Connected
            </div>
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