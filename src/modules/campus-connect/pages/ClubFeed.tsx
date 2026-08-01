import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  Calendar, 
  Megaphone, 
  Pin, 
  Lock, 
  MessageSquare, 
  Plus, 
  ThumbsUp, 
  MessageCircle, 
  Clock,
  Briefcase,
  ChevronRight,
  TrendingUp,
  Tag,
  Sparkles,
  UserPlus,
  Trash2
} from 'lucide-react';
import { Card, CardHeader, CardBody, CardFooter, Button, Badge, useApp } from '../../common';

export const ClubFeed: React.FC = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const navigate = useNavigate();
  const { 
    clubs, 
    campusPosts, 
    events, 
    currentRole, 
    likeCampusPost, 
    createCampusPost,
    pinCampusPost,
    deleteCampusPost
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'feed' | 'discussions'>('feed');
  const [newPostText, setNewPostText] = useState('');
  const [selectedEventDiscussionId, setSelectedEventDiscussionId] = useState<string | null>(null);
  const [eventDiscussionText, setEventDiscussionText] = useState('');

  // Local state for simulated event discussion messages
  const [eventDiscussions, setEventDiscussions] = useState<Record<string, { id: string; author: string; avatar: string; text: string; time: string }[]>>({
    'event-1': [
      { id: '1', author: 'Amit Sharma', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&q=80', text: "Hey guys! Attending the hackathon tomorrow and looking for 2 React frontenders to team up. Let's make an epic project!", time: '2 hours ago' },
      { id: '2', author: 'Nisha Patel', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&q=80', text: "I'd love to join! I can help build the server side with Node.js and deploy on Vercel.", time: '1 hour ago' }
    ]
  });

  const selectedClubId = clubId || 'club-1';
  const targetClub = clubs.find(c => c.id === selectedClubId);

  if (!targetClub) {
    return (
      <div className="space-y-6">
        <Card className="p-8 text-center border border-slate-105 bg-white dark:bg-[#0E1322]/40 rounded-2xl">
          <CardBody className="py-8 text-slate-500">Club not found.</CardBody>
        </Card>
      </div>
    );
  }

  // 1. Enforce Role-Based Access
  // Students can only access their own joined clubs
  const isJoined = targetClub.isJoined;
  const isPresidentOfThisClub = currentRole === 'president' && targetClub.president.includes('Alex Mercer'); // Alex Mercer manages club-1 Coding Club

  const hasAccess = 
    currentRole === 'faculty' || 
    currentRole === 'admin' || 
    currentRole === 'superadmin' || 
    (currentRole === 'student' && isJoined) || 
    isPresidentOfThisClub;

  if (!hasAccess) {
    return (
      <div className="space-y-6 animate-slide-up max-w-2xl mx-auto">
        <button 
          onClick={() => navigate('/campus-connect')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-primary cursor-pointer transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Feed
        </button>
        <Card className="border border-red-100 dark:border-red-950/60 bg-red-50/10 dark:bg-red-950/5 rounded-3xl overflow-hidden shadow-sm">
          <CardBody className="p-8 text-center flex flex-col items-center justify-center space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-500 flex items-center justify-center shadow-inner">
              <Lock className="h-7 w-7" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Access Denied: Joined Members Only</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 max-w-md mx-auto leading-relaxed">
                The collaboration page for <strong>{targetClub.name}</strong> is restricted to joined members and administrative coordinators. Join the club first to view files, posts, and participate in discussions.
              </p>
            </div>
            <Button 
              variant="primary" 
              size="sm" 
              className="mt-2 font-bold"
              onClick={() => navigate('/clubs')}
            >
              Explore and Join Clubs
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  // Filter posts related to this club
  const clubPosts = campusPosts.filter(post => post.clubTag === targetClub.name);
  const pinnedPosts = clubPosts.filter(post => post.isPinned);
  const normalPosts = clubPosts.filter(post => !post.isPinned);

  // Filter events related to this club
  const clubEvents = events.filter(e => e.clubId === targetClub.id && e.status === 'Approved');

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    createCampusPost({
      content: newPostText,
      clubTag: targetClub.name,
      isAnnouncement: currentRole === 'president' || currentRole === 'faculty' || currentRole === 'admin' || currentRole === 'superadmin'
    });

    setNewPostText('');
  };

  const handleAddEventDiscussion = (eventId: string) => {
    if (!eventDiscussionText.trim()) return;

    const authorName = currentRole === 'student' ? 'Amit Sharma (You)' : currentRole === 'president' ? 'Alex Mercer (President)' : 'Faculty Coordinator';
    const authorAvatar = currentRole === 'student' ? 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&q=80' : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80';

    const newMessage = {
      id: `${Date.now()}`,
      author: authorName,
      avatar: authorAvatar,
      text: eventDiscussionText,
      time: 'Just now'
    };

    setEventDiscussions(prev => ({
      ...prev,
      [eventId]: [...(prev[eventId] || []), newMessage]
    }));

    setEventDiscussionText('');
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* 2. Top Club Selector Navigation Bar (Visible only to Faculty/Admins/SuperAdmins) */}
      {(currentRole === 'faculty' || currentRole === 'admin' || currentRole === 'superadmin') && (
        <Card hoverable={false} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322]">
          <CardBody className="p-3">
            <div className="flex items-center justify-between flex-wrap gap-2.5">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-2">Coordinator Navigation</span>
              <div className="flex gap-2 overflow-x-auto scrollbar-none">
                {clubs.map(c => (
                  <button
                    key={c.id}
                    onClick={() => navigate(`/campus-connect/club/${c.id}`)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                      selectedClubId === c.id
                        ? 'bg-primary border-primary text-white shadow-sm'
                        : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-850 text-slate-655 dark:text-slate-400 hover:border-slate-200 dark:hover:border-slate-750'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Main Club Info Hero Header */}
      <div className="rounded-3xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#0E1322] shadow-sm overflow-hidden">
        {/* Banner mock image */}
        <div className="h-32 md:h-44 bg-gradient-to-r from-violet-650 via-indigo-650 to-indigo-700 relative flex items-end p-6">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
            <img 
              src={targetClub.logo} 
              alt={targetClub.name} 
              className="h-16 w-16 md:h-20 md:w-20 rounded-2xl object-cover border-4 border-white dark:border-[#0E1322] shadow-sm flex-shrink-0"
            />
            <div className="text-white space-y-1.5 sm:mb-1">
              <Badge variant="accent" className="bg-white/20 border-transparent text-white py-0.5 px-2">{targetClub.category}</Badge>
              <h1 className="text-lg md:text-xl font-bold font-display leading-tight">{targetClub.name} Collaboration</h1>
              <p className="text-[10px] text-indigo-100 font-semibold flex items-center gap-1.5 justify-center sm:justify-start">
                <Users className="h-3.5 w-3.5" />
                <span>{targetClub.membersCount} Members</span>
                <span>•</span>
                <span>Coordinator: {targetClub.facultyCoordinator}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Action tabs inside Club Feed */}
        <div className="flex border-t border-slate-100 dark:border-slate-800 px-6">
          <button
            onClick={() => setActiveSubTab('feed')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeSubTab === 'feed'
                ? 'border-primary text-primary dark:text-indigo-400'
                : 'border-transparent text-slate-450 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Club Collaboration Feed
          </button>
          <button
            onClick={() => setActiveSubTab('discussions')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeSubTab === 'discussions'
                ? 'border-primary text-primary dark:text-indigo-400'
                : 'border-transparent text-slate-450 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Event Discussions & Teammates ({clubEvents.length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left main area (Feed or Discussions list) */}
        <div className="lg:col-span-8 space-y-6">
          {activeSubTab === 'feed' ? (
            <>
              {/* Add post input form */}
              <Card hoverable={false} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322]">
                <CardBody className="p-4">
                  <form onSubmit={handlePostSubmit} className="space-y-3.5">
                    <div className="flex gap-3">
                      <img 
                        src={currentRole === 'student' ? 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&q=80' : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80'} 
                        alt="My Profile" 
                        className="h-8 w-8 rounded-lg object-cover"
                      />
                      <textarea 
                        placeholder={`Share files, ask questions, or announce details in ${targetClub.name}...`}
                        value={newPostText}
                        onChange={(e) => setNewPostText(e.target.value)}
                        rows={2}
                        className="w-full bg-slate-50/50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850 text-xs text-slate-850 dark:text-slate-200 outline-none placeholder-slate-400 focus:border-indigo-500"
                      />
                    </div>
                    <div className="flex justify-end gap-2.5">
                      <Button 
                        type="submit" 
                        variant="primary" 
                        size="sm" 
                        className="font-bold cursor-pointer"
                      >
                        Publish to Club
                      </Button>
                    </div>
                  </form>
                </CardBody>
              </Card>

              {/* Pinned Club Posts */}
              {pinnedPosts.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-450 uppercase tracking-widest flex items-center gap-1.5 pl-1">
                    <Pin className="h-4.5 w-4.5 text-indigo-500 rotate-45" /> Pinned announcements
                  </h3>
                  <div className="space-y-3">
                    {pinnedPosts.map(post => (
                      <Card key={post.id} className="border border-indigo-150 bg-indigo-50/10 dark:border-indigo-900/40 dark:bg-indigo-950/5 overflow-hidden">
                        <CardBody className="p-5 space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2.5">
                              <img src={post.avatar} alt={post.author} className="h-8 w-8 rounded-lg object-cover" />
                              <div>
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{post.author}</h4>
                                <p className="text-[9px] text-slate-400 font-semibold">{post.department} • {post.timestamp}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="accent" className="bg-indigo-100 text-indigo-700 text-[8px] py-0.5 px-1.5 font-bold uppercase tracking-wider dark:bg-indigo-950 dark:text-indigo-400 border-indigo-200/50">Pinned</Badge>
                              {(currentRole === 'president' || currentRole === 'faculty' || currentRole === 'admin' || currentRole === 'superadmin') && (
                                <button 
                                  onClick={() => pinCampusPost(post.id)}
                                  className="text-[9px] text-slate-400 hover:text-slate-600 font-semibold cursor-pointer"
                                >
                                  Unpin
                                </button>
                              )}
                            </div>
                          </div>
                          <p 
                            className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-medium whitespace-pre-wrap cursor-pointer"
                            onClick={() => navigate(`/campus-connect/post/${post.id}`)}
                          >
                            {post.content}
                          </p>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Feed Posts */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-450 uppercase tracking-widest pl-1">Recent Collaborations</h3>
                {normalPosts.length === 0 && pinnedPosts.length === 0 ? (
                  <div className="text-center p-8 text-xs text-slate-450 font-medium">
                    No publications in {targetClub.name} yet. Write a post to initiate discussions.
                  </div>
                ) : (
                  normalPosts.map(post => {
                    const isModerator = currentRole === 'admin' || currentRole === 'superadmin' || isPresidentOfThisClub;
                    return (
                      <Card key={post.id} hoverable={true} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322] overflow-hidden">
                        <CardBody className="p-5 space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <img src={post.avatar} alt={post.author} className="h-9 w-9 rounded-xl object-cover cursor-pointer" onClick={() => navigate(`/campus-connect/profile/${post.userId}`)} />
                              <div>
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white hover:text-primary cursor-pointer" onClick={() => navigate(`/campus-connect/profile/${post.userId}`)}>{post.author}</h4>
                                <p className="text-[9px] text-slate-400 font-semibold">{post.department} • {post.timestamp}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {/* Pin Button */}
                              {(currentRole === 'president' || currentRole === 'faculty' || currentRole === 'admin' || currentRole === 'superadmin') && (
                                <button 
                                  onClick={() => pinCampusPost(post.id)}
                                  className="p-1 bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-lg text-slate-400 hover:text-indigo-500 cursor-pointer"
                                  title="Pin Post"
                                >
                                  <Pin className="h-3.5 w-3.5" />
                                </button>
                              )}
                              {/* Delete Button */}
                              {isModerator && (
                                <button 
                                  onClick={() => {
                                    if(confirm('Are you sure you want to delete this club post?')) {
                                      deleteCampusPost(post.id);
                                    }
                                  }}
                                  className="p-1 bg-slate-50 dark:bg-slate-900 border border-red-150 dark:border-red-950 rounded-lg text-slate-400 hover:text-red-500 cursor-pointer"
                                  title="Delete Post"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                          
                          <p 
                            className="text-xs text-slate-655 dark:text-slate-350 leading-relaxed font-sans font-medium whitespace-pre-wrap cursor-pointer"
                            onClick={() => navigate(`/campus-connect/post/${post.id}`)}
                          >
                            {post.content}
                          </p>

                          <div className="border-t border-slate-100 dark:border-slate-850 pt-3 flex justify-between items-center text-[11px] font-bold text-slate-450">
                            <div className="flex items-center gap-4">
                              <button onClick={() => likeCampusPost(post.id)} className={`flex items-center gap-1 cursor-pointer hover:text-indigo-500 ${post.hasLiked ? 'text-primary dark:text-indigo-400' : ''}`}>
                                <ThumbsUp className="h-4.5 w-4.5" />
                                <span>{post.likes}</span>
                              </button>
                              <button onClick={() => navigate(`/campus-connect/post/${post.id}`)} className="flex items-center gap-1 cursor-pointer hover:text-slate-600">
                                <MessageCircle className="h-4.5 w-4.5" />
                                <span>{post.comments.length}</span>
                              </button>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    );
                  })
                )}
              </div>
            </>
          ) : (
            /* Event Discussions and Teammate search matching */
            <div className="space-y-6">
              {!selectedEventDiscussionId ? (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-450 uppercase tracking-widest pl-1">Join Event Teammate Search & Discussions</h3>
                  {clubEvents.length === 0 ? (
                    <div className="text-center p-8 text-xs text-slate-450 font-medium">
                      No approved events found for {targetClub.name}.
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      {clubEvents.map(evt => (
                        <Card key={evt.id} hoverable={true} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322]">
                          <CardBody className="p-5 flex justify-between items-center flex-wrap gap-4">
                            <div className="space-y-1">
                              <h4 className="text-xs font-bold text-slate-900 dark:text-white">{evt.title}</h4>
                              <p className="text-[10px] text-slate-400 font-semibold">{evt.date} • {evt.venue}</p>
                              <p className="text-[9px] text-indigo-500 font-bold">{(eventDiscussions[evt.id] || []).length} active teammate messages</p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="font-bold flex items-center gap-1 border-indigo-200 text-indigo-500 dark:border-slate-800 dark:text-slate-350 cursor-pointer"
                              onClick={() => setSelectedEventDiscussionId(evt.id)}
                            >
                              Open Board <ChevronRight className="h-4 w-4" />
                            </Button>
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Threaded Event Discussion board */
                <div className="space-y-6">
                  {/* Back to Events list */}
                  <button 
                    onClick={() => setSelectedEventDiscussionId(null)}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-primary cursor-pointer transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back to Events List
                  </button>

                  {/* Target Event Info */}
                  {(() => {
                    const evt = clubEvents.find(e => e.id === selectedEventDiscussionId);
                    if (!evt) return null;
                    const discussionMessages = eventDiscussions[evt.id] || [];

                    return (
                      <div className="space-y-4">
                        <Card hoverable={false} className="border border-indigo-150 bg-indigo-50/10 dark:border-indigo-900/30 dark:bg-indigo-950/10">
                          <CardBody className="p-5">
                            <h3 className="text-xs font-bold text-indigo-750 dark:text-indigo-400 uppercase tracking-widest mb-1.5">Active Teammate Hunt</h3>
                            <h2 className="text-sm font-bold text-slate-950 dark:text-white leading-snug">{evt.title}</h2>
                            <p className="text-[10px] text-slate-400 mt-1">{evt.date} • {evt.venue}</p>
                          </CardBody>
                        </Card>

                        {/* Input form */}
                        <Card hoverable={false} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322]">
                          <CardBody className="p-4">
                            <form 
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleAddEventDiscussion(evt.id);
                              }} 
                              className="flex gap-3"
                            >
                              <input 
                                type="text" 
                                placeholder="I need a teammate... / Can I join a group?..." 
                                value={eventDiscussionText}
                                onChange={(e) => setEventDiscussionText(e.target.value)}
                                className="bg-slate-50 dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-850 dark:text-slate-200 outline-none w-full"
                              />
                              <Button 
                                type="submit" 
                                variant="primary" 
                                size="sm" 
                                className="px-4 font-bold flex items-center justify-center cursor-pointer"
                              >
                                Send
                              </Button>
                            </form>
                          </CardBody>
                        </Card>

                        {/* Messages Thread */}
                        <div className="space-y-3.5">
                          {discussionMessages.length === 0 ? (
                            <div className="text-center p-6 text-xs text-slate-400 font-medium">
                              No teammate posts yet. Write a message above to find team members!
                            </div>
                          ) : (
                            discussionMessages.map(msg => (
                              <Card key={msg.id} hoverable={false} className="border border-slate-100 dark:border-slate-850 bg-[#0E1322]/10 dark:bg-[#0E1322]/20">
                                <CardBody className="p-4 space-y-2">
                                  <div className="flex items-center gap-2.5">
                                    <img src={msg.avatar} alt={msg.author} className="h-7 w-7 rounded-lg object-cover" />
                                    <div>
                                      <h5 className="text-[11px] font-bold text-slate-900 dark:text-white">{msg.author}</h5>
                                      <p className="text-[8px] text-slate-400 font-semibold">{msg.time}</p>
                                    </div>
                                  </div>
                                  <p className="text-xs text-slate-655 dark:text-slate-350 leading-relaxed font-sans font-medium whitespace-pre-wrap pl-9">
                                    {msg.text}
                                  </p>
                                </CardBody>
                              </Card>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right side widgets (Events summary, pin summary) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* About Club */}
          <Card hoverable={false} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322]">
            <CardBody className="p-5 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">About Club</h4>
              <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">{targetClub.description}</p>
            </CardBody>
          </Card>

          {/* Club Events widget */}
          <Card hoverable={false} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322]">
            <CardBody className="p-5 space-y-4">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-indigo-500" /> Club Events
              </h4>
              <div className="space-y-3.5">
                {clubEvents.length === 0 ? (
                  <p className="text-[10px] text-slate-400 font-semibold">No upcoming events scheduled.</p>
                ) : (
                  clubEvents.map(evt => (
                    <div key={evt.id} className="space-y-0.5">
                      <h5 className="text-xs font-bold text-slate-850 dark:text-slate-200 line-clamp-1">{evt.title}</h5>
                      <p className="text-[9px] text-slate-400 font-semibold">{evt.date} • {evt.venue.split('&')[0]}</p>
                    </div>
                  ))
                )}
              </div>
            </CardBody>
          </Card>

          {/* Moderate Club details stats for admin/superadmin */}
          {(currentRole === 'admin' || currentRole === 'superadmin') && (
            <Card hoverable={false} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322]">
              <CardBody className="p-5 space-y-4">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-orange-500" /> Moderate Stats
                </h4>
                <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  <div className="flex justify-between">
                    <span>Total Publications</span>
                    <span className="text-slate-800 dark:text-slate-200">{clubPosts.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pinned Announcements</span>
                    <span className="text-slate-800 dark:text-slate-200">{pinnedPosts.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discussion Threads</span>
                    <span className="text-slate-800 dark:text-slate-200">{clubEvents.length}</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

        </div>

      </div>
    </div>
  );
};
