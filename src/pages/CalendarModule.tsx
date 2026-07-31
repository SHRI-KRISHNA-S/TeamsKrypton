import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, MapPin, Clock, Star } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useApp } from '../context/AppContext';

export const CalendarModule: React.FC = () => {
  const { events, opportunities } = useApp();
  const [filterType, setFilterType] = useState<'All' | 'Event' | 'Deadline'>('All');

  // Active items mapped to August 2026 calendar days
  // Coding Club Hackathon - Aug 15
  // Robotics RoboWars - Aug 22
  // Google HashCode Deadline - Aug 20
  // Figma UI/UX Workshop Deadline - Aug 18
  // ACM Recruitment Drive Deadline - Aug 25
  const calendarItems = [
    { day: 15, title: 'HackTech 2026 Hackathon', type: 'Event', organizer: 'Coding Club', time: '09:00 AM', venue: 'Main Seminar Hall' },
    { day: 22, title: 'RoboWars Championship', type: 'Event', organizer: 'Robotics Assoc', time: '10:00 AM', venue: 'College Arena' },
    { day: 20, title: 'Google HashCode 2026 Deadline', type: 'Deadline', organizer: 'Google Students', time: '11:59 PM', venue: 'Online submissions' },
    { day: 18, title: 'UI/UX Figma Design Workshop', type: 'Event', organizer: 'Figma Guild', time: '04:00 PM', venue: 'Seminar Hall C' },
    { day: 25, title: 'ACM Core Team Recruitment Deadline', type: 'Deadline', organizer: 'ACM Chapter', time: '05:00 PM', venue: 'Online application' },
  ];

  const filteredItems = calendarItems.filter(item => {
    if (filterType === 'All') return true;
    return item.type === filterType;
  });

  // Calendar parameters for August 2026
  // August 1st starts on Saturday (index 6 where Sunday=0, Saturday=6)
  const startDayOffset = 6;
  const daysInMonth = 31;
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Pad the calendar grid before the 1st
  const paddingArray = Array.from({ length: startDayOffset }, (_, i) => null);
  const totalGridCells = [...paddingArray, ...daysArray];

  // Tooltip details on hover
  const [hoveredItem, setHoveredItem] = useState<any | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e: React.MouseEvent, item: any) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: rect.left + window.scrollX,
      y: rect.top - 120 + window.scrollY,
    });
    setHoveredItem(item);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white font-sans">Student Activities Calendar</h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">Coordinate events, workshops, registrations, and project submission deadlines.</p>
        </div>
        <div className="flex gap-2">
          {(['All', 'Event', 'Deadline'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-3 py-1 text-xs font-semibold cursor-pointer rounded-lg border transition-colors ${
                filterType === f
                  ? 'bg-primary border-primary text-white'
                  : 'bg-white dark:bg-[#0E1322] border-slate-100 dark:border-slate-800 text-slate-650 dark:text-slate-400'
              }`}
            >
              {f}s
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Month grid (August 2026) */}
        <Card hoverable={false} className="lg:col-span-8 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
              <CalendarIcon className="h-4.5 w-4.5 text-primary" /> August 2026
            </h3>
            <div className="flex gap-1">
              <button className="p-1 border border-slate-100 dark:border-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><ChevronLeft className="h-4 w-4" /></button>
              <button className="p-1 border border-slate-100 dark:border-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>

          {/* Days labels */}
          <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Grid Cells */}
          <div className="grid grid-cols-7 gap-1 border-t border-l border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/10">
            {totalGridCells.map((day, idx) => {
              if (day === null) {
                return (
                  <div key={`pad-${idx}`} className="h-20 bg-slate-50/20 dark:bg-slate-950/10 border-r border-b border-slate-100 dark:border-slate-800/80" />
                );
              }

              // Check for items on this day
              const itemsOnDay = filteredItems.filter(item => item.day === day);

              return (
                <div 
                  key={`day-${day}`} 
                  className={`h-20 p-2 bg-white dark:bg-[#0E1322] border-r border-b border-slate-100 dark:border-slate-800/80 relative flex flex-col justify-between ${
                    day === 31 ? 'bg-indigo-50/20 dark:bg-indigo-950/10' : ''
                  }`}
                >
                  <span className="text-[10px] font-bold text-slate-450">{day}</span>
                  
                  {/* Visual dots / tags for items */}
                  <div className="space-y-1 overflow-hidden">
                    {itemsOnDay.map((item, i) => (
                      <div 
                        key={i}
                        onMouseEnter={(e) => handleMouseEnter(e, item)}
                        onMouseLeave={() => setHoveredItem(null)}
                        className={`text-[8px] font-bold px-1 py-0.5 rounded truncate cursor-pointer transition-transform hover:scale-102 ${
                          item.type === 'Event' 
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-450 border border-emerald-100 dark:border-emerald-900/20' 
                            : 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-450 border border-rose-100 dark:border-rose-900/20'
                        }`}
                      >
                        {item.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Side Panel: Listed details */}
        <div className="lg:col-span-4 space-y-6">
          <Card hoverable={false}>
            <CardHeader><h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Scheduled Actions</h4></CardHeader>
            <CardBody className="space-y-4">
              {filteredItems.map((item, i) => (
                <div key={i} className="flex gap-3 text-xs p-1">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold ${
                    item.type === 'Event' 
                      ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500' 
                      : 'bg-rose-50 dark:bg-rose-950/20 text-rose-500'
                  }`}>
                    {item.day}
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 dark:text-slate-100 leading-tight">{item.title}</h5>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1 flex items-center gap-1"><Clock className="h-3 w-3" /> {item.time} • {item.venue}</p>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Floating Tooltip details */}
      {hoveredItem && (
        <div 
          className="fixed z-50 w-64 bg-white dark:bg-[#0E1322] border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl p-4 space-y-2.5 pointer-events-none animate-fade-in"
          style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
        >
          <div className="flex justify-between items-center pb-1 border-b border-slate-50 dark:border-slate-800/40">
            <Badge variant={hoveredItem.type === 'Event' ? 'secondary' : 'danger'}>{hoveredItem.type}</Badge>
            <span className="text-[9px] text-slate-400 font-bold">Aug {hoveredItem.day}, 2026</span>
          </div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">{hoveredItem.title}</h4>
          <div className="space-y-1.5 text-[10px] text-slate-450 font-semibold">
            <div className="flex items-center gap-1.5"><Clock className="h-3 w-3 text-slate-400" /> {hoveredItem.time}</div>
            <div className="flex items-center gap-1.5"><MapPin className="h-3 w-3 text-slate-400" /> {hoveredItem.venue}</div>
            <div className="flex items-center gap-1.5"><Star className="h-3 w-3 text-slate-400" /> Host: {hoveredItem.organizer}</div>
          </div>
        </div>
      )}
    </div>
  );
};
