import React, { useState } from 'react';
import { BarChart3, Download, Calendar, Users, TrendingUp, HelpCircle } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';

export const ReportsModule: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'Term' | 'Monthly' | 'Yearly'>('Term');
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExport = (format: 'PDF' | 'Excel' | 'CSV') => {
    setExporting(format);
    setTimeout(() => {
      setExporting(null);
      alert(`Report exported successfully as ${format}. check local storage download directory.`);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white font-sans">Activity Reports & Analytics</h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">Review metrics for event participation, department rankings, and student logins.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            isLoading={exporting === 'CSV'} 
            onClick={() => handleExport('CSV')}
            className="text-xs text-slate-650"
          >
            <Download className="h-3.5 w-3.5 mr-1" /> CSV
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            isLoading={exporting === 'Excel'} 
            onClick={() => handleExport('Excel')}
            className="text-xs text-slate-650"
          >
            <Download className="h-3.5 w-3.5 mr-1" /> Excel
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            isLoading={exporting === 'PDF'} 
            onClick={() => handleExport('PDF')}
            className="text-xs font-bold"
          >
            <Download className="h-3.5 w-3.5 mr-1" /> Export PDF
          </Button>
        </div>
      </div>

      {/* Timeframe Toggles */}
      <div className="flex gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
        {(['Term', 'Monthly', 'Yearly'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTimeframe(t)}
            className={`px-3.5 py-1.5 text-xs font-semibold cursor-pointer transition-colors relative ${
              timeframe === t 
                ? 'text-primary font-bold' 
                : 'text-slate-500 hover:text-slate-850 dark:hover:text-slate-200'
            }`}
          >
            <span>{t} overview</span>
            {timeframe === t && (
              <span className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-primary rounded-t" />
            )}
          </button>
        ))}
      </div>

      {/* Main reporting charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Participation Trends */}
        <Card hoverable={false}>
          <CardHeader className="flex justify-between items-center pb-2">
            <div>
              <h3 className="text-xs font-bold font-display text-slate-900 dark:text-white">Active Student Engagement Trends</h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Participation counts aggregated weekly</p>
            </div>
            <TrendingUp className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardBody className="pt-4">
            <div className="h-52 w-full relative flex items-end">
              {/* SVG line chart */}
              <svg className="w-full h-full" viewBox="0 0 500 150" fill="none">
                <path d="M0 130 C 50 110, 100 80, 150 90 C 200 100, 250 40, 300 50 C 350 60, 400 20, 450 10 L 450 150 L 0 150 Z" fill="url(#indigo-grad-rep)" fillOpacity="0.1" />
                <path d="M0 130 C 50 110, 100 80, 150 90 C 200 100, 250 40, 300 50 C 350 60, 400 20, 450 10" stroke="#4F46E5" strokeWidth="3" />
                <path d="M0 150 C 50 130, 100 110, 150 120 C 200 130, 250 90, 300 110 C 350 90, 400 60, 450 50" stroke="#10B981" strokeWidth="2" strokeDasharray="4 4" />
                <defs>
                  <linearGradient id="indigo-grad-rep" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="flex justify-between text-[9px] font-bold text-slate-400 mt-3 pt-2 border-t border-slate-50 dark:border-slate-800/40 uppercase tracking-wider">
              <span>Wk 1</span>
              <span>Wk 2</span>
              <span>Wk 3</span>
              <span>Wk 4</span>
              <span>Wk 5</span>
              <span>Wk 6</span>
            </div>
            <div className="flex gap-4 justify-center mt-3 text-[10px] font-bold">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> Active Registrations</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-dashed bg-secondary block" style={{ border: '2px dashed #10B981' }} /> Checked Attendance</span>
            </div>
          </CardBody>
        </Card>

        {/* Club Attendance statistics */}
        <Card hoverable={false}>
          <CardHeader className="flex justify-between items-center pb-2">
            <div>
              <h3 className="text-xs font-bold font-display text-slate-900 dark:text-white">Club Attendance Comparisons</h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Average checkout ratios</p>
            </div>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardBody className="pt-4">
            <div className="h-52 w-full flex items-end justify-between gap-6 pb-2">
              {/* Simulated SVG Bar chart */}
              <div className="flex flex-col items-center flex-grow gap-2">
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-lg h-36 flex items-end">
                  <div className="w-full bg-indigo-500 rounded-lg animate-pulse" style={{ height: '86%' }} />
                </div>
                <span className="text-[9px] font-bold text-slate-450 tracking-wide uppercase truncate w-full text-center">Coding</span>
              </div>
              <div className="flex flex-col items-center flex-grow gap-2">
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-lg h-36 flex items-end">
                  <div className="w-full bg-emerald-500 rounded-lg animate-pulse" style={{ height: '72%' }} />
                </div>
                <span className="text-[9px] font-bold text-slate-450 tracking-wide uppercase truncate w-full text-center">Robots</span>
              </div>
              <div className="flex flex-col items-center flex-grow gap-2">
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-lg h-36 flex items-end">
                  <div className="w-full bg-amber-500 rounded-lg animate-pulse" style={{ height: '65%' }} />
                </div>
                <span className="text-[9px] font-bold text-slate-450 tracking-wide uppercase truncate w-full text-center">Debate</span>
              </div>
              <div className="flex flex-col items-center flex-grow gap-2">
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-lg h-36 flex items-end">
                  <div className="w-full bg-indigo-500 rounded-lg animate-pulse" style={{ height: '90%' }} />
                </div>
                <span className="text-[9px] font-bold text-slate-450 tracking-wide uppercase truncate w-full text-center">Business</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Department Comparison rows */}
      <Card hoverable={false}>
        <CardHeader><h3 className="text-xs font-bold font-display text-slate-900 dark:text-white">Department Active Participation Breakdown</h3></CardHeader>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-350">
                <span>Computer Science & Engineering</span>
                <span className="font-bold">450 students active</span>
              </div>
              <ProgressBar value={450} max={600} color="primary" />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-350">
                <span>Mechanical Engineering</span>
                <span className="font-bold">250 students active</span>
              </div>
              <ProgressBar value={250} max={600} color="secondary" />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-350">
                <span>Business Administration (BBA/MBA)</span>
                <span className="font-bold">320 students active</span>
              </div>
              <ProgressBar value={320} max={600} color="accent" />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-350">
                <span>Fine Arts Department</span>
                <span className="font-bold">110 students active</span>
              </div>
              <ProgressBar value={110} max={600} color="rose" />
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
