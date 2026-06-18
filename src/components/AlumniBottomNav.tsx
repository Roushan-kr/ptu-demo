'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Briefcase, User, LogOut } from 'lucide-react';

const navItems = [
  { name: 'Home', href: '/alumni/dashboard', icon: Home },
  { name: 'Events', href: '/alumni/events', icon: Calendar },
  { name: 'Jobs', href: '/alumni/jobs', icon: Briefcase },
  { name: 'Profile', href: '/alumni/profile', icon: User },
];

export default function AlumniBottomNav() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch('/api/alumni/logout', { method: 'POST' });
    window.location.href = '/alumni/login';
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50">
      <div className="flex justify-around items-center max-w-lg mx-auto px-2 pb-[env(safe-area-inset-bottom,16px)] pt-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-2 px-1 transition-all duration-200 relative group flex-1 ${
                isActive 
                  ? 'text-[#C41E3A]' 
                  : 'text-slate-500 hover:text-[#003D7A]'
              }`}
            >
              <item.icon size={20} className={`transition-transform group-hover:scale-110 ${isActive ? 'scale-105 text-[#C41E3A]' : ''}`} />
              <span className={`text-[10px] mt-1 tracking-wide ${isActive ? 'font-bold' : 'font-medium'}`}>{item.name}</span>
              {isActive && <div className="absolute bottom-0 left-4 right-4 h-1 bg-gradient-to-r from-[#C41E3A] to-[#003D7A] rounded-full"></div>}
            </Link>
          );
        })}
        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center py-2 px-1 text-slate-500 hover:text-[#C41E3A] transition-all duration-200 group flex-1"
          title="Logout"
        >
          <LogOut size={20} className="transition-transform group-hover:scale-110" />
          <span className="text-[10px] mt-1 font-semibold">Logout</span>
        </button>
      </div>
    </nav>
  );
}