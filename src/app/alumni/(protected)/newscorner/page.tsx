// src/app/alumni/(protected)/newscorner/page.tsx
'use client';

import { useState } from 'react';
import { 
  Search, 
  Plus, 
  X, 
  Calendar as CalendarIcon, 
  MoreHorizontal, 
  FileText, 
} from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  category: string;
  eventDate: string; // Used as post date
  venue: string;
  coverImageUrl?: string;
  isPublished: boolean;
  createdAt: string;
}

const initialNews: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Outstanding Alumni',
    description: 'Featuring distinguished engineering graduates who have excelled in leadership roles within global financial corporations, sharing their early academic experiences and professional tips.',
    category: 'Alumni Stories, Testimonial',
    eventDate: '2026-04-14',
    venue: 'Main Campus',
    coverImageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop',
    isPublished: true,
    createdAt: '2026-04-14'
  },
  {
    id: 'news-2',
    title: 'IIIMMA Group Term Life Insurance',
    description: 'Good News for IIIMMA Alumni!! IIIMMA is thrilled to announce the launch of an exclusive Group Term Life Insurance program in collaboration with Zopper, offering premium safety plans.',
    category: 'Reports, Newsletter',
    eventDate: '2024-10-11',
    venue: 'Online',
    coverImageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop',
    isPublished: true,
    createdAt: '2024-10-11'
  },
  {
    id: 'news-3',
    title: 'Higher Education panel outcomes',
    description: 'A summary of the recent round-table discussion focused on alumni transitioning into Ivy League schools for post-grad courses, covering steps for letters of recommendation.',
    category: 'Alumni in Higher Education',
    eventDate: '2024-10-08',
    venue: 'Seminar Hall 2',
    coverImageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&auto=format&fit=crop',
    isPublished: true,
    createdAt: '2024-10-08'
  }
];

export default function NewsCornerPage() {
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDrafts, setShowDrafts] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Record<string, boolean>>({
    'Alumni in Higher Education': false,
    'Reports': false,
    'Alumni Stories': false,
    'Campus News': false,
    'Newsletter': false,
    'Testimonial': false,
    'Sports': false
  });
  const [sortBy, setSortBy] = useState('Newest');

  // Modal Posting Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCategory, setFormCategory] = useState('Alumni Stories');
  const [formDate, setFormDate] = useState('');
  const [formVenue, setFormVenue] = useState('');
  const [formImgUrl, setFormImgUrl] = useState('');
  const [formPublish, setFormPublish] = useState(true);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const handleMakePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formDesc) return;

    const newPost: NewsItem = {
      id: `news-${Date.now()}`,
      title: formTitle,
      description: formDesc,
      category: formCategory,
      eventDate: formDate || new Date().toISOString().split('T')[0],
      venue: formVenue || 'Campus',
      coverImageUrl: formImgUrl || 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&auto=format&fit=crop',
      isPublished: formPublish,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setNews(prev => [newPost, ...prev]);
    setIsModalOpen(false);

    // Reset Form fields
    setFormTitle('');
    setFormDesc('');
    setFormVenue('');
    setFormImgUrl('');
  };

  // Format date helper: e.g. "Apr 14, 2026"
  const formatDate = (dateString: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch {
      return dateString;
    }
  };

  // Filter logic
  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPublish = showDrafts ? true : item.isPublished;

    // Category filter
    const activeCats = Object.keys(selectedCategories).filter(k => selectedCategories[k]);
    const matchesCategory = activeCats.length === 0 || activeCats.some(cat => item.category.includes(cat));

    // Date range filters
    const itemDate = new Date(item.eventDate);
    const matchesFrom = !dateFrom || itemDate >= new Date(dateFrom);
    const matchesTo = !dateTo || itemDate <= new Date(dateTo);

    return matchesSearch && matchesPublish && matchesCategory && matchesFrom && matchesTo;
  });

  // Sort logic
  const sortedNews = [...filteredNews].sort((a, b) => {
    if (sortBy === 'Newest') {
      return b.eventDate.localeCompare(a.eventDate);
    }
    return 0;
  });

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top action bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-900">NewsCorner</h2>
          
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500">Sort:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-bold text-gray-800 bg-white border border-slate-200 rounded-lg py-1.5 px-2.5 focus:outline-none focus:border-[#003D7A]"
            >
              <option value="Newest">Newest</option>
            </select>
          </div>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-[#003D7A] hover:bg-[#002b56] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition active:scale-[0.98]"
        >
          <Plus size={16} />
          <span>Make a post</span>
        </button>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Sidebar Filters */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-5">
            
            {/* Search Box */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
              <input 
                type="text" 
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-100 hover:border-slate-200 focus:border-slate-200 focus:bg-white focus:outline-none rounded-xl text-xs font-semibold text-gray-800 placeholder:text-gray-400 transition"
              />
            </div>

            {/* Checkbox drafts */}
            <label className="flex items-center gap-2.5 text-xs font-bold text-slate-700 cursor-pointer hover:text-slate-900">
              <input 
                type="checkbox"
                checked={showDrafts}
                onChange={(e) => setShowDrafts(e.target.checked)}
                className="rounded border-slate-300 text-[#003D7A] focus:ring-[#003D7A] w-4 h-4"
              />
              <span>Show draft/unpublished posts</span>
            </label>

            {/* Date Pickers */}
            <div className="space-y-3 pt-3 border-t border-slate-50">
              <span className="block text-xs font-bold text-gray-700">Date</span>
              
              <div className="space-y-2">
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">From</label>
                  <input 
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#003D7A] text-xs font-semibold text-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">To</label>
                  <input 
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#003D7A] text-xs font-semibold text-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-3 pt-3 border-t border-slate-50">
              <span className="block text-xs font-bold text-gray-700">Categories</span>
              <div className="flex flex-col gap-2.5">
                {[
                  'Alumni in Higher Education',
                  'Reports',
                  'Alumni Stories',
                  'Campus News',
                  'Newsletter',
                  'Testimonial',
                  'Sports'
                ].map((cat) => (
                  <label key={cat} className="flex items-center gap-2.5 text-xs font-semibold text-slate-600 cursor-pointer hover:text-slate-900">
                    <input 
                      type="checkbox"
                      checked={selectedCategories[cat]}
                      onChange={() => toggleCategory(cat)}
                      className="rounded border-slate-300 text-[#003D7A] focus:ring-[#003D7A] w-4 h-4"
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Article Cards list */}
        <div className="lg:col-span-9 space-y-4">
          {sortedNews.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center text-slate-500 font-semibold">
              No news items match your search/filter parameters.
            </div>
          ) : (
            sortedNews.map((item) => (
              <div 
                key={item.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition flex flex-col md:flex-row relative"
              >
                
                {/* Rectangular Cover image (Left) */}
                <div className="md:w-56 h-40 flex-shrink-0 relative bg-slate-50 border-r border-slate-50">
                  {item.coverImageUrl ? (
                    <img 
                      src={item.coverImageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-100">
                      <FileText size={40} />
                    </div>
                  )}
                  
                  {/* Draft Badge */}
                  {!item.isPublished && (
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-yellow-500 text-white font-bold text-[8px] uppercase tracking-wider rounded shadow-sm">
                      Draft
                    </span>
                  )}
                </div>

                {/* Article Info details (Right) */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    
                    {/* Date and Category */}
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <CalendarIcon size={12} />
                        <span>{formatDate(item.eventDate)}</span>
                      </div>
                      <span>•</span>
                      <span className="text-slate-500">{item.category}</span>
                    </div>

                    {/* Headline Title */}
                    <h3 className="text-sm font-bold text-gray-950 hover:text-blue-600 cursor-pointer transition">
                      {item.title}
                    </h3>

                    {/* Excerpt Body description */}
                    <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Three-dots menu button */}
                  <button className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition">
                    <MoreHorizontal size={16} />
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

      </div>

      {/* Modal - Make a post */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-slate-100">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-gray-900 text-sm">Make a post</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleMakePost} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">Post Title *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Outstanding Alumni achievements"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#003D7A] text-xs font-semibold text-gray-800 placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">Excerpt Description *</label>
                <textarea 
                  required
                  rows={3}
                  placeholder="Summarize the announcement or alumni story here..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#003D7A] text-xs font-semibold text-gray-800 placeholder:text-gray-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">Category *</label>
                  <select 
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 bg-white rounded-xl focus:outline-none focus:border-[#003D7A] text-xs font-semibold text-gray-800"
                  >
                    <option value="Alumni Stories, Testimonial">Alumni Stories</option>
                    <option value="Reports, Newsletter">Reports</option>
                    <option value="Alumni in Higher Education">Higher Ed</option>
                    <option value="Campus News">Campus News</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">Post Date</label>
                  <input 
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#003D7A] text-xs font-semibold text-gray-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">Venue</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Main Campus"
                    value={formVenue}
                    onChange={(e) => setFormVenue(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#003D7A] text-xs font-semibold text-gray-800 placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">Publish Status</label>
                  <select 
                    value={formPublish ? 'true' : 'false'}
                    onChange={(e) => setFormPublish(e.target.value === 'true')}
                    className="w-full px-3 py-2 border border-slate-200 bg-white rounded-xl focus:outline-none focus:border-[#003D7A] text-xs font-semibold text-gray-800"
                  >
                    <option value="true">Published</option>
                    <option value="false">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">Cover Image URL</label>
                <input 
                  type="url" 
                  placeholder="https://example.com/cover.jpg"
                  value={formImgUrl}
                  onChange={(e) => setFormImgUrl(e.target.value)}
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
                  Create Post
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
