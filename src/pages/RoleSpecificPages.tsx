import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Users, 
  QrCode, 
  Plus, 
  FileText, 
  Shield, 
  Award,
  Calendar,
  Settings,
  Activity,
  UserCheck2,
  Trash2,
  Lock,
  Database,
  Search,
  ExternalLink,
  Info
} from 'lucide-react';
import { Card, CardHeader, CardBody, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table } from '../components/ui/Table';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useApp } from '../context/AppContext';

// ========================================================
// 0. 403 ACCESS DENIED PAGE
// ========================================================
export const AccessDenied: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center px-6 animate-fade-in">
      <Card hoverable={false} className="max-w-md w-full border-rose-100 dark:border-rose-950/40 text-center p-8 bg-rose-500/[0.01]">
        <CardBody className="space-y-6 flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-rose-50 dark:bg-rose-950/20 text-rose-500 flex items-center justify-center">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold font-display text-slate-905 dark:text-white">403 - Access Denied</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Your active portal role does not have authorization to inspect this resource. Administrative clearance is required.
            </p>
          </div>
          <Button 
            variant="primary" 
            size="md" 
            onClick={() => navigate('/dashboard')}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            className="w-full bg-rose-600 hover:bg-rose-700"
          >
            Back to Dashboard
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

// ========================================================
// 1. VOLUNTEER VIEWS
// ========================================================
export const VolunteerTasks: React.FC = () => {
  const [tasks, setTasks] = useState([
    { id: '1', name: 'Swag Box unpacking & cataloging', deadline: 'Today, 04:00 PM', done: false },
    { id: '2', name: 'Mounting banners at seminar hall entrance', deadline: 'Today, 06:00 PM', done: true },
    { id: '3', name: 'Safety screening gates setup support', deadline: 'Tomorrow, 08:00 AM', done: false },
  ]);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Volunteer Tasks</h1>
        <p className="text-xs text-slate-400 mt-1">Review and mark completion on your operational checkpoints.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card hoverable={false} className="md:col-span-2">
          <CardHeader><h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Assigned Checkpoints</h3></CardHeader>
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
                    <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1"><Clock className="h-3 w-3" /> {t.deadline}</p>
                  </div>
                </div>
                <Badge variant={t.done ? 'secondary' : 'neutral'}>{t.done ? 'Finished' : 'Pending'}</Badge>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export const VolunteerEvents: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Assigned Events</h1>
        <p className="text-xs text-slate-400 mt-1">Operations schedules for events where you are registered as staff.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardBody className="space-y-4">
            <Badge variant="primary">Coding Club</Badge>
            <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white">HackTech 2026</h3>
            <p className="text-xs text-slate-500 leading-normal">Volunteering role: Welcoming desks registration scan verification.</p>
            <div className="flex justify-between text-[10px] font-bold text-slate-400 pt-2 border-t border-slate-50 dark:border-slate-800/40">
              <span>Date: Aug 15, 2026</span>
              <span>Duty: 09:00 AM - 12:00 PM</span>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export const VolunteerSchedule: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Volunteer Roster Schedule</h1>
        <p className="text-xs text-slate-400 mt-1">Shifts and hours allocated by Event Managers.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="p-0">
          <Table 
            columns={[
              { header: 'Allocated Duty', accessor: 'duty' },
              { header: 'Allocated Event', accessor: 'event' },
              { header: 'Shift Interval', accessor: 'shift' },
              { header: 'Lead Supervisor', accessor: 'lead' }
            ]}
            data={[
              { duty: 'Registrations Scanner', event: 'HackTech 2026', shift: '09:00 AM - 12:00 PM', lead: 'Alex Mercer (President)' },
              { duty: 'Swag Handout Desk', event: 'HackTech 2026', shift: '01:00 PM - 04:00 PM', lead: 'Amit Sharma (Lead)' }
            ]}
            keyExtractor={(row) => row.shift}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export const VolunteerScanner: React.FC = () => {
  const [ticketStatus, setTicketStatus] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  const simulateScan = () => {
    setScanning(true);
    setTicketStatus(null);
    setTimeout(() => {
      setScanning(false);
      setTicketStatus('verified');
      alert('Simulated Scan: Attendance logged for Student Amit Sharma (ID: ST-8932). Verification Success!');
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-slide-up max-w-md mx-auto">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white text-center">Simulated QR Code Scanner</h1>
        <p className="text-xs text-slate-400 mt-1 text-center">Scan event tickets or badge check-ins.</p>
      </div>
      <Card hoverable={false} className="border-teal-200 dark:border-teal-900/40">
        <CardBody className="flex flex-col items-center py-8 space-y-6">
          <div className="h-48 w-full bg-slate-100 dark:bg-slate-900 rounded-2xl flex flex-col justify-center items-center text-xs text-slate-400 border-2 border-dashed border-slate-350 dark:border-slate-800 relative overflow-hidden">
            {scanning && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-teal-500 animate-bounce" />
            )}
            <QrCode className="h-10 w-10 text-teal-500 mb-2" />
            <span className="font-semibold">{scanning ? 'Simulating lens capture...' : 'Finder Box Ready'}</span>
          </div>

          <Button 
            variant="primary" 
            size="md" 
            isLoading={scanning} 
            onClick={simulateScan}
            className="w-full bg-teal-650 hover:bg-teal-700"
          >
            Trigger Scan Simulation
          </Button>

          {ticketStatus === 'verified' && (
            <div className="flex gap-2 items-center text-xs font-bold text-emerald-500">
              <CheckCircle2 className="h-4.5 w-4.5" />
              <span>Badge verified successfully!</span>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

// ========================================================
// 2. COMMITTEE MEMBER VIEWS
// ========================================================
export const CommitteeMembers: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Club Rosters</h1>
        <p className="text-xs text-slate-400 mt-1">Directory of registered members in your department clubs.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="p-0">
          <Table 
            columns={[
              { header: 'Member Profile', accessor: 'name' },
              { header: 'Departement', accessor: 'dept' },
              { header: 'Roster Role', accessor: 'role' },
              { header: 'Term Joined', accessor: 'term' }
            ]}
            data={[
              { name: 'Amit Sharma', dept: 'CS Department', role: 'Student Member', term: 'Winter 2025' },
              { name: 'Alex Mercer', dept: 'CS Department', role: 'Club President', term: 'Fall 2024' },
              { name: 'Nisha Patel', dept: 'ME Department', role: 'Volunteer Staff', term: 'Fall 2025' }
            ]}
            keyExtractor={(row) => row.name}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export const CommitteeRegistrations: React.FC = () => {
  const [registrations, setRegistrations] = useState([
    { id: '1', name: 'Jane Doe', dept: 'CS', event: 'HackTech 2026', verified: false },
    { id: '2', name: 'Mark Smith', dept: 'EE', event: 'HackTech 2026', verified: true },
    { id: '3', name: 'Alice Johnson', dept: 'BBA', event: 'National Debate', verified: false }
  ]);

  const verifyReg = (id: string) => {
    setRegistrations(prev => prev.map(r => r.id === id ? { ...r, verified: true } : r));
    alert('Simulated Verification: Student registration credentials approved.');
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Active Registrations</h1>
        <p className="text-xs text-slate-400 mt-1">Verify event registration tickets before granting check-in entrance.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="p-0">
          <Table 
            columns={[
              { header: 'Student Name', accessor: 'name' },
              { header: 'Event Requested', accessor: 'event' },
              { header: 'Verification Status', accessor: (row) => <Badge variant={row.verified ? 'secondary' : 'accent'}>{row.verified ? 'Verified' : 'Pending Verification'}</Badge> },
              { 
                header: 'Control', 
                accessor: (row) => !row.verified && (
                  <Button variant="secondary" size="sm" onClick={() => verifyReg(row.id)}>
                    Verify ticket
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
  );
};

export const CommitteeAttendance: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white font-sans">Attendance Logs</h1>
        <p className="text-xs text-slate-400 mt-1">Inspect logged attendees counts for this week\'s events.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="p-0">
          <Table 
            columns={[
              { header: 'Event Title', accessor: 'event' },
              { header: 'Roster Checked-in', accessor: 'checked' },
              { header: 'Absentees Count', accessor: 'absent' },
              { header: 'Verification Status', accessor: (row) => <Badge variant="secondary">{row.status}</Badge> }
            ]}
            data={[
              { event: 'HackTech 2026 Keynote', checked: '142 students', absent: '18 students', status: 'Roster Finalized' },
              { event: 'Figma Design Workshop', checked: '64 students', absent: '4 students', status: 'Roster Finalized' }
            ]}
            keyExtractor={(row) => row.event}
          />
        </CardBody>
      </Card>
    </div>
  );
};

// ========================================================
// 3. EVENT MANAGER VIEWS
// ========================================================
export const EventManagerRegistrations: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Registrations Manager</h1>
        <p className="text-xs text-slate-400 mt-1">Review sign-up sheets and limit event capacity values.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="p-0">
          <Table 
            columns={[
              { header: 'Event Title', accessor: 'title' },
              { header: 'Max Allocations', accessor: 'cap' },
              { header: 'Signups Count', accessor: 'signed' },
              { header: 'Actions', accessor: () => <Button variant="outline" size="sm">Modify Cap</Button> }
            ]}
            data={[
              { title: 'HackTech 2026', cap: 300, signed: '250 signed up' },
              { title: 'RoboWars Championship', cap: 200, signed: '180 signed up' }
            ]}
            keyExtractor={(row) => row.title}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export const EventManagerAttendance: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Attendance Analytics</h1>
        <p className="text-xs text-slate-400 mt-1">Review check-in conversion ratios and download verified rosters logs.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card hoverable={false}>
          <CardHeader><h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Conversion Rate Tracker</h3></CardHeader>
          <CardBody className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span>HackTech 2026 Keynote</span>
                <span>94% Check-in</span>
              </div>
              <ProgressBar value={94} max={100} color="accent" />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span>Figma UI/UX Workshop</span>
                <span>86% Check-in</span>
              </div>
              <ProgressBar value={86} max={100} color="secondary" />
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export const EventManagerGallery: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Event Media Manager</h1>
        <p className="text-xs text-slate-400 mt-1">Upload and catalog photography highlights for student reviews.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="py-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center">
          <Calendar className="h-8 w-8 text-orange-500 mb-2" />
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">Drop your event photography folders here</h3>
          <p className="text-[10px] text-slate-400 mt-1">Supports raw, PNG, and JPEG. Max upload folder size: 100 MB.</p>
          <Button variant="primary" size="sm" className="mt-4 bg-orange-650 hover:bg-orange-700">Choose Files</Button>
        </CardBody>
      </Card>
    </div>
  );
};

export const EventManagerAnalytics: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Event Operations Reports</h1>
        <p className="text-xs text-slate-400 mt-1">Review operational efficiency, budget usage logs, and staff allocation stats.</p>
      </div>
      <Card hoverable={false}>
        <CardHeader><h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Budget Consumed Breakdown</h3></CardHeader>
        <CardBody className="space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-500">HackTech 2026 Swags & Supplies</span>
            <span className="font-bold text-slate-800 dark:text-slate-100">$2,400 of $3,000 (80%)</span>
          </div>
          <ProgressBar value={80} max={100} color="accent" />
        </CardBody>
      </Card>
    </div>
  );
};

// ========================================================
// 4. CLUB PRESIDENT VIEWS (Additional Specific Pages)
// ========================================================
export const PresidentMembers: React.FC = () => {
  const [members, setMembers] = useState([
    { id: '1', name: 'Jane Doe', role: 'Volunteer', status: 'Active' },
    { id: '2', name: 'Mark Smith', role: 'Committee Member', status: 'Active' },
    { id: '3', name: 'Alice Johnson', role: 'Student Member', status: 'Active' }
  ]);

  const removeMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    alert('Simulated Action: Member credentials removed from roster.');
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Manage Club Members</h1>
        <p className="text-xs text-slate-400 mt-1">Edit designations, view roles, or remove members from rosters.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="p-0">
          <Table 
            columns={[
              { header: 'Member Name', accessor: 'name' },
              { header: 'Designation Role', accessor: 'role' },
              { header: 'Current Status', accessor: (row) => <Badge variant="secondary">{row.status}</Badge> },
              { 
                header: 'Control', 
                accessor: (row) => (
                  <Button variant="outline" size="sm" className="text-rose-500 border-rose-200" onClick={() => removeMember(row.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                ) 
              }
            ]}
            data={members}
            keyExtractor={(row) => row.id}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export const PresidentRequests: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Membership Applications</h1>
        <p className="text-xs text-slate-400 mt-1">Review registration applications submitted by campus students.</p>
      </div>
      {/* Reuses dynamic content or logs table */}
      <Card hoverable={false}>
        <CardBody className="py-10 text-center text-xs text-slate-400">
          Please refer to the Memberships approvals checklist on your Dashboard page.
        </CardBody>
      </Card>
    </div>
  );
};

export const PresidentGallery: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Club Gallery</h1>
        <p className="text-xs text-slate-400 mt-1">Post updates and upload photos of team events.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="py-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center">
          <Award className="h-8 w-8 text-purple-500 mb-2" />
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">Upload new club photos</h3>
          <Button variant="primary" size="sm" className="mt-4 bg-purple-600 hover:bg-purple-700">Choose Photos</Button>
        </CardBody>
      </Card>
    </div>
  );
};

export const PresidentReports: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Club Activity Reports</h1>
        <p className="text-xs text-slate-400 mt-1 font-medium">Export performance statistics for Dean operations.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="space-y-4">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">Annual Activity summary (2025-26)</h4>
          <p className="text-xs text-slate-500 leading-normal">Includes budgets breakdown, total attendance figures, and verification lists.</p>
          <div className="flex gap-2">
            <Button variant="primary" size="sm" onClick={() => alert('PDF export generated.')} className="bg-purple-600 hover:bg-purple-700">Download PDF Report</Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export const PresidentAnalytics: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Club Analytics</h1>
        <p className="text-xs text-slate-400 mt-1">Examine active participation and student conversions lists.</p>
      </div>
      <Card hoverable={false}>
        <CardHeader><h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Interaction Trends</h3></CardHeader>
        <CardBody className="h-44 w-full flex items-end">
          <svg className="w-full h-full" viewBox="0 0 500 150" fill="none">
            <path d="M0 130 C 50 110, 100 80, 150 90 C 200 100, 250 40, 300 50 C 350 60, 400 20, 450 10 L 450 150 L 0 150 Z" fill="url(#purple-grad)" fillOpacity="0.15" />
            <path d="M0 130 C 50 110, 100 80, 150 90 C 200 100, 250 40, 300 50 C 350 60, 400 20, 450 10" stroke="#8B5CF6" strokeWidth="3" />
            <defs>
              <linearGradient id="purple-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
        </CardBody>
      </Card>
    </div>
  );
};

// ========================================================
// 5. FACULTY COORDINATOR VIEWS
// ========================================================
export const FacultyClubs: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Assigned Clubs</h1>
        <p className="text-xs text-slate-400 mt-1">Review activity parameters of clubs under your academic supervision.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card hoverable={true}>
          <CardBody className="space-y-4">
            <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white">Coding Club</h3>
            <p className="text-xs text-slate-500 leading-normal">Coordinator duty active. Review logs, approve proposals, and monitor student counts.</p>
            <div className="flex justify-between text-[10px] font-bold text-slate-400 pt-2 border-t border-slate-50 dark:border-slate-800/40">
              <span>142 Members</span>
              <span className="text-emerald-500 font-semibold">Active Roster</span>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export const FacultyApprovals: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Pending Event Proposals</h1>
        <p className="text-xs text-slate-400 mt-1">Sign off budget requests or schedule approvals submitted by Club Presidents.</p>
      </div>
      {/* Reuses dashboard code blocks or displays message */}
      <Card hoverable={false}>
        <CardBody className="py-10 text-center text-xs text-slate-400">
          Please review the Approvals list on your Dashboard page.
        </CardBody>
      </Card>
    </div>
  );
};

export const FacultyAttendance: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Attendance Logs Review</h1>
        <p className="text-xs text-slate-400 mt-1">Approve verified rosters or audit event check-in compliance logs.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="p-0">
          <Table 
            columns={[
              { header: 'Event Title', accessor: 'title' },
              { header: 'Verified Attendees', accessor: 'attendees' },
              { header: 'Audit Status', accessor: (row) => <Badge variant="secondary">{row.status}</Badge> }
            ]}
            data={[
              { title: 'HackTech 2026', attendees: '142 students', status: 'Audit Passed' },
              { title: 'Figma Design Workshop', attendees: '64 students', status: 'Audit Passed' }
            ]}
            keyExtractor={(row) => row.title}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export const FacultyReports: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white font-sans">Coordinated Activity Summaries</h1>
        <p className="text-xs text-slate-400 mt-1">Generate reports for Dean reviews.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="space-y-4">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">Faculty Overseer Roster Summary</h4>
          <p className="text-xs text-slate-500 leading-normal">Download verified list of student metrics.</p>
          <Button variant="primary" size="sm" onClick={() => alert('Summary exported.')} className="bg-emerald-600 hover:bg-emerald-700">Export Summary</Button>
        </CardBody>
      </Card>
    </div>
  );
};

export const FacultyAnalytics: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Faculty Analytics</h1>
        <p className="text-xs text-slate-400 mt-1">Review club performance indexes.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span>Coding Club Performance</span>
              <span>92% Efficiency</span>
            </div>
            <ProgressBar value={92} max={100} color="secondary" />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

// ========================================================
// 6. COLLEGE ADMIN VIEWS
// ========================================================
export const AdminUsers: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">User Registry</h1>
        <p className="text-xs text-slate-400 mt-1">Register, assign, or delete student profiles and faculty coordinates.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="p-0">
          <Table 
            columns={[
              { header: 'Profile Name', accessor: 'name' },
              { header: 'Portal Role', accessor: 'role' },
              { header: 'Clearance Status', accessor: (row) => <Badge variant="secondary">{row.status}</Badge> }
            ]}
            data={[
              { name: 'Amit Sharma', role: 'Student', status: 'Active' },
              { name: 'Dr. Sarah Jenkins', role: 'Faculty Coordinator', status: 'Active' },
              { name: 'Dean of Student Affairs', role: 'College Admin', status: 'Active' }
            ]}
            keyExtractor={(row) => row.name}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export const AdminClubs: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Clubs Registry</h1>
        <p className="text-xs text-slate-400 mt-1">Create student clubs or assign faculty advisors.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="p-0">
          <Table 
            columns={[
              { header: 'Club Name', accessor: 'name' },
              { header: 'Category', accessor: 'cat' },
              { header: 'Advisor', accessor: 'advisor' },
              { header: 'Status', accessor: (row) => <Badge variant="secondary">{row.status}</Badge> }
            ]}
            data={[
              { name: 'Coding Club', cat: 'Technical', advisor: 'Dr. Sarah Jenkins', status: 'Active' },
              { name: 'Robotics Association', cat: 'Engineering', advisor: 'Prof. Marcus Vance', status: 'Active' }
            ]}
            keyExtractor={(row) => row.name}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export const AdminDepartments: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Department Registries</h1>
        <p className="text-xs text-slate-400 mt-1">Review department analytics and student coordinates.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span>Computer Science & Engineering</span>
              <span>450 Active Students</span>
            </div>
            <ProgressBar value={450} max={600} color="primary" />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export const AdminFaculty: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Faculty Directory</h1>
        <p className="text-xs text-slate-400 mt-1">Roster of assigned faculty coordinators.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="p-0">
          <Table 
            columns={[
              { header: 'Faculty Name', accessor: 'name' },
              { header: 'Academic Dept', accessor: 'dept' },
              { header: 'Coordinated Club', accessor: 'club' }
            ]}
            data={[
              { name: 'Dr. Sarah Jenkins', dept: 'CSE Dept', club: 'Coding Club' },
              { name: 'Prof. Marcus Vance', dept: 'Mechanical Dept', club: 'Robotics Association' }
            ]}
            keyExtractor={(row) => row.name}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export const AdminReports: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">College-Wide Reports</h1>
        <p className="text-xs text-slate-400 mt-1">Review aggregated parameters for all student clubs.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="space-y-4">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 font-display">Campus Club Report (August 2026)</h4>
          <p className="text-xs text-slate-500 leading-normal">Includes registration counts and active credentials ledgers.</p>
          <Button variant="primary" size="sm" onClick={() => alert('Admin report exported.')} className="bg-blue-600 hover:bg-blue-750">Download Report</Button>
        </CardBody>
      </Card>
    </div>
  );
};

export const AdminAnalytics: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">College Analytics</h1>
        <p className="text-xs text-slate-400 mt-1 font-medium">Review metrics across all department parameters.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="h-44 flex items-end">
          <svg className="w-full h-full" viewBox="0 0 500 150" fill="none">
            <path d="M0 130 C 50 110, 100 80, 150 90 C 200 100, 250 40, 300 50 C 350 60, 400 20, 450 10 L 450 150 L 0 150 Z" fill="url(#blue-grad)" fillOpacity="0.15" />
            <path d="M0 130 C 50 110, 100 80, 150 90 C 200 100, 250 40, 300 50 C 350 60, 400 20, 450 10" stroke="#2563EB" strokeWidth="3" />
            <defs>
              <linearGradient id="blue-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
        </CardBody>
      </Card>
    </div>
  );
};

// ========================================================
// 7. SUPER ADMIN VIEWS
// ========================================================
export const SuperAdminOrganizations: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Campus Chapters</h1>
        <p className="text-xs text-slate-400 mt-1">Review global settings for registered campus branches.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="p-0">
          <Table 
            columns={[
              { header: 'Branch Name', accessor: 'name' },
              { header: 'Database Instance', accessor: 'db' },
              { header: 'Status', accessor: (row) => <Badge variant="secondary">{row.status}</Badge> }
            ]}
            data={[
              { name: 'Tech Central Campus', db: 'postgres-prod-01', status: 'Connected' },
              { name: 'West Valley Campus', db: 'postgres-prod-02', status: 'Connected' }
            ]}
            keyExtractor={(row) => row.name}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export const SuperAdminUsers: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Super User Manager</h1>
        <p className="text-xs text-slate-400 mt-1">Platform-wide registry of active accounts.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="p-0">
          <Table 
            columns={[
              { header: 'Profile Name', accessor: 'name' },
              { header: 'Upstream Role', accessor: 'role' },
              { header: 'Clearance level', accessor: (row) => <Badge variant="danger">{row.level}</Badge> }
            ]}
            data={[
              { name: 'System Root Admin', role: 'Super Admin', level: 'Level 10' },
              { name: 'Dean of Student Affairs', role: 'College Admin', level: 'Level 8' },
              { name: 'Dr. Sarah Jenkins', role: 'Faculty Coordinator', level: 'Level 6' }
            ]}
            keyExtractor={(row) => row.name}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export const SuperAdminRoles: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Roles Configuration</h1>
        <p className="text-xs text-slate-400 mt-1 font-sans">Modify security groups and hierarchy boundaries.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="p-0">
          <Table 
            columns={[
              { header: 'Role Label', accessor: 'label' },
              { header: 'Inherits From', accessor: 'inherits' },
              { header: 'Clearance Status', accessor: (row) => <Badge variant="secondary">{row.status}</Badge> }
            ]}
            data={[
              { label: 'Super Admin', inherits: 'College Admin', status: 'Enabled' },
              { label: 'College Admin', inherits: 'Faculty Coordinator', status: 'Enabled' },
              { label: 'Faculty Coordinator', inherits: 'Club President', status: 'Enabled' },
              { label: 'Club President', inherits: 'Student', status: 'Enabled' },
              { label: 'Student', inherits: 'Guest', status: 'Enabled' }
            ]}
            keyExtractor={(row) => row.label}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export const SuperAdminPermissions: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Permission Matrix</h1>
        <p className="text-xs text-slate-400 mt-1">Configure feature access boundaries for each role.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="p-0">
          <Table 
            columns={[
              { header: 'Route Scope', accessor: 'scope' },
              { header: 'Student Access', accessor: (row) => <Badge variant={row.student ? 'secondary' : 'neutral'}>{row.student ? 'Allowed' : 'Blocked'}</Badge> },
              { header: 'Super Admin Access', accessor: () => <Badge variant="danger">Allowed</Badge> }
            ]}
            data={[
              { scope: '/dashboard', student: true },
              { scope: '/superadmin/*', student: false }
            ]}
            keyExtractor={(row) => row.scope}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export const SuperAdminAuditLogs: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Platform Audit Trail</h1>
        <p className="text-xs text-slate-400 mt-1">Tamper-proof history of administrative actions.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="p-0">
          <Table 
            columns={[
              { header: 'Action Details', accessor: 'action' },
              { header: 'Initiated By', accessor: 'user' },
              { header: 'IP Coordinates', accessor: 'ip' },
              { header: 'Result', accessor: (row) => <Badge variant="secondary">{row.result}</Badge> }
            ]}
            data={[
              { action: 'Role permissions modified: committee', user: 'Root Admin', ip: '192.168.1.104', result: 'Success' },
              { action: 'Database backup checkpoint initialized', user: 'Cron Daemon', ip: 'localhost', result: 'Success' },
              { action: 'Emergency system configurations update', user: 'Root Admin', ip: '192.168.1.104', result: 'Success' }
            ]}
            keyExtractor={(row) => row.action}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export const SuperAdminSystemHealth: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Infrastructure Health</h1>
        <p className="text-xs text-slate-400 mt-1 font-medium">Uptime monitoring of database and api endpoints.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hoverable={false}>
          <CardBody className="space-y-2 text-center">
            <div className="text-2xl font-bold text-emerald-500 font-display">99.98%</div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">API Gateway Uptime</div>
          </CardBody>
        </Card>
        <Card hoverable={false}>
          <CardBody className="space-y-2 text-center">
            <div className="text-2xl font-bold text-emerald-500 font-display">Healthy</div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Database Cluster</div>
          </CardBody>
        </Card>
        <Card hoverable={false}>
          <CardBody className="space-y-2 text-center">
            <div className="text-2xl font-bold text-indigo-500 font-display">42ms</div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Avg Response Latency</div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export const SuperAdminAnalytics: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Super Analytics</h1>
        <p className="text-xs text-slate-400 mt-1">Review global platform statistics.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="h-44 flex items-end">
          <svg className="w-full h-full" viewBox="0 0 500 150" fill="none">
            <path d="M0 130 C 50 110, 100 80, 150 90 C 200 100, 250 40, 300 50 C 350 60, 400 20, 450 10 L 450 150 L 0 150 Z" fill="url(#crimson-grad)" fillOpacity="0.15" />
            <path d="M0 130 C 50 110, 100 80, 150 90 C 200 100, 250 40, 300 50 C 350 60, 400 20, 450 10" stroke="#DC2626" strokeWidth="3" />
            <defs>
              <linearGradient id="crimson-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#DC2626" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
        </CardBody>
      </Card>
    </div>
  );
};

// ========================================================
// 8. ADDITIONAL TARGETED PAGES FOR CORE 5 ROLES
// ========================================================
export const PresidentOverview: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Club Overview</h1>
        <p className="text-xs text-slate-400 mt-1">Detailed operational state of your assigned student body.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card hoverable={false}>
          <CardHeader><h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Coding Club Summary</h3></CardHeader>
          <CardBody className="space-y-3.5 text-xs">
            <div className="flex justify-between">
              <span className="font-semibold text-slate-400">Academic advisor:</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">Dr. Sarah Jenkins</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-400">Total Registered Members:</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">142 Students</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-400">Active Events Count:</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">1 Proposed, 1 Approved</span>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export const PresidentAttendance: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Club Attendance Log</h1>
        <p className="text-xs text-slate-400 mt-1">Review check-in conversion sheets for events organized by your club.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="p-0">
          <Table 
            columns={[
              { header: 'Student Profile', accessor: 'name' },
              { header: 'Registered Event', accessor: 'event' },
              { header: 'Check-in Status', accessor: (row) => <Badge variant="secondary">{row.status}</Badge> }
            ]}
            data={[
              { name: 'Amit Sharma', event: 'HackTech 2026 Keynote', status: 'Checked In' },
              { name: 'Jane Doe', event: 'HackTech 2026 Keynote', status: 'Checked In' },
              { name: 'Mark Smith', event: 'Figma Design Workshop', status: 'Checked In' }
            ]}
            keyExtractor={(row) => row.name}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export const FacultyMembershipApprovals: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Membership Approvals</h1>
        <p className="text-xs text-slate-400 mt-1">Review membership applications submitted for clubs under your supervision.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="py-12 text-center text-xs text-slate-400">
          All applications currently aligned. Refer to the dashboard panel for instant approvals.
        </CardBody>
      </Card>
    </div>
  );
};

