'use client';

import { useState } from 'react';
import { Briefcase, MapPin, DollarSign, Zap, Search, Filter } from 'lucide-react';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  tags: string[];
  postedBy: string;
  posted: string;
}

const jobs: Job[] = [
  {
    id: 1,
    title: 'Senior Software Engineer',
    company: 'TechCorp India',
    location: 'Bangalore',
    salary: '₹15-20 LPA',
    type: 'Full-time',
    description: 'Looking for an experienced software engineer to lead backend architecture and mentor junior developers. Must have 5+ years of experience.',
    tags: ['Python', 'AWS', 'Microservices', 'Leadership'],
    postedBy: 'Rajesh Kumar (2015)',
    posted: '2 days ago'
  },
  {
    id: 2,
    title: 'Product Manager',
    company: 'StartupXYZ',
    location: 'Pune',
    salary: '₹12-18 LPA',
    type: 'Full-time',
    description: 'Join our fast-growing startup as Product Manager. You will define product strategy, work with engineering and design teams, and drive growth.',
    tags: ['Product Strategy', 'Analytics', 'User Research'],
    postedBy: 'Priya Singh (2018)',
    posted: '5 days ago'
  },
  {
    id: 3,
    title: 'Data Scientist',
    company: 'AI Solutions',
    location: 'Remote',
    salary: '₹13-17 LPA',
    type: 'Full-time',
    description: 'Help us build ML models for financial analytics. Experience with Python, TensorFlow, and SQL required. Work from anywhere!',
    tags: ['Machine Learning', 'Python', 'SQL', 'TensorFlow'],
    postedBy: 'Amit Patel (2016)',
    posted: '1 week ago'
  },
  {
    id: 4,
    title: 'Frontend Developer (React)',
    company: 'DesignHub',
    location: 'Gurgaon',
    salary: '₹10-14 LPA',
    type: 'Full-time',
    description: 'Create stunning user interfaces for our SaaS platform. Must be proficient in React, TypeScript, and have a keen eye for UI/UX.',
    tags: ['React', 'TypeScript', 'UI/UX', 'CSS'],
    postedBy: 'Sarah Khan (2019)',
    posted: '3 days ago'
  },
  {
    id: 5,
    title: 'Sales Executive',
    company: 'Enterprise Solutions Ltd',
    location: 'Delhi',
    salary: '₹8-12 LPA + Bonus',
    type: 'Full-time',
    description: 'Drive B2B sales for our enterprise software. Build client relationships and achieve targets. Commission-based compensation.',
    tags: ['B2B Sales', 'Enterprise', 'Negotiation'],
    postedBy: 'Vikram Singh (2017)',
    posted: '1 week ago'
  },
  {
    id: 6,
    title: 'DevOps Engineer (Intern)',
    company: 'CloudTech',
    location: 'Remote',
    salary: '₹3-5 LPA',
    type: 'Internship',
    description: 'Learn DevOps while working on real projects. Great opportunity for freshers interested in cloud infrastructure and CI/CD pipelines.',
    tags: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
    postedBy: 'Ananya Sharma (2020)',
    posted: '2 days ago'
  },
];

const jobTypes = ['All', 'Full-time', 'Internship', 'Contract'];

export default function JobsPage() {
  const [selectedType, setSelectedType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredJobs = jobs.filter(job => {
    const matchType = selectedType === 'All' || job.type === selectedType;
    const matchSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchType && matchSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#003D7A] to-[#C41E3A] text-white rounded-2xl p-8 shadow-lg">
        <h1 className="text-4xl font-bold mb-3">Job Board</h1>
        <p className="text-blue-100 text-lg">Discover career opportunities posted by alumni and partner companies</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex gap-4 mb-6 flex-col md:flex-row">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search jobs by title, company, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#003D7A] transition"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-2.5 border-2 border-[#003D7A] text-[#003D7A] rounded-lg hover:bg-[#003D7A] hover:text-white transition font-semibold">
            <Filter size={20} /> Advanced
          </button>
        </div>

        {/* Job type filter */}
        <div className="flex gap-2 flex-wrap">
          {jobTypes.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-full font-semibold transition ${
                selectedType === type
                  ? 'bg-gradient-to-r from-[#003D7A] to-[#C41E3A] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs List */}
      <div className="grid gap-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map(job => (
            <div key={job.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition border-l-4 border-[#003D7A]">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4 flex-col md:flex-row">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="text-[#003D7A]" size={24} />
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        job.type === 'Full-time' ? 'bg-green-100 text-green-700' :
                        job.type === 'Internship' ? 'bg-blue-100 text-blue-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {job.type}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{job.title}</h3>
                  </div>
                  <button className="px-6 py-2 bg-[#C41E3A] text-white rounded-lg hover:bg-[#A01830] transition font-semibold mt-4 md:mt-0">
                    Apply Now
                  </button>
                </div>

                <div className="flex items-center gap-6 mb-4 text-gray-600 flex-wrap">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-gray-900">{job.company}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-[#C41E3A]" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={18} className="text-[#0057B8]" />
                    <span className="font-semibold text-gray-900">{job.salary}</span>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{job.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold hover:bg-[#003D7A] hover:text-white transition cursor-pointer">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 border-t pt-4">
                  <span>Posted by: <strong>{job.postedBy}</strong></span>
                  <span>{job.posted}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-2xl">
            <p className="text-gray-600 text-lg">No jobs found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Spacer for bottom nav */}
      <div className="h-20"></div>
    </div>
  );
}