import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Send, 
  Image, 
  Calendar, 
  Tag, 
  Sparkles,
  FileText
} from 'lucide-react';
import { Card, CardBody, Button, useApp } from '../../common';

export const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const { clubs, events, createCampusPost, currentRole } = useApp();

  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedClub, setSelectedClub] = useState('');
  const [isAnnouncement, setIsAnnouncement] = useState(false);

  // Predefined templates
  const templates = [
    {
      name: 'Teammate Search',
      content: "🚀 I'm attending the HackTech 2026 Hackathon tomorrow. Looking for 2 teammates to form a team. I specialize in React frontend, looking for backend/database developers!"
    },
    {
      name: 'Robotics Workshop',
      content: "🤖 Anyone interested in joining the Robotics Workshop next week? We will be building autonomous maze-solving micro-mice. No prior hardware experience needed!"
    },
    {
      name: 'Volunteer Recruitment',
      content: "⚠️ We need student volunteers for managing tomorrow's symposium food courts and Wifi desk check-ins. Please comment or DM if interested!"
    },
    {
      name: 'Transportation',
      content: "🚗 Looking for transportation/carpooling to the national symposium this weekend. Let me know if anyone has extra space in their car or wants to split a cab!"
    }
  ];

  // List of approved events
  const approvedEvents = events.filter(e => e.status === 'Approved');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    createCampusPost({
      content,
      image: image || undefined,
      eventTag: selectedEvent || undefined,
      clubTag: selectedClub || undefined,
      isAnnouncement: isAnnouncement
    });

    navigate('/campus-connect');
  };

  const selectTemplate = (text: string) => {
    setContent(text);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Back button */}
      <button 
        onClick={() => navigate('/campus-connect')}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-primary cursor-pointer transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Feed
      </button>

      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-500" /> Share Something New
          </h1>
          <p className="text-xs text-slate-400 mt-1">Start a discussion, look for hackathon teammates, or recruit volunteers.</p>
        </div>

        {/* Templates selector */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Use Predefined Templates</h3>
          <div className="grid grid-cols-2 gap-3">
            {templates.map(tmpl => (
              <button 
                key={tmpl.name}
                type="button"
                onClick={() => selectTemplate(tmpl.content)}
                className="p-3 text-left border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322] rounded-xl hover:border-indigo-400 dark:hover:border-indigo-650 hover:shadow-sm cursor-pointer transition-all space-y-1.5"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <FileText className="h-4 w-4 text-indigo-500" />
                  <span>{tmpl.name}</span>
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 line-clamp-2 leading-relaxed">{tmpl.content}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Main form */}
        <Card hoverable={false} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322]">
          <CardBody className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Content Textarea */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900 dark:text-slate-350">Post Content</label>
                <textarea 
                  placeholder="What's happening? Ask a question, find teammates, or organize a meetup..." 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={5}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 rounded-xl text-xs text-slate-850 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-indigo-500"
                />
              </div>

              {/* Image Input (Mock) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900 dark:text-slate-350 flex items-center gap-1">
                  <Image className="h-4 w-4 text-slate-450" /> Image URL (Optional)
                </label>
                <input 
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..." 
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-3 py-2 rounded-xl text-xs text-slate-850 dark:text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              {/* Tags grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Event Tag */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-900 dark:text-slate-350 flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-slate-450" /> Event Tag (Optional)
                  </label>
                  <select
                    value={selectedEvent}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-3 py-2.5 rounded-xl text-xs text-slate-655 dark:text-slate-350 outline-none focus:border-indigo-500"
                  >
                    <option value="">No Event Tag</option>
                    {approvedEvents.map(evt => (
                      <option key={evt.id} value={evt.title}>{evt.title}</option>
                    ))}
                  </select>
                </div>

                {/* Club Tag */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-900 dark:text-slate-350 flex items-center gap-1">
                    <Tag className="h-4 w-4 text-slate-450" /> Club Tag (Optional)
                  </label>
                  <select
                    value={selectedClub}
                    onChange={(e) => setSelectedClub(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-3 py-2.5 rounded-xl text-xs text-slate-655 dark:text-slate-350 outline-none focus:border-indigo-500"
                  >
                    <option value="">No Club Tag</option>
                    {clubs.map(club => (
                      <option key={club.id} value={club.name}>{club.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Announcements switch for Presidents/Staff */}
              {(currentRole === 'president' || currentRole === 'faculty' || currentRole === 'admin' || currentRole === 'superadmin') && (
                <div className="flex items-center gap-2.5 bg-indigo-50/20 dark:bg-indigo-950/10 p-3.5 border border-dashed border-indigo-100 dark:border-indigo-900/40 rounded-xl">
                  <input 
                    type="checkbox"
                    id="announcementCheck"
                    checked={isAnnouncement}
                    onChange={(e) => setIsAnnouncement(e.target.checked)}
                    className="h-4 w-4 text-indigo-650 cursor-pointer"
                  />
                  <label htmlFor="announcementCheck" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                    Post as Club Announcement (Highlighted and Pinned in Club Feed)
                  </label>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="font-bold cursor-pointer"
                  onClick={() => navigate('/campus-connect')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  size="sm" 
                  className="font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="h-4 w-4" /> Share Post
                </Button>
              </div>

            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
