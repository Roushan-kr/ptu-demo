import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { verifyAlumniAccessToken } from '@/lib/auth/alumni-jwt';
import { GET } from '@/app/api/landing-data/route';

// Components
import HeroCarousel from '@/components/landing/HeroCarousel';
import EventsSection from '@/components/landing/EventsSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import GalleryMasonry from '@/components/landing/GalleryMasonry';
import NewsletterSignup from '@/components/landing/NewsletterSignup';

async function getLandingData() {
  const res = await GET();
  return await res.json();
}

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
    redirect('/alumni/feed');
  }

  // Load landing page data (mock API route helper call)
  const data = await getLandingData();

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-gray-900 selection:bg-[#C41E3A] selection:text-white">
      {/* 12. Navigation Header */}
      <nav className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-md shadow-blue-900/10 tracking-wider overflow-hidden border border-slate-100">
              <img src="/icon.png" alt="logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-extrabold text-gray-900 tracking-tight leading-none mb-1">IKGPTU Alumni</h1>
              <p className="text-[10px] font-bold text-[#C41E3A] tracking-widest uppercase">Since 1997</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/alumni/login" 
              className="px-5 py-2.5 bg-gradient-to-r from-[#003D7A] to-[#002b56] text-white rounded-xl hover:from-[#C41E3A] hover:to-[#a01830] shadow-md shadow-blue-950/10 hover:shadow-lg transition-all duration-300 font-bold text-xs tracking-wider uppercase"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* 1. Hero Section (Dynamic rotating carousel) */}
      <HeroCarousel slides={data.heroSlides} />

      {/* 2. Stats Strip */}
      <section className="bg-gradient-to-r from-[#003D7A] to-[#C41E3A] py-14 text-white relative overflow-hidden shadow-inner">
        <div className="absolute inset-0 bg-blue-950/20 backdrop-brightness-75"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-y-8 gap-x-4 md:gap-4 text-center justify-center">
            <div className="md:border-r md:border-white/10">
              <p className="text-3xl md:text-4.5xl font-black mb-1.5 tracking-tight">{data.stats.totalAlumni}</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-200 font-bold">Total Alumni</p>
            </div>
            <div className="md:border-r md:border-white/10">
              <p className="text-3xl md:text-4.5xl font-black mb-1.5 tracking-tight">{data.stats.campuses}</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-200 font-bold">Campuses</p>
            </div>
            <div className="md:border-r md:border-white/10 sm:border-none">
              <p className="text-3xl md:text-4.5xl font-black mb-1.5 tracking-tight">{data.stats.collegesAffiliated}+</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-200 font-bold">Affiliated Colleges</p>
            </div>
            <div className="md:border-r md:border-white/10">
              <p className="text-3xl md:text-4.5xl font-black mb-1.5 tracking-tight">{data.stats.countriesRepresented}+</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-200 font-bold">Countries</p>
            </div>
            <div className="col-span-2 sm:col-span-1 md:col-span-1">
              <p className="text-3xl md:text-4.5xl font-black mb-1.5 tracking-tight">{data.stats.eventsHosted}+</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-200 font-bold">Events Hosted</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. About / Welcome Note */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Note text */}
            <div className="lg:col-span-7">
              <span className="inline-block px-3 py-1 bg-[#003D7A]/5 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-[#003D7A] mb-4">
                Message from Leadership
              </span>
              <h2 className="text-3xl font-black text-gray-900 mb-6 tracking-tight">
                {data.welcomeNote.title}
              </h2>
              <div 
                className="text-gray-600 text-sm leading-relaxed font-light mb-8"
                dangerouslySetInnerHTML={{ __html: data.welcomeNote.body }}
              />
              <div>
                <h4 className="font-extrabold text-gray-900 text-sm">{data.welcomeNote.name}</h4>
                <p className="text-xs text-[#C41E3A] font-bold uppercase tracking-wider mt-0.5">{data.welcomeNote.designation}</p>
              </div>
            </div>
            {/* Leadership Photo Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative p-3 bg-white border border-slate-100 rounded-3xl shadow-xl max-w-sm w-full">
                <div className="relative h-96 w-full rounded-2xl overflow-hidden bg-slate-50">
                  <img 
                    src={data.welcomeNote.photo} 
                    alt={data.welcomeNote.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Upcoming Events Section */}
      <EventsSection events={data.events} />

      {/* 5. News & Updates Section */}
      <section id="news" className="py-24 bg-slate-50 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-xs font-extrabold text-[#C41E3A] uppercase tracking-widest mb-3">Stay Updated</h3>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">News & Campus Updates</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#C41E3A] to-[#003D7A] mx-auto rounded-full mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto font-medium">
              Read about student placements, faculty breakthroughs, and alumni milestones.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.news.map((item: any) => (
              <div 
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full group"
              >
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  <img 
                    src={item.coverImage} 
                    alt={item.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  {item.featured && (
                    <span className="absolute top-4 left-4 bg-gradient-to-r from-[#C41E3A] to-[#e62648] text-white text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full shadow">
                      ★ Featured
                    </span>
                  )}
                  <span className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-0.5 rounded">
                    {item.category}
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                    {item.publishedDate} • By {item.author}
                  </div>
                  <h4 className="text-base font-extrabold text-gray-900 mb-3 group-hover:text-[#003D7A] transition-colors leading-snug line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-gray-600 text-xs leading-relaxed line-clamp-3 mb-6">
                    {item.summary}
                  </p>
                  <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between text-xs font-semibold text-[#003D7A]">
                    <span>Read Full Story →</span>
                    <span className="text-slate-400 font-medium">📍 {item.campusTag}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Notable Alumni / Spotlight */}
      <section id="spotlight" className="py-10 bg-white scroll-mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-xs font-extrabold text-[#C41E3A] uppercase tracking-widest mb-3">Hall of Fame</h3>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">Alumni Spotlight</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#C41E3A] to-[#003D7A] mx-auto rounded-full mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto font-medium">
              Celebrating our distinguished alumni leading global enterprise domains and pathbreaking research cells.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {data.notableAlumni.map((alum: any) => (
              <div 
                key={alum.id}
                className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col text-center"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-2 border-slate-100 shadow-inner">
                  <img 
                    src={alum.photo} 
                    alt={alum.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-base font-bold text-gray-900">{alum.name}</h4>
                <p className="text-xs font-medium text-[#C41E3A] uppercase tracking-wider mt-0.5">
                  Class of {alum.batch} | {alum.branch}
                </p>
                <div className="my-3 text-xs bg-slate-50 border border-slate-100 rounded-lg py-1.5 px-3 inline-block mx-auto font-semibold text-gray-700">
                  {alum.designation} @ <span className="text-[#003D7A]">{alum.company}</span>
                </div>
                <p className="text-gray-600 text-xs leading-relaxed font-light my-4">
                  "{alum.bio}"
                </p>
                <a 
                  href={alum.linkedIn}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-auto pt-4 text-xs font-bold text-[#003D7A] hover:text-[#C41E3A] transition-colors flex items-center justify-center gap-1.5"
                >
                  Connect on LinkedIn ↗
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Testimonials Section */}
      <TestimonialsSection initialTestimonials={data.testimonials} />

      {/* 8. Gallery / Memories Section */}
      <GalleryMasonry items={data.gallery} />

      {/* 9. Campus Showcase */}
      <section id="campuses" className="py-10 bg-slate-50 scroll-mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-xs font-extrabold text-[#C41E3A] uppercase tracking-widest mb-3">Our Footprint</h3>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">Campus Showcase</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#C41E3A] to-[#003D7A] mx-auto rounded-full mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto font-medium">
              Explore our core campuses fostering engineering, tech research, and professional domains.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {data.campuses.map((campus: any) => (
              <div 
                key={campus.id}
                className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
              >
                <div className="text-3xl mb-4">
                  {campus .logo.includes('https://') || campus .logo.includes('http://') ? (
                    <img src={campus.logo} alt={campus.name} className="h-14" />
                  ) : (
                    <span className="text-xl">{campus.logo}</span>
                  )}
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-1">{campus.name}</h4>
                <p className="text-xs font-semibold text-[#C41E3A] uppercase tracking-wider mb-4">📍 {campus.location}</p>
                <p className="text-gray-650 text-xs leading-relaxed mb-6 font-light">
                  {campus.description}
                </p>
                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-800">{campus.alumniCount} Alumni</span>
                  <a href={campus.link} className="font-semibold text-[#003D7A] hover:underline">Visit Page →</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Partner/Affiliated Colleges strip */}
      <section className="py-16 bg-white border-t border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-8">
            Partner / Affiliated Institutions
          </p>
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-70">
            {data.affiliatedColleges.map((college: any) => (
              <div key={college.id} className="flex items-center gap-2 hover:opacity-100 transition-opacity">
                {college.logo.includes('https://') || college.logo.includes('http://') ? (
                  <img src={college.logo} alt={college.name} className="h-14" />
                ) : (
                  <span className="text-xl">{college.logo}</span>
                )}
                <span className="text-xs font-bold text-slate-600">{college.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. Newsletter Capture Form */}
      <NewsletterSignup />

      {/* 12. Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            <div>
              <h4 className="font-extrabold text-white mb-4 tracking-wider text-xs uppercase">IKGPTU Alumni</h4>
              <p className="text-[11px] leading-relaxed font-light text-slate-400">
                Fostering lifelong alliances across technology, management research, and creative design domains globally since 1997.
              </p>
            </div>
            <div>
              <h4 className="font-extrabold text-white mb-4 tracking-wider text-xs uppercase">Quick Navigation</h4>
              <ul className="space-y-2.5 text-xs font-semibold">
                <li><a href="#" className="hover:text-[#C41E3A] transition-colors">About Association</a></li>
                <li><a href="#events" className="hover:text-[#C41E3A] transition-colors">Events & Reunions</a></li>
                <li><a href="#news" className="hover:text-[#C41E3A] transition-colors">News Updates</a></li>
                <li><a href="#" className="hover:text-[#C41E3A] transition-colors">Support Desk</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-extrabold text-white mb-4 tracking-wider text-xs uppercase">Compliance</h4>
              <ul className="space-y-2.5 text-xs font-semibold">
                <li><a href="#" className="hover:text-[#C41E3A] transition-colors">Privacy Charter</a></li>
                <li><a href="#" className="hover:text-[#C41E3A] transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-[#C41E3A] transition-colors">Platform Guidelines</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-extrabold text-white mb-4 tracking-wider text-xs uppercase">Connect Safely</h4>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold">
                <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                <a href="#" className="hover:text-white transition-colors">Facebook</a>
                <a href="#" className="hover:text-white transition-colors">Twitter</a>
                <a href="#" className="hover:text-white transition-colors">YouTube</a>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800/80 pt-8 text-center text-[11px] font-medium tracking-wide text-slate-500">
            <p>&copy; {new Date().getFullYear()} IKGPTU Alumni Network. Designed to University Excellence Standards. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}