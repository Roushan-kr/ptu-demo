// src/app/alumni/(protected)/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Briefcase, Users, BookOpen, Award } from 'lucide-react';

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

const upcomingEvents = [
  { id: 1, title: 'Batch 2020 Reunion', date: 'June 15, 2024', location: 'Chandigarh', attendees: 42 },
  { id: 2, title: 'Tech Career Summit', date: 'June 22, 2024', location: 'Online', attendees: 128 },
  { id: 3, title: 'Networking Brunch', date: 'June 29, 2024', location: 'Chandigarh', attendees: 35 },
];

const jobOpportunities = [
  { id: 1, title: 'Senior Software Engineer', company: 'TechCorp India', location: 'Bangalore', posted: '2 days ago' },
  { id: 2, title: 'Product Manager', company: 'StartupXYZ', location: 'Pune', posted: '5 days ago' },
  { id: 3, title: 'Data Scientist', company: 'AI Solutions', location: 'Remote', posted: '1 week ago' },
];

const alumniHighlights = [
  { id: 1, name: 'Rajesh Kumar', batch: '2015', role: 'CTO at TechCorp', achievement: 'Led team of 50+ engineers' },
  { id: 2, name: 'Priya Singh', batch: '2018', role: 'Entrepreneur', achievement: 'Founded AI Startup (50M+ valuation)' },
  { id: 3, name: 'Amit Patel', batch: '2016', role: 'VP Engineering at MNC', achievement: 'Patent holder in Cloud Technologies' },
];

export default function AlumniDashboard() {
  const [profile, setProfile] = useState<AlumniProfile | null>(null);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#003D7A] border-t-[#C41E3A] rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-[#C41E3A] to-[#003D7A] text-white rounded-2xl p-8 shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back, {profile?.name?.split(' ')[0]}! 👋</h1>
            <p className="text-red-100 text-lg">{profile?.branch} • Class of {profile?.batchYear}</p>
            {profile?.currentCompany && <p className="text-red-100 mt-1">📍 {profile.currentCompany}, {profile.city}</p>}
          </div>
        </div>
      </div>

      {/* Profile Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-[#C41E3A]">
          <p className="text-gray-600 text-sm font-semibold mb-1">Email</p>
          <p className="text-gray-900 font-semibold text-sm truncate">{profile?.email}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-[#003D7A]">
          <p className="text-gray-600 text-sm font-semibold mb-1">College</p>
          <p className="text-gray-900 font-semibold text-sm truncate">{profile?.college}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-[#0057B8]">
          <p className="text-gray-600 text-sm font-semibold mb-1">Current Role</p>
          <p className="text-gray-900 font-semibold text-sm truncate">{profile?.currentRole || 'Not specified'}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-[#C41E3A]">
          <p className="text-gray-600 text-sm font-semibold mb-1">Location</p>
          <p className="text-gray-900 font-semibold text-sm truncate">{profile?.city || 'Not specified'}</p>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#C41E3A]/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-[#C41E3A]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
          </div>
          <Link href="/alumni/events" className="text-[#003D7A] hover:text-[#C41E3A] font-semibold text-sm">
            View All →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {upcomingEvents.map(event => (
            <div key={event.id} className="border-2 border-gray-200 rounded-xl p-5 hover:border-[#003D7A] hover:shadow-md transition">
              <p className="text-sm text-[#C41E3A] font-bold uppercase tracking-wide mb-2">📅 {event.date}</p>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
              <p className="text-sm text-gray-600 mb-3">📍 {event.location}</p>
              <button className="w-full py-2 border-2 border-[#003D7A] text-[#003D7A] font-semibold rounded-lg hover:bg-[#003D7A] hover:text-white transition text-sm">
                Register ({event.attendees})
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Job Opportunities */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#003D7A]/10 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-[#003D7A]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Job Opportunities</h2>
          </div>
          <Link href="/alumni/jobs" className="text-[#003D7A] hover:text-[#C41E3A] font-semibold text-sm">
            View All →
          </Link>
        </div>
        <div className="space-y-3">
          {jobOpportunities.map(job => (
            <div key={job.id} className="border border-gray-200 rounded-xl p-4 hover:border-[#003D7A] hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{job.company} • {job.location}</p>
                  <p className="text-xs text-gray-500 mt-2">Posted {job.posted}</p>
                </div>
                <button className="px-4 py-2 bg-[#003D7A] text-white rounded-lg hover:bg-[#002654] transition text-sm font-semibold">
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alumni Network Highlights */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0057B8]/10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-[#0057B8]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Alumni Highlights</h2>
          </div>
          <Link href="/alumni/networking" className="text-[#003D7A] hover:text-[#C41E3A] font-semibold text-sm">
            View Network →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {alumniHighlights.map(alumni => (
            <div key={alumni.id} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200 hover:shadow-md transition">
              <p className="text-xs font-bold text-[#C41E3A] uppercase tracking-wide mb-2">Batch {alumni.batch}</p>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{alumni.name}</h3>
              <p className="text-sm text-[#003D7A] font-semibold mb-3">{alumni.role}</p>
              <p className="text-sm text-gray-700 italic">"✨ {alumni.achievement}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Resources */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#0057B8]/10 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-[#0057B8]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Learning Resources</h3>
          </div>
          <p className="text-gray-600 mb-4">Access exclusive webinars, courses, and mentorship programs from experienced alumni.</p>
          <button className="w-full py-3 bg-[#0057B8] text-white rounded-lg hover:bg-[#003D7A] transition font-semibold">
            Explore Resources
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#C41E3A]/10 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-[#C41E3A]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Your Profile</h3>
          </div>
          <p className="text-gray-600 mb-4">Complete and update your profile to make the most of the alumni network.</p>
          <Link href="/alumni/profile" className="block w-full py-3 bg-[#C41E3A] text-white rounded-lg hover:bg-[#A01830] transition font-semibold text-center">
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
}