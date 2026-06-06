'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Edit3, Save, X, Mail, Briefcase, MapPin } from 'lucide-react';

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

export default function ProfilePage() {
  const [profile, setProfile] = useState<AlumniProfile | null>(null);
  const [editingMode, setEditingMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<AlumniProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/alumni/me');
      if (!res.ok) throw new Error('Unauthorized');
      const data = await res.json();
      setProfile(data.user);
      setFormData(data.user);
    } catch {
      router.push('/alumni/login');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData) return;
    setSaving(true);
    try {
      const res = await fetch('/api/alumni/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Update failed');
      const updated = await res.json();
      setProfile(updated.user);
      setFormData(updated.user);
      setEditingMode(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setEditingMode(false);
  };

  const handleInputChange = (field: keyof AlumniProfile, value: any) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
    }
  };

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
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#C41E3A] to-[#003D7A] text-white rounded-2xl p-8 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Your Profile</h1>
            <p className="text-red-100">Manage your alumni network presence</p>
          </div>
          <button
            onClick={() => setEditingMode(!editingMode)}
            className="flex items-center gap-2 px-6 py-3 bg-white text-[#C41E3A] rounded-lg hover:bg-gray-100 transition font-semibold"
          >
            {editingMode ? <X size={20} /> : <Edit3 size={20} />}
            {editingMode ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Profile Header Background */}
        <div className="bg-gradient-to-r from-[#003D7A]/20 to-[#C41E3A]/20 h-32"></div>

        {/* Profile Content */}
        <div className="px-8 pb-8 relative">
          {/* Avatar Circle */}
          <div className="flex justify-center -mt-16 mb-6">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#C41E3A] to-[#003D7A] flex items-center justify-center text-6xl shadow-lg border-4 border-white">
              👤
            </div>
          </div>

          {!editingMode ? (
            // View Mode
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{profile?.name}</h2>
                <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
                  <MapPin size={18} className="text-[#C41E3A]" />
                  <span className="font-semibold">{profile?.branch}</span>
                  <span className="mx-2">•</span>
                  <span className="font-semibold">Class of {profile?.batchYear}</span>
                </div>
                <p className="text-gray-600">{profile?.college}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Mail className="text-[#003D7A]" size={20} />
                    <h3 className="font-semibold text-gray-800">Email</h3>
                  </div>
                  <p className="text-gray-700 text-sm">{profile?.email}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Briefcase className="text-[#003D7A]" size={20} />
                    <h3 className="font-semibold text-gray-800">Current Role</h3>
                  </div>
                  <p className="text-gray-700 text-sm">{profile?.currentRole || 'Not specified'}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xl">🏢</span>
                    <h3 className="font-semibold text-gray-800">Company</h3>
                  </div>
                  <p className="text-gray-700 text-sm">{profile?.currentCompany || 'Not specified'}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <MapPin className="text-[#C41E3A]" size={20} />
                    <h3 className="font-semibold text-gray-800">Location</h3>
                  </div>
                  <p className="text-gray-700 text-sm">{profile?.city || 'Not specified'}</p>
                </div>
              </div>
            </div>
          ) : (
            // Edit Mode
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData?.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#003D7A] transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email (Read-only)</label>
                <input
                  type="email"
                  value={formData?.email}
                  disabled
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Branch</label>
                  <input
                    type="text"
                    value={formData?.branch}
                    onChange={(e) => handleInputChange('branch', e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#003D7A] transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Batch Year</label>
                  <input
                    type="number"
                    value={formData?.batchYear}
                    onChange={(e) => handleInputChange('batchYear', parseInt(e.target.value))}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#003D7A] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">College</label>
                <input
                  type="text"
                  value={formData?.college}
                  onChange={(e) => handleInputChange('college', e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#003D7A] transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Current Role</label>
                <input
                  type="text"
                  value={formData?.currentRole || ''}
                  onChange={(e) => handleInputChange('currentRole', e.target.value)}
                  placeholder="e.g., Senior Engineer"
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#003D7A] transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Company</label>
                <input
                  type="text"
                  value={formData?.currentCompany || ''}
                  onChange={(e) => handleInputChange('currentCompany', e.target.value)}
                  placeholder="e.g., Tech Company Inc."
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#003D7A] transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  value={formData?.city || ''}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="e.g., Bangalore"
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#003D7A] transition"
                />
              </div>

              <div className="flex gap-3 pt-6">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#C41E3A] to-[#003D7A] text-white rounded-lg hover:shadow-lg transition font-semibold disabled:opacity-50"
                >
                  <Save size={20} />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Additional Options */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Privacy Settings</h3>
          <p className="text-gray-600 mb-4">Control who can see your profile and contact information</p>
          <button className="w-full py-2 border-2 border-[#003D7A] text-[#003D7A] rounded-lg hover:bg-[#003D7A] hover:text-white transition font-semibold">
            Manage Privacy
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Account Settings</h3>
          <p className="text-gray-600 mb-4">Change your password and other account preferences</p>
          <button className="w-full py-2 border-2 border-[#003D7A] text-[#003D7A] rounded-lg hover:bg-[#003D7A] hover:text-white transition font-semibold">
            Account Settings
          </button>
        </div>
      </div>

      {/* Spacer for bottom nav */}
      <div className="h-20"></div>
    </div>
  );
}