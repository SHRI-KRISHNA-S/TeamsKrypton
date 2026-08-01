import React from 'react';
import { Card, CardBody, ClubAnalyticsData } from '../../common';
import { Users, Calendar, Award, CheckCircle2, FileCheck, TrendingUp } from 'lucide-react';

interface ClubStatsOverviewProps {
  stats: ClubAnalyticsData;
  clubName?: string;
}

export const ClubStatsOverview: React.FC<ClubStatsOverviewProps> = ({ stats, clubName }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
      {/* Total Members */}
      <Card hoverable={false} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322]">
        <CardBody className="p-4 space-y-2">
          <div className="flex justify-between items-center text-indigo-600 dark:text-indigo-400">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40">
              <Users className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" /> +14%
            </span>
          </div>
          <div>
            <div className="text-xl font-bold font-display text-slate-900 dark:text-white">{stats.totalMembers}</div>
            <div className="text-[10px] font-semibold text-slate-400">Total Members</div>
          </div>
        </CardBody>
      </Card>

      {/* Active Members % */}
      <Card hoverable={false} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322]">
        <CardBody className="p-4 space-y-2">
          <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-500">{stats.activeMembers} Active</span>
          </div>
          <div>
            <div className="text-xl font-bold font-display text-emerald-600 dark:text-emerald-400">{stats.activePercentage}%</div>
            <div className="text-[10px] font-semibold text-slate-400">Active Rate</div>
          </div>
        </CardBody>
      </Card>

      {/* Event Count */}
      <Card hoverable={false} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322]">
        <CardBody className="p-4 space-y-2">
          <div className="flex justify-between items-center text-purple-600 dark:text-purple-400">
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40">
              <Calendar className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-purple-500">Scheduled</span>
          </div>
          <div>
            <div className="text-xl font-bold font-display text-slate-900 dark:text-white">{stats.eventCount}</div>
            <div className="text-[10px] font-semibold text-slate-400">Events Organized</div>
          </div>
        </CardBody>
      </Card>

      {/* AP Points */}
      <Card hoverable={false} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322]">
        <CardBody className="p-4 space-y-2">
          <div className="flex justify-between items-center text-amber-600 dark:text-amber-400">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40">
              <Award className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-amber-500">AP Points</span>
          </div>
          <div>
            <div className="text-xl font-bold font-display text-amber-600 dark:text-amber-400">{stats.totalApPoints}</div>
            <div className="text-[10px] font-semibold text-slate-400">Activity Points</div>
          </div>
        </CardBody>
      </Card>

      {/* Attendance % */}
      <Card hoverable={false} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322]">
        <CardBody className="p-4 space-y-2">
          <div className="flex justify-between items-center text-sky-600 dark:text-sky-400">
            <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/40">
              <FileCheck className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-sky-500">Average</span>
          </div>
          <div>
            <div className="text-xl font-bold font-display text-sky-600 dark:text-sky-400">{stats.attendanceRate}%</div>
            <div className="text-[10px] font-semibold text-slate-400">Attendance Rate</div>
          </div>
        </CardBody>
      </Card>

      {/* Certificates Issued */}
      <Card hoverable={false} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322]">
        <CardBody className="p-4 space-y-2">
          <div className="flex justify-between items-center text-rose-600 dark:text-rose-400">
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40">
              <Award className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-rose-500">Issued</span>
          </div>
          <div>
            <div className="text-xl font-bold font-display text-slate-900 dark:text-white">{stats.certificatesIssued}</div>
            <div className="text-[10px] font-semibold text-slate-400">Certificates Awarded</div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
