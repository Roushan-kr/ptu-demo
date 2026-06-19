// src/app/alumni/(protected)/startups/page.tsx
'use client';

import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
import { 
  Search, 
  Plus, 
  MapPin, 
  Globe, 
  ChevronDown, 
  ChevronUp, 
  X, 
  Check, 
  Tag, 
  Filter,
  ExternalLink
} from 'lucide-react';

interface StartUpItem {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  logoUrl?: string;
  industry: string;
  location: string;
  founderName: string;
  founderRole: string;
  founderAvatar?: string;
  offers?: string[];
}

const initialStartups: StartUpItem[] = [
  {
    id: 'startup-1',
    name: 'HOME DEPOT',
    description: 'Premier interior design, decor, and structural solution provider for commercial and residential properties.',
    websiteUrl: 'https://www.asianpaints.com/',
    logoUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=180&auto=format&fit=crop&q=60',
    industry: 'Interior Design & Decorative Art',
    location: 'Ahmedabad',
    founderName: 'Siddharth Ramnani',
    founderRole: 'CEO',
    founderAvatar: '',
    offers: ['10% discount on first consultation']
  },
  {
    id: 'startup-2',
    name: 'Dribbble',
    description: 'Connecting creative designers globally with freelance, contract, and full-time brand design gigs.',
    websiteUrl: 'https://dribbble.com/',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=180&auto=format&fit=crop&q=60',
    industry: 'Graphic Design',
    location: 'California',
    founderName: 'Aakanksha Agarwal',
    founderRole: 'CEO',
    founderAvatar: '',
    offers: ['Free portfolio audit for members']
  },
  {
    id: 'startup-3',
    name: 'S S Agro',
    description: 'Eco-friendly food production, distribution, and organic farming supply systems.',
    websiteUrl: 'https://www.food.com/',
    logoUrl: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=180&auto=format&fit=crop&q=60',
    industry: 'Food Production',
    location: 'Ahmedabad',
    founderName: 'Demo Admin',
    founderRole: 'Founder & CEO',
    founderAvatar: ''
  },
  {
    id: 'startup-4',
    name: 'canva',
    description: 'Empowering the world to design anything and publish anywhere with simple interface templates.',
    websiteUrl: 'https://www.almashines.io',
    logoUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=180&auto=format&fit=crop&q=60',
    industry: 'Interior Design & Decorative Art',
    location: 'Ahmedabad',
    founderName: 'Akshin Mayatra',
    founderRole: 'Web Developer',
    founderAvatar: ''
  },
  {
    id: 'startup-5',
    name: 'Almashines Technologies Pvt. Ltd.',
    description: 'Alumni database management, engagement portals, and relationship solutions for universities.',
    websiteUrl: 'https://www.almashine.com',
    logoUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=180&auto=format&fit=crop&q=60',
    industry: 'Graphic Design',
    location: 'Ahmedabad',
    founderName: 'Test Admin',
    founderRole: 'Founder & Director',
    founderAvatar: '',
    offers: ['3 months free trial subscription']
  }
];

export default function StartupsShowcase() {
  const [startups, setStartups] = useState<StartUpItem[]>(initialStartups);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [selectedDesignation, setSelectedDesignation] = useState<string>('All');
  const [selectedOffer, setSelectedOffer] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('Name');
  
  // Accordion state
  const [filtersOpen, setFiltersOpen] = useState({
    industry: true,
    designation: true,
    offers: true,
    location: true
  });

  // Modal form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formIndustry, setFormIndustry] = useState('Interior Design & Decorative Art');
  const [formLocation, setFormLocation] = useState('');
  const [formOffer, setFormOffer] = useState('');
  const [formFounderName, setFormFounderName] = useState('');
  const [formFounderRole, setFormFounderRole] = useState('');

  const toggleFilter = (key: keyof typeof filtersOpen) => {
    setFiltersOpen(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleCreateStartup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formDesc || !formFounderName) return;

    const newItem: StartUpItem = {
      id: `startup-${Date.now()}`,
      name: formName,
      description: formDesc,
      websiteUrl: formUrl || 'https://www.google.com',
      industry: formIndustry,
      location: formLocation || 'Chandigarh',
      founderName: formFounderName,
      founderRole: formFounderRole || 'Founder',
      offers: formOffer ? [formOffer] : undefined
    };

    setStartups(prev => [newItem, ...prev]);
    setIsModalOpen(false);

    // Reset Form
    setFormName('');
    setFormDesc('');
    setFormUrl('');
    setFormLocation('');
    setFormOffer('');
    setFormFounderName('');
    setFormFounderRole('');
  };

  // Get unique filter values
  const industries = ['All', ...Array.from(new Set(startups.map(s => s.industry)))];
  const locations = ['All', ...Array.from(new Set(startups.map(s => s.location)))];
  const designations = ['All', ...Array.from(new Set(startups.map(s => s.founderRole)))];

  // Filtering logic
  const filteredStartups = startups.filter(startup => {
    const matchesSearch = startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          startup.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          startup.founderName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesIndustry = selectedIndustry === 'All' || startup.industry === selectedIndustry;
    const matchesLocation = selectedLocation === 'All' || startup.location === selectedLocation;
    const matchesDesignation = selectedDesignation === 'All' || startup.founderRole === selectedDesignation;
    const matchesOffer = selectedOffer === 'All' || 
                         (selectedOffer === 'Has Offers' && startup.offers && startup.offers.length > 0) ||
                         (selectedOffer === 'No Offers' && (!startup.offers || startup.offers.length === 0));

    return matchesSearch && matchesIndustry && matchesLocation && matchesDesignation && matchesOffer;
  });

  // Sorting logic
  const sortedStartups = [...filteredStartups].sort((a, b) => {
    if (sortBy === 'Name') {
      return a.name.localeCompare(b.name);
    }
    // Default fallback
    return 0;
  });

  const getInitials = (name: string) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'S';
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-950">
          Find and connect with businesses of your fellow members!
        </h2>
        
        {/* Sort drop down */}
        <div className="flex items-center gap-2 self-end">
          <span className="text-xs font-semibold text-slate-500">Sort by:</span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-bold text-gray-800 bg-white border border-slate-200 rounded-lg py-1.5 px-3 focus:outline-none focus:border-[#003D7A]"
          >
            <option value="Name">Name</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Listing Box, Search, Filters */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* List a Business Banner */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-md font-bold text-gray-900 mb-2">List a business</h3>
            <p className="text-xs text-slate-500 font-medium mb-4 leading-relaxed">
              List a business here and get the following benefits:
            </p>
            
            <ul className="space-y-2 mb-6">
              {[
                'Free advertisement',
                'Find trusted customer',
                'Boosted SEO'
              ].map((benefit, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Check size={11} strokeWidth={3} />
                  </div>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full py-3 bg-[#003D7A] hover:bg-[#002b56] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition"
            >
              <Plus size={16} />
              <span>List a new business</span>
            </button>
          </div>

          {/* Search box */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex items-center gap-2.5">
            <Search size={16} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name,keyword,etc"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent focus:outline-none text-xs font-medium text-gray-800 placeholder:text-gray-400"
            />
          </div>

          {/* Filter Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-900 pb-2 border-b border-slate-50">
              <Filter size={16} />
              <span>Filters</span>
            </div>

            {/* Industry Filter Accordion */}
            <div className="space-y-2">
              <button 
                onClick={() => toggleFilter('industry')}
                className="w-full flex items-center justify-between text-xs font-bold text-gray-700 hover:text-gray-950"
              >
                <span>Industry</span>
                {filtersOpen.industry ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {filtersOpen.industry && (
                <div className="pt-1 flex flex-col gap-1.5 max-h-40 overflow-y-auto pr-1">
                  {industries.map((ind) => (
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

            {/* Designation Filter Accordion */}
            <div className="space-y-2 pt-2 border-t border-slate-50">
              <button 
                onClick={() => toggleFilter('designation')}
                className="w-full flex items-center justify-between text-xs font-bold text-gray-700 hover:text-gray-950"
              >
                <span>Designation</span>
                {filtersOpen.designation ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {filtersOpen.designation && (
                <div className="pt-1 flex flex-col gap-1.5">
                  {designations.map((des) => (
                    <label key={des} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer hover:text-slate-900">
                      <input 
                        type="radio" 
                        name="designation"
                        checked={selectedDesignation === des}
                        onChange={() => setSelectedDesignation(des)}
                        className="rounded border-slate-300 text-[#003D7A] focus:ring-[#003D7A]"
                      />
                      <span>{des}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Offers Filter Accordion */}
            <div className="space-y-2 pt-2 border-t border-slate-50">
              <button 
                onClick={() => toggleFilter('offers')}
                className="w-full flex items-center justify-between text-xs font-bold text-gray-700 hover:text-gray-950"
              >
                <span>Offers</span>
                {filtersOpen.offers ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {filtersOpen.offers && (
                <div className="pt-1 flex flex-col gap-1.5">
                  {['All', 'Has Offers', 'No Offers'].map((off) => (
                    <label key={off} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer hover:text-slate-900">
                      <input 
                        type="radio" 
                        name="offers"
                        checked={selectedOffer === off}
                        onChange={() => setSelectedOffer(off)}
                        className="rounded border-slate-300 text-[#003D7A] focus:ring-[#003D7A]"
                      />
                      <span>{off}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Location Served Accordion */}
            <div className="space-y-2 pt-2 border-t border-slate-50">
              <button 
                onClick={() => toggleFilter('location')}
                className="w-full flex items-center justify-between text-xs font-bold text-gray-700 hover:text-gray-950"
              >
                <span>Location Served</span>
                {filtersOpen.location ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {filtersOpen.location && (
                <div className="pt-1 flex flex-col gap-1.5 max-h-40 overflow-y-auto pr-1">
                  {locations.map((loc) => (
                    <label key={loc} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer hover:text-slate-900">
                      <input 
                        type="radio" 
                        name="location"
                        checked={selectedLocation === loc}
                        onChange={() => setSelectedLocation(loc)}
                        className="rounded border-slate-300 text-[#003D7A] focus:ring-[#003D7A]"
                      />
                      <span>{loc}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Right Side: Grid of Startups */}
        <div className="lg:col-span-8">
          {sortedStartups.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center text-slate-500 font-medium">
              No startups match your search/filter criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sortedStartups.map((startup) => (
                <div 
                  key={startup.id} 
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition relative flex flex-col justify-between"
                >
                  {/* Offers Ribbon Tag */}
                  {startup.offers && startup.offers.length > 0 && (
                    <div className="absolute top-0 left-4 z-10 bg-orange-600 text-white font-bold text-[9px] px-2.5 py-1.5 rounded-b-lg shadow-sm flex items-center gap-1">
                      <Tag size={10} fill="currentColor" />
                      <span>{startup.offers.length} Offer!</span>
                    </div>
                  )}

                  {/* Logo Banner Area */}
                  <div className="h-32 bg-slate-50 border-b border-slate-50 flex items-center justify-center p-4">
                    {startup.logoUrl ? (
                      <img 
                        src={startup.logoUrl} 
                        alt={startup.name} 
                        className="max-h-full max-w-[150px] object-contain rounded-lg shadow-sm"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#003D7A] to-[#C41E3A] flex items-center justify-center text-white font-black text-xl">
                        {getInitials(startup.name)}
                      </div>
                    )}
                  </div>

                  {/* Info block */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 uppercase tracking-tight">
                        {startup.name}
                      </h4>
                      <p className="text-[11px] text-slate-600 font-medium mt-1 line-clamp-3 leading-relaxed">
                        {startup.description}
                      </p>
                    </div>

                    <div className="mt-4 space-y-2 pt-3 border-t border-slate-50">
                      {/* Location Pin */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                        <MapPin size={13} className="text-slate-400" />
                        <span>{startup.location}</span>
                      </div>

                      {/* Website Link */}
                      <a 
                        href={startup.websiteUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        <Globe size={13} />
                        <span className="truncate max-w-[180px]">{startup.websiteUrl}</span>
                        <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>

                  {/* Founder Block & Industry Tag */}
                  <div className="p-4 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-200 border border-slate-100 flex items-center justify-center text-slate-600 font-bold text-[10px] overflow-hidden flex-shrink-0">
                        {startup.founderAvatar ? (
                          <img src={startup.founderAvatar} alt={startup.founderName} className="w-full h-full object-cover" />
                        ) : (
                          getInitials(startup.founderName)
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 leading-tight">
                          {startup.founderName}
                        </p>
                        <p className="text-[9px] text-slate-400 font-semibold mt-0.5 leading-none">
                          {startup.founderRole}
                        </p>
                      </div>
                    </div>
                    
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-bold text-[9px] truncate max-w-[120px]">
                      {startup.industry}
                    </span>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Modal - List new Business */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-slate-100">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-gray-900 text-sm">List your startup</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleCreateStartup} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">Business Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Acme Labs"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#003D7A] text-xs font-semibold text-gray-800 placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">Description *</label>
                <textarea 
                  required
                  rows={3}
                  placeholder="Tell us what your startup does..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#003D7A] text-xs font-semibold text-gray-800 placeholder:text-gray-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">Industry *</label>
                  <select 
                    value={formIndustry}
                    onChange={(e) => setFormIndustry(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 bg-white rounded-xl focus:outline-none focus:border-[#003D7A] text-xs font-semibold text-gray-800"
                  >
                    <option value="Interior Design & Decorative Art">Interior Design</option>
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="Food Production">Food Production</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">Location *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Bangalore, Chandigarh"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#003D7A] text-xs font-semibold text-gray-800 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">Website Link</label>
                <input 
                  type="url" 
                  placeholder="https://example.com"
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#003D7A] text-xs font-semibold text-gray-800 placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">Special Offer (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. 15% discount for batchmates"
                  value={formOffer}
                  onChange={(e) => setFormOffer(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#003D7A] text-xs font-semibold text-gray-800 placeholder:text-gray-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-50">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">Founder Name *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Your Name"
                    value={formFounderName}
                    onChange={(e) => setFormFounderName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#003D7A] text-xs font-semibold text-gray-800 placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">Founder Role *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. CEO, Founder"
                    value={formFounderRole}
                    onChange={(e) => setFormFounderRole(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#003D7A] text-xs font-semibold text-gray-800 placeholder:text-gray-400"
                  />
                </div>
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
                  Register Business
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
