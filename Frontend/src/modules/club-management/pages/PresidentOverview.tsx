import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Badge, Button, useApp } from '../../common';
import { ClubStatsOverview } from '../components/ClubStatsOverview';
import { GrowthCharts } from '../components/GrowthCharts';
import { DepartmentDistribution } from '../components/DepartmentDistribution';
import { 
  Building, 
  Users, 
  Crown, 
  Award, 
  Activity, 
  Calendar, 
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Mail
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PresidentOverview: React.FC = () => {
  const { clubs, getClubStats, clubMembers, activityFeed } = useApp();
  const navigate = useNavigate();

  const [selectedClubId, setSelectedClubId] = useState<string>(clubs[0]?.id || 'club-1');

  const activeClub = clubs.find(c => c.id === selectedClubId) || clubs[0];
  const stats = getClubStats(selectedClubId);

  // Executive team for active club
  const executiveTeam = clubMembers.filter(m => 
    m.clubId === selectedClubId && ['President', 'Vice President', 'Secretary', 'Treasurer'].includes(m.role)
  );

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Top Header & Club Selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Club Operational State & Statistics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time analytics, member growth metrics, AP point distribution, and departmental spread.
          </p>
        </div>

        {/* Club Dropdown Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold">Active Club:</span>
          <select
            value={selectedClubId}
            onChange={e => setSelectedClubId(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-bold shadow-sm"
          >
            {clubs.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Overview Metrics Cards */}
      {stats && <ClubStatsOverview stats={stats} clubName={activeClub?.name} />}

      {/* Main Charts & Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Growth Trend Graph */}
        <div className="lg:col-span-8">
          {stats && <GrowthCharts monthlyData={stats.monthlyGrowth} />}
        </div>

        {/* Department Distribution */}
        <div className="lg:col-span-4">
          {stats && <DepartmentDistribution departments={stats.departmentBreakdown} />}
        </div>
      </div>

      {/* Executive Leadership & Club Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Executive Leadership Showcase */}
        <div className="lg:col-span-6 space-y-4">
          <Card hoverable={false} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322] h-full">
            <CardHeader className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-amber-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Executive Council</h3>
              </div>
              <Button variant="outline" size="sm" className="text-xs" onClick={() => navigate('/president/members')}>
                Manage Roster <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </CardHeader>
            <CardBody className="space-y-3.5">
              {executiveTeam.length === 0 ? (
                <div className="text-center text-xs text-slate-400 py-6">
                  No executive officers assigned to this roster yet.
                </div>
              ) : (
                executiveTeam.map(officer => (
                  <div key={officer.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <img src={officer.avatar} alt={officer.name} className="h-9 w-9 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">{officer.name}</div>
                        <span className="text-[10px] text-slate-400 font-semibold">{officer.department}</span>
                      </div>
                    </div>
                    <Badge variant={officer.role === 'President' ? 'primary' : 'secondary'} className="py-0.5 px-2 text-[10px] font-bold">
                      {officer.role}
                    </Badge>
                  </div>
                ))
              )}
            </CardBody>
          </Card>
        </div>

        {/* Club Governance Profile */}
        <div className="lg:col-span-6">
          <Card hoverable={false} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322] h-full">
            <CardHeader className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-indigo-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Club Governance Profile</h3>
              </div>
              <Button variant="outline" size="sm" className="text-xs" onClick={() => navigate('/clubs')}>
                View Club Page
              </Button>
            </CardHeader>
            <CardBody className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-slate-400 font-medium">Faculty Coordinator:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{activeClub?.facultyCoordinator}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-slate-400 font-medium">Club Category:</span>
                <Badge variant="primary" className="py-0.5 px-2 text-[10px]">{activeClub?.category}</Badge>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-slate-400 font-medium">Status & Visibility:</span>
                <div className="flex items-center gap-1.5">
                  <Badge variant={activeClub?.status === 'Active' ? 'secondary' : 'accent'} className="py-0.5 px-2 text-[10px]">
                    {activeClub?.status}
                  </Badge>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">({activeClub?.visibility})</span>
                </div>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-slate-400 font-medium">Contact Email:</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" /> {activeClub?.contactEmail || 'club@campus.edu'}
                </span>
              </div>

              {activeClub?.establishedDate && (
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400 font-medium">Established On:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{activeClub.establishedDate}</span>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
