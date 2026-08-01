import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Grid, 
  List, 
  Search, 
  Users, 
  Plus, 
  Award, 
  Check, 
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Shield,
  Edit3,
  Mail,
  Building,
  Calendar,
  Filter,
  Eye
} from 'lucide-react';
import { Card, CardHeader, CardBody, CardFooter, Button, Badge, useApp, Club } from '../../common';
import { ClubFormModal } from '../components/ClubFormModal';

export const ClubModule: React.FC = () => {
  const { clubs, joinClub, events, currentRole } = useApp();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  
  // View states
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('Active');
  
  // Selection for detail page
  const [selectedClubId, setSelectedClubId] = useState<string | null>(null);

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [clubToEdit, setClubToEdit] = useState<Club | null>(null);

  // Categories list
  const categories = ['All', 'Technical', 'Engineering', 'Arts & Humanities', 'Business', 'Creative Arts', 'Sports', 'Media'];
  const statuses = ['Active', 'Inactive', 'Archived', 'All'];

  // Filter clubs
  const isMyClubs = pathname === '/my-clubs';

  const filteredClubs = clubs.filter(club => {
    const matchesSearch = 
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      club.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (club.code && club.code.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' ? true : club.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' ? true : club.status === selectedStatus;
    const matchesJoined = isMyClubs ? club.isJoined : true;

    // Filter out Archived & Private clubs for normal students unless strictly searching
    const isPublicActive = currentRole === 'student' ? (club.status === 'Active' && club.visibility !== 'Private') : true;

    return matchesSearch && matchesCategory && (isMyClubs ? true : matchesStatus) && (isMyClubs ? matchesJoined : isPublicActive);
  });

  // Get active selected club
  const activeClub = clubs.find(c => c.id === selectedClubId);

  // Get events related to active club
  const clubEvents = events.filter(e => e.clubId === selectedClubId && e.status === 'Approved');

  const canEditClub = (club: Club) => {
    if (currentRole === 'admin' || currentRole === 'superadmin') return true;
    if (currentRole === 'faculty') return true;
    if (currentRole === 'president') return true;
    return false;
  };

  const handleOpenEdit = (club: Club) => {
    setClubToEdit(club);
    setIsEditModalOpen(true);
  };

  if (activeClub) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Back navigation & top actions */}
        <div className="flex justify-between items-center">
          <button 
            onClick={() => setSelectedClubId(null)}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white cursor-pointer transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Clubs Listing
          </button>

          {canEditClub(activeClub) && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleOpenEdit(activeClub)}
              className="flex items-center gap-1.5 text-xs font-bold"
            >
              <Edit3 className="h-3.5 w-3.5" /> Edit Club Details
            </Button>
          )}
        </div>

        {/* Club Details banner header */}
        <div className="rounded-3xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#0E1322] shadow-sm overflow-hidden">
          {/* Header Banner */}
          <div 
            className="h-48 md:h-64 bg-cover bg-center relative flex items-end p-6 md:p-8"
            style={{ 
              backgroundImage: activeClub.banner 
                ? `url(${activeClub.banner})` 
                : 'linear-gradient(to right, #4f46e5, #6366f1, #4338ca)' 
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end gap-5 w-full justify-between">
              <div className="flex items-end gap-4">
                <img 
                  src={activeClub.logo} 
                  alt={activeClub.name} 
                  className="h-20 w-20 md:h-24 md:w-24 rounded-2xl object-cover border-4 border-white dark:border-[#0E1322] shadow-xl flex-shrink-0 bg-white"
                />
                <div className="text-white space-y-1.5 md:mb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="accent" className="bg-white/20 border-transparent text-white py-0.5 px-2 text-[10px]">{activeClub.category}</Badge>
                    <Badge variant={activeClub.status === 'Active' ? 'secondary' : 'accent'} className="py-0.5 px-2 text-[10px]">
                      {activeClub.status || 'Active'}
                    </Badge>
                    <Badge variant="neutral" className="bg-black/30 text-white border-transparent py-0.5 px-2 text-[10px]">
                      {activeClub.visibility || 'Public'}
                    </Badge>
                  </div>
                  <h1 className="text-xl md:text-3xl font-bold font-display leading-tight">{activeClub.name}</h1>
                  <p className="text-xs text-indigo-100 font-medium flex items-center gap-2">
                    <span>Coordinator: {activeClub.facultyCoordinator}</span>
                    {activeClub.department && <span>• {activeClub.department}</span>}
                  </p>
                </div>
              </div>

              {/* Quick join action */}
              <div className="hidden md:block">
                <Button 
                  variant={activeClub.isJoined ? 'outline' : 'primary'} 
                  size="md"
                  className={`font-bold px-6 ${activeClub.isJoined ? 'bg-white/10 text-white border-white/30 hover:bg-white/20' : 'shadow-lg shadow-indigo-500/30'}`}
                  onClick={() => joinClub(activeClub.id)}
                >
                  {activeClub.isJoined ? 'Joined (Leave Club)' : 'Join Club Now'}
                </Button>
              </div>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Content column */}
            <div className="lg:col-span-8 space-y-8">
              {/* About description */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                  <Building className="h-4 w-4 text-indigo-500" /> About the Organization
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{activeClub.description}</p>
              </div>

              {/* Objectives */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" /> Key Objectives & Mission
                </h3>
                {activeClub.objectives && activeClub.objectives.length > 0 ? (
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeClub.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
                        <Check className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-[11px] text-slate-700 dark:text-slate-300 leading-normal">{obj}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400 italic">No specific objectives listed yet.</p>
                )}
              </div>

              {/* Club Gallery */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white">Club Media Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <img src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop&q=80" alt="Gallery" className="rounded-xl h-28 w-full object-cover border border-slate-100 dark:border-slate-800 shadow-sm" />
                  <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop&q=80" alt="Gallery" className="rounded-xl h-28 w-full object-cover border border-slate-100 dark:border-slate-800 shadow-sm" />
                  <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop&q=80" alt="Gallery" className="rounded-xl h-28 w-full object-cover border border-slate-100 dark:border-slate-800 shadow-sm" />
                </div>
              </div>

              {/* Achievements */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="h-4 w-4 text-amber-500" /> Recent Achievements
                </h3>
                <div className="space-y-2.5">
                  {activeClub.achievements && activeClub.achievements.length > 0 ? (
                    activeClub.achievements.map((ach, i) => (
                      <div key={i} className="flex items-center gap-3 p-3.5 border border-amber-100 dark:border-amber-900/30 bg-amber-50/20 dark:bg-amber-950/10 rounded-xl">
                        <Award className="h-5 w-5 text-amber-500 flex-shrink-0" />
                        <div>
                          <h4 className="text-xs font-bold text-slate-850 dark:text-slate-100">{ach.title}</h4>
                          <p className="text-[10px] text-slate-400">{ach.description}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-3 p-3.5 border border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/10 rounded-xl">
                      <Award className="h-5 w-5 text-amber-500 flex-shrink-0" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-850 dark:text-slate-100">National Hackathon Winner</h4>
                        <p className="text-[10px] text-slate-400">Team led by Alex Mercer bagged 1st place in smart campus category.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right side widgets column */}
            <div className="lg:col-span-4 space-y-6">
              {/* Join Action widget */}
              <Card hoverable={false}>
                <CardBody className="space-y-4">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                    <span>Enrolled Members</span>
                    <span className="text-slate-800 dark:text-slate-200 text-sm font-display">{activeClub.membersCount} Active</span>
                  </div>

                  {activeClub.contactEmail && (
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
                      <Mail className="h-3.5 w-3.5 text-indigo-500" />
                      <span className="truncate">{activeClub.contactEmail}</span>
                    </div>
                  )}

                  <Button 
                    variant={activeClub.isJoined ? 'outline' : 'primary'} 
                    className="w-full font-bold text-xs py-2.5"
                    onClick={() => joinClub(activeClub.id)}
                  >
                    {activeClub.isJoined ? 'Joined (Leave Club)' : 'Join Club Now'}
                  </Button>
                </CardBody>
              </Card>

              {/* Executive Team roster */}
              <Card hoverable={false}>
                <CardHeader><h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Executive Leadership</h4></CardHeader>
                <CardBody className="space-y-3.5">
                  <div className="flex items-center gap-3">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&q=80" alt="President" className="h-8 w-8 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{activeClub.president}</div>
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">Club President</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&q=80" alt="Faculty Coordinator" className="h-8 w-8 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{activeClub.facultyCoordinator}</div>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Faculty Coordinator</span>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Upcoming Club specific events */}
              <Card hoverable={false}>
                <CardHeader><h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Scheduled Events</h4></CardHeader>
                <CardBody className="space-y-3.5">
                  {clubEvents.length === 0 ? (
                    <div className="text-center text-[10px] text-slate-400 py-3">No scheduled upcoming events.</div>
                  ) : (
                    clubEvents.map(evt => (
                      <div key={evt.id} className="flex justify-between items-center text-xs p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer" onClick={() => navigate('/events')}>
                        <div>
                          <h5 className="font-bold text-slate-800 dark:text-slate-100">{evt.title}</h5>
                          <span className="text-[9px] text-slate-400">{evt.date} • {evt.venue}</span>
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

        {/* Modal for editing active club */}
        <ClubFormModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          clubToEdit={clubToEdit}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">
            {isMyClubs ? 'My Enrolled Clubs' : 'Discover Campus Clubs'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isMyClubs 
              ? 'View and access campus organizations you are currently enrolled in.' 
              : 'Discover, explore, and join technical, cultural, business, and athletic student societies.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Create Club shortcut for faculty/admin */}
          {(currentRole === 'admin' || currentRole === 'superadmin' || currentRole === 'faculty') && (
            <Button variant="primary" size="sm" onClick={() => { setClubToEdit(null); setIsEditModalOpen(true); }} className="flex items-center gap-1.5 font-bold">
              <Plus className="h-4 w-4" /> Create Club
            </Button>
          )}

          <div className="flex gap-1.5 border border-slate-200 dark:border-slate-800 p-1 rounded-xl bg-white dark:bg-slate-900">
            <button className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300' : 'text-slate-400'}`} onClick={() => setViewMode('grid')}>
              <Grid className="h-4 w-4" />
            </button>
            <button className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300' : 'text-slate-400'}`} onClick={() => setViewMode('list')}>
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category filters scrollbar */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none py-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer border transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-[#0E1322] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#0E1322] shadow-sm">
        {/* Search */}
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 max-w-md w-full">
          <Search className="h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by keyword, code, name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-xs text-slate-850 dark:text-slate-200 placeholder-slate-400"
          />
        </div>

        {/* Status filter dropdown */}
        {!isMyClubs && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Status:</span>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 outline-none"
            >
              {statuses.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Clubs rendering grid/list */}
      {filteredClubs.length === 0 ? (
        <Card className="p-8 text-center border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322]/40 rounded-2xl">
          <CardBody className="flex flex-col items-center justify-center space-y-4 py-8">
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl text-slate-400 dark:text-slate-500">
              <Users className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">No Clubs Found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                {isMyClubs 
                  ? "You haven't joined any clubs yet. Go to Explore Clubs to join some!"
                  : "We couldn't find any clubs matching your criteria. Try adjusting your filters or search terms."}
              </p>
            </div>
            {isMyClubs && (
              <Button 
                variant="primary" 
                size="sm" 
                className="mt-2 font-bold"
                onClick={() => navigate('/clubs')}
              >
                Explore Clubs
              </Button>
            )}
          </CardBody>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.map(club => (
            <Card key={club.id} hoverable={true} className="flex flex-col h-full border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322]">
              <CardBody className="space-y-4 flex-grow">
                <div className="flex justify-between items-start gap-4">
                  <img src={club.logo} alt={club.name} className="h-12 w-12 rounded-xl object-cover border border-slate-100 dark:border-slate-800 shadow-sm" />
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="primary" className="py-0.5 px-2 text-[10px]">{club.category}</Badge>
                    {club.status && club.status !== 'Active' && (
                      <Badge variant={club.status === 'Inactive' ? 'accent' : 'neutral'} className="py-0 px-1.5 text-[9px]">
                        {club.status}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-bold font-display text-slate-900 dark:text-white flex items-center gap-1.5">
                    {club.name}
                    {club.code && <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">{club.code}</span>}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold">{club.membersCount || 0} active members</p>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal line-clamp-3">
                  {club.description}
                </p>
              </CardBody>
              <CardFooter className="flex gap-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/20">
                <Button variant="outline" size="sm" className="w-full text-xs font-bold" onClick={() => setSelectedClubId(club.id)}>
                  View Details
                </Button>
                <Button 
                  variant={club.isJoined ? 'outline' : 'primary'} 
                  size="sm" 
                  className="w-full text-xs font-bold"
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
            <Card key={club.id} hoverable={true} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322]">
              <CardBody className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <img src={club.logo} alt={club.name} className="h-12 w-12 rounded-xl object-cover border border-slate-100 dark:border-slate-800 shadow-sm" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold font-display text-slate-900 dark:text-white">{club.name}</h3>
                      <Badge variant="primary" className="py-0 px-1.5 text-[9px]">{club.category}</Badge>
                      {club.status && club.status !== 'Active' && (
                        <Badge variant="accent" className="py-0 px-1.5 text-[9px]">{club.status}</Badge>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                      {club.membersCount || 0} members • Coordinator: {club.facultyCoordinator}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button variant="outline" size="sm" className="text-xs font-bold w-full sm:w-auto" onClick={() => setSelectedClubId(club.id)}>
                    Details
                  </Button>
                  <Button 
                    variant={club.isJoined ? 'outline' : 'primary'} 
                    size="sm" 
                    className="text-xs font-bold w-full sm:w-auto"
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

      {/* Form modal for creating/editing */}
      <ClubFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        clubToEdit={clubToEdit}
      />
    </div>
  );
};
