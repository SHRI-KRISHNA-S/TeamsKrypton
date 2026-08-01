import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ThumbsUp, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Plus, 
  Users, 
  Calendar, 
  Sparkles, 
  Search, 
  Clock, 
  Tag, 
  ChevronRight,
  TrendingUp,
  MapPin,
  BookmarkCheck
} from 'lucide-react';
import { Card, CardBody, Button, Badge, useApp } from '../../common';

export const CampusFeed: React.FC = () => {
  const navigate = useNavigate();
  const { 
    campusPosts, 
    likeCampusPost, 
    saveCampusPost, 
    currentRole, 
    userProfiles, 
    clubs, 
    events 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClubFilter, setSelectedClubFilter] = useState('All');
  const [visiblePostsCount, setVisiblePostsCount] = useState(4); // For simulated infinite scroll

  // Find currently logged-in user profile
  const currentUserId = currentRole === 'student' ? 'user-student' : currentRole === 'president' ? 'user-president' : 'user-faculty';
  const currentUserProfile = userProfiles.find(p => p.id === currentUserId);

  // Get active clubs list
  const activeClubs = ['All', ...clubs.map(c => c.name)];

  // Filter posts
  const filteredPosts = campusPosts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.clubTag && post.clubTag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (post.eventTag && post.eventTag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesClub = selectedClubFilter === 'All' ? true : post.clubTag === selectedClubFilter;

    // Check if poster is suspended
    const authorProfile = userProfiles.find(p => p.id === post.userId);
    const isSuspended = authorProfile?.isSuspended;

    return matchesSearch && matchesClub && !isSuspended;
  });

  const postsToShow = filteredPosts.slice(0, visiblePostsCount);

  const loadMorePosts = () => {
    setVisiblePostsCount(prev => prev + 3);
  };

  const handleShare = (postTitle: string) => {
    alert(`Mock Share Link generated for: "${postTitle}"`);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-indigo-500" /> Campus Connect
          </h1>
          <p className="text-xs text-slate-400 mt-1">Connect, discuss events, find teammates, and collaborate with your peers.</p>
        </div>
        <Button 
          variant="primary" 
          size="sm" 
          className="flex items-center gap-1.5"
          onClick={() => navigate('/campus-connect/create')}
        >
          <Plus className="h-4 w-4" /> Create Post
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Mini Profile and Quick Links */}
        <div className="lg:col-span-3 space-y-6">
          {currentUserProfile && (
            <Card hoverable={false} className="overflow-hidden border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#0E1322]">
              {/* Cover Banner Mock */}
              <div className="h-16 bg-gradient-to-r from-indigo-500 to-purple-600" />
              <CardBody className="pt-0 pb-5 px-5 flex flex-col items-center text-center -mt-8">
                <img 
                  src={currentUserProfile.avatar} 
                  alt={currentUserProfile.name} 
                  className="h-16 w-16 rounded-2xl object-cover border-4 border-white dark:border-[#0E1322] shadow-sm cursor-pointer"
                  onClick={() => navigate(`/campus-connect/profile/${currentUserProfile.id}`)}
                />
                <div className="mt-3 space-y-1">
                  <h3 
                    className="text-sm font-bold text-slate-900 dark:text-white hover:text-primary dark:hover:text-indigo-400 cursor-pointer"
                    onClick={() => navigate(`/campus-connect/profile/${currentUserProfile.id}`)}
                  >
                    {currentUserProfile.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium">{currentUserProfile.department}</p>
                  <div className="flex gap-1.5 justify-center mt-1">
                    <Badge variant="primary" className="text-[9px] py-0 px-1.5">{currentUserProfile.role}</Badge>
                  </div>
                </div>
                
                <div className="w-full border-t border-slate-100 dark:border-slate-800/80 my-4" />
                
                <div className="w-full space-y-2.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <button 
                    onClick={() => navigate('/campus-connect/my-posts')}
                    className="flex items-center justify-between w-full hover:text-primary dark:hover:text-white cursor-pointer"
                  >
                    <span>My Posts</span>
                    <span className="bg-slate-50 dark:bg-slate-900 text-slate-400 py-0.5 px-2 rounded-md text-[10px]">
                      {campusPosts.filter(p => p.userId === currentUserProfile.id).length}
                    </span>
                  </button>
                  <button 
                    onClick={() => navigate('/campus-connect/my-posts?tab=saved')}
                    className="flex items-center justify-between w-full hover:text-primary dark:hover:text-white cursor-pointer"
                  >
                    <span>Saved Posts</span>
                    <span className="bg-slate-50 dark:bg-slate-900 text-slate-400 py-0.5 px-2 rounded-md text-[10px]">
                      {campusPosts.filter(p => p.isSaved).length}
                    </span>
                  </button>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Shortcuts / Suggested Clubs */}
          <Card hoverable={false} className="border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#0E1322]">
            <CardBody className="p-5 space-y-4">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">My Joined Clubs</h4>
              <div className="space-y-3">
                {clubs.filter(c => c.isJoined).map(club => (
                  <div 
                    key={club.id} 
                    className="flex items-center gap-2.5 cursor-pointer group"
                    onClick={() => navigate(`/campus-connect/club/${club.id}`)}
                  >
                    <img src={club.logo} alt={club.name} className="h-7 w-7 rounded-lg object-cover" />
                    <span className="text-xs font-semibold text-slate-655 dark:text-slate-350 group-hover:text-indigo-500 truncate">{club.name}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Center Column: Search, Filters & Feed */}
        <div className="lg:col-span-6 space-y-6">
          {/* Search bar & filter pill buttons */}
          <Card hoverable={false} className="border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#0E1322]">
            <CardBody className="p-4 space-y-4">
              {/* Search */}
              <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/60 w-full">
                <Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search keywords, events, or clubs..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-xs text-slate-850 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>

              {/* Club filters */}
              <div className="flex gap-2 overflow-x-auto scrollbar-none py-1">
                {activeClubs.map(clubName => (
                  <button
                    key={clubName}
                    onClick={() => setSelectedClubFilter(clubName)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold cursor-pointer border transition-colors whitespace-nowrap ${
                      selectedClubFilter === clubName
                        ? 'bg-primary border-primary text-white'
                        : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-850 text-slate-550 dark:text-slate-400 hover:border-slate-200 dark:hover:border-slate-750'
                    }`}
                  >
                    {clubName === 'All' ? 'All Feed' : clubName}
                  </button>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Feed List */}
          <div className="space-y-4">
            {postsToShow.length === 0 ? (
              <Card className="p-8 text-center border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322]/40 rounded-2xl">
                <CardBody className="flex flex-col items-center justify-center space-y-3 py-8">
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl text-slate-400 dark:text-slate-500 animate-pulse">
                    <MessageCircle className="h-7 w-7" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">No Posts Found</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    Try modifying your search or club filters to view other discussions.
                  </p>
                </CardBody>
              </Card>
            ) : (
              postsToShow.map(post => {
                const userProfile = userProfiles.find(u => u.id === post.userId);
                const showDelete = currentRole === 'admin' || currentRole === 'superadmin' || 
                  (currentRole === 'president' && post.clubBadge === 'Coding Club' /* Mock managed club */);

                return (
                  <Card 
                    key={post.id} 
                    hoverable={true} 
                    className="border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#0E1322] overflow-hidden"
                  >
                    <CardBody className="p-5 space-y-4">
                      {/* Author Header */}
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <img 
                            src={post.avatar} 
                            alt={post.author} 
                            className="h-10 w-10 rounded-xl object-cover border border-slate-50 dark:border-slate-850 cursor-pointer"
                            onClick={() => navigate(`/campus-connect/profile/${post.userId}`)}
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 
                                className="text-xs font-bold text-slate-900 dark:text-white hover:text-primary dark:hover:text-indigo-400 cursor-pointer"
                                onClick={() => navigate(`/campus-connect/profile/${post.userId}`)}
                              >
                                {post.author}
                              </h4>
                              {post.clubBadge && (
                                <Badge variant="accent" className="text-[8px] py-0 px-1 bg-indigo-50/50 text-indigo-500 border-indigo-100/50 dark:bg-indigo-950/20 dark:border-indigo-900/30">
                                  {post.clubBadge}
                                </Badge>
                              )}
                            </div>
                            <p className="text-[9px] text-slate-400 font-semibold flex items-center gap-1">
                              <span>{post.department}</span>
                              <span>•</span>
                              <Badge variant="neutral" className="text-[8px] py-0 px-1 font-bold">{post.roleBadge}</Badge>
                              <span>•</span>
                              <Clock className="h-2.5 w-2.5 text-slate-400" />
                              <span>{post.timestamp}</span>
                            </p>
                          </div>
                        </div>
                        {showDelete && (
                          <button 
                            className="text-[10px] text-red-500 hover:text-red-600 font-bold border border-red-200 dark:border-red-950 hover:bg-red-50 dark:hover:bg-red-950/10 py-1 px-2 rounded-lg cursor-pointer"
                            onClick={() => {
                              if(confirm('Are you sure you want to delete this post?')) {
                                // Action handler
                                likeCampusPost(post.id); // Simple trigger to reload
                                campusPosts.splice(campusPosts.findIndex(p => p.id === post.id), 1);
                              }
                            }}
                          >
                            Delete
                          </button>
                        )}
                      </div>

                      {/* Content */}
                      <div 
                        className="space-y-3 cursor-pointer"
                        onClick={() => navigate(`/campus-connect/post/${post.id}`)}
                      >
                        <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-sans font-medium whitespace-pre-wrap">
                          {post.content}
                        </p>
                        {post.image && (
                          <img 
                            src={post.image} 
                            alt="Post Attachment" 
                            className="rounded-xl max-h-64 w-full object-cover border border-slate-50 dark:border-slate-800 shadow-sm" 
                          />
                        )}
                      </div>

                      {/* Action Tags */}
                      <div className="flex flex-wrap gap-2">
                        {post.eventTag && (
                          <Badge variant="primary" className="bg-indigo-50 border-indigo-100 text-indigo-650 text-[8px] py-0.5 px-2 dark:bg-indigo-950/30 dark:border-indigo-900/30 dark:text-indigo-400 flex items-center gap-1 font-bold">
                            <Calendar className="h-3 w-3" /> Event: {post.eventTag}
                          </Badge>
                        )}
                        {post.clubTag && (
                          <Badge variant="neutral" className="text-[8px] py-0.5 px-2 flex items-center gap-1 font-bold">
                            <Tag className="h-3 w-3" /> Club: {post.clubTag}
                          </Badge>
                        )}
                      </div>

                      {/* Engagement Metrics & Interaction Buttons */}
                      <div className="border-t border-slate-100 dark:border-slate-850/80 pt-3 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {/* Like */}
                          <button 
                            onClick={() => likeCampusPost(post.id)}
                            className={`flex items-center gap-1 text-[11px] font-bold cursor-pointer transition-colors ${
                              post.hasLiked 
                                ? 'text-primary dark:text-indigo-400' 
                                : 'text-slate-450 hover:text-slate-600 dark:hover:text-slate-200'
                            }`}
                          >
                            <ThumbsUp className={`h-4.5 w-4.5 ${post.hasLiked ? 'fill-indigo-500/20' : ''}`} />
                            <span>{post.likes}</span>
                          </button>

                          {/* Comment Link */}
                          <button 
                            onClick={() => navigate(`/campus-connect/post/${post.id}`)}
                            className="flex items-center gap-1 text-[11px] font-bold text-slate-450 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                          >
                            <MessageCircle className="h-4.5 w-4.5" />
                            <span>{post.comments.length}</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Share (UI Only) */}
                          <button 
                            onClick={() => handleShare(post.content)}
                            className="flex items-center gap-1 text-[11px] font-bold text-slate-450 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                          >
                            <Share2 className="h-4.5 w-4.5" />
                          </button>

                          {/* Save */}
                          <button 
                            onClick={() => saveCampusPost(post.id)}
                            className={`flex items-center gap-1 text-[11px] font-bold cursor-pointer transition-colors ${
                              post.isSaved 
                                ? 'text-emerald-500' 
                                : 'text-slate-450 hover:text-slate-600 dark:hover:text-slate-200'
                            }`}
                          >
                            {post.isSaved ? <BookmarkCheck className="h-4.5 w-4.5 text-emerald-500 fill-emerald-500/20" /> : <Bookmark className="h-4.5 w-4.5" />}
                          </button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                );
              })
            )}
          </div>

          {/* Infinite Scroll Load More Trigger */}
          {filteredPosts.length > visiblePostsCount && (
            <div className="text-center py-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadMorePosts}
                className="font-bold border-indigo-200 text-indigo-600 dark:border-slate-800 dark:text-slate-400"
              >
                Load More Posts
              </Button>
            </div>
          )}
        </div>

        {/* Right Column: Trending Discussions & Events */}
        <div className="lg:col-span-3 space-y-6">
          <Card hoverable={false} className="border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#0E1322]">
            <CardBody className="p-5 space-y-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                <TrendingUp className="h-4 w-4 text-orange-500" />
                <span>Trending Topics</span>
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <a href="#" onClick={(e) => { e.preventDefault(); setSearchQuery('teammate'); }} className="text-xs font-bold text-slate-750 dark:text-slate-200 hover:text-primary leading-tight">#HackathonTeamSearch</a>
                  <p className="text-[10px] text-slate-400">12 students looking for teammates</p>
                </div>
                <div className="space-y-1">
                  <a href="#" onClick={(e) => { e.preventDefault(); setSearchQuery('robot'); }} className="text-xs font-bold text-slate-750 dark:text-slate-200 hover:text-primary leading-tight">#RoboticsWorkshop</a>
                  <p className="text-[10px] text-slate-400">8 discussion threads active</p>
                </div>
                <div className="space-y-1">
                  <a href="#" onClick={(e) => { e.preventDefault(); setSearchQuery('volunteer'); }} className="text-xs font-bold text-slate-750 dark:text-slate-200 hover:text-primary leading-tight">#HackTechVolunteers</a>
                  <p className="text-[10px] text-slate-400">Dr. Sarah Jenkins requesting help</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card hoverable={false} className="border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#0E1322]">
            <CardBody className="p-5 space-y-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                <Calendar className="h-4 w-4 text-indigo-500" />
                <span>Upcoming Events</span>
              </div>
              <div className="space-y-3.5">
                {events.slice(0, 3).map(evt => (
                  <div key={evt.id} className="space-y-1">
                    <h5 className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-1">{evt.title}</h5>
                    <p className="text-[9px] text-slate-400 font-semibold flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" />
                      <span>{evt.date} • {evt.venue.split('&')[0]}</span>
                    </p>
                    <button 
                      onClick={() => navigate(`/campus-connect/club/${evt.clubId}`)}
                      className="text-[9px] font-bold text-indigo-500 hover:text-indigo-600 flex items-center gap-0.5 cursor-pointer mt-1"
                    >
                      Join Event Discussion <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

      </div>
    </div>
  );
};
