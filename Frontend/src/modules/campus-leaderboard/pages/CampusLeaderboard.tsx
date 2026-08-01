import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  Search, 
  Filter, 
  Download, 
  FileSpreadsheet, 
  RefreshCw, 
  Settings, 
  Sparkles, 
  Users, 
  Award, 
  TrendingUp, 
  Sliders, 
  X,
  Plus,
  Minus,
  Check,
  Building
} from 'lucide-react';
import { Card, CardBody, Button, Badge, useApp } from '../../common';
import { getLevelDetails, PointsRule } from '../config/pointsConfig';

export const CampusLeaderboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    userProfiles, 
    currentRole, 
    pointRules, 
    updatePointRules, 
    resetLeaderboard,
    updateApPoints
  } = useApp();

  // Tab State: 'overall' | 'club'
  const [activeTab, setActiveTab] = useState<'overall' | 'club'>('overall');

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedPeriod, setSelectedPeriod] = useState<'Today' | 'This Week' | 'This Month' | 'This Semester' | 'Overall'>('Overall');

  // Club Tab - Coordinator Selector
  const [selectedClubFilter, setSelectedClubFilter] = useState('Coding Club');

  // Modal Controls
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [tempRules, setTempRules] = useState<PointsRule[]>([]);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Active User Profile Lookup
  const activeUserId = currentRole === 'student' ? 'user-student' : currentRole === 'president' ? 'user-president' : 'user-faculty';
  const activeUser = userProfiles.find(u => u.id === activeUserId);
  const userPrimaryClub = activeUser?.joinedClubs?.[0] || 'Coding Club';

  // Student list (excludes Faculty Coordinators)
  const studentsOnly = userProfiles.filter(p => p.role !== 'Faculty Coordinator');

  // Filter students based on current tab
  const getFilteredStudents = () => {
    let list = [...studentsOnly];

    // Enforce Role Access on Club Tab
    if (activeTab === 'club') {
      if (currentRole === 'student' || currentRole === 'president') {
        // Locked to own club
        list = list.filter(p => p.joinedClubs?.includes(userPrimaryClub));
      } else {
        // Faculty/Admin see selected club in dropdown
        list = list.filter(p => p.joinedClubs?.includes(selectedClubFilter));
      }
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.department.toLowerCase().includes(q) || 
        p.club.toLowerCase().includes(q)
      );
    }

    // Dropdown filters
    if (selectedDept !== 'All') {
      list = list.filter(p => p.department === selectedDept);
    }
    if (selectedYear !== 'All') {
      list = list.filter(p => p.academicYear === selectedYear);
    }

    // Sort by AP descending
    return list.sort((a, b) => b.apPoints - a.apPoints);
  };

  const processedRankings = getFilteredStudents();

  // Extract Podium (Top 3)
  const podiumStudents = processedRankings.slice(0, 3);
  const tableStudents = processedRankings.slice(3);

  // Statistics Calculation
  const totalStudents = studentsOnly.length;
  const highestAP = studentsOnly.length > 0 ? Math.max(...studentsOnly.map(s => s.apPoints)) : 0;
  const averageAP = studentsOnly.length > 0 
    ? Math.round(studentsOnly.reduce((acc, s) => acc + s.apPoints, 0) / studentsOnly.length) 
    : 0;

  // Most Active Club Calculation
  const getMostActiveClub = () => {
    const clubApMap: Record<string, number> = {};
    studentsOnly.forEach(student => {
      student.joinedClubs.forEach(c => {
        clubApMap[c] = (clubApMap[c] || 0) + student.apPoints;
      });
    });
    let bestClub = 'None';
    let maxAp = -1;
    Object.entries(clubApMap).forEach(([club, ap]) => {
      if (ap > maxAp) {
        maxAp = ap;
        bestClub = club;
      }
    });
    return bestClub;
  };

  // Most Active Department Calculation
  const getMostActiveDept = () => {
    const deptApMap: Record<string, number> = {};
    studentsOnly.forEach(student => {
      deptApMap[student.department] = (deptApMap[student.department] || 0) + student.apPoints;
    });
    let bestDept = 'None';
    let maxAp = -1;
    Object.entries(deptApMap).forEach(([dept, ap]) => {
      if (ap > maxAp) {
        maxAp = ap;
        bestDept = dept;
      }
    });
    return bestDept;
  };

  const mostActiveClub = getMostActiveClub();
  const mostActiveDept = getMostActiveDept();

  // Export Rankings to CSV simulation
  const handleExportRankings = () => {
    const headers = 'Rank,Name,Department,Year,Club,Activity Points,Level,Recent Achievement\n';
    const rows = processedRankings.map((student, index) => 
      `${index + 1},"${student.name}","${student.department}","${student.academicYear}","${student.joinedClubs.join(' & ')}",${student.apPoints},"${getLevelDetails(student.apPoints).name}","${student.recentAchievement || 'None'}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Campus_Leaderboard_${activeTab}_${selectedPeriod}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Point rules configuration actions
  const openRulesModal = () => {
    setTempRules([...pointRules]);
    setIsRulesModalOpen(true);
  };

  const saveRules = () => {
    updatePointRules(tempRules);
    setIsRulesModalOpen(false);
  };

  const handleRulePointsChange = (key: string, offset: number) => {
    setTempRules(prev => prev.map(r => r.key === key ? { ...r, points: Math.max(0, r.points + offset) } : r));
  };

  return (
    <div className="space-y-6 animate-slide-up pb-10">
      
      {/* Page header and controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold font-display text-slate-905 dark:text-white flex items-center gap-2">
            <Trophy className="h-6 w-6 text-amber-500" /> Campus Leaderboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">Discover top-performing students based on extracurricular contributions.</p>
        </div>

        {/* Administration Actions Bar */}
        <div className="flex flex-wrap gap-2.5">
          {/* Admin and Super Admin tools */}
          {(currentRole === 'admin' || currentRole === 'superadmin') && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                className="font-bold flex items-center gap-1.5 border-slate-200 dark:border-slate-800 text-slate-655 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
                onClick={() => setIsReportOpen(true)}
              >
                <FileSpreadsheet className="h-4 w-4 text-emerald-500" /> Generate Report
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="font-bold flex items-center gap-1.5 border-slate-200 dark:border-slate-800 text-slate-655 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
                onClick={handleExportRankings}
              >
                <Download className="h-4 w-4 text-indigo-500" /> Export CSV
              </Button>
            </>
          )}

          {/* Super Admin specific tools */}
          {currentRole === 'superadmin' && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                className="font-bold flex items-center gap-1.5 border-slate-200 dark:border-slate-800 text-slate-655 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
                onClick={openRulesModal}
              >
                <Settings className="h-4 w-4 text-blue-500" /> Configure AP Rules
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="font-bold flex items-center gap-1.5 border-red-200 dark:border-red-950 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                onClick={() => {
                  if(confirm('WARNING: Are you sure you want to reset all students Activity Points (AP) to 0?')) {
                    resetLeaderboard();
                  }
                }}
              >
                <RefreshCw className="h-4 w-4" /> Reset Leaderboard
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Statistics dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card hoverable={false} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322]">
          <CardBody className="p-4 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Ranked Students</span>
            <span className="text-lg font-extrabold text-slate-850 dark:text-white mt-1">{totalStudents} Students</span>
          </CardBody>
        </Card>
        <Card hoverable={false} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322]">
          <CardBody className="p-4 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Highest AP Score</span>
            <span className="text-lg font-extrabold text-indigo-650 dark:text-indigo-400 mt-1">{highestAP} AP</span>
          </CardBody>
        </Card>
        <Card hoverable={false} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322]">
          <CardBody className="p-4 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Average Student AP</span>
            <span className="text-lg font-extrabold text-slate-850 dark:text-white mt-1">{averageAP} AP</span>
          </CardBody>
        </Card>
        <Card hoverable={false} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322]">
          <CardBody className="p-4 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Most Active Club</span>
            <span className="text-xs font-extrabold text-slate-850 dark:text-white mt-1.5 truncate">{mostActiveClub}</span>
          </CardBody>
        </Card>
        <Card hoverable={false} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322]">
          <CardBody className="p-4 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Most Active Dept</span>
            <span className="text-xs font-extrabold text-slate-850 dark:text-white mt-1.5 truncate">{mostActiveDept}</span>
          </CardBody>
        </Card>
      </div>

      {/* Tabs Selector at the top (Overall vs Within Club) */}
      <div className="flex border-b border-slate-100 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('overall')}
          className={`py-3.5 px-6 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'overall'
              ? 'border-primary text-primary dark:text-indigo-400'
              : 'border-transparent text-slate-450 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          🌍 Overall Leaderboard
        </button>
        <button
          onClick={() => setActiveTab('club')}
          className={`py-3.5 px-6 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'club'
              ? 'border-primary text-primary dark:text-indigo-400'
              : 'border-transparent text-slate-450 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          🏛 Within Club Rankings
        </button>
      </div>

      {/* Club selector above Within Club Leaderboard for Faculty/Admins */}
      {activeTab === 'club' && (currentRole === 'faculty' || currentRole === 'admin' || currentRole === 'superadmin') && (
        <Card hoverable={false} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322] p-4">
          <div className="flex items-center gap-3">
            <Building className="h-4.5 w-4.5 text-indigo-500" />
            <label className="text-xs font-bold text-slate-905 dark:text-slate-350">Select Club Feed:</label>
            <select
              value={selectedClubFilter}
              onChange={(e) => setSelectedClubFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 font-bold focus:border-indigo-500 outline-none"
            >
              <option value="Coding Club">Coding Club</option>
              <option value="Robotics Association">Robotics Association</option>
              <option value="Debate & Literary Society">Debate & Literary Society</option>
              <option value="Business & Entrepreneurship Club">Business & Entrepreneurship Club</option>
              <option value="Creative Photography Guild">Creative Photography Guild</option>
            </select>
          </div>
        </Card>
      )}

      {/* Within Club active user label for Students / Presidents */}
      {activeTab === 'club' && (currentRole === 'student' || currentRole === 'president') && (
        <div className="bg-indigo-50/20 dark:bg-indigo-950/10 border border-indigo-100 dark:border-indigo-900/30 p-3.5 rounded-2xl flex items-center justify-between flex-wrap gap-2 text-xs font-bold text-slate-750 dark:text-slate-300">
          <span className="flex items-center gap-1.5"><Users className="h-4.5 w-4.5 text-indigo-500" /> Filtered by: Your Club ({userPrimaryClub})</span>
          <span className="text-[10px] text-slate-400">Locked to your registered club profile.</span>
        </div>
      )}

      {/* Filter and Search Layout */}
      <div className="bg-white dark:bg-[#0E1322] border border-slate-100 dark:border-slate-850 p-4.5 rounded-2xl grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Search */}
        <div className="md:col-span-4 relative">
          <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search student, department, club..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 p-2 pl-9.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 border border-slate-100 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500"
          />
        </div>

        {/* Filters */}
        <div className="md:col-span-8 flex flex-wrap md:justify-end gap-3">
          
          {/* Department Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-450 uppercase">Dept:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs px-2.5 py-1.5 rounded-xl text-slate-700 dark:text-slate-300 font-bold focus:border-indigo-550 outline-none"
            >
              <option value="All">All Departments</option>
              <option value="Computer Science & Eng">Computer Science</option>
              <option value="Mechanical Engineering">Mechanical</option>
              <option value="Fine Arts">Fine Arts</option>
              <option value="Business Administration">Business</option>
            </select>
          </div>

          {/* Academic Year Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-450 uppercase">Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs px-2.5 py-1.5 rounded-xl text-slate-700 dark:text-slate-300 font-bold focus:border-indigo-550 outline-none"
            >
              <option value="All">All Years</option>
              <option value="Year I">Year I</option>
              <option value="Year II">Year II</option>
              <option value="Year III">Year III</option>
              <option value="Year IV">Year IV</option>
            </select>
          </div>

          {/* Timeframe Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-450 uppercase">Period:</span>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs px-2.5 py-1.5 rounded-xl text-slate-700 dark:text-slate-300 font-bold focus:border-indigo-550 outline-none"
            >
              <option value="Overall">Overall (All Time)</option>
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
              <option value="This Semester">This Semester</option>
            </select>
          </div>

        </div>

      </div>

      {/* Top 3 Podium layout */}
      {processedRankings.length > 0 && (
        <div className="bg-white dark:bg-[#0E1322] border border-slate-100 dark:border-slate-850 p-6 md:p-8 rounded-3xl space-y-6">
          <h3 className="text-xs font-bold text-slate-450 uppercase tracking-widest text-center flex items-center justify-center gap-1.5">
            <Sparkles className="h-4.5 w-4.5 text-indigo-500" /> Leaderboard Top Extracurriculars
          </h3>
          <div className="flex flex-col md:flex-row items-end justify-center gap-6 pt-4 max-w-2xl mx-auto">
            
            {/* Rank 2 (Silver) Podium on Left */}
            {podiumStudents[1] && (
              <div 
                className="w-full md:w-44 flex flex-col items-center cursor-pointer group order-2 md:order-1"
                onClick={() => navigate(`/profile/${podiumStudents[1].id}`)}
              >
                <div className="relative mb-3 group-hover:scale-105 transition-transform">
                  <div className="h-16 w-16 rounded-full border-4 border-slate-300 overflow-hidden shadow-md">
                    <img src={podiumStudents[1].avatar} alt={podiumStudents[1].name} className="h-full w-full object-cover" />
                  </div>
                  <span className="absolute -bottom-1.5 -right-1.5 h-6 w-6 rounded-full bg-slate-300 text-white font-extrabold flex items-center justify-center text-xs shadow-inner">
                    🥈
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-850 dark:text-white text-center line-clamp-1">{podiumStudents[1].name}</h4>
                <p className="text-[9px] text-slate-450 font-bold">{getLevelDetails(podiumStudents[1].apPoints).name}</p>
                {/* Silver podium box */}
                <div className="w-full h-24 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-t-xl mt-3 flex flex-col items-center justify-center">
                  <span className="text-xs font-extrabold text-indigo-650 dark:text-indigo-400 font-display">{podiumStudents[1].apPoints} AP</span>
                  <span className="text-[9px] text-slate-400 font-bold">2nd Place</span>
                </div>
              </div>
            )}

            {/* Rank 1 (Gold) Podium in Center */}
            {podiumStudents[0] && (
              <div 
                className="w-full md:w-48 flex flex-col items-center cursor-pointer group order-1 md:order-2"
                onClick={() => navigate(`/profile/${podiumStudents[0].id}`)}
              >
                <div className="relative mb-3 group-hover:scale-105 transition-transform">
                  <div className="h-20 w-20 rounded-full border-4 border-amber-400 overflow-hidden shadow-lg">
                    <img src={podiumStudents[0].avatar} alt={podiumStudents[0].name} className="h-full w-full object-cover" />
                  </div>
                  <span className="absolute -bottom-1.5 -right-1.5 h-7 w-7 rounded-full bg-amber-400 text-white font-extrabold flex items-center justify-center text-xs shadow-inner">
                    🥇
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-855 dark:text-white text-center line-clamp-1">{podiumStudents[0].name}</h4>
                <p className="text-[9px] text-amber-500 font-extrabold tracking-wider uppercase">{getLevelDetails(podiumStudents[0].apPoints).name}</p>
                {/* Gold podium box (taller) */}
                <div className="w-full h-32 bg-gradient-to-b from-indigo-50/50 to-indigo-100/30 dark:from-[#0E1322] dark:to-indigo-950/10 border-2 border-indigo-550/20 dark:border-indigo-900/30 rounded-t-2xl mt-3 flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-indigo-500/10 text-indigo-500 text-[8px] font-extrabold py-0.5 px-2 rounded-bl-lg uppercase tracking-widest">Top Contributor</div>
                  <span className="text-sm font-extrabold text-indigo-650 dark:text-indigo-400 font-display">{podiumStudents[0].apPoints} AP</span>
                  <span className="text-[9px] text-indigo-650/70 dark:text-indigo-400 font-extrabold mt-0.5">1st Place</span>
                </div>
              </div>
            )}

            {/* Rank 3 (Bronze) Podium on Right */}
            {podiumStudents[2] && (
              <div 
                className="w-full md:w-44 flex flex-col items-center cursor-pointer group order-3"
                onClick={() => navigate(`/profile/${podiumStudents[2].id}`)}
              >
                <div className="relative mb-3 group-hover:scale-105 transition-transform">
                  <div className="h-16 w-16 rounded-full border-4 border-amber-600 overflow-hidden shadow-md">
                    <img src={podiumStudents[2].avatar} alt={podiumStudents[2].name} className="h-full w-full object-cover" />
                  </div>
                  <span className="absolute -bottom-1.5 -right-1.5 h-6 w-6 rounded-full bg-amber-600 text-white font-extrabold flex items-center justify-center text-xs shadow-inner">
                    🥉
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-855 dark:text-white text-center line-clamp-1">{podiumStudents[2].name}</h4>
                <p className="text-[9px] text-slate-450 font-bold">{getLevelDetails(podiumStudents[2].apPoints).name}</p>
                {/* Bronze podium box */}
                <div className="w-full h-20 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-t-xl mt-3 flex flex-col items-center justify-center">
                  <span className="text-xs font-extrabold text-indigo-650 dark:text-indigo-400 font-display">{podiumStudents[2].apPoints} AP</span>
                  <span className="text-[9px] text-slate-400 font-bold">3rd Place</span>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Main Leaderboard Table List */}
      <div className="bg-white dark:bg-[#0E1322] border border-slate-100 dark:border-slate-850 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/30 text-[10px] font-bold text-slate-450 uppercase tracking-wider">
                <th className="py-4 px-6 text-center w-16">Rank</th>
                <th className="py-4 px-6">Student Info</th>
                <th className="py-4 px-6">Dept / Year</th>
                <th className="py-4 px-6">Clubs</th>
                <th className="py-4 px-6">Level Badge</th>
                <th className="py-4 px-6">Recent Achievement</th>
                <th className="py-4 px-6 text-right">Points (AP)</th>
              </tr>
            </thead>
            <tbody>
              {processedRankings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-slate-450 font-medium">
                    No student rankings match your filter parameters.
                  </td>
                </tr>
              ) : (
                processedRankings.map((student, idx) => {
                  const level = getLevelDetails(student.apPoints);
                  const isTop3 = idx < 3;
                  const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : null;

                  return (
                    <tr 
                      key={student.id}
                      onClick={() => navigate(`/profile/${student.id}`)}
                      className="border-b border-slate-50 dark:border-slate-850 hover:bg-slate-50/50 dark:hover:bg-slate-900/20 cursor-pointer transition-colors"
                    >
                      {/* Rank Column */}
                      <td className="py-3.5 px-6 text-center font-bold text-xs">
                        {medal ? (
                          <span className="text-base select-none">{medal}</span>
                        ) : (
                          <span className="text-slate-400">#{idx + 1}</span>
                        )}
                      </td>

                      {/* Student avatar & name */}
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <img src={student.avatar} alt={student.name} className="h-8.5 w-8.5 rounded-lg object-cover flex-shrink-0" />
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white hover:text-primary transition-colors">{student.name}</h4>
                            <span className="text-[9px] font-bold text-slate-400 capitalize">{student.role}</span>
                          </div>
                        </div>
                      </td>

                      {/* Dept & Academic year */}
                      <td className="py-3.5 px-6">
                        <div className="text-xs font-semibold text-slate-655 dark:text-slate-350">{student.department}</div>
                        <div className="text-[9px] font-bold text-slate-400 mt-0.5">{student.academicYear}</div>
                      </td>

                      {/* Primary Club badges */}
                      <td className="py-3.5 px-6">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {student.joinedClubs.map(c => (
                            <Badge 
                              key={c}
                              variant="neutral" 
                              className="text-[8px] py-0 px-1 border-slate-100 dark:border-slate-800 text-slate-500 font-bold"
                            >
                              {c.split(' ')[0]}
                            </Badge>
                          ))}
                        </div>
                      </td>

                      {/* Level Badges */}
                      <td className="py-3.5 px-6">
                        <Badge 
                          variant="primary"
                          className={`text-[9px] font-bold py-0.5 px-2 bg-indigo-50 border-indigo-100 text-indigo-650 dark:bg-indigo-950 dark:border-indigo-900 dark:text-indigo-400`}
                        >
                          {level.name}
                        </Badge>
                      </td>

                      {/* Recent Extracurricular Accomplishment */}
                      <td className="py-3.5 px-6">
                        <span className="text-[11px] font-semibold text-slate-650 dark:text-slate-400 line-clamp-1">
                          {student.recentAchievement || 'None'}
                        </span>
                      </td>

                      {/* AP Point values */}
                      <td className="py-3.5 px-6 text-right font-bold text-indigo-650 dark:text-indigo-400 font-display text-xs">
                        {student.apPoints} AP
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Configure Point Allocation Rules (Super Admin only) */}
      {isRulesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#0E1322] border border-slate-100 dark:border-slate-800 max-w-xl w-full rounded-2xl shadow-xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/30">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Settings className="h-4.5 w-4.5 text-blue-500" /> Configure AP Allocation Rules
              </h3>
              <button onClick={() => setIsRulesModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-5 max-h-[50vh] overflow-y-auto space-y-3">
              {tempRules.map(rule => (
                <div key={rule.key} className="flex justify-between items-center p-3 border border-slate-50 dark:border-slate-850 rounded-xl bg-slate-50/20 dark:bg-slate-950/10 gap-3">
                  <div className="space-y-0.5">
                    <h5 className="text-xs font-bold text-slate-850 dark:text-slate-200">{rule.label}</h5>
                    <span className="text-[9px] text-slate-450 font-bold uppercase">{rule.key}</span>
                  </div>
                  <div className="flex items-center gap-3.5">
                    <button 
                      type="button" 
                      onClick={() => handleRulePointsChange(rule.key, -5)}
                      className="p-1 border border-slate-200 dark:border-slate-800 hover:border-slate-350 rounded-lg text-slate-500 cursor-pointer"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-xs font-extrabold text-indigo-650 dark:text-indigo-400 font-display w-12 text-center">+{rule.points} AP</span>
                    <button 
                      type="button" 
                      onClick={() => handleRulePointsChange(rule.key, 5)}
                      className="p-1 border border-slate-200 dark:border-slate-800 hover:border-slate-350 rounded-lg text-slate-500 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
              <Button variant="outline" size="sm" onClick={() => setIsRulesModalOpen(false)} className="font-bold cursor-pointer">
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={saveRules} className="font-bold flex items-center gap-1 cursor-pointer">
                <Check className="h-4.5 w-4.5" /> Save Point Rules
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Point Activity Reports (Admins only) */}
      {isReportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#0E1322] border border-slate-100 dark:border-slate-800 max-w-lg w-full rounded-2xl shadow-xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/30">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <FileSpreadsheet className="h-4.5 w-4.5 text-emerald-500" /> Extracurricular Point Analytics Report
              </h3>
              <button onClick={() => setIsReportOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-4 text-xs font-semibold text-slate-655 dark:text-slate-350">
              <div className="bg-indigo-50/20 dark:bg-indigo-950/10 p-4 border border-dashed border-indigo-150 dark:border-indigo-900/30 rounded-2xl space-y-2">
                <h4 className="font-bold text-indigo-750 dark:text-indigo-400 text-xs">Semestrial Contribution Summary</h4>
                <p className="text-[11px] leading-relaxed">
                  This report summarizes students verified contributions across all 5 campus clubs. Currently, <strong>{studentsOnly.length} students</strong> are tracking activity scores.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between border-b border-slate-50 dark:border-slate-850 pb-1.5">
                  <span>Total Activity Points Logged</span>
                  <span className="text-indigo-650 dark:text-indigo-400 font-extrabold">{studentsOnly.reduce((acc, s) => acc + s.apPoints, 0)} AP</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 dark:border-slate-850 pb-1.5">
                  <span>Average Score per student</span>
                  <span className="text-slate-850 dark:text-white font-extrabold">{averageAP} AP</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 dark:border-slate-850 pb-1.5">
                  <span>Top Performing Department</span>
                  <span className="text-slate-855 dark:text-white font-extrabold">{mostActiveDept}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 dark:border-slate-850 pb-1.5">
                  <span>Top Performing Club</span>
                  <span className="text-slate-855 dark:text-white font-extrabold">{mostActiveClub}</span>
                </div>
                <div className="flex justify-between pb-1.5">
                  <span>Top Level Achievers (Legends)</span>
                  <span className="text-slate-855 dark:text-white font-extrabold">
                    {studentsOnly.filter(s => s.apPoints >= 1500).length} Students
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setIsReportOpen(false)} className="font-bold cursor-pointer">
                Close Report
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
