'use client';

import { useEffect, useState } from 'react';
import axiosClient from '@/lib/axios-client';
import { toast } from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, Calendar, MapPin, Users, Check, Eye, Search } from 'lucide-react';

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
  maybeCount: number;
  totalRsvps: number;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
}

interface RSVP {
  id: string;
  status: 'ATTENDING' | 'NOT_ATTENDING' | 'MAYBE';
  message: string | null;
  respondedAt: string;
  alumni: {
    id: string;
    name: string;
    email: string;
    batchYear: number;
    branch: string;
    course: string | null;
    currentRole: string | null;
    currentCompany: string | null;
    avatarUrl: string | null;
  };
}

interface RSVPData {
  eventTitle: string;
  eventDate: string;
  totalCount: number;
  attendingCount: number;
  maybeCount: number;
  notAttendingCount: number;
  rsvps: RSVP[];
}

const categories = ['Reunion', 'Workshop', 'Networking', 'Mentorship', 'Sports', 'Panel', 'Webinar', 'General'];

export default function EventsManagementPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'General',
    eventDate: '',
    venue: '',
    coverImageUrl: '',
    rsvpDeadline: '',
    isPublished: false,
  });

  // RSVP details modal
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [rsvpData, setRsvpData] = useState<RSVPData | null>(null);
  const [loadingRsvps, setLoadingRsvps] = useState(false);
  const [rsvpSearch, setRsvpSearch] = useState('');

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/api/admin/events');
      setEvents(res.data);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const fetchRsvps = async (eventId: string) => {
    setLoadingRsvps(true);
    try {
      const res = await axiosClient.get(`/api/admin/events/${eventId}/rsvps`);
      setRsvpData(res.data);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to load RSVPs');
    } finally {
      setLoadingRsvps(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openCreateModal = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      category: 'General',
      eventDate: '',
      venue: '',
      coverImageUrl: '',
      rsvpDeadline: '',
      isPublished: false,
    });
    setShowModal(true);
  };

  const openEditModal = (event: Event) => {
    setEditingEvent(event);
    
    // Format dates for datetime-local input (YYYY-MM-DDThh:mm)
    const formatForInput = (dateStr: string | null) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      const tzOffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
      const localISOTime = (new Date(date.getTime() - tzOffset)).toISOString().slice(0, 16);
      return localISOTime;
    };

    setFormData({
      title: event.title,
      description: event.description,
      category: event.category,
      eventDate: formatForInput(event.eventDate),
      coverImageUrl: event.coverImageUrl || '',
      venue: event.venue,
      rsvpDeadline: formatForInput(event.rsvpDeadline),
      isPublished: event.isPublished,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.eventDate || !formData.venue) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        coverImageUrl: formData.coverImageUrl || null,
        rsvpDeadline: formData.rsvpDeadline || null,
      };

      if (editingEvent) {
        await axiosClient.put(`/api/admin/events/${editingEvent.id}`, payload);
        toast.success('Event updated successfully');
      } else {
        await axiosClient.post('/api/admin/events', payload);
        toast.success('Event created successfully');
      }
      fetchEvents();
      setShowModal(false);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePublish = async (event: Event) => {
    try {
      await axiosClient.put(`/api/admin/events/${event.id}`, {
        title: event.title,
        description: event.description,
        category: event.category,
        eventDate: event.eventDate,
        venue: event.venue,
        coverImageUrl: event.coverImageUrl,
        rsvpDeadline: event.rsvpDeadline,
        isPublished: !event.isPublished,
      });
      toast.success(event.isPublished ? 'Event unpublished' : 'Event published');
      fetchEvents();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event? This will delete all RSVPs for this event too.')) return;
    try {
      await axiosClient.delete(`/api/admin/events/${id}`);
      toast.success('Event deleted successfully');
      fetchEvents();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to delete event');
    }
  };

  const openRsvpModal = (eventId: string) => {
    setSelectedEventId(eventId);
    setRsvpSearch('');
    fetchRsvps(eventId);
  };

  const closeRsvpModal = () => {
    setSelectedEventId(null);
    setRsvpData(null);
  };

  const filteredRsvps = rsvpData?.rsvps.filter(rsvp => {
    const searchLower = rsvpSearch.toLowerCase();
    return (
      rsvp.alumni.name.toLowerCase().includes(searchLower) ||
      rsvp.alumni.email.toLowerCase().includes(searchLower) ||
      (rsvp.alumni.currentCompany && rsvp.alumni.currentCompany.toLowerCase().includes(searchLower)) ||
      (rsvp.alumni.currentRole && rsvp.alumni.currentRole.toLowerCase().includes(searchLower)) ||
      rsvp.alumni.branch.toLowerCase().includes(searchLower)
    );
  }) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#003D7A]">Admin Module</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Events Management</h1>
          <p className="mt-2 text-sm text-slate-600">
            Create, publish, and track events for the alumni community. Manage registrations and analyze attendance.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-[#003D7A] hover:bg-[#002654] text-white px-5 py-3 text-sm font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#003D7A]/50 self-start sm:self-center"
        >
          <Plus size={18} />
          Create Event
        </button>
      </section>

      {/* Events List */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-500">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Calendar className="mx-auto text-slate-300 mb-3" size={40} />
            <p className="text-lg font-medium">No events found</p>
            <p className="text-sm text-slate-400 mt-1">Get started by creating your first alumni event!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase text-slate-500 tracking-wider">
                  <th className="px-6 py-4">Event Details</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Venue</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">RSVPs</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {events.map((event) => {
                  const hasPassed = new Date() > new Date(event.eventDate);
                  return (
                    <tr key={event.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-xl overflow-hidden shrink-0 border border-slate-200">
                            {event.coverImageUrl ? (
                              <img src={event.coverImageUrl} alt={event.title} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[#003D7A] font-bold">📅</span>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 line-clamp-1">{event.title}</p>
                            <span className="inline-block mt-1 px-2.5 py-0.5 bg-[#003D7A]/5 text-[#003D7A] font-medium text-xs rounded-full">
                              {event.category}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">
                          {new Date(event.eventDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(event.eventDate).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-800">{event.venue}</td>
                      <td className="px-6 py-4">
                        {hasPassed ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                            Concluded
                          </span>
                        ) : event.isPublished ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                            Active / Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => openRsvpModal(event.id)}
                          className="flex items-center gap-2 hover:bg-slate-100 p-2 rounded-xl transition group text-left"
                        >
                          <div className="bg-slate-100 group-hover:bg-white p-1.5 rounded-lg border border-slate-200">
                            <Users size={16} className="text-slate-500" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{event.attendingCount} Attending</p>
                            <p className="text-xs text-slate-400">{event.totalRsvps} Total RSVP</p>
                          </div>
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleTogglePublish(event)}
                            disabled={hasPassed}
                            className={`p-2 rounded-xl border text-xs font-medium transition ${
                              hasPassed
                                ? 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed'
                                : event.isPublished
                                ? 'border-[#C41E3A]/20 bg-[#C41E3A]/5 text-[#C41E3A] hover:bg-[#C41E3A]/10'
                                : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                            title={event.isPublished ? 'Unpublish Event' : 'Publish Event'}
                          >
                            {event.isPublished ? 'Unpublish' : 'Publish'}
                          </button>
                          <button
                            onClick={() => openEditModal(event)}
                            className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition border border-slate-200"
                            title="Edit Event"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="p-2 text-[#C41E3A] hover:bg-red-50 hover:text-red-700 rounded-xl transition border border-red-100"
                            title="Delete Event"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">{editingEvent ? 'Edit Event' : 'Create Event'}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition p-1 hover:bg-slate-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#003D7A] transition text-sm"
                    placeholder="e.g. Annual Alumni Meet 2026"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl bg-white focus:outline-none focus:border-[#003D7A] transition text-sm"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Venue *</label>
                  <input
                    type="text"
                    required
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#003D7A] transition text-sm"
                    placeholder="e.g. Main Auditorium, Campus"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Event Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#003D7A] transition text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">RSVP Deadline (Optional)</label>
                  <input
                    type="datetime-local"
                    value={formData.rsvpDeadline}
                    onChange={(e) => setFormData({ ...formData, rsvpDeadline: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#003D7A] transition text-sm"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Cover Image URL (Optional)</label>
                  <input
                    type="url"
                    value={formData.coverImageUrl}
                    onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#003D7A] transition text-sm"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Description *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#003D7A] transition text-sm"
                    placeholder="Write details about the event, activities, guest speakers, etc..."
                  />
                </div>

                <div className="col-span-2 flex items-center gap-2 py-2">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="h-4.5 w-4.5 rounded text-[#003D7A] focus:ring-[#003D7A]"
                  />
                  <label htmlFor="isPublished" className="text-sm font-semibold text-slate-700 select-none cursor-pointer">
                    Publish this event immediately (visible in the alumni portal)
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold transition text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-[#003D7A] hover:bg-[#002654] text-white rounded-xl font-semibold transition text-sm flex items-center gap-2"
                >
                  {submitting && <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />}
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RSVPs Modal */}
      {selectedEventId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Event RSVP Details</h2>
                {rsvpData && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    For event: <span className="font-semibold text-slate-700">{rsvpData.eventTitle}</span>
                  </p>
                )}
              </div>
              <button onClick={closeRsvpModal} className="text-slate-400 hover:text-slate-600 transition p-1 hover:bg-slate-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            {loadingRsvps ? (
              <div className="p-12 text-center text-slate-500 flex-1">Loading RSVP details...</div>
            ) : !rsvpData ? (
              <div className="p-12 text-center text-slate-500 flex-1">Failed to load RSVP data.</div>
            ) : (
              <div className="flex flex-col flex-1 overflow-hidden">
                {/* RSVP Status Counters */}
                <div className="grid grid-cols-4 border-b border-slate-100 bg-slate-50/50 p-4 gap-4 text-center">
                  <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-semibold text-slate-400 uppercase">Total RSVPs</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{rsvpData.totalCount}</p>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-emerald-500">
                    <p className="text-xs font-semibold text-emerald-600 uppercase">Attending</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{rsvpData.attendingCount}</p>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-amber-500">
                    <p className="text-xs font-semibold text-amber-600 uppercase">Maybe</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{rsvpData.maybeCount}</p>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-red-500">
                    <p className="text-xs font-semibold text-red-600 uppercase">Not Attending</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{rsvpData.notAttendingCount}</p>
                  </div>
                </div>

                {/* Search / Filter */}
                <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search respondents by name, email, batch, branch, current company/role..."
                      value={rsvpSearch}
                      onChange={(e) => setRsvpSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#003D7A] transition text-sm"
                    />
                  </div>
                </div>

                {/* RSVP list */}
                <div className="overflow-y-auto flex-1">
                  {filteredRsvps.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">No respondents found matching your filters.</div>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-semibold uppercase text-slate-500 tracking-wider">
                          <th className="px-6 py-3">Alumni</th>
                          <th className="px-6 py-3">Batch & Branch</th>
                          <th className="px-6 py-3">Current Employment</th>
                          <th className="px-6 py-3">Status</th>
                          <th className="px-6 py-3">Message</th>
                          <th className="px-6 py-3">Responded At</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                        {filteredRsvps.map((rsvp) => (
                          <tr key={rsvp.id} className="hover:bg-slate-50/20 transition-colors">
                            <td className="px-6 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-[#003D7A] text-white flex items-center justify-center font-bold text-sm shrink-0 uppercase">
                                  {rsvp.alumni.avatarUrl ? (
                                    <img src={rsvp.alumni.avatarUrl} alt={rsvp.alumni.name} className="w-full h-full object-cover rounded-full" />
                                  ) : (
                                    rsvp.alumni.name.charAt(0)
                                  )}
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-900">{rsvp.alumni.name}</p>
                                  <p className="text-xs text-slate-400">{rsvp.alumni.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-3">
                              <p className="font-medium text-slate-800">{rsvp.alumni.branch}</p>
                              <p className="text-xs text-slate-500">Batch {rsvp.alumni.batchYear} {rsvp.alumni.course ? `(${rsvp.alumni.course})` : ''}</p>
                            </td>
                            <td className="px-6 py-3">
                              {rsvp.alumni.currentRole || rsvp.alumni.currentCompany ? (
                                <>
                                  <p className="font-medium text-slate-800 line-clamp-1">{rsvp.alumni.currentRole || 'Alumni'}</p>
                                  <p className="text-xs text-slate-500 line-clamp-1">{rsvp.alumni.currentCompany || 'Self Employed'}</p>
                                </>
                              ) : (
                                <p className="text-slate-400 italic">Not Provided</p>
                              )}
                            </td>
                            <td className="px-6 py-3">
                              {rsvp.status === 'ATTENDING' ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                  Attending
                                </span>
                              ) : rsvp.status === 'MAYBE' ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20">
                                  Maybe
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20">
                                  Not Attending
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-3 max-w-xs">
                              {rsvp.message ? (
                                <p className="text-xs text-slate-600 truncate" title={rsvp.message}>
                                  {rsvp.message}
                                </p>
                              ) : (
                                <span className="text-slate-400 italic text-xs">-</span>
                              )}
                            </td>
                            <td className="px-6 py-3 text-xs text-slate-500">
                              {new Date(rsvp.respondedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
