'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Users, Search, Filter } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  attendees: number;
  image: string;
}

const events: Event[] = [
  {
    id: 1,
    title: 'Batch 2020 Reunion',
    description: 'Connect with your batchmates and celebrate memories from the good old days at IKGPTU.',
    date: 'June 15, 2024',
    time: '6:00 PM',
    location: 'IKGPTU Campus, Chandigarh',
    category: 'Reunion',
    attendees: 42,
    image: '🎓'
  },
  {
    id: 2,
    title: 'Tech Career Summit 2024',
    description: 'Industry leaders and alumni sharing insights on career growth, AI, cloud computing, and emerging technologies.',
    date: 'June 22, 2024',
    time: '2:00 PM',
    location: 'Online',
    category: 'Workshop',
    attendees: 128,
    image: '💼'
  },
  {
    id: 3,
    title: 'Networking Brunch',
    description: 'Casual meetup for alumni from different batches and backgrounds. Great opportunity to build connections.',
    date: 'June 29, 2024',
    time: '11:00 AM',
    location: 'The Grand Hotel, Chandigarh',
    category: 'Networking',
    attendees: 35,
    image: '☕'
  },
  {
    id: 4,
    title: 'Alumni Mentorship Program',
    description: 'Get mentored by senior alumni professionals in your field of interest. Apply now!',
    date: 'July 5, 2024',
    time: '4:00 PM',
    location: 'Online',
    category: 'Mentorship',
    attendees: 65,
    image: '👨‍🏫'
  },
  {
    id: 5,
    title: 'Sports Championship',
    description: 'Annual cricket tournament among alumni teams from different years. Come and cheer your batch!',
    date: 'July 12-14, 2024',
    time: '9:00 AM',
    location: 'IKGPTU Sports Complex',
    category: 'Sports',
    attendees: 89,
    image: '🏆'
  },
  {
    id: 6,
    title: 'Women in Tech Panel',
    description: 'Inspiring stories from successful women alumni in technology and entrepreneurship.',
    date: 'July 20, 2024',
    time: '3:00 PM',
    location: 'Online',
    category: 'Panel',
    attendees: 76,
    image: '👩‍💻'
  }
];

const categories = ['All', 'Reunion', 'Workshop', 'Networking', 'Mentorship', 'Sports', 'Panel'];

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEvents = events.filter(event => {
    const matchCategory = selectedCategory === 'All' || event.category === selectedCategory;
    const matchSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       event.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#C41E3A] to-[#003D7A] text-white rounded-2xl p-8 shadow-lg">
        <h1 className="text-4xl font-bold mb-3">Alumni Events</h1>
        <p className="text-red-100 text-lg">Discover upcoming events, reunions, and networking opportunities</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex gap-4 mb-6 flex-col md:flex-row">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#003D7A] transition"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-2.5 border-2 border-[#003D7A] text-[#003D7A] rounded-lg hover:bg-[#003D7A] hover:text-white transition font-semibold">
            <Filter size={20} /> Filters
          </button>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-[#C41E3A] to-[#003D7A] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid gap-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <div key={event.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition border-l-4 border-[#C41E3A]">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-3xl">{event.image}</span>
                      <span className="px-3 py-1 bg-[#C41E3A]/10 text-[#C41E3A] rounded-full text-xs font-bold uppercase">
                        {event.category}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{event.title}</h3>
                  </div>
                  <button className="px-6 py-2 bg-[#003D7A] text-white rounded-lg hover:bg-[#002654] transition font-semibold">
                    RSVP
                  </button>
                </div>

                <p className="text-gray-700 mb-4 leading-relaxed">{event.description}</p>

                <div className="grid md:grid-cols-4 gap-4 mb-6 py-4 border-y border-gray-200">
                  <div className="flex items-center gap-2">
                    <Calendar className="text-[#003D7A]" size={20} />
                    <div>
                      <p className="text-xs text-gray-600">Date</p>
                      <p className="font-semibold text-gray-900">{event.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⏰</span>
                    <div>
                      <p className="text-xs text-gray-600">Time</p>
                      <p className="font-semibold text-gray-900">{event.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="text-[#C41E3A]" size={20} />
                    <div>
                      <p className="text-xs text-gray-600">Location</p>
                      <p className="font-semibold text-gray-900 text-sm">{event.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="text-[#0057B8]" size={20} />
                    <div>
                      <p className="text-xs text-gray-600">Attending</p>
                      <p className="font-semibold text-gray-900">{event.attendees}+</p>
                    </div>
                  </div>
                </div>

                <button className="w-full py-3 border-2 border-[#003D7A] text-[#003D7A] font-bold rounded-lg hover:bg-[#003D7A] hover:text-white transition">
                  Learn More
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-2xl">
            <p className="text-gray-600 text-lg">No events found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Spacer for bottom nav */}
      <div className="h-20"></div>
    </div>
  );
}