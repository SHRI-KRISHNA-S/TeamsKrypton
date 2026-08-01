import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardBody, 
  Badge, 
  Button, 
  Table, 
  useApp 
} from '../../common';
import { ClubStatsOverview } from '../../club-management/components/ClubStatsOverview';
import { GrowthCharts } from '../../club-management/components/GrowthCharts';
import { 
  BarChart3, 
  Download, 
  FileText, 
  Calendar, 
  Award, 
  CheckCircle2, 
  TrendingUp, 
  Building 
} from 'lucide-react';

export const PresidentAnalytics: React.FC = () => {
  const { clubs, getClubStats, events } = useApp();

  const [selectedClubId, setSelectedClubId] = useState<string>(clubs[0]?.id || 'club-1');
  const [academicTerm, setAcademicTerm] = useState<'Current Semester' | 'Academic Year 2025-26'>('Current Semester');

  const activeClub = clubs.find(c => c.id === selectedClubId) || clubs[0];
  const stats = getClubStats(selectedClubId);

  const clubEvents = events.filter(e => e.clubId === selectedClubId && e.status === 'Approved');

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header & Export Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            Club Analytics & Monthly Performance Reports
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Examine student participation rates, monthly AP point allocations, attendance logs, and event metrics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={selectedClubId}
            onChange={e => setSelectedClubId(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-bold shadow-sm"
          >
            {clubs.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <Button variant="outline" size="sm" className="text-xs font-bold flex items-center gap-1.5">
            <Download className="h-3.5 w-3.5 text-purple-500" /> Export Summary PDF
          </Button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      {stats && <ClubStatsOverview stats={stats} clubName={activeClub?.name} />}

      {/* Main Growth Graph */}
      {stats && <GrowthCharts monthlyData={stats.monthlyGrowth} />}

      {/* Monthly Performance Ledger Table */}
      <Card hoverable={false} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322] overflow-hidden">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-500" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Monthly Event & Participation Breakdown</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Detailed metric ledger per month for {activeClub?.name}.</p>
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          <Table
            columns={[
              { header: 'Month Term', accessor: 'month', className: 'font-bold text-slate-900 dark:text-white' },
              { header: 'New Member Enrollment', accessor: (row) => <span className="font-bold text-indigo-600 dark:text-indigo-400">+{row.members} Students</span> },
              { header: 'Events Conducted', accessor: (row) => <span className="font-bold text-purple-600 dark:text-purple-400">{row.events} Events</span> },
              { header: 'AP Points Awarded', accessor: (row) => <span className="font-bold text-amber-600 dark:text-amber-400">+{row.apPoints} AP</span> },
              { header: 'Avg Attendance', accessor: () => <span className="font-bold text-emerald-600 dark:text-emerald-400">88.5%</span> },
              {
                header: 'Status',
                accessor: () => (
                  <Badge variant="secondary" className="py-0.5 px-2 text-[10px] font-bold">
                    Verified
                  </Badge>
                )
              }
            ]}
            data={stats?.monthlyGrowth || []}
            keyExtractor={(row) => row.month}
          />
        </CardBody>
      </Card>
    </div>
  );
};
