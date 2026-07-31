import React, { useState } from 'react';
import { 
  Grid, 
  List, 
  Search, 
  User, 
  Users, 
  Calendar, 
  Plus, 
  Award, 
  Check, 
  ArrowLeft,
  ChevronRight,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { Card, CardHeader, CardBody, CardFooter, Button, Badge, useApp, Club } from '../../common';

export const ClubModule: React.FC = () => {
  const { clubs, joinClub, events, announcements } = useApp();
  
  // States
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Selection for detail page
  const [selectedClubId, setSelectedClubId] = useState<string | null>(null);

  // Categories list
  const categories = ['All', 'Technical', 'Engineering', 'Arts & Humanities', 'Business', 'Creative Arts'];

  // Filter clubs
  const filteredClubs = clubs.filter(club => {
    const matchesSearch = 
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      club.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' ? true : club.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get active selected club
  const activeClub = clubs.find(c => c.id === selectedClubId);

  // Get events related to active club
  const clubEvents = events.filter(e => e.clubId === selectedClubId && e.status === 'Approved');

  if (activeClub) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Back navigation */}
        <button 
          onClick={() => setSelectedClubId(null)}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white cursor-pointer transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Clubs Listing
        </button>

        {/* Club Details banner header */}
        <div className="rounded-3xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#0E1322] shadow-sm overflow-hidden">
          {/* Header Banner */}
          <div className="h-44 md:h-56 bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 relative flex items-end p-6">
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end gap-5">
              <img 
                src={activeClub.logo} 
                alt={activeClub.name} 
                className="h-20 w-20 md:h-24 md:w-24 rounded-2xl object-cover border-4 border-white dark:border-[#0E1322] shadow-md flex-shrink-0"
              />
              <div className="text-white space-y-1.5 md:mb-2">
                <Badge variant="accent" className="bg-white/20 border-transparent text-white py-0.5 px-2">{activeClub.category}</Badge>
                <h1 className="text-xl md:text-2xl font-bold font-display leading-tight">{activeClub.name}</h1>
                <p className="text-[11px] text-indigo-100 font-medium">Faculty Coordinator: {activeClub.facultyCoordinator}</p>
              </div>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Content column */}
            <div className="lg:col-span-8 space-y-8">
              {/* About description */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white">Club Description</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{activeClub.description}</p>
              </div>

              {/* Objectives */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white">Key Objectives</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <li className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-50 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/10">
                    <Check className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-[11px] text-slate-650 dark:text-slate-400">Conduct regular technical bootcamps and workshops on modern toolsets.</span>
                  </li>
                  <li className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-50 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/10">
                    <Check className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-[11px] text-slate-650 dark:text-slate-400">Promote student collaboration and prepare groups for national competitions.</span>
                  </li>
                </ul>
              </div>

              {/* Club Gallery */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white">Club Media Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <img src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop&q=80" alt="Gallery" className="rounded-xl h-24 w-full object-cover border border-slate-100 dark:border-slate-800" />
                  <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop&q=80" alt="Gallery" className="rounded-xl h-24 w-full object-cover border border-slate-100 dark:border-slate-800" />
                  <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop&q=80" alt="Gallery" className="rounded-xl h-24 w-full object-cover border border-slate-100 dark:border-slate-800" />
                </div>
              </div>

              {/* Achievements */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white">Recent Achievements</h3>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 p-3.5 border border-slate-50 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/10 rounded-xl">
                    <Award className="h-5 w-5 text-amber-500" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-850 dark:text-slate-100">National Hackathon Winner</h4>
                      <p className="text-[10px] text-slate-400">Team led by Alex Mercer bagged 1st place in smart campus category.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side widgets column */}
            <div className="lg:col-span-4 space-y-6">
              {/* Join Action widget */}
              <Card hoverable={false}>
                <CardBody className="space-y-4">
                  <div className="flex justify-between text-xs font-bold text-slate-500">
                    <span>Members Count</span>
                    <span className="text-slate-800 dark:text-slate-200">{activeClub.membersCount} Active</span>
                  </div>
                  <Button 
                    variant={activeClub.isJoined ? 'outline' : 'primary'} 
                    className="w-full font-bold"
                    onClick={() => joinClub(activeClub.id)}
                  >
                    {activeClub.isJoined ? 'Joined (Leave Club)' : 'Join Club now'}
                  </Button>
                </CardBody>
              </Card>

              {/* Executive Team roster */}
              <Card hoverable={false}>
                <CardHeader><h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Executive Council</h4></CardHeader>
                <CardBody className="space-y-3.5">
                  <div className="flex items-center gap-3">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&q=80" alt="President" className="h-7 w-7 rounded-full object-cover" />
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{activeClub.president}</div>
                      <span className="text-[9px] text-slate-400 font-semibold">President</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop&q=80" alt="VP" className="h-7 w-7 rounded-full object-cover" />
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Rohit Sen (Year IV)</div>
                      <span className="text-[9px] text-slate-400 font-semibold">Vice President</span>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Upcoming Club specific events */}
              <Card hoverable={false}>
                <CardHeader><h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Club Events</h4></CardHeader>
                <CardBody className="space-y-3.5">
                  {clubEvents.length === 0 ? (
                    <div className="text-center text-[10px] text-slate-400">No scheduled upcoming events.</div>
                  ) : (
                    clubEvents.map(evt => (
                      <div key={evt.id} className="flex justify-between items-center text-xs">
                        <div>
                          <h5 className="font-bold text-slate-800 dark:text-slate-100">{evt.title}</h5>
                          <span className="text-[9px] text-slate-400">{evt.date}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      </div>
                    ))
                  )}
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
      {/* Header controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Discover Campus Clubs</h1>
          <p className="text-xs text-slate-400 mt-1">Discover, read, and join diverse technical and cultural organizations.</p>
        </div>
        <div className="flex gap-2.5">
          <Button variant="outline" className={`p-2.5 !rounded-xl ${viewMode === 'grid' ? 'bg-indigo-50 border-primary text-primary dark:bg-indigo-950/20' : 'text-slate-500'}`} onClick={() => setViewMode('grid')}>
            <Grid className="h-4 w-4" />
          </Button>
          <Button variant="outline" className={`p-2.5 !rounded-xl ${viewMode === 'list' ? 'bg-indigo-50 border-primary text-primary dark:bg-indigo-950/20' : 'text-slate-500'}`} onClick={() => setViewMode('list')}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none py-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer border transition-colors ${
              selectedCategory === cat
                ? 'bg-primary border-primary text-white'
                : 'bg-white dark:bg-[#0E1322] border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-200 dark:hover:border-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search Input bar */}
      <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 max-w-md">
        <Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />
        <input 
          type="text" 
          placeholder="Filter by keyword..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent border-none outline-none w-full text-xs text-slate-850 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
        />
      </div>

      {/* Clubs rendering grid/list */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.map(club => (
            <Card key={club.id} hoverable={true} className="flex flex-col h-full">
              <CardBody className="space-y-4 flex-grow">
                <div className="flex justify-between items-start gap-4">
                  <img src={club.logo} alt={club.name} className="h-12 w-12 rounded-xl object-cover border border-slate-50 dark:border-slate-800" />
                  <Badge variant="primary" className="py-0.5 px-2">{club.category}</Badge>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-bold font-display text-slate-900 dark:text-white">{club.name}</h3>
                  <p className="text-[10px] text-slate-400 font-semibold">{club.membersCount} active members</p>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal line-clamp-3">
                  {club.description}
                </p>
              </CardBody>
              <CardFooter className="flex gap-2">
                <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => setSelectedClubId(club.id)}>
                  View Details
                </Button>
                <Button 
                  variant={club.isJoined ? 'outline' : 'primary'} 
                  size="sm" 
                  className="w-full text-xs"
                  onClick={() => joinClub(club.id)}
                >
                  {club.isJoined ? 'Joined' : 'Join'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredClubs.map(club => (
            <Card key={club.id} hoverable={true}>
              <CardBody className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <img src={club.logo} alt={club.name} className="h-12 w-12 rounded-xl object-cover border border-slate-50 dark:border-slate-800" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold font-display text-slate-900 dark:text-white">{club.name}</h3>
                      <Badge variant="primary" className="py-0 px-1.5 text-[9px]">{club.category}</Badge>
                    </div>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{club.membersCount} members • Coordinator: {club.facultyCoordinator}</p>
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button variant="outline" size="sm" className="text-xs w-full sm:w-auto" onClick={() => setSelectedClubId(club.id)}>
                    Details
                  </Button>
                  <Button 
                    variant={club.isJoined ? 'outline' : 'primary'} 
                    size="sm" 
                    className="text-xs w-full sm:w-auto"
                    onClick={() => joinClub(club.id)}
                  >
                    {club.isJoined ? 'Leave' : 'Join'}
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
