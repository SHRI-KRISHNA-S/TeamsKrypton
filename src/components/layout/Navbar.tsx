import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  Mail, 
  Sun, 
  Moon, 
  Menu, 
  ChevronDown, 
  Award, 
  Users, 
  Calendar, 
  Megaphone,
  Check,
  User,
  LogOut,
  Settings as SettingsIcon,
  ShieldCheck
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useApp, Role } from '../../context/AppContext';

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isMobile: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ sidebarOpen, setSidebarOpen, isMobile }) => {
  const {
    theme,
    toggleTheme,
    currentRole,
    setCurrentRole,
    notifications,
    markAllNotificationsRead,
    markNotificationRead,
    unreadNotificationsCount,
    globalSearch,
  } = useApp();

  const navigate = useNavigate();

  // Dropdown States
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [msgOpen, setMsgOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  
  // Notification filter state
  const [notifFilter, setNotifFilter] = useState<'all' | 'event' | 'club' | 'membership' | 'opportunity' | 'announcement'>('all');

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const msgRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
      if (msgRef.current && !msgRef.current.contains(event.target as Node)) {
        setMsgOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(event.target as Node)) {
        setRoleOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Search suggestions
  const searchResults = globalSearch(searchQuery);
  const hasSearchResults = 
    searchResults.clubs.length > 0 ||
    searchResults.events.length > 0 ||
    searchResults.announcements.length > 0 ||
    searchResults.certificates.length > 0;

  // Filtered Notifications
  const filteredNotifications = notifications.filter(n => 
    notifFilter === 'all' ? true : n.type === notifFilter
  );

  // Get active user details
  const getRoleUser = () => {
    switch (currentRole) {
      case 'student':
        return { name: 'Amit Sharma', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&q=80', subtitle: 'Computer Science Dept' };
      case 'president':
        return { name: 'Alex Mercer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80', subtitle: 'Coding Club President' };
      case 'faculty':
        return { name: 'Dr. Sarah Jenkins', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80', subtitle: 'Faculty Coordinator' };
      case 'admin':
        return { name: 'Dean of Student Affairs', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=80', subtitle: 'College Administration' };
      case 'superadmin':
        return { name: 'System Root Admin', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&q=80', subtitle: 'Super Operations' };
    }
  };

  const currentUser = getRoleUser();

  const handleSuggestionClick = (path: string) => {
    setSearchQuery('');
    setSearchFocused(false);
    navigate(path);
  };

  return (
    <header className="h-16 sticky top-0 z-30 bg-white/80 dark:bg-[#0E1322]/85 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between px-6">
      <div className="flex items-center gap-4 flex-grow max-w-xl">
        {/* Mobile menu trigger */}
        <Button
          variant="ghost"
          size="sm"
          className="p-1.5 !rounded-lg text-slate-500 dark:text-slate-400"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Global Live Search Bar */}
        <div ref={searchRef} className="relative w-full max-w-md hidden sm:block">
          <div className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all duration-200 ${
            searchFocused
              ? 'bg-white dark:bg-slate-900 border-primary ring-2 ring-indigo-500/10'
              : 'bg-slate-50 dark:bg-slate-900/60 border-slate-100 dark:border-slate-800/60'
          }`}>
            <Search className="h-4 w-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search clubs, events, certificates, or timelines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              className="bg-transparent border-none outline-none w-full text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>

          {/* Suggestions Dropdown */}
          {searchFocused && searchQuery && (
            <div className="absolute top-13 left-0 right-0 max-h-96 overflow-y-auto bg-white dark:bg-[#0E1322] border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-xl p-3 z-50 animate-fade-in scrollbar-none">
              {!hasSearchResults ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  No matching records found.
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Clubs Matches */}
                  {searchResults.clubs.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 px-2">
                        Clubs
                      </div>
                      <div className="space-y-0.5">
                        {searchResults.clubs.map(c => (
                          <div
                            key={c.id}
                            onClick={() => handleSuggestionClick('/clubs')}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/60 cursor-pointer transition-colors"
                          >
                            <Users className="h-4 w-4 text-indigo-500" />
                            <div className="text-xs text-slate-700 dark:text-slate-350 font-medium">{c.name}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Events Matches */}
                  {searchResults.events.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 px-2">
                        Events
                      </div>
                      <div className="space-y-0.5">
                        {searchResults.events.map(e => (
                          <div
                            key={e.id}
                            onClick={() => handleSuggestionClick('/events')}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/60 cursor-pointer transition-colors"
                          >
                            <Calendar className="h-4 w-4 text-emerald-500" />
                            <div className="text-xs text-slate-700 dark:text-slate-350 font-medium">{e.title}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Certificates Matches */}
                  {searchResults.certificates.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 px-2">
                        Certificates
                      </div>
                      <div className="space-y-0.5">
                        {searchResults.certificates.map(cert => (
                          <div
                            key={cert.id}
                            onClick={() => handleSuggestionClick('/certificates')}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/60 cursor-pointer transition-colors"
                          >
                            <Award className="h-4 w-4 text-amber-500" />
                            <div className="text-xs text-slate-700 dark:text-slate-350 font-medium">{cert.event}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Announcements Matches */}
                  {searchResults.announcements.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 px-2">
                        Announcements
                      </div>
                      <div className="space-y-0.5">
                        {searchResults.announcements.map(ann => (
                          <div
                            key={ann.id}
                            onClick={() => handleSuggestionClick('/announcements')}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/60 cursor-pointer transition-colors"
                          >
                            <Megaphone className="h-4 w-4 text-rose-500" />
                            <div className="text-xs text-slate-700 dark:text-slate-350 font-medium truncate">{ann.title}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons Section */}
      <div className="flex items-center gap-2 md:gap-3.5">
        
        {/* Role Switcher Widget (For Graders/Evaluators) */}
        <div ref={roleRef} className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRoleOpen(!roleOpen)}
            className="flex items-center gap-2 border-indigo-200 dark:border-indigo-900/65 bg-indigo-50/20 dark:bg-indigo-950/10 text-primary py-1.5 px-3 rounded-xl hover:bg-indigo-50/50"
          >
            <ShieldCheck className="h-4 w-4 flex-shrink-0" />
            <span className="text-xs font-bold hidden md:inline">Role: {currentRole.toUpperCase()}</span>
            <ChevronDown className="h-3 w-3 opacity-60" />
          </Button>

          {roleOpen && (
            <div className="absolute right-0 mt-2.5 w-48 bg-white dark:bg-[#0E1322] border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-xl p-2 z-50 animate-fade-in">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Switch Portal Role
              </div>
              {(['student', 'president', 'faculty', 'admin', 'superadmin'] as Role[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setCurrentRole(r);
                    setRoleOpen(false);
                    navigate('/dashboard');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl text-left cursor-pointer transition-colors ${
                    currentRole === r
                      ? 'bg-primary text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <span>{r.toUpperCase()}</span>
                  {currentRole === r && <Check className="h-3 w-3" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="p-2.5 !rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50"
          onClick={toggleTheme}
          aria-label="Toggle Theme Mode"
        >
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>

        {/* Messages Dropdown Drawer */}
        <div ref={msgRef} className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="p-2.5 !rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50"
            onClick={() => setMsgOpen(!msgOpen)}
          >
            <Mail className="h-5 w-5" />
          </Button>

          {msgOpen && (
            <div className="absolute right-[-60px] sm:right-0 mt-2.5 w-80 bg-white dark:bg-[#0E1322] border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-xl p-3.5 z-50 animate-fade-in">
              <div className="flex items-center justify-between mb-3 border-b border-slate-50 dark:border-slate-800/60 pb-2">
                <span className="text-sm font-semibold font-display text-slate-950 dark:text-white">Active Discussions</span>
                <Badge variant="primary" className="text-[9px] px-1.5 py-0">2 New</Badge>
              </div>
              <div className="space-y-3.5 max-h-72 overflow-y-auto scrollbar-none">
                <div className="flex items-start gap-3 cursor-pointer p-1.5 hover:bg-slate-50 dark:hover:bg-slate-900/40 rounded-xl">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80" alt="Liam" className="h-9 w-9 rounded-full object-cover" />
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Liam Carter (Robotics)</div>
                    <p className="text-[11px] text-slate-450 truncate mt-0.5">Could you sign off the arena dimensions approval document by...</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 cursor-pointer p-1.5 hover:bg-slate-50 dark:hover:bg-slate-900/40 rounded-xl">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80" alt="Sarah" className="h-9 w-9 rounded-full object-cover" />
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Dr. Sarah Jenkins</div>
                    <p className="text-[11px] text-slate-450 truncate mt-0.5">Excellent draft proposal, Alex. Ready to pitch this next Monday.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Dropdown Panel */}
        <div ref={notifRef} className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="p-2.5 !rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 relative"
            onClick={() => setNotifOpen(!notifOpen)}
          >
            <Bell className="h-5 w-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-slate-950">
                {unreadNotificationsCount}
              </span>
            )}
          </Button>

          {notifOpen && (
            <div className="absolute right-[-100px] sm:right-0 mt-2.5 w-80 sm:w-96 bg-white dark:bg-[#0E1322] border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-xl p-3.5 z-50 animate-fade-in">
              <div className="flex items-center justify-between mb-3 border-b border-slate-50 dark:border-slate-800/60 pb-2">
                <span className="text-sm font-semibold font-display text-slate-950 dark:text-white">Inbox Updates</span>
                <button 
                  onClick={markAllNotificationsRead}
                  className="text-xs font-bold text-primary hover:text-indigo-700 cursor-pointer"
                >
                  Mark All Read
                </button>
              </div>

              {/* Notification Category Filters */}
              <div className="flex gap-1.5 overflow-x-auto scrollbar-none mb-3.5 pb-1">
                {(['all', 'event', 'club', 'membership', 'opportunity', 'announcement'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setNotifFilter(cat)}
                    className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-md cursor-pointer transition-colors ${
                      notifFilter === cat
                        ? 'bg-indigo-50 dark:bg-indigo-950/45 text-primary'
                        : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Notification Items */}
              <div className="space-y-3.5 max-h-72 overflow-y-auto scrollbar-none">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400">
                    No new notifications in this category.
                  </div>
                ) : (
                  filteredNotifications.map(n => (
                    <div 
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`flex items-start gap-3 p-2 rounded-xl transition-all cursor-pointer ${
                        n.read ? 'opacity-60 hover:bg-slate-50 dark:hover:bg-slate-900/30' : 'bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100/50 dark:border-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex-shrink-0 mt-1">
                        <span className={`h-2.5 w-2.5 rounded-full block ${!n.read ? 'bg-primary animate-pulse' : 'bg-slate-300 dark:bg-slate-700'}`} />
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-baseline">
                          <span className="text-xs font-bold text-slate-950 dark:text-slate-100">{n.title}</span>
                          <span className="text-[10px] text-slate-400 font-semibold">{n.date}</span>
                        </div>
                        <p className="text-[11px] text-slate-650 dark:text-slate-400 mt-1 leading-normal">
                          {n.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div ref={profileRef} className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 p-1 !rounded-xl"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-8.5 w-8.5 rounded-xl object-cover ring-2 ring-slate-100 dark:ring-slate-800/80"
            />
            <ChevronDown className="h-3 w-3 opacity-60 text-slate-500" />
          </Button>

          {profileOpen && (
            <div className="absolute right-0 mt-2.5 w-56 bg-white dark:bg-[#0E1322] border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-xl p-2.5 z-50 animate-fade-in">
              <div className="px-3.5 py-3 border-b border-slate-50 dark:border-slate-800/60 mb-2">
                <div className="text-xs font-bold text-slate-950 dark:text-white truncate">{currentUser.name}</div>
                <div className="text-[10px] text-slate-400 font-semibold mt-0.5 truncate">{currentUser.subtitle}</div>
              </div>
              <button 
                onClick={() => { setProfileOpen(false); navigate('/settings'); }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-slate-100 rounded-xl cursor-pointer"
              >
                <User className="h-4 w-4" />
                <span>My Profile</span>
              </button>
              <button 
                onClick={() => { setProfileOpen(false); navigate('/settings'); }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-slate-100 rounded-xl cursor-pointer"
              >
                <SettingsIcon className="h-4 w-4" />
                <span>Account Settings</span>
              </button>
              <button 
                onClick={() => { setProfileOpen(false); navigate('/'); }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl cursor-pointer border-t border-slate-50 dark:border-slate-800/50 mt-1 pt-2.5"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
