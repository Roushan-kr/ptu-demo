// src/app/alumni/(protected)/feed/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar, 
  Briefcase, 
  Users, 
  Award, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  MoreHorizontal, 
  ThumbsUp, 
  Share2, 
  Rocket, 
  GraduationCap, 
  Cake, 
  MessageCircle,
  Play
} from 'lucide-react';

interface AlumniProfile {
  name: string;
  email: string;
  batchYear: number;
  branch: string;
  college: string;
  currentRole?: string;
  currentCompany?: string;
  city?: string;
  avatarUrl?: string;
}

interface MockPost {
  id: string;
  author: {
    name: string;
    batchYear: number;
    avatarUrl?: string;
    currentRole?: string;
    currentCompany?: string;
  };
  content: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  media?: {
    type: 'video' | 'image';
    title?: string;
    url: string;
    thumbnailUrl: string;
  };
}

export default function AlumniFeed() {
  const [profile, setProfile] = useState<AlumniProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [shareText, setShareText] = useState('');
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const router = useRouter();

  useEffect(() => {
    fetch('/api/alumni/me')
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => {
        setProfile(data.user);
        setLoading(false);
      })
      .catch(() => {
        router.push('/alumni/login');
      });
  }, [router]);

  const mockPosts: MockPost[] = [
    {
      id: 'post-1',
      author: {
        name: 'Test Admin',
        batchYear: profile?.batchYear || 1999,
        avatarUrl: profile?.avatarUrl || '',
        currentRole: 'System Administrator',
        currentCompany: 'IKGPTU'
      },
      content: 'hi',
      createdAt: 'Jun 17, 2026',
      likesCount: 12,
      commentsCount: 2,
      media: {
        type: 'video',
        title: 'Spring Cherry Blossom Drive in Tokyo 🌸 / 8K 60fps HDR',
        url: 'https://www.youtube.com',
        thumbnailUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop'
      }
    },
    {
      id: 'post-2',
      author: {
        name: 'Rajesh Kumar',
        batchYear: 2015,
        avatarUrl: '',
        currentRole: 'CTO',
        currentCompany: 'TechCorp India'
      },
      content: 'Hello colleagues! We are actively looking for Senior Software Engineers to join our core architecture team. Passion for scalability is a must. If interested, check out our posting in Jobs section or send me a message! 🚀',
      createdAt: 'Jun 16, 2026',
      likesCount: 34,
      commentsCount: 8
    },
    {
      id: 'post-3',
      author: {
        name: 'Priya Singh',
        batchYear: 2018,
        avatarUrl: '',
        currentRole: 'Founder',
        currentCompany: 'AI Solutions'
      },
      content: 'Incredibly proud to share that AI Solutions has been recognized as one of the top 30 promising startups this year. Big thanks to all the mentors at PTU who helped us in our early incubation phase! 🌟🏆',
      createdAt: 'Jun 15, 2026',
      likesCount: 56,
      commentsCount: 14,
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1200&auto=format&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1200&auto=format&fit=crop'
      }
    }
  ];

  const handleLike = (id: string) => {
    setLikedPosts(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#003D7A] border-t-[#C41E3A] rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600 font-medium">Synchronizing feed...</p>
        </div>
      </div>
    );
  }

  // Get initial letters of user's name for placeholder avatar
  const getInitials = (name: string) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'A';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-8">
      
      {/* Left Sidebar - Profile & Communities & Quick Links */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Banner Graphic */}
          <div className="h-28 bg-gradient-to-r from-blue-900/10 via-slate-100 to-indigo-900/10 relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#003D7A_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <div className="text-center p-3 relative z-10">
              <p className="text-[10px] font-bold tracking-widest text-[#003D7A] uppercase">Creating a platform</p>
              <p className="text-[11px] font-semibold text-slate-600">Where you can connect to connect with Alumni</p>
            </div>
          </div>
          {/* User Info Container */}
          <div className="px-6 pb-6 pt-0 relative flex flex-col items-start">
            {/* Avatar overlapping banner */}
            <div className="w-20 h-20 rounded-full border-4 border-white shadow-md bg-gradient-to-tr from-[#003D7A] to-[#C41E3A] flex items-center justify-center text-white font-extrabold text-2xl -mt-10 mb-3 overflow-hidden">
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                getInitials(profile?.name || 'Test Admin')
              )}
            </div>
            
            <h3 className="text-lg font-bold text-gray-900">{profile?.name || 'Test Admin'}</h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Class of {profile?.batchYear || 1999}
            </p>
            {profile?.currentRole && (
              <p className="text-xs text-slate-600 mt-1 font-medium italic">
                {profile.currentRole} {profile.currentCompany ? `at ${profile.currentCompany}` : ''}
              </p>
            )}
          </div>
        </div>

        {/* Communities Panel */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h4 className="text-md font-bold text-gray-900 mb-4">Your communities</h4>
          <div className="flex flex-wrap gap-2.5">
            {[
              'Internet of Things (IOT)',
              'Women Entrepreneurs',
              'Marketing Up',
              'Startups',
              'GCML Core Teams 2025'
            ].map((tag, idx) => (
              <button 
                key={idx} 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-sky-100 bg-sky-50/50 hover:bg-sky-50 text-xs font-bold text-sky-700 transition"
              >
                <Users size={12} />
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Links Panel */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h4 className="text-md font-bold text-gray-900 mb-4">Quick links</h4>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Business Connect', icon: Award, href: '/alumni/networking' },
              { label: 'Mentorship', icon: GraduationCap, href: '/alumni/networking' },
              { label: 'Events', icon: Calendar, href: '/alumni/events' },
              { label: 'Jobs & Internships', icon: Briefcase, href: '/alumni/jobs' },
            ].map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-blue-50 bg-blue-50/30 hover:bg-blue-50 hover:border-blue-100 text-xs font-bold text-[#003D7A] transition"
              >
                <link.icon size={14} className="text-[#003D7A]" />
                <span className="truncate">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* Right Content Area - Feed Composer, Promo Carousel & Posts */}
      <div className="lg:col-span-8 space-y-6">

        {/* Composer Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-[#003D7A] font-bold text-sm overflow-hidden flex-shrink-0">
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                getInitials(profile?.name || 'Test Admin')
              )}
            </div>
            
            <input 
              type="text" 
              placeholder="Share something with your community" 
              value={shareText}
              onChange={(e) => setShareText(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-100 hover:border-slate-200 focus:border-slate-200 focus:bg-white focus:outline-none rounded-full text-sm font-medium text-gray-800 placeholder:text-gray-400 transition"
            />

            <div className="flex items-center gap-1">
              <button className="hidden sm:flex items-center gap-1 px-3 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-50 rounded-full transition">
                <ImageIcon size={16} />
                <span>Photo</span>
              </button>
              <button className="hidden sm:flex items-center gap-1 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-full transition">
                <Video size={16} />
                <span>Video</span>
              </button>
              <button className="hidden sm:flex items-center gap-1 px-3 py-2 text-xs font-bold text-sky-600 hover:bg-sky-50 rounded-full transition">
                <FileText size={16} />
                <span>File</span>
              </button>
              <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition" title="More options">
                <MoreHorizontal size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Promotions Carousel / Scroll Grid */}
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none]">
          {[
            {
              title: 'Are you Startup Owner?',
              desc: 'List your startup here and stand out in the community!',
              btn: 'List now',
              iconColor: 'bg-orange-500',
              icon: Rocket,
              href: '/alumni/startups'
            },
            {
              title: '1 job opening you may like',
              desc: 'Posted by your fellow alumni within the community',
              btn: 'View openings',
              iconColor: 'bg-emerald-500',
              icon: Briefcase,
              href: '/alumni/jobs'
            },
            {
              title: 'Looking for guidance?',
              desc: 'Browse 22 mentors and get the guidance you need',
              btn: 'See mentors',
              iconColor: 'bg-blue-500',
              icon: GraduationCap,
              href: '/alumni/networking'
            },
            {
              title: 'Get your story published!',
              desc: 'Share it on the Post and inspire the community',
              btn: 'Post now',
              iconColor: 'bg-[#009688]',
              icon: FileText,
              href: '/alumni/newscorner'
            },
            {
              title: 'Memories fade.......',
              desc: 'Share photos of your time here and help us preserve them',
              btn: 'Share photos',
              iconColor: 'bg-pink-500',
              icon: ImageIcon,
              href: '/alumni/gallery'
            },
            {
              title: '2 people have birthdays today',
              desc: 'Make their day brighter by sending a wish!',
              btn: 'Send wishes',
              iconColor: 'bg-amber-500',
              icon: Cake,
              href: '#'
            }
          ].map((promo, idx) => (
            <div 
              key={idx} 
              className="w-[200px] flex-shrink-0 bg-white border border-slate-100 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition duration-200"
            >
              <div>
                <div className={`w-9 h-9 rounded-full ${promo.iconColor} flex items-center justify-center text-white mb-3 shadow-sm`}>
                  <promo.icon size={16} />
                </div>
                <h5 className="text-xs font-bold text-gray-900 line-clamp-2 min-h-[32px] leading-tight">
                  {promo.title}
                </h5>
                <p className="text-[10px] text-slate-500 font-medium mt-1 line-clamp-3 leading-relaxed">
                  {promo.desc}
                </p>
              </div>
              <Link href={promo.href} className="w-full mt-4">
                <button className="w-full py-1.5 bg-[#003D7A] hover:bg-[#002b56] text-white text-[11px] font-bold rounded-lg transition active:scale-[0.98]">
                  {promo.btn}
                </button>
              </Link>
            </div>
          ))}
        </div>

        {/* Feed Posts */}
        <div className="space-y-6">
          {mockPosts.map((post) => {
            const hasLiked = likedPosts[post.id];
            
            return (
              <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                
                {/* Post Header */}
                <div className="p-4 flex items-center justify-between border-b border-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 border border-slate-100 flex items-center justify-center text-[#003D7A] font-bold text-sm overflow-hidden flex-shrink-0">
                      {post.author.avatarUrl ? (
                        <img src={post.author.avatarUrl} alt={post.author.name} className="w-full h-full object-cover" />
                      ) : (
                        getInitials(post.author.name)
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-gray-900 hover:text-[#003D7A] cursor-pointer">
                          {post.author.name}
                        </h4>
                        <span className="text-[11px] font-semibold text-slate-400">
                          Class of &apos;{String(post.author.batchYear).slice(-2)}
                        </span>
                      </div>
                      <p className="text-[10px] font-semibold text-slate-500">
                        {post.author.currentRole} {post.author.currentCompany ? `at ${post.author.currentCompany}` : ''}
                      </p>
                      <p className="text-[9px] font-medium text-slate-400 mt-0.5">
                        {post.createdAt}
                      </p>
                    </div>
                  </div>
                  
                  <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition">
                    <MoreHorizontal size={18} />
                  </button>
                </div>

                {/* Post Content */}
                <div className="px-5 py-4">
                  <p className="text-sm text-gray-800 leading-relaxed font-medium whitespace-pre-line">
                    {post.content}
                  </p>
                </div>

                {/* Post Media Area */}
                {post.media && (
                  <div className="border-t border-slate-50 bg-slate-50 relative group cursor-pointer overflow-hidden">
                    {post.media.type === 'video' ? (
                      <div className="aspect-video w-full relative">
                        <img 
                          src={post.media.thumbnailUrl} 
                          alt={post.media.title} 
                          className="w-full h-full object-cover group-hover:scale-[1.01] transition duration-500" 
                        />
                        {/* YouTube Player Mock Overlay */}
                        <div className="absolute inset-0 bg-black/20 flex flex-col justify-between p-4 text-white">
                          <h5 className="text-sm font-bold truncate drop-shadow-md">
                            {post.media.title}
                          </h5>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-12 bg-red-600 hover:bg-red-700 rounded-2xl flex items-center justify-center transition shadow-lg shadow-black/20">
                              <Play size={24} fill="currentColor" className="ml-1 text-white" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full max-h-[480px] overflow-hidden flex items-center justify-center bg-slate-100">
                        <img 
                          src={post.media.url} 
                          alt="Attached media" 
                          className="w-full h-auto object-cover group-hover:scale-[1.01] transition duration-500"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Engagement Stats Bar */}
                <div className="px-5 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-500 border-t border-slate-50">
                  <div className="flex items-center gap-1">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-50 text-blue-600">
                      <ThumbsUp size={11} fill={hasLiked ? "currentColor" : "none"} />
                    </div>
                    <span>{post.likesCount + (hasLiked ? 1 : 0)} likes</span>
                  </div>
                  <div>
                    <span>{post.commentsCount} comments</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-3 py-1 flex items-center justify-between border-t border-slate-50 bg-slate-50/20 text-xs font-bold text-slate-600">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className={`flex-1 py-2 flex items-center justify-center gap-1.5 rounded-xl transition ${
                      hasLiked 
                        ? 'text-blue-600 bg-blue-50/50' 
                        : 'hover:bg-slate-50 hover:text-slate-800'
                    }`}
                  >
                    <ThumbsUp size={16} className={hasLiked ? "fill-blue-600 text-blue-600" : ""} />
                    <span>Like</span>
                  </button>
                  <button className="flex-1 py-2 flex items-center justify-center gap-1.5 rounded-xl hover:bg-slate-50 hover:text-slate-800 transition">
                    <MessageCircle size={16} />
                    <span>Comment</span>
                  </button>
                  <button className="flex-1 py-2 flex items-center justify-center gap-1.5 rounded-xl hover:bg-slate-50 hover:text-slate-800 transition">
                    <Share2 size={16} />
                    <span>Share</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
