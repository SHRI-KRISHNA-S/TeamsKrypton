import React, { useState } from 'react';
import { UserCheck, ShieldAlert, Check, X, ArrowLeft, Users, Calendar } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table } from '../components/ui/Table';
import { useApp } from '../context/AppContext';

export const MembershipModule: React.FC = () => {
  const { membershipRequests, handleMembership } = useApp();
  
  // Selection filter state
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');

  const filteredRequests = membershipRequests.filter(req => {
    if (filter === 'All') return true;
    return req.status === filter;
  });

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Page Title */}
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Membership Proposals</h1>
        <p className="text-xs text-slate-400 mt-1">Review club registrations and approve prospective student members.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
        {(['All', 'Pending', 'Approved', 'Rejected'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 text-xs font-semibold cursor-pointer transition-colors relative ${
              filter === tab
                ? 'text-primary'
                : 'text-slate-500 hover:text-slate-850 dark:hover:text-slate-200'
            }`}
          >
            <span>{tab}</span>
            {filter === tab && (
              <span className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-primary rounded-t" />
            )}
          </button>
        ))}
      </div>

      {/* Requests table container */}
      <Card hoverable={false}>
        <CardBody className="p-0">
          <Table
            columns={[
              { 
                header: 'Student Profile', 
                accessor: (row) => (
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-950/20 text-primary flex items-center justify-center font-bold font-display text-[11px]">
                      {row.studentName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="text-xs font-bold text-slate-905 dark:text-slate-100">{row.studentName}</div>
                  </div>
                ) 
              },
              { header: 'Target Club', accessor: 'clubName' },
              { header: 'Department', accessor: 'department' },
              { header: 'College Year', accessor: 'year', className: 'text-slate-500 dark:text-slate-400 font-semibold' },
              { header: 'Applied On', accessor: 'appliedDate' },
              {
                header: 'Status',
                accessor: (row) => (
                  <Badge 
                    variant={row.status === 'Approved' ? 'secondary' : row.status === 'Rejected' ? 'danger' : 'accent'}
                  >
                    {row.status}
                  </Badge>
                )
              },
              {
                header: 'Control Actions',
                accessor: (row) => {
                  if (row.status !== 'Pending') {
                    return <span className="text-[10px] text-slate-400 font-bold">Closed</span>;
                  }
                  return (
                    <div className="flex gap-2">
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="py-1 px-2.5 text-xs font-semibold"
                        onClick={() => handleMembership(row.id, 'approve')}
                      >
                        <Check className="h-3.5 w-3.5 mr-1" /> Approve
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="py-1 px-2.5 text-xs text-rose-500 hover:bg-rose-50/40 border-rose-200 dark:border-rose-950/40"
                        onClick={() => handleMembership(row.id, 'reject')}
                      >
                        <X className="h-3.5 w-3.5 mr-1" /> Reject
                      </Button>
                    </div>
                  );
                }
              }
            ]}
            data={filteredRequests}
            keyExtractor={(row) => row.id}
          />
        </CardBody>
      </Card>
    </div>
  );
};
