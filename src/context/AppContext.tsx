import React, { createContext, useContext, useState, useEffect } from 'react';

// Definitions
export type Role = 'student' | 'volunteer' | 'committee' | 'event_manager' | 'president' | 'faculty' | 'admin' | 'superadmin';

export interface RoleConfig {
  accentColor: string;
  accentClass: string;
  bgClass: string;
  darkBgClass: string;
  borderClass: string;
  glowClass: string;
  btnClass: string;
}

export const roleConfigs: Record<Role, RoleConfig> = {
  student: {
    accentColor: '#4F46E5',
    accentClass: 'text-indigo-600 dark:text-indigo-400',
    bgClass: 'bg-indigo-50 dark:bg-indigo-950/20',
    darkBgClass: 'dark:bg-indigo-950/20',
    borderClass: 'border-indigo-150 dark:border-indigo-900/40',
    glowClass: 'shadow-indigo-600/10',
    btnClass: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500',
  },
  volunteer: {
    accentColor: '#0D9488',
    accentClass: 'text-teal-650 dark:text-teal-400',
    bgClass: 'bg-teal-50 dark:bg-teal-950/20',
    darkBgClass: 'dark:bg-teal-950/20',
    borderClass: 'border-teal-150 dark:border-teal-900/40',
    glowClass: 'shadow-teal-600/10',
    btnClass: 'bg-teal-600 hover:bg-teal-700 text-white focus:ring-teal-500',
  },
  committee: {
    accentColor: '#0891B2',
    accentClass: 'text-cyan-650 dark:text-cyan-400',
    bgClass: 'bg-cyan-50 dark:bg-cyan-950/20',
    darkBgClass: 'dark:bg-cyan-950/20',
    borderClass: 'border-cyan-150 dark:border-cyan-900/40',
    glowClass: 'shadow-cyan-600/10',
    btnClass: 'bg-cyan-600 hover:bg-cyan-700 text-white focus:ring-cyan-500',
  },
  event_manager: {
    accentColor: '#EA580C',
    accentClass: 'text-orange-650 dark:text-orange-400',
    bgClass: 'bg-orange-50 dark:bg-orange-950/20',
    darkBgClass: 'dark:bg-orange-950/20',
    borderClass: 'border-orange-150 dark:border-orange-900/40',
    glowClass: 'shadow-orange-600/10',
    btnClass: 'bg-orange-600 hover:bg-orange-700 text-white focus:ring-orange-500',
  },
  president: {
    accentColor: '#8B5CF6',
    accentClass: 'text-purple-650 dark:text-purple-400',
    bgClass: 'bg-purple-50 dark:bg-purple-950/20',
    darkBgClass: 'dark:bg-purple-950/20',
    borderClass: 'border-purple-150 dark:border-purple-900/40',
    glowClass: 'shadow-purple-600/10',
    btnClass: 'bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500',
  },
  faculty: {
    accentColor: '#10B981',
    accentClass: 'text-emerald-650 dark:text-emerald-450',
    bgClass: 'bg-emerald-50 dark:bg-emerald-950/20',
    darkBgClass: 'dark:bg-emerald-950/20',
    borderClass: 'border-emerald-150 dark:border-emerald-900/40',
    glowClass: 'shadow-emerald-600/10',
    btnClass: 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500',
  },
  admin: {
    accentColor: '#2563EB',
    accentClass: 'text-blue-650 dark:text-blue-400',
    bgClass: 'bg-blue-50 dark:bg-blue-950/20',
    darkBgClass: 'dark:bg-blue-950/20',
    borderClass: 'border-blue-150 dark:border-blue-900/40',
    glowClass: 'shadow-blue-600/10',
    btnClass: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
  },
  superadmin: {
    accentColor: '#DC2626',
    accentClass: 'text-rose-650 dark:text-rose-450',
    bgClass: 'bg-rose-50 dark:bg-rose-950/20',
    darkBgClass: 'dark:bg-rose-950/20',
    borderClass: 'border-rose-150 dark:border-rose-900/40',
    glowClass: 'shadow-rose-600/10',
    btnClass: 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500',
  },
};


export interface Club {
  id: string;
  name: string;
  category: string;
  description: string;
  logo: string;
  facultyCoordinator: string;
  president: string;
  membersCount: number;
  upcomingEventsCount: number;
  isJoined?: boolean;
}

export interface ClubEvent {
  id: string;
  title: string;
  poster: string;
  date: string;
  time: string;
  venue: string;
  organizer: string;
  clubId: string;
  registrationCount: number;
  status: 'Approved' | 'Pending Approval' | 'Draft';
  isRegistered?: boolean;
  speakers?: string[];
  participants?: string[];
  schedule?: { time: string; activity: string }[];
  feedback?: { name: string; rating: number; text: string }[];
  gallery?: string[];
}

export interface MembershipRequest {
  id: string;
  studentName: string;
  department: string;
  year: string;
  appliedDate: string;
  clubName: string;
  clubId: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface Opportunity {
  id: string;
  title: string;
  type: 'Hackathon' | 'Competition' | 'Internship' | 'Workshop' | 'Recruitment';
  organizer: string;
  deadline: string;
  eligibility: string;
  isApplied?: boolean;
  isBookmarked?: boolean;
  description: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  department: string;
  priority: 'High' | 'Medium' | 'Low';
  isPinned?: boolean;
  attachments?: { name: string; size: string }[];
}

export interface Certificate {
  id: string;
  certificateId: string;
  event: string;
  date: string;
  downloadUrl: string;
}

export interface ActivityPost {
  id: string;
  author: string;
  role: string;
  avatar: string;
  content: string;
  image?: string;
  likes: number;
  hasLiked?: boolean;
  comments: { id: string; author: string; content: string; date: string }[];
  date: string;
}

export interface NotificationItem {
  id: string;
  type: 'event' | 'club' | 'membership' | 'opportunity' | 'announcement';
  title: string;
  message: string;
  date: string;
  read: boolean;
}

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  activeConfig: RoleConfig;
  clubs: Club[];
  joinClub: (clubId: string) => void;
  createClub: (club: Omit<Club, 'id' | 'membersCount' | 'upcomingEventsCount'>) => void;
  events: ClubEvent[];
  registerForEvent: (eventId: string) => void;
  createEvent: (event: Omit<ClubEvent, 'id' | 'registrationCount' | 'status'>) => void;
  approveEvent: (eventId: string) => void;
  membershipRequests: MembershipRequest[];
  handleMembership: (requestId: string, action: 'approve' | 'reject') => void;
  submitMembershipRequest: (clubId: string, details: { studentName: string; department: string; year: string }) => void;
  opportunities: Opportunity[];
  toggleBookmarkOpportunity: (oppId: string) => void;
  applyOpportunity: (oppId: string) => void;
  announcements: Announcement[];
  createAnnouncement: (announcement: Omit<Announcement, 'id' | 'date'>) => void;
  certificates: Certificate[];
  activityFeed: ActivityPost[];
  likePost: (postId: string) => void;
  addComment: (postId: string, commentText: string) => void;
  notifications: NotificationItem[];
  markAllNotificationsRead: () => void;
  markNotificationRead: (id: string) => void;
  unreadNotificationsCount: number;
  globalSearch: (query: string) => { clubs: Club[]; events: ClubEvent[]; announcements: Announcement[]; certificates: Certificate[] };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme Management
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Current User Role
  const [currentRole, setCurrentRole] = useState<Role>('student');

  // Mock Clubs State
  const [clubs, setClubs] = useState<Club[]>([
    {
      id: 'club-1',
      name: 'Coding Club',
      category: 'Technical',
      description: 'Dive deep into software engineering, algorithms, web development, and hackathons. Weekly coding contests and workshops.',
      logo: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=150&h=150&fit=crop&q=80',
      facultyCoordinator: 'Dr. Sarah Jenkins (CSE)',
      president: 'Alex Mercer (Year IV)',
      membersCount: 142,
      upcomingEventsCount: 2,
      isJoined: true,
    },
    {
      id: 'club-2',
      name: 'Robotics Association',
      category: 'Engineering',
      description: 'Designing, building, and programming autonomous robots. Preparing teams for national level RoboWars & drone races.',
      logo: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=150&h=150&fit=crop&q=80',
      facultyCoordinator: 'Prof. Marcus Vance (Mech)',
      president: 'Liam Carter (Year IV)',
      membersCount: 89,
      upcomingEventsCount: 1,
      isJoined: false,
    },
    {
      id: 'club-3',
      name: 'Debate & Literary Society',
      category: 'Arts & Humanities',
      description: 'Fostering public speaking, analytical reasoning, and global perspective debates. Hosts the annual Model United Nations (MUN).',
      logo: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=150&h=150&fit=crop&q=80',
      facultyCoordinator: 'Dr. Emily Vance (Humanities)',
      president: 'Clara Hughes (Year III)',
      membersCount: 64,
      upcomingEventsCount: 1,
      isJoined: true,
    },
    {
      id: 'club-4',
      name: 'Business & Entrepreneurship Club',
      category: 'Business',
      description: 'Incubating startup ideas, learning equity management, financial modelling, and case studies. Networking with venture capitalists.',
      logo: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=150&h=150&fit=crop&q=80',
      facultyCoordinator: 'Prof. Alan Vance (MBA)',
      president: 'Ryan Davis (Year IV)',
      membersCount: 110,
      upcomingEventsCount: 1,
      isJoined: false,
    },
    {
      id: 'club-5',
      name: 'Creative Photography Guild',
      category: 'Creative Arts',
      description: 'Exploring visual aesthetics, street photography, lighting design, and digital post-processing. Organizes monthly photo-walks.',
      logo: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=150&h=150&fit=crop&q=80',
      facultyCoordinator: 'Prof. Sandra Hall (Fine Arts)',
      president: 'Elena Rostova (Year III)',
      membersCount: 45,
      upcomingEventsCount: 0,
      isJoined: false,
    },
  ]);

  // Mock Events State
  const [events, setEvents] = useState<ClubEvent[]>([
    {
      id: 'event-1',
      title: 'HackTech 2026: 36-Hour Hackathon',
      poster: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=450&fit=crop&q=80',
      date: '2026-08-15',
      time: '09:00 AM - 09:00 PM',
      venue: 'Main Seminar Hall & Tech Center',
      organizer: 'Coding Club',
      clubId: 'club-1',
      registrationCount: 250,
      status: 'Approved',
      isRegistered: true,
      speakers: ['Aris Thorne (Principal Dev, Vercel)', 'Dr. Sarah Jenkins (HOD, CSE)'],
      participants: ['Amit Sharma', 'Nisha Patel', 'Rohan Das', 'Karan Johar'],
      schedule: [
        { time: '09:00 AM', activity: 'Registration & Welcome Keynote' },
        { time: '11:00 AM', activity: 'Hacking Commences & Mentoring Session' },
        { time: '06:00 PM', activity: 'Mid-way Progress Checks' },
      ],
      feedback: [
        { name: 'Kunal Sen', rating: 5, text: 'Incredible setup and amazing mentors!' },
        { name: 'Priya Verma', rating: 4.5, text: 'Great food, but WiFi was a bit sluggish at start.' },
      ],
      gallery: [
        'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop&q=80',
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop&q=80',
      ],
    },
    {
      id: 'event-2',
      title: 'RoboWars Championship 2026',
      poster: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=450&fit=crop&q=80',
      date: '2026-08-22',
      time: '10:00 AM - 05:00 PM',
      venue: 'College Arena (Outdoor)',
      organizer: 'Robotics Association',
      clubId: 'club-2',
      registrationCount: 180,
      status: 'Approved',
      isRegistered: false,
      speakers: ['Prof. Marcus Vance (Mech Head)', 'Dr. Robert C. (Director, Robotix Labs)'],
      schedule: [
        { time: '10:00 AM', activity: 'Safety Inspections' },
        { time: '11:30 AM', activity: 'Group Round Battles' },
        { time: '03:00 PM', activity: 'Grand Finale Combat' },
      ],
      feedback: [],
      gallery: [],
    },
    {
      id: 'event-3',
      title: 'National Debate Invitational',
      poster: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=450&fit=crop&q=80',
      date: '2026-09-05',
      time: '09:00 AM - 04:00 PM',
      venue: 'Auditorium Block C',
      organizer: 'Debate & Literary Society',
      clubId: 'club-3',
      registrationCount: 95,
      status: 'Approved',
      isRegistered: true,
      speakers: ['Hon. Justice Anita Sen', 'Clara Hughes (Debate President)'],
      schedule: [
        { time: '09:00 AM', activity: 'Motion Announcements' },
        { time: '10:00 AM', activity: 'Round-Robin Debate Panels' },
      ],
      feedback: [],
      gallery: [],
    },
    {
      id: 'event-4',
      title: 'Startup Pitch & Funding Night',
      poster: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=450&fit=crop&q=80',
      date: '2026-09-12',
      time: '04:00 PM - 08:30 PM',
      venue: 'Campus Incubation Center',
      organizer: 'Business & Entrepreneurship Club',
      clubId: 'club-4',
      registrationCount: 42,
      status: 'Pending Approval',
      isRegistered: false,
      speakers: ['Vinod Khosla Jr. (VC Analyst)', 'Ryan Davis (President, Business Club)'],
    },
  ]);

  // Mock Membership Requests
  const [membershipRequests, setMembershipRequests] = useState<MembershipRequest[]>([
    {
      id: 'req-1',
      studentName: 'Amit Sharma',
      department: 'Computer Science & Eng',
      year: 'Year II',
      appliedDate: '2026-07-28',
      clubName: 'Coding Club',
      clubId: 'club-1',
      status: 'Pending',
    },
    {
      id: 'req-2',
      studentName: 'Nisha Patel',
      department: 'Mechanical Engineering',
      year: 'Year III',
      appliedDate: '2026-07-29',
      clubName: 'Robotics Association',
      clubId: 'club-2',
      status: 'Pending',
    },
    {
      id: 'req-3',
      studentName: 'Rohan Das',
      department: 'Business Administration',
      year: 'Year I',
      appliedDate: '2026-07-30',
      clubName: 'Business & Entrepreneurship Club',
      clubId: 'club-4',
      status: 'Pending',
    },
  ]);

  // Mock Opportunities
  const [opportunities, setOpportunities] = useState<Opportunity[]>([
    {
      id: 'opp-1',
      title: 'Google HashCode 2026',
      type: 'Competition',
      organizer: 'Google Students Chapter',
      deadline: '2026-08-20',
      eligibility: 'All Engineering & Tech Students',
      isApplied: false,
      isBookmarked: true,
      description: 'Google’s team-based programming competition, HashCode, allows you to share your skills and connect with other coders as you work together to solve a problem modeled after a real Google engineering challenge.',
    },
    {
      id: 'opp-2',
      title: 'SpaceX Systems Engineer Intern',
      type: 'Internship',
      organizer: 'SpaceX Recruitment Team',
      deadline: '2026-09-01',
      eligibility: 'Pref. Final Year Students (EE, ME, Aero, CS)',
      isApplied: true,
      isBookmarked: false,
      description: 'SpaceX is looking for engineering interns to help build humanity\'s multiplanetary future. You will work side-by-side with full-time engineers on critical hardware and software subsystems.',
    },
    {
      id: 'opp-3',
      title: 'Interactive UI/UX Design Workshop',
      type: 'Workshop',
      organizer: 'Figma Student Representatives',
      deadline: '2026-08-18',
      eligibility: 'Open to All Students (No design experience required)',
      isApplied: false,
      isBookmarked: false,
      description: 'Learn the principles of wireframing, color systems, component-driven layouts, and transitions directly in Figma. Guided live build of a dashboard interface.',
    },
    {
      id: 'opp-4',
      title: 'ACM Chapter Core Member Recruitment',
      type: 'Recruitment',
      organizer: 'College ACM Chapter',
      deadline: '2026-08-25',
      eligibility: 'First & Second Year Students only',
      isApplied: false,
      isBookmarked: true,
      description: 'Join the premier computing association on campus. We are recruiting developers, designers, content writers, and event organizers for our upcoming annual techfest.',
    },
  ]);

  // Mock Announcements
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: 'ann-1',
      title: 'Mandatory Club Registration Deadline Extended',
      content: 'All student clubs must submit their executive rosters and budget estimates for the academic year 2026-27. The deadline has been extended to August 10th by the Dean of Student Affairs. Late entries will risk funding cuts.',
      date: '2026-07-31',
      department: 'Dean of Student Affairs Office',
      priority: 'High',
      isPinned: true,
      attachments: [{ name: 'Executive_Roster_Template.xlsx', size: '24 KB' }],
    },
    {
      id: 'ann-2',
      title: 'Upcoming Tech Fest Budget Approvals',
      content: 'The review of budget allocations for individual clubs for the annual TechNova Hackathon has been completed. Department heads and faculty coordinators are requested to download the approval letter and submit signatures.',
      date: '2026-07-30',
      department: 'Finance and Operations Department',
      priority: 'Medium',
      isPinned: false,
      attachments: [{ name: 'TechFest_Allocations_Final.pdf', size: '1.2 MB' }],
    },
    {
      id: 'ann-3',
      title: 'Independence Day Event Preparations',
      content: 'All cultural clubs and the photography guild are requested to meet at the central courtyard on August 5th at 03:00 PM. We will formulate the logistics, parade routes, and photography booths for the upcoming Independence Day ceremony.',
      date: '2026-07-29',
      department: 'Cultural Affairs Committee',
      priority: 'Low',
      isPinned: false,
    },
  ]);

  // Mock Certificates
  const [certificates] = useState<Certificate[]>([
    {
      id: 'cert-1',
      certificateId: 'CERT-HT-8932',
      event: 'HackTech 2025: 1st Runners-up',
      date: '2025-11-12',
      downloadUrl: '#',
    },
    {
      id: 'cert-2',
      certificateId: 'CERT-RW-3021',
      event: 'RoboWars Championship 2025 (Special Mention)',
      date: '2025-12-05',
      downloadUrl: '#',
    },
    {
      id: 'cert-3',
      certificateId: 'CERT-AM-1049',
      event: 'AI/ML Bootcamp Completion',
      date: '2026-01-20',
      downloadUrl: '#',
    },
  ]);

  // Mock LinkedIn Activity Feed State
  const [activityFeed, setActivityFeed] = useState<ActivityPost[]>([
    {
      id: 'post-1',
      author: 'Coding Club',
      role: 'Technical Club',
      avatar: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=150&h=150&fit=crop&q=80',
      content: '🔥 Super thrilled to announce that our 36-hour hackathon "HackTech 2026" is officially open for registrations! We have Vercel engineers mentoring, awesome cash prizes, and custom swag. Tap "Join Now" and claim your slot!',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=450&fit=crop&q=80',
      likes: 42,
      hasLiked: false,
      comments: [
        { id: 'c-1', author: 'Amit Sharma', content: 'Already registered! Team "CodeRed" is ready.', date: '3 hours ago' },
        { id: 'c-2', author: 'Liam Carter', content: 'Looks epic, will there be robot challenges too?', date: '2 hours ago' },
      ],
      date: '4 hours ago',
    },
    {
      id: 'post-2',
      author: 'Elena Rostova',
      role: 'Photography Guild President',
      avatar: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=150&h=150&fit=crop&q=80',
      content: '📸 Some snippets from our photowalk at the Botanical Gardens yesterday! Incredible lenses, great weather, and some amazing reflections captured by our freshers. Check out the full gallery on our detail page!',
      image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&h=450&fit=crop&q=80',
      likes: 29,
      hasLiked: true,
      comments: [
        { id: 'c-3', author: 'Dr. Sarah Jenkins', content: 'Fabulous compositions, Elena! Keep mentoring them.', date: '1 day ago' },
      ],
      date: '1 day ago',
    },
    {
      id: 'post-3',
      author: 'Robotics Association',
      role: 'Engineering Club',
      avatar: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=150&h=150&fit=crop&q=80',
      content: '🤖 Quick update! The battle arena for RoboWars 2026 is officially set. Safety screens are up, and the sparks are ready to fly. Here is a sneak peek at our autonomous heavy-weight champion robot "Annihilator"!',
      likes: 56,
      hasLiked: false,
      comments: [],
      date: '2 days ago',
    },
  ]);

  // Mock Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      type: 'event',
      title: 'Registration Approved',
      message: 'Your registration for "HackTech 2026" has been approved. See you at Main Seminar Hall!',
      date: '1 hour ago',
      read: false,
    },
    {
      id: 'notif-2',
      type: 'membership',
      title: 'New Request Received',
      message: 'Student Jane Doe applied for Coding Club. Action required.',
      date: '2 hours ago',
      read: false,
    },
    {
      id: 'notif-3',
      type: 'announcement',
      title: 'Urgent Announcement Pinned',
      message: 'Dean of Student Affairs pinned: "Mandatory Club Registration Deadline Extended"',
      date: '4 hours ago',
      read: false,
    },
    {
      id: 'notif-4',
      type: 'opportunity',
      title: 'New Internship Opportunity',
      message: 'SpaceX listed a Systems Engineer Internship. Eligibility criteria details updated.',
      date: '1 day ago',
      read: true,
    },
    {
      id: 'notif-5',
      type: 'club',
      title: 'Welcome to Debate Society',
      message: 'Clara Hughes approved your membership to the Debate & Literary Society.',
      date: '2 days ago',
      read: true,
    },
  ]);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // Actions
  const joinClub = (clubId: string) => {
    setClubs(prev =>
      prev.map(club => {
        if (club.id === clubId) {
          const isJoined = !club.isJoined;
          // Add notification
          const newNotif: NotificationItem = {
            id: `notif-${Date.now()}`,
            type: 'club',
            title: isJoined ? 'Club Joined' : 'Club Left',
            message: isJoined
              ? `You successfully joined ${club.name}. Welcome aboard!`
              : `You left ${club.name}. Hope to see you back soon!`,
            date: 'Just now',
            read: false,
          };
          setNotifications(prevNotifs => [newNotif, ...prevNotifs]);
          return { ...club, isJoined, membersCount: club.membersCount + (isJoined ? 1 : -1) };
        }
        return club;
      })
    );
  };

  const createClub = (club: Omit<Club, 'id' | 'membersCount' | 'upcomingEventsCount'>) => {
    const newClub: Club = {
      ...club,
      id: `club-${Date.now()}`,
      membersCount: 1,
      upcomingEventsCount: 0,
      isJoined: true,
    };
    setClubs(prev => [newClub, ...prev]);

    // Send notifications
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'club',
      title: 'New Club Registered',
      message: `Club "${club.name}" was successfully registered by Faculty Coordinator ${club.facultyCoordinator}.`,
      date: 'Just now',
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const registerForEvent = (eventId: string) => {
    setEvents(prev =>
      prev.map(evt => {
        if (evt.id === eventId) {
          const isReg = !evt.isRegistered;
          const newNotif: NotificationItem = {
            id: `notif-${Date.now()}`,
            type: 'event',
            title: isReg ? 'Registered for Event' : 'Unregistered from Event',
            message: isReg
              ? `You are now registered for "${evt.title}". Calendar updated.`
              : `You unregistered from "${evt.title}".`,
            date: 'Just now',
            read: false,
          };
          setNotifications(prevNotifs => [newNotif, ...prevNotifs]);
          return { ...evt, isRegistered: isReg, registrationCount: evt.registrationCount + (isReg ? 1 : -1) };
        }
        return evt;
      })
    );
  };

  const createEvent = (event: Omit<ClubEvent, 'id' | 'registrationCount' | 'status'>) => {
    const newEvent: ClubEvent = {
      ...event,
      id: `event-${Date.now()}`,
      registrationCount: 0,
      status: currentRole === 'faculty' || currentRole === 'admin' || currentRole === 'superadmin' ? 'Approved' : 'Pending Approval',
      isRegistered: false,
    };
    setEvents(prev => [newEvent, ...prev]);

    // Send notifications
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'event',
      title: 'Event Proposal Submitted',
      message: `New event proposal "${event.title}" has been submitted for approval.`,
      date: 'Just now',
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Update club event count
    setClubs(prevClubs =>
      prevClubs.map(c => (c.id === event.clubId ? { ...c, upcomingEventsCount: c.upcomingEventsCount + 1 } : c))
    );
  };

  const approveEvent = (eventId: string) => {
    setEvents(prev =>
      prev.map(evt => {
        if (evt.id === eventId) {
          const newNotif: NotificationItem = {
            id: `notif-${Date.now()}`,
            type: 'event',
            title: 'Event Approved',
            message: `The event proposal "${evt.title}" has been approved and is now public.`,
            date: 'Just now',
            read: false,
          };
          setNotifications(prevNotifs => [newNotif, ...prevNotifs]);
          return { ...evt, status: 'Approved' };
        }
        return evt;
      })
    );
  };

  const handleMembership = (requestId: string, action: 'approve' | 'reject') => {
    setMembershipRequests(prev =>
      prev.map(req => {
        if (req.id === requestId) {
          const status = action === 'approve' ? 'Approved' : 'Rejected';

          // Add notification
          const newNotif: NotificationItem = {
            id: `notif-${Date.now()}`,
            type: 'membership',
            title: `Membership Request ${status}`,
            message: `Membership request for ${req.studentName} in ${req.clubName} was ${status.toLowerCase()}.`,
            date: 'Just now',
            read: false,
          };
          setNotifications(prevNotifs => [newNotif, ...prevNotifs]);

          // If approved, update club member count and status in local state
          if (action === 'approve') {
            setClubs(prevClubs =>
              prevClubs.map(c => (c.id === req.clubId ? { ...c, membersCount: c.membersCount + 1 } : c))
            );
          }

          return { ...req, status };
        }
        return req;
      })
    );
  };

  const submitMembershipRequest = (clubId: string, details: { studentName: string; department: string; year: string }) => {
    const targetClub = clubs.find(c => c.id === clubId);
    if (!targetClub) return;

    const newRequest: MembershipRequest = {
      id: `req-${Date.now()}`,
      studentName: details.studentName,
      department: details.department,
      year: details.year,
      appliedDate: new Date().toISOString().split('T')[0],
      clubName: targetClub.name,
      clubId: targetClub.id,
      status: 'Pending',
    };
    setMembershipRequests(prev => [newRequest, ...prev]);

    // Send notifications
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'membership',
      title: 'Membership Request Filed',
      message: `You applied to join ${targetClub.name}. Waiting for approval.`,
      date: 'Just now',
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const toggleBookmarkOpportunity = (oppId: string) => {
    setOpportunities(prev =>
      prev.map(opp => (opp.id === oppId ? { ...opp, isBookmarked: !opp.isBookmarked } : opp))
    );
  };

  const applyOpportunity = (oppId: string) => {
    setOpportunities(prev =>
      prev.map(opp => {
        if (opp.id === oppId) {
          const isApplied = !opp.isApplied;
          const newNotif: NotificationItem = {
            id: `notif-${Date.now()}`,
            type: 'opportunity',
            title: isApplied ? 'Applied for Opportunity' : 'Withdrawn Application',
            message: isApplied
              ? `Your application for "${opp.title}" was submitted.`
              : `You withdrew your application for "${opp.title}".`,
            date: 'Just now',
            read: false,
          };
          setNotifications(prevNotifs => [newNotif, ...prevNotifs]);
          return { ...opp, isApplied };
        }
        return opp;
      })
    );
  };

  const createAnnouncement = (announcement: Omit<Announcement, 'id' | 'date'>) => {
    const newAnn: Announcement = {
      ...announcement,
      id: `ann-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setAnnouncements(prev => [newAnn, ...prev]);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'announcement',
      title: 'New Announcement Posted',
      message: `[${announcement.priority}] ${announcement.title}`,
      date: 'Just now',
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const likePost = (postId: string) => {
    setActivityFeed(prev =>
      prev.map(post => {
        if (post.id === postId) {
          const hasLiked = !post.hasLiked;
          return { ...post, hasLiked, likes: post.likes + (hasLiked ? 1 : -1) };
        }
        return post;
      })
    );
  };

  const addComment = (postId: string, commentText: string) => {
    if (!commentText.trim()) return;
    setActivityFeed(prev =>
      prev.map(post => {
        if (post.id === postId) {
          const newComment = {
            id: `c-${Date.now()}`,
            author: currentRole === 'student' ? 'Amit Sharma (You)' : `${currentRole.charAt(0).toUpperCase() + currentRole.slice(1)} User`,
            content: commentText,
            date: 'Just now',
          };
          return { ...post, comments: [...post.comments, newComment] };
        }
        return post;
      })
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const globalSearch = (query: string) => {
    const lowerQuery = query.toLowerCase();
    if (!lowerQuery.trim()) return { clubs: [], events: [], announcements: [], certificates: [] };

    return {
      clubs: clubs.filter(c => c.name.toLowerCase().includes(lowerQuery) || c.category.toLowerCase().includes(lowerQuery) || c.description.toLowerCase().includes(lowerQuery)),
      events: events.filter(e => e.title.toLowerCase().includes(lowerQuery) || e.organizer.toLowerCase().includes(lowerQuery) || e.venue.toLowerCase().includes(lowerQuery)),
      announcements: announcements.filter(a => a.title.toLowerCase().includes(lowerQuery) || a.content.toLowerCase().includes(lowerQuery)),
      certificates: certificates.filter(cert => cert.event.toLowerCase().includes(lowerQuery) || cert.certificateId.toLowerCase().includes(lowerQuery)),
    };
  };

  const activeConfig = roleConfigs[currentRole];

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        currentRole,
        setCurrentRole,
        activeConfig,
        clubs,
        joinClub,
        createClub,
        events,
        registerForEvent,
        createEvent,
        approveEvent,
        membershipRequests,
        handleMembership,
        submitMembershipRequest,
        opportunities,
        toggleBookmarkOpportunity,
        applyOpportunity,
        announcements,
        createAnnouncement,
        certificates,
        activityFeed,
        likePost,
        addComment,
        notifications,
        markAllNotificationsRead,
        markNotificationRead,
        unreadNotificationsCount,
        globalSearch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
