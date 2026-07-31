import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  CalendarRange,
  Calendar,
  Megaphone,
  Briefcase,
  Award,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useApp, Role } from '../../context/AppContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isMobile: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, isMobile }) => {
  const { currentRole, activeConfig } = useApp();

  const getMenuItemsForRole = (role: Role) => {
    switch (role) {
      case 'student':
        return [
          { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { name: 'Explore Clubs', path: '/clubs', icon: Users },
          { name: 'My Clubs', path: '/my-clubs', icon: Users },
          { name: 'Events', path: '/events', icon: CalendarRange },
          { name: 'Calendar', path: '/calendar', icon: Calendar },
          { name: 'Announcements', path: '/announcements', icon: Megaphone },
          { name: 'Opportunities', path: '/opportunities', icon: Briefcase },
          { name: 'Certificates', path: '/certificates', icon: Award },
          { name: 'Profile', path: '/settings?tab=profile', icon: Users },
          { name: 'Settings', path: '/settings', icon: Settings },
        ];
      case 'president':
        return [
          { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { name: 'Club Overview', path: '/president/overview', icon: LayoutDashboard },
          { name: 'Members', path: '/president/members', icon: Users },
          { name: 'Membership Requests', path: '/president/requests', icon: UserPlus },
          { name: 'Events', path: '/events', icon: CalendarRange },
          { name: 'Attendance', path: '/president/attendance', icon: Award },
          { name: 'Announcements', path: '/announcements', icon: Megaphone },
          { name: 'Gallery', path: '/president/gallery', icon: Sparkles },
          { name: 'Reports', path: '/president/reports', icon: BarChart3 },
          { name: 'Analytics', path: '/president/analytics', icon: BarChart3 },
          { name: 'Settings', path: '/settings', icon: Settings },
        ];
      case 'faculty':
        return [
          { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { name: 'Assigned Clubs', path: '/faculty/clubs', icon: Users },
          { name: 'Event Approvals', path: '/faculty/approvals', icon: ShieldCheck },
          { name: 'Membership Approvals', path: '/faculty/membership-approvals', icon: UserPlus },
          { name: 'Attendance', path: '/faculty/attendance', icon: Award },
          { name: 'Reports', path: '/faculty/reports', icon: BarChart3 },
          { name: 'Analytics', path: '/faculty/analytics', icon: BarChart3 },
          { name: 'Profile', path: '/settings?tab=profile', icon: Users },
        ];
      case 'admin':
        return [
          { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { name: 'Users', path: '/admin/users', icon: Users },
          { name: 'Clubs', path: '/admin/clubs', icon: Users },
          { name: 'Departments', path: '/admin/departments', icon: BarChart3 },
          { name: 'Faculty', path: '/admin/faculty', icon: Users },
          { name: 'Events', path: '/events', icon: CalendarRange },
          { name: 'Announcements', path: '/announcements', icon: Megaphone },
          { name: 'Reports', path: '/admin/reports', icon: BarChart3 },
          { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
          { name: 'Settings', path: '/settings', icon: Settings },
        ];
      case 'superadmin':
        return [
          { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { name: 'Organizations', path: '/superadmin/organizations', icon: Users },
          { name: 'Users', path: '/superadmin/users', icon: Users },
          { name: 'Roles', path: '/superadmin/roles', icon: ShieldCheck },
          { name: 'Permissions', path: '/superadmin/permissions', icon: ShieldCheck },
          { name: 'Audit Logs', path: '/superadmin/audit-logs', icon: BarChart3 },
          { name: 'System Health', path: '/superadmin/system-health', icon: Sparkles },
          { name: 'Platform Analytics', path: '/superadmin/analytics', icon: BarChart3 },
          { name: 'Global Settings', path: '/settings', icon: Settings },
        ];
      default:
        return [
          { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        ];
    }
  };

  const menuItems = getMenuItemsForRole(currentRole);
  const sidebarWidth = isOpen ? 'w-64' : 'w-20';

  if (isMobile && !isOpen) return null;

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-white dark:bg-[#0E1322] border-r border-slate-100 dark:border-slate-800/80 transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isMobile ? 'w-64 fixed' : sidebarWidth
        }`}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-150/50 dark:border-slate-800/60">
          <div className="flex items-center gap-3 overflow-hidden">
            <div 
              className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-xl text-white font-bold font-display shadow-md transition-colors"
              style={{ backgroundColor: activeConfig.accentColor }}
            >
              CP
            </div>
            {(isOpen || isMobile) && (
              <span className="font-display font-bold text-slate-800 dark:text-slate-100 text-sm tracking-wide truncate">
                ClubPortal
              </span>
            )}
          </div>

          {/* Collapse Button (Desktop Only) */}
          {!isMobile && (
            <Button
              variant="ghost"
              size="sm"
              className="p-1.5 !rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hidden md:flex"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-grow py-6 px-3 overflow-y-auto space-y-1.5 scrollbar-none">
          {menuItems.map((item, idx) => (
            <NavLink
              key={`${item.path}-${idx}`}
              to={item.path}
              onClick={() => isMobile && setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 group ${
                  isActive
                    ? `${activeConfig.btnClass} text-white shadow-md ${activeConfig.glowClass}`
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-slate-100'
                }`
              }
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {(isOpen || isMobile) && <span className="truncate">{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer Logout */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800/60">
          <NavLink
            to="/"
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-semibold text-rose-500 dark:text-rose-450 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-600 transition-all duration-200"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {(isOpen || isMobile) && <span>Logout</span>}
          </NavLink>
        </div>
      </aside>
    </>
  );
};

