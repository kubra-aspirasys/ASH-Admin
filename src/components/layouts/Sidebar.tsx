import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  BookOpen,
  Calendar,
  FolderGit2,
  Award,
  Megaphone,
  Zap,
  FileBarChart,
  Settings,
  LogOut
} from 'lucide-react';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isActive }) => (
  <NavLink
    to={to}
    className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
      isActive 
        ? 'bg-indigo-50 text-indigo-700' 
        : 'text-gray-700 hover:bg-gray-100'
    }`}
  >
    {icon}
    <span className="ml-3">{label}</span>
  </NavLink>
);

const Sidebar: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname.startsWith(path);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const navItems = [
    { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/dashboard/aspirants', icon: <Users size={20} />, label: 'Aspirants' },
    { to: '/dashboard/branches', icon: <Building2 size={20} />, label: 'Branches' },
    { to: '/dashboard/branch-admins', icon: <Users size={20} />, label: 'Branch Admins' },
    { to: '/dashboard/courses', icon: <BookOpen size={20} />, label: 'Courses' },
    { to: '/dashboard/interviews', icon: <Calendar size={20} />, label: 'Interviews' },
    { to: '/dashboard/projects', icon: <FolderGit2 size={20} />, label: 'Projects' },
    { to: '/dashboard/certificates', icon: <Award size={20} />, label: 'Certificates' },
    { to: '/dashboard/announcements', icon: <Megaphone size={20} />, label: 'Announcements' },
    { to: '/dashboard/xp', icon: <Zap size={20} />, label: 'XP & Streaks' },
    { to: '/dashboard/reports', icon: <FileBarChart size={20} />, label: 'Reports' },
    { to: '/dashboard/settings', icon: <Settings size={20} />, label: 'Settings' }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Logo */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-indigo-600">AspiraSys</h1>
        <p className="text-sm text-gray-500">Super Admin Portal</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            isActive={isActive(item.to)}
          />
        ))}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
            <span className="text-sm font-medium text-white">MI</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">Mohammed Imran</p>
            <p className="text-xs text-gray-500">Super Admin</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50"
        >
          <LogOut size={20} className="mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;