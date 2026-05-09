import React from 'react';
import { Home, PlusSquare, Search, User, ClipboardList } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { COLORS } from '../../constants';

export const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1A1A1A] border-t border-[#2A2A2A] pb-safe pt-2 px-6 flex justify-between items-center z-50">
      <NavItem to="/" icon={<Home size={24} />} label="Home" />
      <NavItem to="/projects" icon={<ClipboardList size={24} />} label="Drafts" />
      <div className="relative -top-6">
        <NavLink 
          to="/wizard"
          className="w-14 h-14 bg-gradient-to-br from-[#FF6B00] to-[#FF8533] rounded-full flex items-center justify-center shadow-[0_5px_20px_rgba(255,107,0,0.4)] border-4 border-[#0A0A0A]"
        >
          <PlusSquare size={28} className="text-white" />
        </NavLink>
      </div>
      <NavItem to="/search" icon={<Search size={24} />} label="Search" />
      <NavItem to="/profile" icon={<User size={24} />} label="Profile" />
    </nav>
  );
};

const NavItem = ({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) => (
  <NavLink 
    to={to}
    className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-[#FF6B00]' : 'text-[#A0A0A0]'}`}
  >
    {icon}
    <span className="text-[10px] font-medium uppercase tracking-widest">{label}</span>
  </NavLink>
);
