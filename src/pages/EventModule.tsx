import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  QrCode, 
  Share2, 
  ArrowLeft,
  CheckCircle2,
  Bookmark,
  User,
  Plus
} from 'lucide-react';
import { Card, CardHeader, CardBody, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table } from '../components/ui/Table';
import { useApp, ClubEvent } from '../context/AppContext';

export const EventModule: React.FC = () => {
  const { events, registerForEvent, currentRole, createEvent } = useApp();
  
  // Selection
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  
  // Filter states
  const [filterStatus, setFilterStatus] = useState<'All' | 'Approved' | 'Pending Approval'>('All');

  const filteredEvents = events.filter(e => {
    if (filterStatus === 'All') return true;
    return e.status === filterStatus;
  });

  const activeEvent = events.find(e => e.id === selectedEventId);

  if (activeEvent) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Back button */}
        <button 
          onClick={() => setSelectedEventId(null)}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white cursor-pointer transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Events Listing
        </button>

        {/* Poster banner header */}
        <div className="rounded-3xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#0E1322] overflow-hidden shadow-sm">
          <div className="h-60 md:h-72 relative">
            <img 
              src={activeEvent.poster} 
              alt={activeEvent.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-6 md:p-8" />
            <div className="absolute bottom-6 left-6 right-6 md:left-8 md:right-8 z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 text-white">
              <div className="space-y-2">
                <Badge variant="primary" className="bg-white/20 border-transparent text-white py-0.5 px-2">{activeEvent.organizer}</Badge>
                <h1 className="text-xl md:text-2xl font-bold font-display leading-tight">{activeEvent.title}</h1>
                <div className="flex flex-wrap gap-4 text-[11px] text-slate-200">
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {activeEvent.date}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {activeEvent.time}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {activeEvent.venue}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={activeEvent.isRegistered ? 'outline' : 'primary'} 
                  onClick={() => registerForEvent(activeEvent.id)}
                  className="font-bold text-xs"
                >
                  {activeEvent.isRegistered ? 'Unregister' : 'Register Now'}
                </Button>
              </div>
            </div>
          </div>

          {/* Details sections */}
          <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Content column */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Event speakers */}
              {activeEvent.speakers && activeEvent.speakers.length > 0 && (
                <div className="space-y-3.5">
                  <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white">Featured Speakers</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeEvent.speakers.map((spk, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3.5 border border-slate-50 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/10 rounded-xl">
                        <div className="h-8 w-8 rounded-full bg-indigo-500/10 text-primary flex items-center justify-center font-bold">
                          <User className="h-4 w-4" />
                        </div>
                        <div className="text-xs font-bold text-slate-850 dark:text-slate-100">{spk}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Schedule */}
              {activeEvent.schedule && activeEvent.schedule.length > 0 && (
                <div className="space-y-3.5">
                  <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white">Event Timeline Schedule</h3>
                  <div className="p-0 border border-slate-50 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900/25">
                    <Table
                      columns={[
                        { header: 'Time Slot', accessor: 'time', className: 'font-semibold text-slate-500 dark:text-slate-400' },
                        { header: 'Session Activity details', accessor: 'activity', className: 'text-slate-800 dark:text-slate-200' },
                      ]}
                      data={activeEvent.schedule}
                      keyExtractor={(row) => row.time}
                    />
                  </div>
                </div>
              )}

              {/* Map Placeholder */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white">Venue Map Layout</h3>
                <div className="h-40 bg-slate-100 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-2xl flex flex-col justify-center items-center text-xs text-slate-400 space-y-2">
                  <MapPin className="h-7 w-7 text-indigo-500 animate-bounce" />
                  <span className="font-semibold">{activeEvent.venue} (Campus Central Wing)</span>
                  <span className="text-[10px] text-slate-450 font-sans">Visual coordinates simulation</span>
                </div>
              </div>

              {/* Feedback reviews */}
              {activeEvent.feedback && activeEvent.feedback.length > 0 && (
                <div className="space-y-3.5">
                  <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white">Participant Feedback</h3>
                  <div className="space-y-3">
                    {activeEvent.feedback.map((f, idx) => (
                      <div key={idx} className="p-3.5 border border-slate-50 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/10 rounded-xl space-y-1.5">
                        <div className="flex justify-between items-center text-[10px] text-slate-400">
                          <span className="font-bold text-slate-700 dark:text-slate-350">{f.name}</span>
                          <span className="text-amber-500 font-semibold">★ {f.rating}/5</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-normal">"{f.text}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right side widgets column */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Check-in QR Attendance code */}
              <Card hoverable={false}>
                <CardHeader className="flex justify-between items-center pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Attendance QR Simulator</h4>
                  <QrCode className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardBody className="flex flex-col items-center py-6 space-y-3 bg-slate-50/40 dark:bg-slate-900/20 rounded-xl">
                  {/* Visual QR Simulator */}
                  <div className="h-32 w-32 border border-slate-100 dark:border-slate-800/80 bg-white p-2.5 rounded-2xl flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="h-full w-full text-slate-850">
                      <rect width="100" height="100" fill="none" />
                      {/* Outer boxes */}
                      <rect x="5" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="6" />
                      <rect x="11" y="11" width="13" height="13" fill="currentColor" />
                      <rect x="70" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="6" />
                      <rect x="76" y="11" width="13" height="13" fill="currentColor" />
                      <rect x="5" y="70" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="6" />
                      <rect x="11" y="76" width="13" height="13" fill="currentColor" />
                      {/* Random lines pattern to resemble a QR code */}
                      <path d="M40 5h10v10H40V5zm15 0h10v5H55V5zm15 15v5H55v-5h15zM40 20h5v10h-5V20zm15 15h15v5H55v-5zm-15 15v10H30v-10h10zm15 10v15h-5v-15h5zm15 5h10v10H70v-10zm-15 15h15v5H55v-5zM40 70h15v10H40V70zm15 15v10H30v-10h10z" fill="currentColor" />
                    </svg>
                  </div>
                  <div className="text-[10px] text-slate-400 font-bold text-center leading-normal">
                    <span>Scan code at entrance lobby to automatically register attendance</span>
                  </div>
                </CardBody>
              </Card>

              {/* Event Statistics */}
              <Card hoverable={false}>
                <CardHeader><h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Event Overview</h4></CardHeader>
                <CardBody className="space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold">Registered Count</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100">{activeEvent.registrationCount} students</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold">Approval Status</span>
                    <Badge variant={activeEvent.status === 'Approved' ? 'secondary' : 'accent'}>{activeEvent.status}</Badge>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Active Campus Events</h1>
          <p className="text-xs text-slate-400 mt-1">Review schedules, speakers details, and log your attendance credentials.</p>
        </div>
      </div>

      {/* Action Filters */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div className="flex gap-2">
          {(['All', 'Approved', 'Pending Approval'] as const).map(stat => (
            <button
              key={stat}
              onClick={() => setFilterStatus(stat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer border transition-colors ${
                filterStatus === stat
                  ? 'bg-primary border-primary text-white'
                  : 'bg-white dark:bg-[#0E1322] border-slate-100 dark:border-slate-800 text-slate-650 dark:text-slate-400'
              }`}
            >
              {stat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map(evt => (
          <Card key={evt.id} hoverable={true} className="flex flex-col h-full overflow-hidden">
            <div className="h-40 bg-slate-100 dark:bg-slate-800 relative">
              <img 
                src={evt.poster} 
                alt={evt.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                <Badge variant={evt.status === 'Approved' ? 'secondary' : 'accent'} className="bg-black/50 border-none text-white">{evt.status}</Badge>
              </div>
            </div>
            <CardBody className="space-y-4 flex-grow">
              <div className="space-y-1.5">
                <Badge variant="primary">{evt.organizer}</Badge>
                <h3 className="text-xs font-bold font-display text-slate-900 dark:text-white leading-snug">{evt.title}</h3>
              </div>
              <div className="space-y-2 text-[10px] text-slate-400 font-semibold">
                <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {evt.date}</div>
                <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {evt.venue}</div>
                <div className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {evt.registrationCount} registered</div>
              </div>
            </CardBody>
            <CardFooter className="flex gap-2">
              <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => setSelectedEventId(evt.id)}>
                View Details
              </Button>
              <Button 
                variant={evt.isRegistered ? 'outline' : 'primary'} 
                size="sm" 
                className="w-full text-xs"
                onClick={() => registerForEvent(evt.id)}
              >
                {evt.isRegistered ? 'Registered' : 'Register'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
