// src/app/alumni/(protected)/jobs/page.tsx
'use client';

import { useState } from 'react';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Search, 
  Filter, 
  Settings, 
  Plus, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Lock, 
  Unlock 
} from 'lucide-react';

interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  experienceRange: string;
  salaryRange: string;
  type: string;
  workplaceType: string; // On-site, Remote, Hybrid
  industry: string;
  postedDate: string;
  isOpen: boolean;
  postedByMe: boolean;
  appliedByMe: boolean;
  skills: string[];
}

const initialJobs: JobOpportunity[] = [
  {
    id: 'job-1',
    title: 'Web Application UI Developer',
    company: 'C-Sam Solutions Pvt. Ltd.',
    location: 'Woluwe-Saint-Lambert - Sint-Lambrechts-Woluwe (On-site)',
    experienceRange: '1-4 years',
    salaryRange: 'INR 11 - 111,111 / year',
    type: 'Full Time',
    workplaceType: 'On-site',
    industry: 'Software',
    postedDate: '1 week ago',
    isOpen: false,
    postedByMe: false,
    appliedByMe: false,
    skills: ['UI/UX', 'React', 'HTML/CSS']
  },
  {
    id: 'job-2',
    title: 'Administrator',
    company: 'SoiL',
    location: 'Gurgaon District (On-site)',
    experienceRange: '9-10 years',
    salaryRange: 'Not specified',
    type: 'Full Time',
    workplaceType: 'On-site',
    industry: 'Administration',
    postedDate: '1 month ago',
    isOpen: false,
    postedByMe: false,
    appliedByMe: false,
    skills: ['Management', 'Operations']
  },
  {
    id: 'job-3',
    title: 'Tester',
    company: 'Vlerick',
    location: 'Gent (On-site)',
    experienceRange: '2-6 years',
    salaryRange: 'Not specified',
    type: 'Full Time',
    workplaceType: 'On-site',
    industry: 'Software Quality Assurance',
    postedDate: '1 month ago',
    isOpen: false,
    postedByMe: false,
    appliedByMe: false,
    skills: ['Selenium', 'Automation', 'Manual Testing']
  },
  {
    id: 'job-4',
    title: 'Senior Frontend Engineer',
    company: 'TechCorp India',
    location: 'Bangalore (Hybrid)',
    experienceRange: '5+ years',
    salaryRange: 'INR 15,00,000 - 20,00,000 / year',
    type: 'Full Time',
    workplaceType: 'Hybrid',
    industry: 'Software',
    postedDate: '2 days ago',
    isOpen: true,
    postedByMe: true,
    appliedByMe: false,
    skills: ['Next.js', 'React', 'TypeScript']
  },
  {
    id: 'job-5',
    title: 'Data Scientist Intern',
    company: 'AI Solutions',
    location: 'Remote',
    experienceRange: '0-1 years',
    salaryRange: 'INR 3,00,000 - 5,00,000 / year',
    type: 'Internship',
    workplaceType: 'Remote',
    industry: 'Data Science',
    postedDate: '3 days ago',
    isOpen: true,
    postedByMe: false,
    appliedByMe: true,
    skills: ['Python', 'TensorFlow', 'SQL']
  }
];

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobOpportunity[]>(initialJobs);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'posted' | 'applied'>('all');
  
  // Accordion states
  const [filtersOpen, setFiltersOpen] = useState({
    type: true,
    location: true,
    industry: true,
    workplace: true,
    salary: true,
    skills: true,
    experience: true
  });

  // Selected filters
  const [selectedType, setSelectedType] = useState('All');
  const [selectedWorkplace, setSelectedWorkplace] = useState('All');
  const [selectedExp, setSelectedExp] = useState('All');
  const [selectedIndustry, setSelectedIndustry] = useState('All');

  // Modal Posting Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formExp, setFormExp] = useState('');
  const [formSalary, setFormSalary] = useState('');
  const [formType, setFormType] = useState('Full Time');
  const [formWorkplace, setFormWorkplace] = useState('On-site');
  const [formIndustry, setFormIndustry] = useState('Software');
  const [formSkills, setFormSkills] = useState('');

  const toggleFilter = (key: keyof typeof filtersOpen) => {
    setFiltersOpen(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePostOpportunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formCompany || !formLocation) return;

    const newJob: JobOpportunity = {
      id: `job-${Date.now()}`,
      title: formTitle,
      company: formCompany,
      location: `${formLocation} (${formWorkplace})`,
      experienceRange: formExp || 'Not specified',
      salaryRange: formSalary || 'Not specified',
      type: formType,
      workplaceType: formWorkplace,
      industry: formIndustry,
      postedDate: 'Just now',
      isOpen: true,
      postedByMe: true,
      appliedByMe: false,
      skills: formSkills ? formSkills.split(',').map(s => s.trim()) : []
    };

    setJobs(prev => [newJob, ...prev]);
    setIsModalOpen(false);

    // Reset Form fields
    setFormTitle('');
    setFormCompany('');
    setFormLocation('');
    setFormExp('');
    setFormSalary('');
    setFormSkills('');
  };

  // Get dynamic unique filters
  const industries = ['All', ...Array.from(new Set(jobs.map(j => j.industry)))];
  const types = ['All', ...Array.from(new Set(jobs.map(j => j.type)))];
  const workplaces = ['All', ...Array.from(new Set(jobs.map(j => j.workplaceType)))];
  const experiences = ['All', '0-1 years', '1-4 years', '2-6 years', '5+ years', '9-10 years'];

  // Filtering Logic
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesOpen = !showOpenOnly || job.isOpen;
    
    // Tab filtering
    const matchesTab = activeTab === 'all' || 
                       (activeTab === 'posted' && job.postedByMe) || 
                       (activeTab === 'applied' && job.appliedByMe);

    const matchesType = selectedType === 'All' || job.type === selectedType;
    const matchesWorkplace = selectedWorkplace === 'All' || job.workplaceType === selectedWorkplace;
    const matchesExp = selectedExp === 'All' || job.experienceRange === selectedExp;
    const matchesIndustry = selectedIndustry === 'All' || job.industry === selectedIndustry;

    return matchesSearch && matchesOpen && matchesTab && matchesType && matchesWorkplace && matchesExp && matchesIndustry;
  });

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top action header area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-950">Opportunities</h2>
        
        <div className="flex items-center gap-3 self-end">
          <button className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 bg-white rounded-xl transition">
            <Settings size={14} />
            <span>Preferences</span>
          </button>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#003D7A] hover:bg-[#002b56] text-white text-xs font-bold rounded-xl transition active:scale-[0.98]"
          >
            <Plus size={16} />
            <span>Post an opportunity</span>
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Accordion Filters */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-900 pb-2 border-b border-slate-50">
              <Filter size={16} />
              <span>Filters</span>
            </div>

            {/* Search filter input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
              <input 
                type="text" 
                placeholder="Search by company, title"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-100 hover:border-slate-200 focus:border-slate-200 focus:bg-white focus:outline-none rounded-xl text-xs font-semibold text-gray-800 placeholder:text-gray-400 transition"
              />
            </div>

            {/* Checkbox: show open only */}
            <label className="flex items-center gap-2.5 text-xs font-bold text-slate-700 cursor-pointer hover:text-slate-900">
              <input 
                type="checkbox"
                checked={showOpenOnly}
                onChange={(e) => setShowOpenOnly(e.target.checked)}
                className="rounded border-slate-300 text-[#003D7A] focus:ring-[#003D7A] w-4 h-4"
              />
              <span>Show open opportunities only</span>
            </label>

            {/* Opportunity Type Accordion */}
            <div className="space-y-2 pt-3 border-t border-slate-50">
              <button 
                onClick={() => toggleFilter('type')}
                className="w-full flex items-center justify-between text-xs font-bold text-gray-700 hover:text-gray-950"
              >
                <span>Opportunity type</span>
                {filtersOpen.type ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {filtersOpen.type && (
                <div className="pt-1 flex flex-col gap-1.5">
                  {types.map(t => (
                    <label key={t} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer hover:text-slate-900">
                      <input 
                        type="radio" 
                        name="type" 
                        checked={selectedType === t}
                        onChange={() => setSelectedType(t)}
                        className="rounded border-slate-300 text-[#003D7A] focus:ring-[#003D7A]"
                      />
                      <span>{t}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Workplace type Accordion */}
            <div className="space-y-2 pt-3 border-t border-slate-50">
              <button 
                onClick={() => toggleFilter('workplace')}
                className="w-full flex items-center justify-between text-xs font-bold text-gray-700 hover:text-gray-950"
              >
                <span>Workplace type</span>
                {filtersOpen.workplace ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {filtersOpen.workplace && (
                <div className="pt-1 flex flex-col gap-1.5">
                  {workplaces.map(w => (
                    <label key={w} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer hover:text-slate-900">
                      <input 
                        type="radio" 
                        name="workplace" 
                        checked={selectedWorkplace === w}
                        onChange={() => setSelectedWorkplace(w)}
                        className="rounded border-slate-300 text-[#003D7A] focus:ring-[#003D7A]"
                      />
                      <span>{w}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Industry Accordion */}
            <div className="space-y-2 pt-3 border-t border-slate-50">
              <button 
                onClick={() => toggleFilter('industry')}
                className="w-full flex items-center justify-between text-xs font-bold text-gray-700 hover:text-gray-950"
              >
                <span>Industry</span>
                {filtersOpen.industry ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {filtersOpen.industry && (
                <div className="pt-1 flex flex-col gap-1.5 max-h-40 overflow-y-auto pr-1">
                  {industries.map(ind => (
                    <label key={ind} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer hover:text-slate-900">
                      <input 
                        type="radio" 
                        name="industry" 
                        checked={selectedIndustry === ind}
                        onChange={() => setSelectedIndustry(ind)}
                        className="rounded border-slate-300 text-[#003D7A] focus:ring-[#003D7A]"
                      />
                      <span>{ind}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Work experience Accordion */}
            <div className="space-y-2 pt-3 border-t border-slate-50">
              <button 
                onClick={() => toggleFilter('experience')}
                className="w-full flex items-center justify-between text-xs font-bold text-gray-700 hover:text-gray-950"
              >
                <span>Work experience</span>
                {filtersOpen.experience ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {filtersOpen.experience && (
                <div className="pt-1 flex flex-col gap-1.5">
                  {experiences.map(exp => (
                    <label key={exp} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer hover:text-slate-900">
                      <input 
                        type="radio" 
                        name="experience" 
                        checked={selectedExp === exp}
                        onChange={() => setSelectedExp(exp)}
                        className="rounded border-slate-300 text-[#003D7A] focus:ring-[#003D7A]"
                      />
                      <span>{exp}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Right column: Opportunities Listing */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Tabs Filter Bar */}
          <div className="flex gap-2 pb-2">
            {[
              { id: 'all', label: 'All opportunities' },
              { id: 'posted', label: 'Posted by me' },
              { id: 'applied', label: 'Applied by me' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                  activeTab === tab.id
                    ? 'bg-slate-200/80 text-gray-800'
                    : 'text-slate-500 hover:text-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Opportunities Counter */}
          <p className="text-xs font-semibold text-slate-500">
            Showing {filteredJobs.length} opportunities
          </p>

          {/* Grid of opportunities */}
          <div className="space-y-4">
            {filteredJobs.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center text-slate-500 font-semibold">
                No opportunities matching your selection were found.
              </div>
            ) : (
              filteredJobs.map(job => (
                <div 
                  key={job.id} 
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition flex flex-col justify-between gap-3 relative"
                >
                  {/* Job title & Type pill */}
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-sm font-bold text-gray-950 hover:text-[#003D7A] cursor-pointer">
                      {job.title} <span className="text-slate-400 font-medium font-sans px-1">|</span> <span className="text-slate-600 font-medium">{job.company}</span>
                    </h3>
                    
                    <span className="flex-shrink-0 px-3 py-1 rounded-full border border-slate-200 text-slate-600 font-bold text-[9px] uppercase tracking-wide">
                      {job.type}
                    </span>
                  </div>

                  {/* Metadata Row */}
                  <div className="flex items-center gap-6 text-[11px] text-slate-500 font-semibold flex-wrap">
                    {/* Location Pin */}
                    <div className="flex items-center gap-1">
                      <MapPin size={13} className="text-slate-400" />
                      <span>{job.location}</span>
                    </div>
                    {/* Experience required */}
                    <div className="flex items-center gap-1">
                      <Briefcase size={13} className="text-slate-400" />
                      <span>{job.experienceRange}</span>
                    </div>
                    {/* Salary */}
                    <div className="flex items-center gap-1">
                      <DollarSign size={13} className="text-slate-400" />
                      <span>{job.salaryRange}</span>
                    </div>
                  </div>

                  {/* Job Footer Information */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-50 text-[10px] text-slate-400 font-medium">
                    <div className="flex items-center gap-2">
                      <span>Posted {job.postedDate}</span>
                    </div>
                    
                    {/* Active/Closed tag */}
                    <div className="flex items-center gap-1 font-bold">
                      {job.isOpen ? (
                        <span className="text-emerald-600 flex items-center gap-0.5">
                          <Unlock size={10} />
                          Applications open
                        </span>
                      ) : (
                        <span className="text-slate-400 flex items-center gap-0.5">
                          <Lock size={10} />
                          Applications closed
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>

        </div>

      </div>

      {/* Modal - Post new opportunity */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-slate-100">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-gray-900 text-sm">Post an opportunity</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handlePostOpportunity} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">Opportunity Title *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Frontend Engineer"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#003D7A] text-xs font-semibold text-gray-800 placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">Company Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Acme Labs"
                  value={formCompany}
                  onChange={(e) => setFormCompany(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#003D7A] text-xs font-semibold text-gray-800 placeholder:text-gray-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">Workplace *</label>
                  <select 
                    value={formWorkplace}
                    onChange={(e) => setFormWorkplace(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 bg-white rounded-xl focus:outline-none focus:border-[#003D7A] text-xs font-semibold text-gray-800"
                  >
                    <option value="On-site">On-site</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">Location *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Jalandhar"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#003D7A] text-xs font-semibold text-gray-800 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">Experience *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 1-3 years"
                    value={formExp}
                    onChange={(e) => setFormExp(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#003D7A] text-xs font-semibold text-gray-800 placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">Salary Range</label>
                  <input 
                    type="text" 
                    placeholder="e.g. INR 6 - 8 LPA"
                    value={formSalary}
                    onChange={(e) => setFormSalary(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#003D7A] text-xs font-semibold text-gray-800 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">Type *</label>
                  <select 
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 bg-white rounded-xl focus:outline-none focus:border-[#003D7A] text-xs font-semibold text-gray-800"
                  >
                    <option value="Full Time">Full Time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">Industry *</label>
                  <select 
                    value={formIndustry}
                    onChange={(e) => setFormIndustry(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 bg-white rounded-xl focus:outline-none focus:border-[#003D7A] text-xs font-semibold text-gray-800"
                  >
                    <option value="Software">Software</option>
                    <option value="Design">Design</option>
                    <option value="Administration">Administration</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">Skills (Comma-separated)</label>
                <input 
                  type="text" 
                  placeholder="e.g. React, Next.js, CSS"
                  value={formSkills}
                  onChange={(e) => setFormSkills(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#003D7A] text-xs font-semibold text-gray-800 placeholder:text-gray-400"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 bg-[#003D7A] hover:bg-[#002b56] text-white text-xs font-bold rounded-xl transition"
                >
                  Submit Opportunity
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}