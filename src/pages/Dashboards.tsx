import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  Award, 
  Megaphone, 
  ArrowRight, 
  UserPlus, 
  FileText, 
  Clock, 
  Check, 
  X, 
  Activity, 
  TrendingUp, 
  Shield, 
  Plus, 
  Image as ImageIcon,
  Cpu,
  Bookmark,
  Share2
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Table } from '../components/ui/Table';
import { useApp, ClubEvent, MembershipRequest, Role } from '../context/AppContext';

const getBannerGradient = (role: Role) => {
  switch (role) {
    case 'student': return 'from-indigo-500 via-indigo-600 to-indigo-700 shadow-indigo-600/10';
    case 'volunteer': return 'from-teal-500 via-teal-600 to-teal-700 shadow-teal-650/10';
    case 'committee': return 'from-cyan-500 via-cyan-600 to-cyan-700 shadow-cyan-650/10';
    case 'event_manager': return 'from-orange-500 via-orange-600 to-orange-700 shadow-orange-650/10';
    case 'president': return 'from-purple-500 via-purple-650 to-purple-750 shadow-purple-600/10';
    case 'faculty': return 'from-emerald-500 via-emerald-600 to-emerald-700 shadow-emerald-650/10';
    case 'admin': return 'from-blue-500 via-blue-600 to-blue-700 shadow-blue-650/10';
    case 'superadmin': return 'from-rose-500 via-rose-600 to-rose-700 shadow-rose-650/10';
    default: return 'from-indigo-500 via-indigo-600 to-indigo-700 shadow-indigo-600/10';
  }
};

export const Dashboards: React.FC = () => {

  const navigate = useNavigate();
  const {
    currentRole,
    clubs,
    events,
    registerForEvent,
    approveEvent,
    membershipRequests,
    handleMembership,
    announcements,
    certificates,
    opportunities,
    createAnnouncement,
    createEvent
  } = useApp();

  // State for modals
  const [showEventModal, setShowEventModal] = useState(false);
  const [showAnnounceModal, setShowAnnounceModal] = useState(false);

  // Form states
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventVenue, setNewEventVenue] = useState('');
  
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');
  const [newAnnPriority, setNewAnnPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');

  // Welcome user info helper
  const getUserName = () => {
    switch (currentRole) {
      case 'student': return 'Amit Sharma';
      case 'volunteer': return 'Amit Sharma';
      case 'committee': return 'Amit Sharma';
      case 'event_manager': return 'Amit Sharma';
      case 'president': return 'Alex Mercer';
      case 'faculty': return 'Dr. Sarah Jenkins';
      case 'admin': return 'Dean of Student Affairs';
      case 'superadmin': return 'System Root Admin';
      default: return 'User';
    }
  };


  const handleCreateEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle || !newEventDate || !newEventVenue) return;
    createEvent({
      title: newEventTitle,
      date: newEventDate,
      venue: newEventVenue,
      time: '10:00 AM - 04:00 PM',
      organizer: currentRole === 'president' ? 'Coding Club' : 'General Campus',
      clubId: 'club-1',
      poster: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=450&fit=crop&q=80',
    });
    setNewEventTitle('');
    setNewEventDate('');
    setNewEventVenue('');
    setShowEventModal(false);
  };

  const handleCreateAnnounceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle || !newAnnContent) return;
    createAnnouncement({
      title: newAnnTitle,
      content: newAnnContent,
      priority: newAnnPriority,
      department: currentRole === 'admin' ? 'Dean of Student Affairs' : 'Club Council',
    });
    setNewAnnTitle('');
    setNewAnnContent('');
    setShowAnnounceModal(false);
  };

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Welcome Banner */}
      <div className={`p-6 md:p-8 rounded-3xl bg-gradient-to-r ${getBannerGradient(currentRole)} text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden`}>
        <div className="absolute right-[-40px] top-[-40px] w-48 h-48 rounded-full bg-white/10 blur-xl" />
        <div className="space-y-1.5 relative z-10">
          <h1 className="text-xl md:text-2xl font-bold font-display">
            Welcome back, {getUserName()}!
          </h1>
          <p className="text-xs text-white/90 font-medium">
            Portal active in <span className="underline font-bold">{currentRole.toUpperCase().replace('_', ' ')}</span> clearance. Review all widgets below.
          </p>
        </div>

        <div className="flex gap-2 relative z-10">
          {currentRole === 'president' && (
            <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs" onClick={() => setShowEventModal(true)}>
              <Plus className="h-4 w-4 mr-1.5" /> Propose Event
            </Button>
          )}
          {currentRole === 'admin' && (
            <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs" onClick={() => setShowAnnounceModal(true)}>
              <Megaphone className="h-4 w-4 mr-1.5" /> Broadcast Alert
            </Button>
          )}
          <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs" onClick={() => navigate('/settings')}>
            Edit Profile
          </Button>
        </div>
      </div>

      {/* RENDER ROLE SPECIFIC DASHBOARDS */}
      {currentRole === 'student' && (
        <StudentDashboard 
          clubsCount={clubs.filter(c => c.isJoined).length}
          registeredEvents={events.filter(e => e.isRegistered)}
          certificates={certificates}
          announcements={announcements}
          opportunities={opportunities}
          registerForEvent={registerForEvent}
          navigate={navigate}
        />
      )}

      {currentRole === 'volunteer' && (
        <VolunteerDashboard 
          clubsCount={clubs.filter(c => c.isJoined).length}
          registeredEvents={events.filter(e => e.isRegistered)}
          certificates={certificates}
          announcements={announcements}
          opportunities={opportunities}
          navigate={navigate}
        />
      )}

      {currentRole === 'committee' && (
        <CommitteeDashboard 
          navigate={navigate}
        />
      )}

      {currentRole === 'event_manager' && (
        <EventManagerDashboard 
          events={events}
          setShowEventModal={setShowEventModal}
          navigate={navigate}
        />
      )}

      {currentRole === 'president' && (
        <PresidentDashboard 
          requests={membershipRequests.filter(r => r.status === 'Pending')}
          handleRequest={handleMembership}
          events={events.filter(e => e.clubId === 'club-1')}
          announcements={announcements}
          setShowEventModal={setShowEventModal}
          setShowAnnounceModal={setShowAnnounceModal}
        />
      )}

      {currentRole === 'faculty' && (
        <FacultyDashboard 
          pendingEvents={events.filter(e => e.status === 'Pending Approval')}
          approveEvent={approveEvent}
          requests={membershipRequests.filter(r => r.status === 'Pending')}
          handleRequest={handleMembership}
        />
      )}

      {currentRole === 'admin' && (
        <AdminDashboard 
          totalClubs={clubs.length}
          pendingApprovals={events.filter(e => e.status === 'Pending Approval').length}
          requests={membershipRequests.filter(r => r.status === 'Pending')}
          handleRequest={handleMembership}
          setShowAnnounceModal={setShowAnnounceModal}
        />
      )}

      {currentRole === 'superadmin' && (
        <SuperAdminDashboard 
          totalStudents={2451}
          totalClubs={clubs.length}
        />
      )}


      {/* Propose Event Modal (President) */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-[#0E1322] border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-2xl animate-slide-up">
            <h3 className="text-base font-bold font-display text-slate-900 dark:text-white mb-4">Propose Club Event</h3>
            <form onSubmit={handleCreateEventSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500">Event Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. React Workshop" 
                  value={newEventTitle} 
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-transparent text-slate-850 dark:text-slate-150 outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500">Proposed Date</label>
                <input 
                  type="date" 
                  required
                  value={newEventDate} 
                  onChange={(e) => setNewEventDate(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-transparent text-slate-850 dark:text-slate-150 outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500">Proposed Venue</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Block A Seminar Room"
                  value={newEventVenue} 
                  onChange={(e) => setNewEventVenue(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-transparent text-slate-850 dark:text-slate-150 outline-none focus:border-primary"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" type="button" onClick={() => setShowEventModal(false)}>Cancel</Button>
                <Button variant="primary" size="sm" type="submit">Submit Proposal</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Broadcast Alert Modal (Admin) */}
      {showAnnounceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-[#0E1322] border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-2xl animate-slide-up">
            <h3 className="text-base font-bold font-display text-slate-900 dark:text-white mb-4">Broadcast Announcement</h3>
            <form onSubmit={handleCreateAnnounceSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500">Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Budget Deadline" 
                  value={newAnnTitle} 
                  onChange={(e) => setNewAnnTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-transparent text-slate-850 dark:text-slate-150 outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500">Content</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Write announcement details here..." 
                  value={newAnnContent} 
                  onChange={(e) => setNewAnnContent(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-transparent text-slate-850 dark:text-slate-150 outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500">Priority</label>
                <select
                  value={newAnnPriority}
                  onChange={(e) => setNewAnnPriority(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-transparent text-slate-850 dark:text-slate-150 outline-none focus:border-primary dark:bg-slate-900"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" type="button" onClick={() => setShowAnnounceModal(false)}>Cancel</Button>
                <Button variant="primary" size="sm" type="submit">Broadcast</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 1. STUDENT DASHBOARD SUB-PAGE
// ==========================================
interface StudentDashProps {
  clubsCount: number;
  registeredEvents: ClubEvent[];
  certificates: any[];
  announcements: any[];
  opportunities: any[];
  registerForEvent: (id: string) => void;
  navigate: any;
}
const StudentDashboard: React.FC<StudentDashProps> = ({
  clubsCount,
  registeredEvents,
  certificates,
  announcements,
  opportunities,
  registerForEvent,
  navigate
}) => {
  const stats = [
    { label: 'Joined Clubs', value: clubsCount, icon: Users, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20' },
    { label: 'Registered Events', value: registeredEvents.length, icon: Calendar, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' },
    { label: 'Certificates Vault', value: certificates.length, icon: Award, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20' },
    { label: 'Open Opportunities', value: opportunities.length, icon: FileText, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/20' },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} hoverable={true}>
            <CardBody className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-extrabold text-slate-900 dark:text-white font-display">{stat.value}</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{stat.label}</div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Columns - Activities & Registrations */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Registered Events */}
          <Card hoverable={false}>
            <CardHeader className="flex justify-between items-center">
              <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white">Registered Active Events</h3>
              <Button variant="ghost" size="sm" onClick={() => navigate('/events')} className="text-xs">Browse All</Button>
            </CardHeader>
            <CardBody className="divide-y divide-slate-50 dark:divide-slate-800/60">
              {registeredEvents.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">You are not registered for any active events.</div>
              ) : (
                registeredEvents.map(evt => (
                  <div key={evt.id} className="flex justify-between items-center py-3.5 first:pt-0 last:pb-0">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-850 dark:text-slate-100">{evt.title}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold">{evt.date} • {evt.venue}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* Simulated QR Code placeholder */}
                      <div className="h-9 w-9 bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700/60 cursor-pointer hover:scale-105 transition-transform" title="Show Check-in QR">
                        <svg viewBox="0 0 24 24" className="h-full w-full text-slate-800 dark:text-slate-350" fill="currentColor">
                          <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm0 8v2h2v-2H5zm8-8v2h2V5h-2zm2-2h6v6h-6V3zm2 2v2h2V5h-2zM3 15h6v6H3v-6zm12 2v4h2v-4h-2zm4-2v4h2v-4h-2zm-4 4h4v2h-4v-2z" />
                        </svg>
                      </div>
                      <Button variant="outline" size="sm" className="text-xs text-rose-500 border-rose-200 dark:border-rose-950/40 hover:bg-rose-50/50" onClick={() => registerForEvent(evt.id)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardBody>
          </Card>

          {/* Timeline Feed */}
          <Card>
            <CardHeader>
              <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white">Recent Activities</h3>
            </CardHeader>
            <CardBody className="relative pl-6 border-l border-slate-100 dark:border-slate-800 space-y-6">
              <div className="relative">
                <span className="absolute left-[-29px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-slate-900 bg-primary block" />
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Registered for HackTech 2026</h4>
                <p className="text-[10px] text-slate-400 font-semibold mt-1">Today • 11:20 AM</p>
              </div>
              <div className="relative">
                <span className="absolute left-[-29px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-slate-900 bg-emerald-500 block" />
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Joined Debate & Literary Society</h4>
                <p className="text-[10px] text-slate-400 font-semibold mt-1">Yesterday • 04:30 PM</p>
              </div>
              <div className="relative">
                <span className="absolute left-[-29px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-slate-900 bg-amber-500 block" />
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">AI/ML Bootcamp Certificate Issued</h4>
                <p className="text-[10px] text-slate-400 font-semibold mt-1">Jan 20, 2026</p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Columns - Side Widgets */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <Card hoverable={false}>
            <CardHeader><h3 className="text-sm font-bold font-display text-slate-900 dark:text-white">Quick Actions</h3></CardHeader>
            <CardBody className="grid grid-cols-2 gap-3">
              <button onClick={() => navigate('/clubs')} className="p-3 border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 text-center transition-colors">
                <Users className="h-5 w-5 text-indigo-500 mx-auto mb-2" />
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-350">Browse Clubs</span>
              </button>
              <button onClick={() => navigate('/events')} className="p-3 border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 text-center transition-colors">
                <Calendar className="h-5 w-5 text-emerald-500 mx-auto mb-2" />
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-350">Browse Events</span>
              </button>
              <button onClick={() => navigate('/certificates')} className="p-3 border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl hover:bg-amber-50/30 dark:hover:bg-amber-950/20 text-center transition-colors">
                <Award className="h-5 w-5 text-amber-500 mx-auto mb-2" />
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-350">Cert Vault</span>
              </button>
              <button onClick={() => navigate('/opportunities')} className="p-3 border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl hover:bg-rose-50/30 dark:hover:bg-rose-950/20 text-center transition-colors">
                <FileText className="h-5 w-5 text-rose-500 mx-auto mb-2" />
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-350">Opportunities</span>
              </button>
            </CardBody>
          </Card>

          {/* pinned Announcements */}
          <Card hoverable={false}>
            <CardHeader><h3 className="text-sm font-bold font-display text-slate-900 dark:text-white">Active Alerts</h3></CardHeader>
            <CardBody className="space-y-4">
              {announcements.slice(0, 2).map(ann => (
                <div key={ann.id} className="p-3 border border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/10 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <Badge variant={ann.priority === 'High' ? 'danger' : 'accent'} className="text-[9px]">{ann.priority}</Badge>
                    <span className="text-[9px] text-slate-400 font-semibold">{ann.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-850 dark:text-slate-150 leading-tight">{ann.title}</h4>
                  <p className="text-[10px] text-slate-500 leading-normal">{ann.content.slice(0, 75)}...</p>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. CLUB PRESIDENT DASHBOARD SUB-PAGE
// ==========================================
interface PresidentDashProps {
  requests: MembershipRequest[];
  handleRequest: (id: string, action: 'approve' | 'reject') => void;
  events: ClubEvent[];
  announcements: any[];
  setShowEventModal: (show: boolean) => void;
  setShowAnnounceModal: (show: boolean) => void;
}
const PresidentDashboard: React.FC<PresidentDashProps> = ({
  requests,
  handleRequest,
  events,
  announcements,
  setShowEventModal,
  setShowAnnounceModal
}) => {
  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-primary"><Users className="h-5 w-5" /></div>
            <div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white font-display">142</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Club Members</div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-secondary"><UserPlus className="h-5 w-5" /></div>
            <div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white font-display">{requests.length}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pending Approvals</div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-accent"><Calendar className="h-5 w-5" /></div>
            <div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white font-display">{events.length}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Events</div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-500"><TrendingUp className="h-5 w-5" /></div>
            <div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white font-display">86%</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Avg Attendance</div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side - Table approvals */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white">Pending Memberships</h3>
              <Badge variant="primary">{requests.length} Requests</Badge>
            </CardHeader>
            <CardBody className="p-0">
              {requests.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-400">No pending requests for Coding Club.</div>
              ) : (
                <Table
                  columns={[
                    { header: 'Student Name', accessor: 'studentName' },
                    { header: 'Dept / Year', accessor: (row) => `${row.department} (${row.year})` },
                    {
                      header: 'Actions',
                      accessor: (row) => (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="p-1 text-emerald-500 border-emerald-200 hover:bg-emerald-55" onClick={() => handleRequest(row.id, 'approve')}>
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="p-1 text-rose-500 border-rose-200 hover:bg-rose-55" onClick={() => handleRequest(row.id, 'reject')}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )
                    }
                  ]}
                  data={requests}
                  keyExtractor={(row) => row.id}
                />
              )}
            </CardBody>
          </Card>

          {/* SVG Analytics Chart */}
          <Card>
            <CardHeader><h3 className="text-sm font-bold font-display text-slate-900 dark:text-white">Active Participation Trend</h3></CardHeader>
            <CardBody className="pt-2">
              <div className="h-44 w-full relative flex items-end">
                {/* SVG Mock Area chart */}
                <svg className="w-full h-full" viewBox="0 0 500 150" fill="none">
                  <path d="M0 130 C 50 110, 100 80, 150 90 C 200 100, 250 40, 300 50 C 350 60, 400 20, 450 10 L 450 150 L 0 150 Z" fill="url(#indigo-grad)" fillOpacity="0.15" />
                  <path d="M0 130 C 50 110, 100 80, 150 90 C 200 100, 250 40, 300 50 C 350 60, 400 20, 450 10" stroke="#4F46E5" strokeWidth="3" />
                  <defs>
                    <linearGradient id="indigo-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4F46E5" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="flex justify-between text-[9px] font-bold text-slate-400 tracking-wider px-2 border-t border-slate-50 dark:border-slate-800/40 pt-2">
                <span>MARCH</span>
                <span>APRIL</span>
                <span>MAY</span>
                <span>JUNE</span>
                <span>JULY (NOW)</span>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right side - quick actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader><h3 className="text-sm font-bold font-display text-slate-900 dark:text-white">President Actions</h3></CardHeader>
            <CardBody className="space-y-3">
              <Button variant="primary" size="md" className="w-full" onClick={() => setShowEventModal(true)}>
                <Plus className="h-4 w-4 mr-2" /> Propose New Event
              </Button>
              <Button variant="outline" size="md" className="w-full text-slate-650" onClick={() => setShowAnnounceModal(true)}>
                <Megaphone className="h-4 w-4 mr-2 text-indigo-500" /> Post Announcement
              </Button>
              <Button variant="outline" size="md" className="w-full text-slate-650">
                <ImageIcon className="h-4 w-4 mr-2 text-emerald-500" /> Upload Club Gallery
              </Button>
            </CardBody>
          </Card>

          {/* Budget Widget summary */}
          <Card>
            <CardHeader><h3 className="text-sm font-bold font-display text-slate-900 dark:text-white">Active Event Proposals</h3></CardHeader>
            <CardBody className="space-y-4">
              {events.map(evt => (
                <div key={evt.id} className="flex justify-between items-center text-xs">
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100">{evt.title}</h4>
                    <span className="text-[10px] text-slate-400">{evt.date}</span>
                  </div>
                  <Badge variant={evt.status === 'Approved' ? 'secondary' : 'accent'}>{evt.status}</Badge>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. FACULTY DASHBOARD SUB-PAGE
// ==========================================
interface FacultyDashProps {
  pendingEvents: ClubEvent[];
  approveEvent: (id: string) => void;
  requests: MembershipRequest[];
  handleRequest: (id: string, action: 'approve' | 'reject') => void;
}
const FacultyDashboard: React.FC<FacultyDashProps> = ({
  pendingEvents,
  approveEvent,
  requests,
  handleRequest
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-primary"><Shield className="h-5 w-5" /></div>
            <div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white font-display">2</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Coordinated Clubs</div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-secondary"><Calendar className="h-5 w-5" /></div>
            <div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white font-display">{pendingEvents.length}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pending Event Approvals</div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-accent"><Users className="h-5 w-5" /></div>
            <div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white font-display">{requests.length}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Membership Actions</div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Pending approvals details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white">Event Proposals Pending Approvals</h3>
            </CardHeader>
            <CardBody className="p-0">
              {pendingEvents.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-400">No pending event proposals to review.</div>
              ) : (
                <Table
                  columns={[
                    { header: 'Event Title', accessor: 'title' },
                    { header: 'Proposed Club', accessor: 'organizer' },
                    { header: 'Date', accessor: 'date' },
                    {
                      header: 'Action',
                      accessor: (row) => (
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => approveEvent(row.id)}>
                            <Check className="h-4 w-4 mr-1" /> Approve
                          </Button>
                        </div>
                      )
                    }
                  ]}
                  data={pendingEvents}
                  keyExtractor={(row) => row.id}
                />
              )}
            </CardBody>
          </Card>

          {/* Assigned Clubs Overview */}
          <Card>
            <CardHeader><h3 className="text-sm font-bold font-display text-slate-900 dark:text-white">Club Growth Trackers</h3></CardHeader>
            <CardBody className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-750 dark:text-slate-200">
                  <span>Coding Club</span>
                  <span>142 Members</span>
                </div>
                <ProgressBar value={142} max={200} color="primary" />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-750 dark:text-slate-200">
                  <span>Robotics Association</span>
                  <span>89 Members</span>
                </div>
                <ProgressBar value={89} max={200} color="secondary" />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right side faculty widget */}
        <div className="space-y-6">
          <Card>
            <CardHeader><h3 className="text-sm font-bold font-display text-slate-900 dark:text-white">Faculty Toolkit</h3></CardHeader>
            <CardBody className="space-y-3.5">
              <Button variant="primary" className="w-full">
                Generate Activity Report
              </Button>
              <Button variant="outline" className="w-full text-slate-650">
                Log Student Attendance Reports
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. COLLEGE ADMIN DASHBOARD SUB-PAGE
// ==========================================
interface AdminDashProps {
  totalClubs: number;
  pendingApprovals: number;
  requests: any[];
  handleRequest: any;
  setShowAnnounceModal: (show: boolean) => void;
}
const AdminDashboard: React.FC<AdminDashProps> = ({
  totalClubs,
  pendingApprovals,
  requests,
  handleRequest,
  setShowAnnounceModal
}) => {
  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-primary"><Users className="h-5 w-5" /></div>
            <div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white font-display">{totalClubs}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-sans">Total active clubs</div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-secondary"><Calendar className="h-5 w-5" /></div>
            <div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white font-display">{pendingApprovals}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Unapproved events</div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-accent"><Award className="h-5 w-5" /></div>
            <div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white font-display">12</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Faculty Overseers</div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-500"><TrendingUp className="h-5 w-5" /></div>
            <div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white font-display">4,250</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total interactions</div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Department Rankings */}
          <Card>
            <CardHeader><h3 className="text-sm font-bold font-display text-slate-900 dark:text-white">Department Club Growth Ranking</h3></CardHeader>
            <CardBody className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                  <span>Computer Science & Engineering</span>
                  <span>45% growth</span>
                </div>
                <ProgressBar value={45} max={100} color="primary" />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                  <span>Mechanical Engineering</span>
                  <span>25% growth</span>
                </div>
                <ProgressBar value={25} max={100} color="secondary" />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                  <span>Business Administration (MBA)</span>
                  <span>30% growth</span>
                </div>
                <ProgressBar value={30} max={100} color="accent" />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Toolkit admin panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader><h3 className="text-sm font-bold font-display text-slate-900 dark:text-white">Administrative Actions</h3></CardHeader>
            <CardBody className="space-y-3">
              <Button variant="primary" className="w-full">Create Student Club</Button>
              <Button variant="outline" className="w-full text-slate-650" onClick={() => setShowAnnounceModal(true)}>Publish Alert Banner</Button>
              <Button variant="outline" className="w-full text-slate-650">Assign Club Coordinator</Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 5. SUPER ADMIN DASHBOARD SUB-PAGE
// ==========================================
interface SuperDashProps {
  totalStudents: number;
  totalClubs: number;
}
const SuperAdminDashboard: React.FC<SuperDashProps> = ({ totalStudents, totalClubs }) => {
  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-primary"><Cpu className="h-5 w-5" /></div>
            <div>
              <div className="text-sm font-extrabold text-emerald-500 font-display">99.8%</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">System Health</div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-secondary"><Users className="h-5 w-5" /></div>
            <div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white font-display">{totalStudents}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Registered Users</div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-accent"><Shield className="h-5 w-5" /></div>
            <div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white font-display">12</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">User Roles Configured</div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-500"><Activity className="h-5 w-5" /></div>
            <div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white font-display">1.4s</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-sans">Avg API Latency</div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: System Logs */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><h3 className="text-sm font-bold font-display text-slate-900 dark:text-white">Active System Action Log</h3></CardHeader>
            <CardBody className="p-0">
              <Table
                columns={[
                  { header: 'Action Context', accessor: 'context' },
                  { header: 'Initiated By', accessor: 'user' },
                  { header: 'System Response', accessor: 'status' },
                  { header: 'Timestamp', accessor: 'time' },
                ]}
                data={[
                  { context: 'Database migration checkpoint', user: 'Cron Daemon', status: 'Success', time: '10 mins ago' },
                  { context: 'Reset password dispatch action', user: 'Root Admin', status: 'Delivered', time: '1 hour ago' },
                  { context: 'Budget allocation report exported', user: 'Dean User', status: 'Success', time: '3 hours ago' },
                ]}
                keyExtractor={(row) => row.time}
              />
            </CardBody>
          </Card>
        </div>

        {/* Right side Super tools */}
        {/* Right side Super tools */}
        <div className="space-y-6">
          <Card>
            <CardHeader><h3 className="text-sm font-bold font-display text-slate-900 dark:text-white">Operations Toolset</h3></CardHeader>
            <CardBody className="space-y-3">
              <Button variant="danger" className="w-full">Trigger Database Backup</Button>
              <Button variant="outline" className="w-full text-slate-650">Config Permission Matrix</Button>
              <Button variant="outline" className="w-full text-slate-650">Inspect API Gateways</Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. VOLUNTEER DASHBOARD SUB-PAGE
// ==========================================
interface VolunteerDashProps {
  clubsCount: number;
  registeredEvents: ClubEvent[];
  certificates: any[];
  announcements: any[];
  opportunities: any[];
  navigate: any;
}
const VolunteerDashboard: React.FC<VolunteerDashProps> = ({
  clubsCount,
  registeredEvents,
  certificates,
  announcements,
  opportunities,
  navigate
}) => {
  const [tasks, setTasks] = useState([
    { id: '1', name: 'Swag Box unpacking & cataloging', deadline: 'Today, 04:00 PM', done: false },
    { id: '2', name: 'Mounting banners at seminar hall entrance', deadline: 'Today, 06:00 PM', done: true },
    { id: '3', name: 'Safety screening gates setup support', deadline: 'Tomorrow, 08:00 AM', done: false },
  ]);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const stats = [
    { label: 'Assigned Tasks', value: `${tasks.filter(t => t.done).length}/${tasks.length}`, icon: Award, color: 'text-teal-500 bg-teal-50 dark:bg-teal-950/20' },
    { label: 'Volunteer Schedule', value: '2 Shifts', icon: Calendar, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' },
    { label: 'Joined Clubs', value: clubsCount, icon: Users, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20' },
    { label: 'Registered Events', value: registeredEvents.length, icon: Calendar, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/20' },
  ];

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} hoverable={true}>
            <CardBody className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-extrabold text-slate-900 dark:text-white font-display">{stat.value}</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{stat.label}</div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <Card hoverable={false}>
            <CardHeader className="flex justify-between items-center">
              <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white">Active Volunteer Tasks</h3>
              <Button variant="ghost" size="sm" onClick={() => navigate('/volunteer/tasks')} className="text-xs">Manage Tasks</Button>
            </CardHeader>
            <CardBody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {tasks.map(t => (
                <div key={t.id} className="flex justify-between items-center py-3.5 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={t.done} 
                      onChange={() => toggleTask(t.id)}
                      className="h-4.5 w-4.5 rounded border-slate-150 text-teal-650 focus:ring-teal-500 cursor-pointer"
                    />
                    <div>
                      <h4 className={`text-xs font-bold ${t.done ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-100'}`}>{t.name}</h4>
                      <p className="text-[10px] text-slate-450 font-semibold">{t.deadline}</p>
                    </div>
                  </div>
                  <Badge variant={t.done ? 'secondary' : 'neutral'}>{t.done ? 'Completed' : 'Pending'}</Badge>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>

        {/* Right Side: Quick Actions & Scanner */}
        <div className="space-y-6">
          <Card hoverable={false}>
            <CardHeader><h3 className="text-sm font-bold font-display text-slate-900 dark:text-white">Quick Actions</h3></CardHeader>
            <CardBody className="space-y-3">
              <Button variant="primary" className="w-full bg-teal-600 hover:bg-teal-700" onClick={() => navigate('/volunteer/scanner')}>
                Open Attendance Scanner
              </Button>
              <Button variant="outline" className="w-full text-teal-600 border-teal-200" onClick={() => navigate('/volunteer/schedule')}>
                View Duty Schedule
              </Button>
              <Button variant="outline" className="w-full text-teal-600 border-teal-200" onClick={() => navigate('/certificates')}>
                Download Certificate
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 7. COMMITTEE DASHBOARD SUB-PAGE
// ==========================================
interface CommitteeDashProps {
  navigate: any;
}
const CommitteeDashboard: React.FC<CommitteeDashProps> = ({ navigate }) => {
  const [registrations, setRegistrations] = useState([
    { id: '1', name: 'Jane Doe', event: 'HackTech 2026', checked: false },
    { id: '2', name: 'Mark Smith', event: 'HackTech 2026', checked: true },
    { id: '3', name: 'Alice Johnson', event: 'RoboWars Championship', checked: false },
  ]);

  const verifyTicket = (id: string) => {
    setRegistrations(prev => prev.map(r => r.id === id ? { ...r, checked: true } : r));
    alert('Simulated Verification: Student registration credentials approved.');
  };

  const stats = [
    { label: "Today's Registrations", value: registrations.length, icon: UserPlus, color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/20' },
    { label: 'Pending Verifications', value: registrations.filter(r => !r.checked).length, icon: Clock, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20' },
    { label: 'Attendance Checked', value: registrations.filter(r => r.checked).length, icon: Award, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' },
    { label: 'Assigned Events', value: '2 Events', icon: Calendar, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20' },
  ];

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} hoverable={true}>
            <CardBody className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-extrabold text-slate-900 dark:text-white font-display">{stat.value}</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{stat.label}</div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Registrations pending */}
        <div className="lg:col-span-2 space-y-6">
          <Card hoverable={false}>
            <CardHeader className="flex justify-between items-center">
              <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white font-sans">Pending Registrations</h3>
              <Button variant="ghost" size="sm" onClick={() => navigate('/committee/registrations')} className="text-xs">Browse All</Button>
            </CardHeader>
            <CardBody className="p-0">
              <Table 
                columns={[
                  { header: 'Student Name', accessor: 'name' },
                  { header: 'Event Requested', accessor: 'event' },
                  { header: 'Status', accessor: (row) => <Badge variant={row.checked ? 'secondary' : 'accent'}>{row.checked ? 'Verified' : 'Pending'}</Badge> },
                  { 
                    header: 'Control', 
                    accessor: (row) => !row.checked && (
                      <Button variant="secondary" size="sm" onClick={() => verifyTicket(row.id)}>
                        Verify
                      </Button>
                    )
                  }
                ]}
                data={registrations}
                keyExtractor={(row) => row.id}
              />
            </CardBody>
          </Card>
        </div>

        {/* Right Side: Quick Actions */}
        <div className="space-y-6">
          <Card hoverable={false}>
            <CardHeader><h3 className="text-sm font-bold font-display text-slate-900 dark:text-white">Quick Actions</h3></CardHeader>
            <CardBody className="space-y-3">
              <Button variant="primary" className="w-full bg-cyan-600 hover:bg-cyan-700" onClick={() => navigate('/committee/attendance')}>
                Scan Attendance
              </Button>
              <Button variant="outline" className="w-full text-cyan-600 border-cyan-200" onClick={() => navigate('/committee/members')}>
                Inspect Member Registry
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 8. EVENT MANAGER DASHBOARD SUB-PAGE
// ==========================================
interface EventManagerDashProps {
  events: ClubEvent[];
  setShowEventModal: (show: boolean) => void;
  navigate: any;
}
const EventManagerDashboard: React.FC<EventManagerDashProps> = ({ events, setShowEventModal, navigate }) => {
  const stats = [
    { label: 'Upcoming Events', value: events.length, icon: Calendar, color: 'text-orange-500 bg-orange-50 dark:bg-orange-950/20' },
    { label: 'Venue Status', value: '4 Booked', icon: Award, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20' },
    { label: 'Allocated Volunteers', value: '18 Active', icon: Users, color: 'text-teal-500 bg-teal-50 dark:bg-teal-950/20' },
    { label: 'Check-in Conversion', value: '92%', icon: Activity, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/20' },
  ];

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} hoverable={true}>
            <CardBody className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-extrabold text-slate-900 dark:text-white font-display">{stat.value}</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{stat.label}</div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Upcoming Events */}
        <div className="lg:col-span-2 space-y-6">
          <Card hoverable={false}>
            <CardHeader className="flex justify-between items-center">
              <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white">Active Events Roster</h3>
              <Button variant="ghost" size="sm" onClick={() => navigate('/events')} className="text-xs">Browse All</Button>
            </CardHeader>
            <CardBody className="p-0">
              <Table 
                columns={[
                  { header: 'Event Title', accessor: 'title' },
                  { header: 'Proposed Date', accessor: 'date' },
                  { header: 'Proposed Venue', accessor: 'venue' },
                  { header: 'Roster Capacity', accessor: (row) => `${row.registrationCount} Signups` }
                ]}
                data={events}
                keyExtractor={(row) => row.id}
              />
            </CardBody>
          </Card>
        </div>

        {/* Right Side: Quick Actions */}
        <div className="space-y-6">
          <Card hoverable={false}>
            <CardHeader><h3 className="text-sm font-bold font-display text-slate-900 dark:text-white">Quick Actions</h3></CardHeader>
            <CardBody className="space-y-3">
              <Button variant="primary" className="w-full bg-orange-600 hover:bg-orange-700" onClick={() => setShowEventModal(true)}>
                Create Event
              </Button>
              <Button variant="outline" className="w-full text-orange-650 border-orange-200" onClick={() => navigate('/event-manager/registrations')}>
                Manage Registrations
              </Button>
              <Button variant="outline" className="w-full text-orange-650 border-orange-200" onClick={() => navigate('/event-manager/gallery')}>
                Upload Gallery Highlights
              </Button>
              <Button variant="outline" className="w-full text-orange-650 border-orange-200" onClick={() => navigate('/event-manager/analytics')}>
                Event Performance Report
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

