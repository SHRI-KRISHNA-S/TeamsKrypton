import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardBody, 
  Badge, 
  Button, 
  Table, 
  useApp, 
  MembershipRequest 
} from '../../common';
import { RejectReasonModal } from '../../club-management/components/RejectReasonModal';
import { 
  ShieldCheck, 
  Check, 
  X, 
  Clock, 
  FileText, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export const FacultyMembershipApprovals: React.FC = () => {
  const { membershipRequests, handleMembership, clubs } = useApp();

  const [selectedClubId, setSelectedClubId] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [reasonModalReq, setReasonModalReq] = useState<MembershipRequest | null>(null);
  const [modalActionType, setModalActionType] = useState<'reject' | 'waitlist'>('reject');

  // Filter requests for pending or waitlisted applications under supervised clubs
  const supervisedRequests = membershipRequests.filter(req => {
    const matchesClub = selectedClubId === 'All' ? true : req.clubId === selectedClubId;
    const matchesSearch = 
      req.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      req.department.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesClub && matchesSearch;
  });

  const pendingRequests = supervisedRequests.filter(r => r.status === 'Pending');

  const handleApproveAllPending = () => {
    pendingRequests.forEach(req => {
      handleMembership(req.id, 'approve');
    });
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            Faculty Membership Approvals Console
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review registration applications and oversee enrollment capacity for clubs under your academic supervision.
          </p>
        </div>

        {pendingRequests.length > 0 && (
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handleApproveAllPending}
            className="flex items-center gap-2 font-bold shadow-sm"
          >
            <CheckCircle2 className="h-4 w-4" /> Approve All Pending ({pendingRequests.length})
          </Button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#0E1322] shadow-sm">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 w-full sm:w-80">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name or department..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-xs text-slate-850 dark:text-slate-200 placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold">Supervised Club:</span>
          <select
            value={selectedClubId}
            onChange={e => setSelectedClubId(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 outline-none"
          >
            <option value="All">All Supervised Clubs</option>
            {clubs.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Datatable */}
      <Card hoverable={false} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322] overflow-hidden">
        <CardBody className="p-0">
          {supervisedRequests.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs space-y-2">
              <ShieldCheck className="h-8 w-8 mx-auto text-slate-300 dark:text-slate-600" />
              <p>No pending membership applications require faculty approval.</p>
            </div>
          ) : (
            <Table
              columns={[
                {
                  header: 'Student Applicant',
                  accessor: (row: MembershipRequest) => (
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-[11px]">
                        {row.studentName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">{row.studentName}</div>
                        <span className="text-[10px] text-slate-400">{row.department} • {row.year}</span>
                      </div>
                    </div>
                  )
                },
                {
                  header: 'Target Club',
                  accessor: 'clubName'
                },
                {
                  header: 'Applied On',
                  accessor: 'appliedDate'
                },
                {
                  header: 'Status',
                  accessor: (row: MembershipRequest) => (
                    <Badge variant={row.status === 'Approved' ? 'secondary' : row.status === 'Rejected' ? 'danger' : 'accent'} className="py-0.5 px-2 text-[10px]">
                      {row.status}
                    </Badge>
                  )
                },
                {
                  header: 'Faculty Actions',
                  accessor: (row: MembershipRequest) => {
                    if (row.status !== 'Pending') {
                      return <span className="text-[10px] text-slate-400 font-semibold">{row.status} on {row.processedDate || 'recently'}</span>;
                    }

                    return (
                      <div className="flex items-center gap-2">
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
                          className="py-1 px-2.5 text-xs text-amber-600 border-amber-200 dark:border-amber-900/40"
                          onClick={() => { setReasonModalReq(row); setModalActionType('waitlist'); }}
                        >
                          <Clock className="h-3.5 w-3.5 mr-1" /> Waitlist
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="py-1 px-2.5 text-xs text-rose-500 border-rose-200 dark:border-rose-900/40"
                          onClick={() => { setReasonModalReq(row); setModalActionType('reject'); }}
                        >
                          <X className="h-3.5 w-3.5 mr-1" /> Reject
                        </Button>
                      </div>
                    );
                  }
                }
              ]}
              data={supervisedRequests}
              keyExtractor={(row) => row.id}
            />
          )}
        </CardBody>
      </Card>

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
