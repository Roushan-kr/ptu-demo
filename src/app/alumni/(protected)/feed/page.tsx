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
  MessageCircle,
  Play
} from 'lucide-react';
import { toast } from 'react-hot-toast';

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
  isAdmin?: boolean;
}

interface FeedPost {
  id: string;
  author: {
    name: string;
    batchYear: number;
    avatarUrl?: string;
    currentRole?: string;
    currentCompany?: string;
    isAdmin?: boolean;
  };
  content: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  media?: {
    type: 'video' | 'image';
    title?: string;
    url: string;
    thumbnailUrl?: string;
  };
}

export default function AlumniFeed() {
  const [profile, setProfile] = useState<AlumniProfile | null>(null);
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareText, setShareText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const router = useRouter();

  const fetchFeed = async () => {
    try {
      const res = await fetch('/api/alumni/posts');
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch (err) {
      console.error('Error fetching feed posts:', err);
    }
  };

  useEffect(() => {
    fetch('/api/alumni/me')
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => {
        setProfile(data.user);
        setLoading(false);
        fetchFeed();
      })
      .catch(() => {
        // Check if there's a staff session before redirecting to alumni login
        fetch('/api/admin/me')
          .then(res => res.ok ? res.json() : Promise.reject())
          .then((data) => {
            // Staff is authenticated — show portal with admin profile metadata
            setProfile({
              name: data.user.name,
              email: data.user.email,
              isAdmin: true,
              currentRole: data.user.role,
              college: data.user.campus?.name || 'All Campuses (Consolidated)',
              batchYear: 0,
              branch: '',
            });
            setLoading(false);
            fetchFeed();
          })
          .catch(() => {
            router.push('/alumni/login');
          });
      });
  }, [router]);

  const handleCreatePost = async () => {
    if (!shareText.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/alumni/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: shareText }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Posted to community feed!');
        setShareText('');
        fetchFeed();
      } else {
        toast.error(data.error || 'Failed to submit post');
      }
    } catch (err) {
      toast.error('Failed to submit post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <p className="text-[11px] font-semibold text-slate-600">Where you can connect with Alumni</p>
            </div>
          </div>
          {/* User Info Container */}
          <div className="px-6 pb-6 pt-0 relative flex flex-col items-start">
            {/* Avatar overlapping banner */}
            <div className="w-20 h-20 rounded-full border-4 border-white shadow-md bg-gradient-to-tr from-[#003D7A] to-[#C41E3A] flex items-center justify-center text-white font-extrabold text-2xl -mt-10 mb-3 overflow-hidden">
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                getInitials(profile?.name || 'Admin')
              )}
            </div>
            
            <h3 className="text-lg font-bold text-gray-900">{profile?.name}</h3>
            {profile?.isAdmin ? (
              <div className="space-y-1 mt-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#012140] text-white">
                  {profile.currentRole || 'ADMINISTRATOR'}
                </span>
                <p className="text-xs text-slate-500 font-semibold">{profile.email}</p>
              </div>
            ) : (
              <>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  Class of {profile?.batchYear}
                </p>
                {profile?.currentRole && (
                  <p className="text-xs text-slate-600 mt-1 font-medium italic">
                    {profile.currentRole} {profile.currentCompany ? `at ${profile.currentCompany}` : ''}
                  </p>
                )}
              </>
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
                getInitials(profile?.name || 'Admin')
              )}
            </div>
            
            <input 
              type="text" 
              placeholder={profile?.isAdmin ? "Posting is managed via Admin Posts module" : "Share something with your community"} 
              value={shareText}
              onChange={(e) => setShareText(e.target.value)}
              disabled={profile?.isAdmin}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-100 hover:border-slate-200 focus:border-slate-200 focus:bg-white focus:outline-none rounded-full text-sm font-medium text-gray-800 placeholder:text-gray-400 transition"
            />

            {!profile?.isAdmin && shareText.trim() && (
              <button
                onClick={handleCreatePost}
                disabled={isSubmitting}
                className="px-5 py-2 bg-[#C41E3A] hover:bg-[#a3182f] text-white text-xs font-bold rounded-full transition active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? 'Posting...' : 'Post'}
              </button>
            )}

            {!shareText.trim() && (
              <div className="flex items-center gap-1">
                <button disabled className="hidden sm:flex items-center gap-1 px-3 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-50 rounded-full transition opacity-50">
                  <ImageIcon size={16} />
                  <span>Photo</span>
                </button>
                <button disabled className="hidden sm:flex items-center gap-1 px-3 py-2 text-xs font-bold text-[#003D7A] hover:bg-blue-50 rounded-full transition opacity-50">
                  <FileText size={16} />
                  <span>File</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Promotions Carousel / Scroll Grid (Birthday wish card removed) */}
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
              desc: 'Browse mentors and get the guidance you need',
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
          {posts.length > 0 ? (
            posts.map((post) => {
              const hasLiked = likedPosts[post.id];
              const isPostAdmin = post.author?.isAdmin;
              
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
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-sm font-bold text-gray-900 hover:text-[#003D7A] cursor-pointer">
                            {post.author.name}
                          </h4>
                          {isPostAdmin ? (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#012140] text-white tracking-wider">
                              ADMIN
                            </span>
                          ) : post.author.batchYear ? (
                            <span className="text-[11px] font-semibold text-slate-400">
                              Class of &apos;{String(post.author.batchYear).slice(-2)}
                            </span>
                          ) : null}
                        </div>
                        <p className="text-[10px] font-semibold text-slate-500">
                          {isPostAdmin ? 'System Administrator at IKGPTU' : `${post.author.currentRole || 'Alumni'} ${post.author.currentCompany ? `at ${post.author.currentCompany}` : ''}`}
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
                  {post.media && post.media.url && (
                    <div className="border-t border-slate-50 bg-slate-50 relative group overflow-hidden">
                      <div className="w-full max-h-[480px] overflow-hidden flex items-center justify-center bg-slate-100">
                        <img 
                          src={post.media.url} 
                          alt="Attached media" 
                          className="w-full h-auto object-cover group-hover:scale-[1.01] transition duration-500"
                        />
                      </div>
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
            })
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 text-slate-500 font-medium">
              No feed posts available. Start connecting with your community!
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
