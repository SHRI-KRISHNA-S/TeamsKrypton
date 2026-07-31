import React, { useState } from 'react';
import { Megaphone, Pin, Calendar, Award, BookOpen, Download, User } from 'lucide-react';
import { Card, CardHeader, CardBody, Button, Badge, useApp } from '../../common';

export const AnnouncementModule: React.FC = () => {
  const { announcements } = useApp();

  // Sort: Pinned first, then by date descending
  const sortedAnnouncements = [...announcements].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Title */}
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Campus Broadcasting Timeline</h1>
        <p className="text-xs text-slate-400 mt-1">Institutional memos, deadlines extensions, and club council notifications.</p>
      </div>

      {/* Timeline cards */}
      <div className="space-y-6 max-w-3xl">
        {sortedAnnouncements.map(ann => (
          <div key={ann.id} className="relative flex gap-6">
            
            {/* Left timeline nodes (Visual line link) */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div className={`h-9 w-9 rounded-full flex items-center justify-center border-2 border-white dark:border-[#080B11] shadow-md ${
                ann.isPinned 
                  ? 'bg-amber-500 text-white' 
                  : ann.priority === 'High' 
                    ? 'bg-rose-500 text-white' 
                    : 'bg-indigo-500 text-white'
              }`}>
                {ann.isPinned ? <Pin className="h-4 w-4 transform rotate-45" /> : <Megaphone className="h-4 w-4" />}
              </div>
              <div className="w-0.5 bg-slate-100 dark:bg-slate-800/80 flex-grow mt-2" />
            </div>

            {/* Right Card content */}
            <Card hoverable={true} className={`w-full ${ann.isPinned ? 'border-amber-300 dark:border-amber-900/40 bg-amber-500/[0.02] dark:bg-amber-500/[0.01]' : ''}`}>
              <CardBody className="space-y-3.5">
                <div className="flex justify-between items-baseline flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={ann.priority === 'High' ? 'danger' : ann.priority === 'Medium' ? 'accent' : 'neutral'}>
                      {ann.priority} Priority
                    </Badge>
                    <span className="text-[10px] text-slate-400 font-semibold">{ann.department}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold">
                    <Calendar className="h-3 w-3" /> {ann.date}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xs font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                    {ann.title}
                    {ann.isPinned && <Pin className="h-3 w-3 text-amber-500 transform rotate-45" />}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {ann.content}
                  </p>
                </div>

                {/* Attachments Section */}
                {ann.attachments && ann.attachments.length > 0 && (
                  <div className="border-t border-slate-50 dark:border-slate-800/60 pt-3 flex flex-wrap gap-2">
                    {ann.attachments.map((file, idx) => (
                      <button 
                        key={idx}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 text-[10px] font-bold text-slate-650 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5 text-indigo-500" />
                        <span>{file.name}</span>
                        <span className="text-[9px] text-slate-400">({file.size})</span>
                      </button>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
