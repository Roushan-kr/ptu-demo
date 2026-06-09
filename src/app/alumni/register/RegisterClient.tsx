'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import bcrypt from 'bcryptjs';
import Link from 'next/link';

export default function SelfRegisterPage() {
  const router = useRouter();
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    enrollmentNo: '',
    batchYear: '',
    branch: '',
    college: 'IKGPTU Main Campus',
    course: '',
    phone: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(formData.password, salt);

      const res = await fetch('/api/alumni/new-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          authProvider: 'MANUAL',
          passwordHash: hashedPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Shared Input Style to ensure black text
  const inputStyle = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black placeholder-gray-400 focus:ring-[#003D7A] focus:border-[#003D7A]";

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Thank you, <strong>{formData.name}</strong>. Your registration request has been sent to the alumni administration for review. 
          </p>
          <button 
            onClick={() => router.push('/alumni/login')}
            className="w-full py-3 bg-[#003D7A] text-white rounded-lg font-semibold hover:bg-[#002654] transition"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#C41E3A] rounded flex items-center justify-center text-white font-bold">P</div>
              <span className="text-xl font-bold text-gray-900">IKGPTU Alumni</span>
            </div>
            <Link 
              href="/alumni/login" 
              className="text-sm font-medium text-[#003D7A] hover:text-[#002654] flex items-center gap-1 transition"
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      </nav>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-[#C41E3A] p-6 text-white text-center">
            <h1 className="text-2xl font-bold">Alumni Registration</h1>
            <p className="text-red-100">Join the IKGPTU Alumni Network</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100">
                ⚠️ {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 border-b pb-2">Personal Details</h3>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name *</label>
                  <input
                    id="name"
                    type="text"
                    required
                    className={inputStyle}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address *</label>
                  <input
                    id="email"
                    type="email"
                    required
                    className={inputStyle}
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password *</label>
                  <input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    className={inputStyle}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>

              {/* Academic Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 border-b pb-2">Academic Details</h3>

                <div>
                  <label htmlFor="enrollmentNo" className="block text-sm font-medium text-gray-700">Enrollment No.</label>
                  <input
                    id="enrollmentNo"
                    type="text"
                    className={inputStyle}
                    value={formData.enrollmentNo}
                    onChange={(e) => setFormData({...formData, enrollmentNo: e.target.value})}
                  />
                </div>

                <div>
                  <label htmlFor="batchYear" className="block text-sm font-medium text-gray-700">Batch Year *</label>
                  <input
                    id="batchYear"
                    type="number"
                    required
                    placeholder="Enter batch year"
                    className={inputStyle}
                    value={formData.batchYear}
                    onChange={(e) => setFormData({...formData, batchYear: e.target.value})}
                  />
                </div>

                <div>
                  <label htmlFor="branch" className="block text-sm font-medium text-gray-700">Branch/Department *</label>
                  <input
                    id="branch"
                    type="text"
                    required
                    placeholder="Enter branch or department"
                    className={inputStyle}
                    value={formData.branch}
                    onChange={(e) => setFormData({...formData, branch: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#003D7A] hover:bg-[#002654] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#003D7A] disabled:opacity-50 transition"
              >
                {loading ? 'Processing...' : 'Submit Registration Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}