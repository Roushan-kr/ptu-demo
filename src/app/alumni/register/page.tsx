'use client';

import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const errorParam = searchParams.get('error');
  const [alumni, setAlumni] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const oauthErrorMessage = (code: string | null) => {
    if (!code) return '';
    if (code === 'AccessDenied') {
      return 'Google sign-in was denied or no matching alumni account was found. Use the invitation link again, or sign in at /alumni/login if you already registered.';
    }
    if (code === 'OAuthCallback' || code === 'Callback') {
      return 'OAuth failed (often LinkedIn app permissions). Enable “Sign In with LinkedIn using OpenID Connect” on your LinkedIn app and try again, or use Google / manual registration.';
    }
    return `Error: ${code}`;
  };
  const [error, setError] = useState(errorParam ? oauthErrorMessage(errorParam) : '');
  const [manualMode, setManualMode] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    currentRole: '',
    currentCompany: '',
    city: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const getCookieValue = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
  };

  useEffect(() => {
    const resolvedToken = token || getCookieValue('invite_token');
    if (!resolvedToken) {
      setError(
        'No invitation token in this link. Open the full invitation URL from your email (it contains ?token=…). Already registered? Sign in at /alumni/login'
      );
      setLoading(false);
      return;
    }
    fetch(`/api/alumni/verify-token?token=${resolvedToken}`)
      .then(r => r.json())
      .then(data => {
        if (data.valid) {
          setAlumni(data.alumni);
          setFormData({
            email: data.alumni.email,
            name: data.alumni.name,
            password: '',
            currentRole: '',
            currentCompany: '',
            city: '',
          });
        } else {
          setError('Invalid or expired invitation link');
        }
      })
      .catch(() => setError('Failed to verify invitation'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const resolvedToken = token || getCookieValue('invite_token');
    try {
      const res = await fetch('/api/alumni/register-manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resolvedToken, ...formData }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push('/alumni/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOAuth = (provider: 'google' | 'linkedin') => {
    const resolvedToken = token || getCookieValue('invite_token');
    if (resolvedToken) {
      document.cookie = `invite_token=${encodeURIComponent(resolvedToken)}; path=/; SameSite=Lax; Max-Age=900`;
    }
    const callbackUrl = new URL(`/alumni/oauth-success?token=${encodeURIComponent(resolvedToken || '')}`, window.location.origin).href;
    signIn(provider, { callbackUrl });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-[#C41E3A] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-xl">⚠️</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-3">Registration Error</h2>
        <p className="text-red-600 mb-6">{error}</p>
        <button onClick={() => window.location.href = '/alumni/login'} className="w-full px-4 py-2 bg-[#003D7A] text-white rounded-lg hover:bg-[#002654] transition">
          Back to Login
        </button>
      </div>
    </div>
  );

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed relative"
      style={{
        backgroundImage: 'url(/images/campus.jpg)',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Header with logo */}
      <div className="relative z-10 pt-6 pb-4 border-b border-white/20">
        <div className="max-w-2xl mx-auto px-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-bold text-[#C41E3A] text-sm">
            PTU
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">IKGPTU Alumni</h1>
            <p className="text-xs text-gray-100">I.K. Gujral Punjab Technical University</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Welcome header */}
          <div className="bg-gradient-to-r from-[#C41E3A] to-[#003D7A] px-8 py-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-2">Welcome!</h2>
            <p className="text-gray-100 text-sm">Complete your registration</p>
          </div>

          {/* Form content */}
          <div className="px-8 py-8">
            <div className="mb-6">
              <p className="text-2xl font-bold text-gray-900">{alumni.name.split(' ')[0]}</p>
              <p className="text-sm text-gray-600 mt-1">{alumni.branch} · Class of {alumni.batchYear}</p>
              <p className="text-xs text-gray-500 mt-3">You're invited to join the IKGPTU alumni network</p>
            </div>

            {!manualMode ? (
              <>
                <div className="space-y-3">
                  <button 
                    onClick={() => handleOAuth('google')} 
                    className="w-full flex items-center justify-center gap-2 border-2 border-gray-200 py-3 rounded-lg hover:border-[#003D7A] hover:bg-blue-50 transition font-medium text-gray-700"
                  >
                    <span>🔵</span> Continue with Google
                  </button>
                  <button 
                    onClick={() => handleOAuth('linkedin')} 
                    className="w-full flex items-center justify-center gap-2 border-2 border-gray-200 py-3 rounded-lg hover:border-[#0057B8] hover:bg-blue-50 transition font-medium text-gray-700"
                  >
                    <span>💼</span> Continue with LinkedIn
                  </button>
                  
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white px-3 text-sm text-gray-500">or</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setManualMode(true)} 
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-[#C41E3A] to-[#003D7A] text-white font-semibold hover:shadow-lg transition"
                  >
                    Complete Registration Form
                  </button>
                  
                  <p className="text-xs text-gray-600 text-center mt-4">
                    Next time, use the same OAuth provider or email + password from the <strong>Alumni Login</strong> page
                  </p>
                </div>
              </>
            ) : (
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    required 
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#003D7A] transition"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                  <input 
                    type="email" 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                    required 
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#003D7A] transition"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Password * (min 6 characters)</label>
                  <input 
                    type="password" 
                    value={formData.password} 
                    onChange={e => setFormData({...formData, password: e.target.value})} 
                    required 
                    minLength={6} 
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#003D7A] transition"
                    placeholder="Secure password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Current Role (optional)</label>
                  <input 
                    type="text" 
                    value={formData.currentRole} 
                    onChange={e => setFormData({...formData, currentRole: e.target.value})} 
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#003D7A] transition"
                    placeholder="e.g., Software Engineer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Company (optional)</label>
                  <input 
                    type="text" 
                    value={formData.currentCompany} 
                    onChange={e => setFormData({...formData, currentCompany: e.target.value})} 
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#003D7A] transition"
                    placeholder="e.g., Tech Company Inc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">City (optional)</label>
                  <input 
                    type="text" 
                    value={formData.city} 
                    onChange={e => setFormData({...formData, city: e.target.value})} 
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#003D7A] transition"
                    placeholder="e.g., Chandigarh"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={submitting} 
                  className="w-full bg-gradient-to-r from-[#C41E3A] to-[#003D7A] text-white font-semibold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50"
                >
                  {submitting ? 'Registering...' : 'Complete Registration'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setManualMode(false)} 
                  className="w-full text-sm text-gray-600 hover:text-[#003D7A] transition py-2"
                >
                  ← Back to OAuth options
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}