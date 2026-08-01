import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardBody, 
  Button, 
  Badge, 
  Table, 
  useApp, 
  MembershipRequest 
} from '../../common';
import { ApplyClubModal } from '../../club-management/components/ApplyClubModal';
import { RejectReasonModal } from '../../club-management/components/RejectReasonModal';
import { 
  UserCheck, 
  Check, 
  X, 
  UserPlus, 
  Clock, 
  FileText, 
  Search, 
  Filter, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';

export const MembershipModule: React.FC = () => {
  const { membershipRequests, handleMembership, currentRole } = useApp();
  
  // Selection filter state
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Approved' | 'Waitlisted' | 'Rejected'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [reasonModalReq, setReasonModalReq] = useState<MembershipRequest | null>(null);
  const [modalActionType, setModalActionType] = useState<'reject' | 'waitlist'>('reject');

  const filteredRequests = membershipRequests.filter(req => {
    const matchesFilter = filter === 'All' ? true : req.status === filter;
    const matchesSearch = 
      req.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      req.clubName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.department.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'secondary';
      case 'Pending':
        return 'primary';
      case 'Waitlisted':
        return 'accent';
      case 'Rejected':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Page Title & Apply Trigger */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Club Membership Applications Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Submit new membership applications to student societies, track application status, or review registration proposals.
          </p>
        </div>

        <Button 
          variant="primary" 
          size="sm" 
          onClick={() => setIsApplyModalOpen(true)}
          className="flex items-center gap-2 font-bold shadow-md shadow-indigo-500/10"
        >
          <UserPlus className="h-4 w-4" /> Apply for Club Membership
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#0E1322] space-y-3 shadow-sm">
        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 overflow-x-auto scrollbar-none">
          {(['All', 'Pending', 'Waitlisted', 'Approved', 'Rejected'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                filter === tab
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 max-w-md">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, club, department..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-xs text-slate-850 dark:text-slate-200 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Requests table container */}
      <Card hoverable={false} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322] overflow-hidden">
        <CardBody className="p-0">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs space-y-2">
              <UserCheck className="h-8 w-8 mx-auto text-slate-300 dark:text-slate-600" />
              <p>No membership applications found in this view.</p>
            </div>
          ) : (
            <Table
              columns={[
                { 
                  header: 'Student Profile', 
                  accessor: (row: MembershipRequest) => (
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-[11px]">
                        {row.studentName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">{row.studentName}</div>
                        <span className="text-[10px] text-slate-400">{row.studentEmail || `${row.studentName.toLowerCase().replace(/\s+/g, '.')}@student.edu`}</span>
                      </div>
                    </div>
                  ) 
                },
                { header: 'Target Club', accessor: 'clubName' },
                { header: 'Department', accessor: 'department' },
                { header: 'Year', accessor: 'year', className: 'text-slate-500 dark:text-slate-400 font-semibold' },
                { header: 'Applied Date', accessor: 'appliedDate' },
                {
                  header: 'Status',
                  accessor: (row: MembershipRequest) => (
                    <Badge variant={getStatusBadgeVariant(row.status)} className="py-0.5 px-2 text-[10px] font-bold">
                      {row.status}
                    </Badge>
                  )
                },
                {
                  header: 'Decision Actions',
                  accessor: (row: MembershipRequest) => {
                    if (row.status !== 'Pending') {
                      return (
                        <div className="text-[10px] font-semibold text-slate-400">
                          {row.rejectionReason ? <span title={row.rejectionReason} className="text-rose-500 truncate block max-w-[120px]">Note: {row.rejectionReason}</span> : 'Processed'}
                        </div>
                      );
                    }

                    return (
                      <div className="flex items-center gap-1.5">
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="py-1 px-2.5 text-xs font-bold"
                          onClick={() => handleMembership(row.id, 'approve')}
                        >
                          <Check className="h-3.5 w-3.5 mr-1" /> Approve
                        </Button>

                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="py-1 px-2.5 text-xs text-amber-600 border-amber-200 dark:border-amber-950/40"
                          onClick={() => { setReasonModalReq(row); setModalActionType('waitlist'); }}
                        >
                          <Clock className="h-3.5 w-3.5 mr-1" /> Waitlist
                        </Button>

                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="py-1 px-2.5 text-xs text-rose-500 border-rose-200 dark:border-rose-950/40"
                          onClick={() => { setReasonModalReq(row); setModalActionType('reject'); }}
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
          )}
        </CardBody>
      </Card>

      {/* Apply Club Modal */}
      <ApplyClubModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />

      {/* Reject / Waitlist Modal */}
      <RejectReasonModal
        isOpen={!!reasonModalReq}
        onClose={() => setReasonModalReq(null)}
        request={reasonModalReq}
        actionType={modalActionType}
      />
    </div>
  );
};
