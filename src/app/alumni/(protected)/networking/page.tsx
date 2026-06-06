'use client';

import { useState } from 'react';
import { Users, Briefcase, MapPin,  Globe, Search, Filter } from 'lucide-react';

interface Alumni {
  id: number;
  name: string;
  batch: string;
  role: string;
  company: string;
  location: string;
  branch: string;
  bio: string;
  image: string;
  linkedin?: string;
  skills: string[];
}

const alumni: Alumni[] = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    batch: '2015',
    role: 'CTO & Co-founder',
    company: 'TechCorp India',
    location: 'Bangalore',
    branch: 'Computer Science',
    bio: 'Built a team of 50+ engineers. Passionate about cloud architecture and mentoring startup founders.',
    image: '👨‍💼',
    linkedin: 'rajesh-kumar',
    skills: ['Cloud Architecture', 'Team Leadership', 'Mentoring', 'AWS', 'System Design']
  },
  {
    id: 2,
    name: 'Priya Singh',
    batch: '2018',
    role: 'Founder & CEO',
    company: 'AI Innovations Inc',
    location: 'Singapore',
    branch: 'Electronics & Communication',
    bio: 'Building AI solutions for enterprises. Raised 50M+ in funding. Women entrepreneur of the year.',
    image: '👩‍💼',
    linkedin: 'priya-singh',
    skills: ['AI/ML', 'Entrepreneurship', 'Business Strategy', 'Fundraising', 'Product Development']
  },
  {
    id: 3,
    name: 'Amit Patel',
    batch: '2016',
    role: 'VP Engineering',
    company: 'Fortune 500 MNC',
    location: 'New York',
    branch: 'Mechanical Engineering',
    bio: 'Patent holder in cloud technologies. Leading product innovation for a Fortune 500 company.',
    image: '👨‍🔬',
    linkedin: 'amit-patel',
    skills: ['Product Engineering', 'Patents', 'Innovation', 'Global Teams', 'R&D']
  },
  {
    id: 4,
    name: 'Sarah Khan',
    batch: '2019',
    role: 'UX/UI Designer',
    company: 'Design Studio',
    location: 'Gurgaon',
    branch: 'Information Technology',
    bio: 'Award-winning designer. Passionate about creating user-centric solutions and mentoring junior designers.',
    image: '👩‍🎨',
    linkedin: 'sarah-khan',
    skills: ['UI/UX Design', 'Figma', 'User Research', 'Design Thinking', 'Frontend']
  },
  {
    id: 5,
    name: 'Vikram Singh',
    batch: '2017',
    role: 'Sales Director',
    company: 'Enterprise Solutions Ltd',
    location: 'Delhi',
    branch: 'Computer Science',
    bio: 'Built B2B sales team from scratch. Exceeded targets by 150% for 3 consecutive years.',
    image: '👨‍💼',
    linkedin: 'vikram-singh',
    skills: ['B2B Sales', 'Team Building', 'Strategic Partnerships', 'Enterprise Sales', 'Leadership']
  },
  {
    id: 6,
    name: 'Ananya Sharma',
    batch: '2020',
    role: 'Junior Software Engineer',
    company: 'CloudTech',
    location: 'Remote',
    branch: 'Computer Science',
    bio: 'Recent graduate building DevOps solutions. Active in open-source community.',
    image: '👩‍💻',
    linkedin: 'ananya-sharma',
    skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Python']
  },
];

const branches = ['All', 'Computer Science', 'Electronics & Communication', 'Mechanical Engineering', 'Information Technology'];

export default function NetworkingPage() {
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAlumni = alumni.filter(person => {
    const matchBranch = selectedBranch === 'All' || person.branch === selectedBranch;
    const matchSearch =
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchBranch && matchSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0057B8] to-[#003D7A] text-white rounded-2xl p-8 shadow-lg">
        <h1 className="text-4xl font-bold mb-3">Alumni Network</h1>
        <p className="text-blue-100 text-lg">Connect with successful alumni across industries and locations worldwide</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex gap-4 mb-6 flex-col md:flex-row">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, role, company, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#003D7A] transition"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-2.5 border-2 border-[#003D7A] text-[#003D7A] rounded-lg hover:bg-[#003D7A] hover:text-white transition font-semibold">
            <Filter size={20} /> Filter
          </button>
        </div>

        {/* Branch filter */}
        <div className="flex gap-2 flex-wrap">
          {branches.map(branch => (
            <button
              key={branch}
              onClick={() => setSelectedBranch(branch)}
              className={`px-4 py-2 rounded-full font-semibold transition text-sm ${
                selectedBranch === branch
                  ? 'bg-gradient-to-r from-[#0057B8] to-[#003D7A] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {branch}
            </button>
          ))}
        </div>
      </div>

      {/* Alumni Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlumni.length > 0 ? (
          filteredAlumni.map(person => (
            <div key={person.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition border-t-4 border-[#0057B8]">
              {/* Header with image/emoji */}
              <div className="bg-gradient-to-r from-[#0057B8]/10 to-[#003D7A]/10 p-8 text-center">
                <p className="text-6xl mb-3">{person.image}</p>
                <p className="text-xs font-semibold text-[#C41E3A] uppercase tracking-wide">Batch {person.batch}</p>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{person.name}</h3>
                <p className="text-sm text-[#003D7A] font-semibold mb-0.5">{person.role}</p>
                <p className="text-sm text-gray-600 mb-3">{person.company}</p>

                <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
                  <MapPin size={16} />
                  {person.location}
                </div>

                <p className="text-sm text-gray-700 mb-4 line-clamp-3">{person.bio}</p>

                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-600 mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {person.skills.slice(0, 3).map(skill => (
                      <span key={skill} className="px-2 py-1 bg-[#0057B8]/10 text-[#0057B8] rounded text-xs font-semibold">
                        {skill}
                      </span>
                    ))}
                    {person.skills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-semibold">
                        +{person.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 border-2 border-[#003D7A] text-[#003D7A] rounded-lg hover:bg-[#003D7A] hover:text-white transition font-semibold text-sm">
                    <span>💬</span> Message
                  </button>
                  {person.linkedin && (
                    <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#0A66C2] text-white rounded-lg hover:bg-[#084398] transition font-semibold text-sm">
                      <Users size={16} /> LinkedIn
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-16 bg-gray-50 rounded-2xl">
            <p className="text-gray-600 text-lg">No alumni found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Spacer for bottom nav */}
      <div className="h-20"></div>
    </div>
  );
}