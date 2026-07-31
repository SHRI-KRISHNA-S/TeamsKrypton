import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  Award, 
  Megaphone, 
  ArrowRight, 
  CheckCircle2, 
  MessageSquare, 
  Mail, 
  Phone, 
  MapPin, 
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const stats = [
    { label: 'Active Clubs', value: '45+', icon: Users, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20' },
    { label: 'Events Conducted', value: '320+', icon: Calendar, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' },
    { label: 'Student Members', value: '2,500+', icon: MessageSquare, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20' },
    { label: 'Certificates Issued', value: '1,800+', icon: Award, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/20' },
  ];

  const features = [
    {
      title: 'Centralized Hub',
      description: 'Discover and join technical, cultural, business, and athletic clubs all in one place.',
    },
    {
      title: 'Event Management',
      description: 'Streamlined registrations, speaker management, scheduling, and automatic QR attendance.',
    },
    {
      title: 'LinkedIn-Style Campus Feed',
      description: 'Celebrate student milestones, view accomplishments, and share activities with peers.',
    },
    {
      title: 'Digital Certificates',
      description: 'Verify and download participation and winners certificates directly to your digital vault.',
    },
  ];

  const faqs = [
    {
      q: 'How do I join a student club?',
      a: 'Browse the Clubs directory under the dashboard, pick a club of interest, and click "Join Now". If the club has moderated entry, the President or Faculty Coordinator will review your request.'
    },
    {
      q: 'How can I get an event certificate?',
      a: 'Certificates are issued automatically upon verification of your attendance via QR code scan at the event venue. You can preview and download certificates from the Certificate tab.'
    },
    {
      q: 'Can I pitch a new club?',
      a: 'Yes, College Admins and Faculty can initialize clubs. Student presidents can propose events and upload gallery items after obtaining approval from assigned faculty.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080B11] text-slate-800 dark:text-slate-100 transition-colors">
      {/* Navbar for Landing Page */}
      <nav className="h-20 flex items-center justify-between px-6 md:px-16 border-b border-slate-100 dark:border-slate-800/80 bg-white/70 dark:bg-[#080B11]/70 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold font-display shadow-md shadow-indigo-600/20">
            CP
          </div>
          <span className="font-display font-bold text-slate-900 dark:text-white text-base tracking-wide">ClubPortal</span>
        </div>
        <div className="flex items-center gap-3 md:gap-6">
          <button 
            onClick={() => navigate('/auth')} 
            className="text-xs font-semibold text-slate-650 dark:text-slate-300 hover:text-primary dark:hover:text-white cursor-pointer"
          >
            Sign In
          </button>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => navigate('/auth')}
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 md:px-16 py-16 md:py-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
          <Badge variant="primary" className="py-1 px-3.5 text-xs">
            <Sparkles className="h-3.5 w-3.5 mr-1.5 inline" /> Reimagining Student Activities
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold font-display leading-[1.1] text-slate-900 dark:text-white tracking-tight">
            Empowering Student Communities Through <span className="text-primary bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500">Digital Collaboration</span>
          </h1>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            The premium workspace for college clubs, communities, and departments. Host hackathons, track attendance via QR codes, issue verifiable credentials, and share achievements on a modern activity feed.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Button 
              variant="primary" 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="w-full sm:w-auto"
            >
              Join Portal Now
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="w-full sm:w-auto"
            >
              Explore Clubs
            </Button>
          </div>
        </div>

        {/* Beautiful Campus Illustration Accent */}
        <div className="lg:col-span-6 relative flex justify-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 md:w-96 h-72 md:h-96 rounded-full bg-indigo-400/10 blur-3xl" />
          <div className="relative w-full max-w-md bg-white dark:bg-[#0E1322] border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-2xl card-shadow transform hover:rotate-1 transition-all duration-500">
            {/* Window bar */}
            <div className="flex items-center gap-1.5 mb-5">
              <span className="h-3 w-3 rounded-full bg-rose-400 block" />
              <span className="h-3 w-3 rounded-full bg-amber-400 block" />
              <span className="h-3 w-3 rounded-full bg-emerald-400 block" />
            </div>
            
            {/* Visual Canvas content */}
            <div className="space-y-4">
              <div className="h-36 bg-gradient-to-tr from-indigo-500 to-indigo-600 rounded-2xl p-4 flex flex-col justify-between text-white relative overflow-hidden">
                <div className="absolute right-[-20px] bottom-[-25px] h-32 w-32 rounded-full bg-white/10 blur-xl" />
                <div className="text-[10px] font-bold tracking-wider uppercase bg-white/20 px-2 py-0.5 rounded-md w-max">
                  Upcoming Event
                </div>
                <div>
                  <h3 className="text-sm font-bold font-display">HackTech 2026</h3>
                  <p className="text-[10px] text-indigo-100 mt-1">Aug 15 • Tech Center Hall</p>
                </div>
              </div>

              {/* Members floating row */}
              <div className="flex items-center justify-between p-3.5 border border-slate-50 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/40">
                <div className="flex -space-x-2">
                  <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop&q=80" alt="Student" className="h-7 w-7 rounded-full border-2 border-white dark:border-slate-900 object-cover" />
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&q=80" alt="Student" className="h-7 w-7 rounded-full border-2 border-white dark:border-slate-900 object-cover" />
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&q=80" alt="Student" className="h-7 w-7 rounded-full border-2 border-white dark:border-slate-900 object-cover" />
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-bold text-slate-850 dark:text-slate-100">142 Members Joined</div>
                  <div className="text-[9px] text-emerald-500 font-bold mt-0.5">+12 Active Requests</div>
                </div>
              </div>

              {/* Verified Certificate Row */}
              <div className="flex items-center gap-3 p-3.5 border border-slate-50 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/40">
                <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0">
                  <Award className="h-5 w-5" />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="text-[11px] font-bold text-slate-850 dark:text-slate-100 truncate">Verifiable Award issued</div>
                  <div className="text-[9px] text-slate-400 truncate mt-0.5">UID: CERT-HT-8932 • Secured on ledger</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="px-6 md:px-16 py-12 border-y border-slate-100 dark:border-slate-800/80 bg-white/45 dark:bg-[#0E1322]/20">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2 p-3">
              <div className={`p-2.5 rounded-xl ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white font-display mt-2">{stat.value}</div>
              <div className="text-xs text-slate-400 font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="px-6 md:px-16 py-20 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <Badge variant="secondary" className="py-1 px-3">
            Core Modules
          </Badge>
          <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white">
            Built for Students, Coordinators, and Admins
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Everything required to scale extracurricular activities and boost club participation metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, i) => (
            <Card key={i} hoverable={true}>
              <CardBody className="space-y-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">{feat.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{feat.description}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 md:px-16 py-20 max-w-7xl mx-auto bg-slate-50 dark:bg-transparent">
        <div className="text-center space-y-3 mb-12">
          <Badge variant="accent" className="py-1 px-3">
            Testimonials
          </Badge>
          <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white">What Students Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hoverable={true} className="bg-white/50 dark:bg-[#0E1322]/40 backdrop-blur-md">
            <CardBody className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 italic leading-relaxed">
                "Our Coding Club registered over 140 new students on day one using this portal. Setting up events, approvals, and certificates is now fully automated!"
              </p>
              <div className="flex items-center gap-3">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&q=80" alt="Alex Mercer" className="h-8 w-8 rounded-full object-cover" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Alex Mercer</h4>
                  <span className="text-[9px] text-slate-400 font-semibold">Coding Club President</span>
                </div>
              </div>
            </CardBody>
          </Card>
          <Card hoverable={true} className="bg-white/50 dark:bg-[#0E1322]/40 backdrop-blur-md">
            <CardBody className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 italic leading-relaxed">
                "Finding internships and hackathons has never been simpler. I can bookmark opportunities and see upcoming calendar deadlines instantly."
              </p>
              <div className="flex items-center gap-3">
                <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop&q=80" alt="Nisha Patel" className="h-8 w-8 rounded-full object-cover" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Nisha Patel</h4>
                  <span className="text-[9px] text-slate-400 font-semibold">Year III Mech Student</span>
                </div>
              </div>
            </CardBody>
          </Card>
          <Card hoverable={true} className="bg-white/50 dark:bg-[#0E1322]/40 backdrop-blur-md">
            <CardBody className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 italic leading-relaxed">
                "Approving event proposals and analyzing club growth reports is incredibly fast. It keeps our administrative overhead to a minimum."
              </p>
              <div className="flex items-center gap-3">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&q=80" alt="Dr. Sarah Jenkins" className="h-8 w-8 rounded-full object-cover" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Dr. Sarah Jenkins</h4>
                  <span className="text-[9px] text-slate-400 font-semibold">Computer Science Head</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="px-6 md:px-16 py-20 max-w-3xl mx-auto space-y-8">
        <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white text-center">Frequently Asked Questions</h2>
        <div className="space-y-3.5">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="border border-slate-100 dark:border-slate-800/80 rounded-2xl overflow-hidden bg-white dark:bg-[#0E1322]/30 transition-all duration-300"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-4 font-semibold text-slate-800 dark:text-slate-200 text-xs md:text-sm text-left hover:bg-slate-50/50 dark:hover:bg-slate-900/20 cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`h-4 w-4 text-slate-400 transform transition-transform ${activeFaq === index ? 'rotate-180' : ''}`} />
              </button>
              {activeFaq === index && (
                <div className="px-4 pb-4 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-50 dark:border-slate-800/40 pt-3 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-16 py-16 bg-white dark:bg-[#0E1322] border-t border-slate-100 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold font-display">
                CP
              </div>
              <span className="font-display font-bold text-slate-900 dark:text-white text-base">ClubPortal</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Verifiable event credentials, interactive calendar grids, and customized role widgets tailored for smart colleges.
            </p>
            <div className="flex items-center gap-3 text-slate-400">
              <a href="#" aria-label="Github link" className="hover:text-primary">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
              <a href="#" aria-label="Twitter link" className="hover:text-primary">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a href="#" aria-label="Linkedin link" className="hover:text-primary">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>

          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-xs text-slate-500 dark:text-slate-400 font-semibold">
              <li><button onClick={() => navigate('/auth')} className="hover:text-primary cursor-pointer">Register Student</button></li>
              <li><button onClick={() => navigate('/auth')} className="hover:text-primary cursor-pointer">Admin Login</button></li>
              <li><button onClick={() => navigate('/')} className="hover:text-primary cursor-pointer">About Us</button></li>
              <li><button onClick={() => navigate('/')} className="hover:text-primary cursor-pointer">Security Ledger</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Support & FAQ</h4>
            <ul className="space-y-2.5 text-xs text-slate-500 dark:text-slate-400 font-semibold">
              <li><a href="#" className="hover:text-primary">Contact Support</a></li>
              <li><a href="#" className="hover:text-primary">Developer API</a></li>
              <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary">Terms of Use</a></li>
            </ul>
          </div>

          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Contact Campus</h4>
            <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
              <MapPin className="h-4 w-4 flex-shrink-0 text-slate-400" />
              <span>100 Innovation Way, Tech Campus</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
              <Phone className="h-4 w-4 flex-shrink-0 text-slate-400" />
              <span>+1 (555) 019-2831</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
              <Mail className="h-4 w-4 flex-shrink-0 text-slate-400" />
              <span>support@collegeportal.edu</span>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-slate-50 dark:border-slate-800/40 mt-12 pt-8 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} ClubPortal. Built with React & Tailwind CSS. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};
