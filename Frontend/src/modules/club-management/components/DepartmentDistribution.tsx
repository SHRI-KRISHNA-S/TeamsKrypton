import React from 'react';
import { Card, CardHeader, CardBody, ProgressBar } from '../../common';
import { Building, PieChart } from 'lucide-react';

interface DepartmentDistributionProps {
  departments: { department: string; count: number; percentage: number }[];
}

export const DepartmentDistribution: React.FC<DepartmentDistributionProps> = ({ departments }) => {
  const colors = [
    'bg-indigo-500',
    'bg-purple-500',
    'bg-emerald-500',
    'bg-amber-500',
    'bg-rose-500',
    'bg-sky-500',
  ];

  return (
    <Card hoverable={false} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322]">
      <CardHeader>
        <div className="flex items-center gap-2">
          <PieChart className="h-5 w-5 text-indigo-500" />
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Departmental Distribution</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Student enrollment spread across academic streams.</p>
          </div>
        </div>
      </CardHeader>

      <CardBody className="space-y-4">
        {departments.map((dept, idx) => {
          const colorClass = colors[idx % colors.length];
          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Building className="h-3.5 w-3.5 text-slate-400" /> {dept.department}
                </span>
                <span className="text-slate-500 dark:text-slate-400 font-bold">
                  {dept.count} Students ({dept.percentage}%)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${Math.min(100, Math.max(5, dept.percentage))}%` }} />
              </div>
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
};
