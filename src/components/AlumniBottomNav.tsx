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
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-3 px-5 transition-all duration-200 relative group flex-1 ${
                isActive 
                  ? 'text-[#C41E3A] border-b-4 border-[#C41E3A]' 
                  : 'text-gray-600 hover:text-[#003D7A]'
              }`}
            >
              <item.icon size={24} className="transition-transform group-hover:scale-110" />
              <span className="text-xs mt-1 font-semibold">{item.name}</span>
              {isActive && <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C41E3A] to-[#003D7A]"></div>}
            </Link>
          );
        })}
        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center py-3 px-5 text-gray-600 hover:text-[#C41E3A] transition-all duration-200 group flex-1"
          title="Logout"
        >
          <LogOut size={24} className="transition-transform group-hover:scale-110" />
          <span className="text-xs mt-1 font-semibold">Logout</span>
        </button>
      </div>
    </nav>
  );
}