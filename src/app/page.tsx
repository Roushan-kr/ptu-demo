import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { verifyAlumniAccessToken } from '@/lib/auth/alumni-jwt';

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('alumniAccessToken')?.value;
  let isAuthenticated = false;

  if (token) {
    try {
      verifyAlumniAccessToken(token);
      isAuthenticated = true;
    } catch {
      // Token expired – treat as not authenticated
    }
  }

  if (isAuthenticated) {
    redirect('/alumni/dashboard');
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-[#C41E3A] to-[#003D7A] rounded-xl flex items-center justify-center font-black text-white text-sm shadow-md shadow-blue-900/10 tracking-wider">
              PTU
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-gray-900 tracking-tight leading-none mb-1">IKGPTU Alumni</h1>
              <p className="text-xs font-medium text-[#C41E3A] tracking-widest uppercase">Since 1997</p>
            </div>
          </div>
          <Link href="/alumni/login" className="px-5 py-2 bg-gradient-to-r from-[#003D7A] to-[#002b56] text-white rounded-lg hover:from-[#C41E3A] hover:to-[#a01830] shadow-md shadow-blue-950/10 hover:shadow-lg transition-all duration-300 font-semibold text-sm">
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] bg-cover bg-center flex items-center justify-center overflow-hidden" style={{backgroundImage: 'url(/campus.jpg)', backgroundAttachment: 'fixed'}}>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/85 via-gray-900/70 to-transparent"></div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center lg:text-left lg:grid lg:grid-cols-12 gap-8 items-center w-full">
          <div className="lg:col-span-8 text-white">
            <div className="mb-6 flex justify-center lg:justify-start">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#C41E3A] rounded-full text-xs font-bold uppercase tracking-widest text-white shadow-sm animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                Welcome to Our Global Community
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-6 leading-[1.15] tracking-tight text-white drop-shadow-sm">
              Stay Connected with Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-300">Alma Mater</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-200 mb-10 leading-relaxed max-w-2xl font-light">
              Join the official network of I.K. Gujral Punjab Technical University. Reconnect with batchmates, accelerate your professional journey, and drive university excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/alumni/login" className="px-8 py-4 bg-gradient-to-r from-[#C41E3A] to-[#e62648] text-white font-bold rounded-xl hover:shadow-xl hover:shadow-red-900/30 transition-all duration-300 text-base text-center transform hover:-translate-y-0.5">
                Access Your Account
              </Link>
              <Link href="#features" className="px-8 py-4 border-2 border-white/80 text-white font-bold rounded-xl hover:bg-white/10 hover:border-white transition-all duration-300 text-base text-center backdrop-blur-sm">
                Explore Platform
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h3 className="text-xs font-extrabold text-[#C41E3A] uppercase tracking-widest mb-3">Explore Our Platform</h3>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">Everything You Need to Succeed</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#C41E3A] to-[#003D7A] mx-auto rounded-full mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto font-medium">Connect, collaborate, and grow with thousands of distinguished IKGPTU alumni worldwide.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group">
              <div className="w-12 h-12 bg-[#003D7A]/5 text-[#003D7A] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#003D7A] group-hover:text-white transition-all duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#003D7A] transition-colors">Connect with Alumni</h4>
              <p className="text-gray-600 text-sm leading-relaxed">Build meaningful relationships with fellow alumni from your batch and across the years. Find mentors and secure global collaborations.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group">
              <div className="w-12 h-12 bg-[#C41E3A]/5 text-[#C41E3A] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#C41E3A] group-hover:text-white transition-all duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#C41E3A] transition-colors">Career Opportunities</h4>
              <p className="text-gray-600 text-sm leading-relaxed">Discover targeted job openings, premium internships, and fast-track career growth options shared directly by corporate alumni leaders.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group">
              <div className="w-12 h-12 bg-[#003D7A]/5 text-[#003D7A] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#003D7A] group-hover:text-white transition-all duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#003D7A] transition-colors">Events & Reunions</h4>
              <p className="text-gray-600 text-sm leading-relaxed">Stay seamlessly updated with flagship alumni meets, structured batch reunions, tech webinars, and offline mixer events.</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group">
              <div className="w-12 h-12 bg-[#C41E3A]/5 text-[#C41E3A] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#C41E3A] group-hover:text-white transition-all duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#C41E3A] transition-colors">Global Network</h4>
              <p className="text-gray-600 text-sm leading-relaxed">Bridge your geographical gap. Seamlessly connect with IKGPTU legacy professionals established in tier-1 tech firms overseas.</p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group">
              <div className="w-12 h-12 bg-[#003D7A]/5 text-[#003D7A] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#003D7A] group-hover:text-white transition-all duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#003D7A] transition-colors">Learning Resources</h4>
              <p className="text-gray-600 text-sm leading-relaxed">Unlock access to interactive panels, industry knowledge maps, and specialized mentorship arrays curated by top leaders.</p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group">
              <div className="w-12 h-12 bg-[#C41E3A]/5 text-[#C41E3A] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#C41E3A] group-hover:text-white transition-all duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#C41E3A] transition-colors">Alumni Laurels</h4>
              <p className="text-gray-600 text-sm leading-relaxed">Celebrate milestone breakthroughs, stellar entrepreneurial trajectories, and national awards bagged by our alumni cohort.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-[#003D7A] to-[#C41E3A] py-20 text-white relative overflow-hidden shadow-inner">
        <div className="absolute inset-0 bg-blue-950/20 backdrop-brightness-75"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center">
            <div className="border-r border-white/10 last:border-0">
              <p className="text-4xl md:text-5xl font-black mb-2 tracking-tight">25K+</p>
              <p className="text-xs md:text-sm uppercase tracking-widest text-slate-200 font-semibold">Alumni Directory</p>
            </div>
            <div className="border-r border-white/10 md:last:border-0 last:border-0">
              <p className="text-4xl md:text-5xl font-black mb-2 tracking-tight">50+</p>
              <p className="text-xs md:text-sm uppercase tracking-widest text-slate-200 font-semibold">Countries Settled</p>
            </div>
            <div className="border-r border-white/10 last:border-0">
              <p className="text-4xl md:text-5xl font-black mb-2 tracking-tight">500+</p>
              <p className="text-xs md:text-sm uppercase tracking-widest text-slate-200 font-semibold">Global Mentors</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-black mb-2 tracking-tight">100+</p>
              <p className="text-xs md:text-sm uppercase tracking-widest text-slate-200 font-semibold">Annual Events</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">Ready to Reimagine Your Network?</h2>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">Secure your footprint inside our flourishing legacy ecosystem today. Step in to learn, excel, and mentor.</p>
          <Link href="/alumni/login" className="inline-block px-10 py-4.5 bg-gradient-to-r from-[#003D7A] via-[#002b56] to-[#C41E3A] text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-blue-900/30 transition-all duration-300 text-base transform hover:-translate-y-0.5">
            Sign In to Your Workspace
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            <div>
              <h4 className="font-extrabold text-white mb-4 tracking-wider text-sm uppercase">IKGPTU Alumni</h4>
              <p className="text-xs leading-relaxed font-medium">Fostering lifelong alliances across tech, management, and design domains globally.</p>
            </div>
            <div>
              <h4 className="font-extrabold text-white mb-4 tracking-wider text-sm uppercase">Quick Navigation</h4>
              <ul className="space-y-2.5 text-xs font-semibold">
                <li><a href="#" className="hover:text-[#C41E3A] transition-colors">About Association</a></li>
                <li><a href="#" className="hover:text-[#C41E3A] transition-colors">Support Desk</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-extrabold text-white mb-4 tracking-wider text-sm uppercase">Compliance</h4>
              <ul className="space-y-2.5 text-xs font-semibold">
                <li><a href="#" className="hover:text-[#C41E3A] transition-colors">Privacy Charter</a></li>
                <li><a href="#" className="hover:text-[#C41E3A] transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-extrabold text-white mb-4 tracking-wider text-sm uppercase">Connect Safely</h4>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold">
                <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                <a href="#" className="hover:text-white transition-colors">Facebook</a>
                <a href="#" className="hover:text-white transition-colors">Twitter</a>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800/80 pt-8 text-center text-xs font-medium tracking-wide text-slate-500">
            <p>&copy; {new Date().getFullYear()} IKGPTU Alumni Network. Designed to University Excellence Standards. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}