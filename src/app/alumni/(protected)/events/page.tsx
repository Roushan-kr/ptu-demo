'use client';

import { useEffect, useState } from 'react';
import { Calendar, MapPin, Users, Search, Filter, Clock, Check, X, MessageSquare, Info } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  eventDate: string;
  venue: string;
  coverImageUrl: string | null;
  rsvpDeadline: string | null;
  isPublished: boolean;
  attendingCount: number;
  myRsvp: {
    status: 'ATTENDING' | 'NOT_ATTENDING' | 'MAYBE';
    message: string | null;
  } | null;
}

const categories = ['All', 'Reunion', 'Workshop', 'Networking', 'Mentorship', 'Sports', 'Panel', 'Webinar', 'General'];

export default function AlumniEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // RSVP Modal State
  const [rsvpEvent, setRsvpEvent] = useState<Event | null>(null);
  const [rsvpStatus, setRsvpStatus] = useState<'ATTENDING' | 'NOT_ATTENDING' | 'MAYBE'>('ATTENDING');
  const [rsvpMessage, setRsvpMessage] = useState('');
  const [submittingRsvp, setSubmittingRsvp] = useState(false);

  // Detail Modal State
  const [activeDetailEvent, setActiveDetailEvent] = useState<Event | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'All') {
        queryParams.append('category', selectedCategory);
      }
      if (searchTerm) {
        queryParams.append('search', searchTerm);
      }

      const res = await fetch(`/api/alumni/events?${queryParams.toString()}`);
      if (!res.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await res.json();
      setEvents(data);
    } catch (err: any) {
      toast.error('Could not load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search slightly
    const timer = setTimeout(() => {
      fetchEvents();
    }, 300);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchTerm]);

  const handleOpenRsvpModal = (event: Event) => {
    setRsvpEvent(event);
    setRsvpStatus(event.myRsvp?.status || 'ATTENDING');
    setRsvpMessage(event.myRsvp?.message || '');
  };

  const handleCloseRsvpModal = () => {
    setRsvpEvent(null);
    setRsvpMessage('');
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpEvent) return;

    setSubmittingRsvp(true);
    try {
      const res = await fetch(`/api/alumni/events/${rsvpEvent.id}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: rsvpStatus, message: rsvpMessage }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit RSVP');
      }

      toast.success('RSVP submitted successfully!');
      fetchEvents();
      handleCloseRsvpModal();
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit RSVP');
    } finally {
      setSubmittingRsvp(false);
    }
  };

  // Format date parts
  const getDateParts = (dateStr: string) => {
    const d = new Date(dateStr);
    const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const day = d.toLocaleDateString('en-US', { day: '2-digit' });
    const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
    const year = d.getFullYear();
    const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return { month, day, weekday, year, time };
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-1">
      <Toaster position="top-right" />

      {/* Styled PTU Crest Header banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#012140] via-[#003D7A] to-[#0f4068] text-white p-8 sm:p-10 shadow-xl border border-white/10">
        {/* Abstract design elements */}
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#C41E3A]/10 blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/3 bottom-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold tracking-wider text-[#C41E3A] border border-white/10 uppercase mb-4">
            University Events
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-3 leading-tight">
            PTU Alumni Events
          </h1>
          <p className="text-slate-200 text-sm sm:text-base font-light leading-relaxed">
            Reconnect with classmates, explore professional developments, and expand your network. Discover the upcoming seminars, workshops, and gatherings.
          </p>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/80 shadow-md p-6 space-y-5">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by event title, details, or venue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-[#003D7A] hover:border-slate-300 transition text-sm bg-slate-50/50"
            />
          </div>
        </div>

        {/* Dynamic Category Capsule Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mask-right">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#003D7A] to-[#012140] text-white shadow-md shadow-blue-900/10 scale-105'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-[#003D7A] border-t-transparent rounded-full mb-3" />
          <p className="text-slate-500 font-semibold">Loading events schedule...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center shadow-sm">
          <Calendar className="mx-auto text-slate-300 mb-4" size={48} />
          <h3 className="text-lg font-bold text-slate-800">No Events Scheduled</h3>
          <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
            There are currently no events matching your filter. Please check back later or modify your search criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => {
            const { month, day, weekday, year, time } = getDateParts(event.eventDate);
            const hasPassed = new Date() > new Date(event.eventDate);
            const isRsvped = !!event.myRsvp;

            return (
              <div
                key={event.id}
                className="group relative bg-white rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-1"
              >
                {/* Visual Category Stripe */}
                <div className="h-2 w-full bg-gradient-to-r from-[#C41E3A] to-[#003D7A]"></div>

                {/* Cover Image/Header */}
                {event.coverImageUrl && (
                  <div className="h-44 w-full overflow-hidden relative border-b border-slate-100">
                    <img
                      src={event.coverImageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                )}

                {/* Main Body */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start gap-4">
                    {/* Custom Calendar Icon */}
                    <div className="flex flex-col items-center justify-center w-14 h-16 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm shrink-0 overflow-hidden text-center">
                      <div className="w-full bg-[#C41E3A] text-white text-[10px] font-bold py-0.5 tracking-wider uppercase">
                        {month}
                      </div>
                      <div className="text-slate-800 text-xl font-extrabold leading-none mt-1">
                        {day}
                      </div>
                      <div className="text-slate-400 text-[9px] font-bold uppercase mb-0.5">
                        {weekday}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="inline-block px-2.5 py-0.5 bg-[#003D7A]/5 text-[#003D7A] font-bold text-[10px] rounded-full uppercase tracking-wider mb-2">
                        {event.category}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-[#003D7A] transition-colors">
                        {event.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm mt-4 leading-relaxed line-clamp-3 flex-1">
                    {event.description}
                  </p>

                  {/* Metadata fields */}
                  <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Clock className="text-[#003D7A]" size={16} />
                      <span className="truncate">{time} ({weekday}, {year})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="text-[#C41E3A]" size={16} />
                      <span className="truncate" title={event.venue}>{event.venue}</span>
                    </div>
                    <div className="flex items-center gap-2 col-span-1 sm:col-span-2">
                      <Users className="text-blue-500" size={16} />
                      <span className="font-semibold text-slate-700">
                        {event.attendingCount} attending alumni
                      </span>
                    </div>
                  </div>

                  {/* RSVP Info Banner */}
                  {isRsvped && (
                    <div className={`mt-4 px-4 py-2.5 rounded-2xl flex items-center justify-between text-xs font-semibold ${
                      event.myRsvp?.status === 'ATTENDING'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                        : event.myRsvp?.status === 'MAYBE'
                        ? 'bg-amber-50 text-amber-800 border border-amber-100'
                        : 'bg-rose-50 text-rose-800 border border-rose-100'
                    }`}>
                      <div className="flex items-center gap-2">
                        <Check size={14} className="shrink-0" />
                        <span>
                          Your RSVP: <span className="uppercase">{event.myRsvp?.status.replace('_', ' ')}</span>
                        </span>
                      </div>
                      {event.myRsvp?.message && (
                        <span className="text-[10px] text-slate-400 italic font-normal truncate max-w-[120px]" title={event.myRsvp.message}>
                          &quot;{event.myRsvp.message}&quot;
                        </span>
                      )}
                    </div>
                  )}

                  {/* CTA Buttons */}
                  <div className="mt-5 flex gap-2">
                    <button
                      onClick={() => setActiveDetailEvent(event)}
                      className="px-4 py-2.5 border border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 font-bold rounded-2xl transition text-xs shrink-0 flex items-center gap-1.5"
                    >
                      <Info size={14} />
                      Details
                    </button>

                    {hasPassed ? (
                      <button
                        disabled
                        className="flex-1 py-2.5 bg-slate-100 text-slate-400 font-bold rounded-2xl text-xs cursor-not-allowed text-center uppercase tracking-wider"
                      >
                        Event Concluded
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenRsvpModal(event)}
                        className={`flex-1 py-2.5 font-bold rounded-2xl text-xs transition shadow-sm text-center ${
                          isRsvped
                            ? 'border-2 border-[#003D7A] text-[#003D7A] hover:bg-[#003D7A] hover:text-white'
                            : 'bg-[#003D7A] hover:bg-[#002654] text-white'
                        }`}
                      >
                        {isRsvped ? 'Change RSVP' : 'RSVP Now'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* RSVP Drawer Modal */}
      {rsvpEvent && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4 backdrop-blur-xs">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border-t sm:border border-slate-200 animate-slide-up sm:animate-fade-in">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <div>
                <h3 className="text-md font-bold text-slate-900">Event Attendance RSVP</h3>
                <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[280px]" title={rsvpEvent.title}>
                  For: {rsvpEvent.title}
                </p>
              </div>
              <button
                onClick={handleCloseRsvpModal}
                className="text-slate-400 hover:text-slate-600 transition p-1 hover:bg-slate-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleRsvpSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Will you be attending?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRsvpStatus('ATTENDING')}
                    className={`py-3 rounded-2xl border text-xs font-bold transition flex flex-col items-center gap-1.5 ${
                      rsvpStatus === 'ATTENDING'
                        ? 'border-emerald-500 bg-emerald-50/50 text-emerald-800 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-lg">✅</span>
                    <span>Going</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRsvpStatus('MAYBE')}
                    className={`py-3 rounded-2xl border text-xs font-bold transition flex flex-col items-center gap-1.5 ${
                      rsvpStatus === 'MAYBE'
                        ? 'border-amber-500 bg-amber-50/50 text-amber-800 ring-2 ring-amber-500/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-lg">❓</span>
                    <span>Maybe</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRsvpStatus('NOT_ATTENDING')}
                    className={`py-3 rounded-2xl border text-xs font-bold transition flex flex-col items-center gap-1.5 ${
                      rsvpStatus === 'NOT_ATTENDING'
                        ? 'border-rose-500 bg-rose-50/50 text-rose-800 ring-2 ring-rose-500/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-lg">❌</span>
                    <span>Not Going</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                  <MessageSquare size={12} /> Add an optional message
                </label>
                <textarea
                  value={rsvpMessage}
                  onChange={(e) => setRsvpMessage(e.target.value)}
                  placeholder="Leave a note for the organizers (e.g. Food preferences, batch reunion ideas)..."
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-[#003D7A] transition text-sm bg-slate-50/50"
                  maxLength={150}
                />
              </div>

              {rsvpEvent.rsvpDeadline && (
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-2xl flex gap-2 text-[11px] text-blue-800 leading-snug">
                  <Info className="shrink-0 mt-0.5" size={14} />
                  <span>
                    RSVPs close on{' '}
                    <span className="font-bold">
                      {new Date(rsvpEvent.rsvpDeadline).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>.
                  </span>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseRsvpModal}
                  className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 rounded-2xl text-slate-700 font-bold transition text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingRsvp}
                  className="flex-1 py-3 bg-[#003D7A] hover:bg-[#002654] text-white rounded-2xl font-bold transition text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-900/10"
                >
                  {submittingRsvp && <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />}
                  Confirm RSVP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event Details Drawer/Modal */}
      {activeDetailEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[85vh]">
            <div className="relative h-48 bg-gradient-to-r from-[#012140] to-[#003D7A] flex items-end p-6 text-white shrink-0">
              {activeDetailEvent.coverImageUrl && (
                <img
                  src={activeDetailEvent.coverImageUrl}
                  alt={activeDetailEvent.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
              
              <div className="relative z-10 w-full">
                <span className="px-2.5 py-0.5 bg-[#C41E3A] text-white font-bold text-[9px] rounded-full uppercase tracking-wider mb-2 inline-block">
                  {activeDetailEvent.category}
                </span>
                <h3 className="text-xl font-bold leading-tight">{activeDetailEvent.title}</h3>
              </div>
              
              <button
                onClick={() => setActiveDetailEvent(null)}
                className="absolute right-4 top-4 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-slate-700 flex-1">
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">About this Event</h4>
                <p className="text-sm leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {activeDetailEvent.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Date & Time</p>
                  <p className="text-sm font-semibold text-slate-800 mt-1">
                    {new Date(activeDetailEvent.eventDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {new Date(activeDetailEvent.eventDate).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Venue</p>
                  <p className="text-sm font-semibold text-slate-800 mt-1 truncate" title={activeDetailEvent.venue}>
                    {activeDetailEvent.venue}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">In-Person Event</p>
                </div>
              </div>

              {activeDetailEvent.rsvpDeadline && (
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex gap-2 text-xs items-center">
                  <Info size={16} className="text-blue-600 shrink-0" />
                  <div>
                    <span className="font-medium text-slate-500">RSVP Deadline:</span>{' '}
                    <span className="font-bold text-slate-800">
                      {new Date(activeDetailEvent.rsvpDeadline).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
              <button
                onClick={() => setActiveDetailEvent(null)}
                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Spacer for bottom nav */}
      <div className="h-20"></div>
    </div>
  );
}