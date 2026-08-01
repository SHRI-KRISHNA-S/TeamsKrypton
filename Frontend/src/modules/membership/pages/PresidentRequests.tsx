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
  UserCheck, 
  Clock, 
  Check, 
  X, 
  ShieldAlert, 
  Search, 
  Filter, 
  FileText, 
  AlertCircle, 
  Sparkles, 
  HelpCircle,
  Users
} from 'lucide-react';

export const PresidentRequests: React.FC = () => {
  const { membershipRequests, handleMembership, clubs } = useApp();

  // State management
  const [activeTab, setActiveTab] = useState<'Pending' | 'Waitlisted' | 'Approved' | 'Rejected' | 'All'>('Pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClubId, setSelectedClubId] = useState<string>('All');

  // Modal state for rejection/waitlist reason
  const [reasonModalReq, setReasonModalReq] = useState<MembershipRequest | null>(null);
  const [modalActionType, setModalActionType] = useState<'reject' | 'waitlist'>('reject');

  // Modal state for viewing full SOP statement
  const [viewStatementReq, setViewStatementReq] = useState<MembershipRequest | null>(null);

  // Filter dataset
  const filteredRequests = membershipRequests.filter(req => {
    const matchesTab = activeTab === 'All' ? true : req.status === activeTab;
    const matchesClub = selectedClubId === 'All' ? true : req.clubId === selectedClubId;
    const matchesSearch = 
      req.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (req.studentId && req.studentId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (req.studentEmail && req.studentEmail.toLowerCase().includes(searchQuery.toLowerCase())) ||
      req.department.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesClub && matchesSearch;
  });

  // Metric counts
  const pendingCount = membershipRequests.filter(r => r.status === 'Pending').length;
  const approvedCount = membershipRequests.filter(r => r.status === 'Approved').length;
  const waitlistedCount = membershipRequests.filter(r => r.status === 'Waitlisted').length;
  const rejectedCount = membershipRequests.filter(r => r.status === 'Rejected').length;

  const handleOpenReasonModal = (req: MembershipRequest, action: 'reject' | 'waitlist') => {
    setReasonModalReq(req);
    setModalActionType(action);
  };

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
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Club Join Applications Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review student registration applications, evaluate statement of purpose statements, approve roster enrollments, or assign waitlist capacity.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hoverable={false} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322]">
          <CardBody className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-bold font-display text-indigo-600 dark:text-indigo-400">{pendingCount}</div>
              <div className="text-[10px] font-semibold text-slate-400">Pending Review</div>
            </div>
          </CardBody>
        </Card>

        <Card hoverable={false} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322]">
          <CardBody className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <Check className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-bold font-display text-emerald-600 dark:text-emerald-400">{approvedCount}</div>
              <div className="text-[10px] font-semibold text-slate-400">Approved Members</div>
            </div>
          </CardBody>
        </Card>

        <Card hoverable={false} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322]">
          <CardBody className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-bold font-display text-amber-600 dark:text-amber-400">{waitlistedCount}</div>
              <div className="text-[10px] font-semibold text-slate-400">Waitlisted</div>
            </div>
          </CardBody>
        </Card>

        <Card hoverable={false} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322]">
          <CardBody className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
              <X className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-bold font-display text-rose-600 dark:text-rose-400">{rejectedCount}</div>
              <div className="text-[10px] font-semibold text-slate-400">Rejected Applications</div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Tabs & Filter Controls */}
      <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#0E1322] space-y-3 shadow-sm">
        {/* Status Tabs */}
        <div className="flex gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 overflow-x-auto scrollbar-none">
          {(['Pending', 'Waitlisted', 'Approved', 'Rejected', 'All'] as const).map(tab => {
            const count = tab === 'Pending' ? pendingCount : tab === 'Waitlisted' ? waitlistedCount : tab === 'Approved' ? approvedCount : tab === 'Rejected' ? rejectedCount : membershipRequests.length;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{tab}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                  activeTab === tab ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Club filter */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-1">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 w-full sm:w-80">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student name, roll no, email..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-xs text-slate-850 dark:text-slate-200 placeholder-slate-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Club:</span>
            <select
              value={selectedClubId}
              onChange={e => setSelectedClubId(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 outline-none"
            >
              <option value="All">All Clubs</option>
              {clubs.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Applications Datatable */}
      <Card hoverable={false} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322] overflow-hidden">
        <CardBody className="p-0">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <UserCheck className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Applications Found</h3>
              <p className="text-xs text-slate-400">There are no join applications matching your current filter tab.</p>
            </div>
          ) : (
            <Table
              columns={[
                {
                  header: 'Applicant Student',
                  accessor: (row: MembershipRequest) => (
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shadow-sm">
                        {row.studentName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          {row.studentName}
                          {row.studentId && <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">{row.studentId}</span>}
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold">{row.studentEmail || `${row.studentName.toLowerCase().replace(/\s+/g, '.')}@student.edu`}</span>
                      </div>
                    </div>
                  )
                },
                {
                  header: 'Target Club & Date',
                  accessor: (row: MembershipRequest) => (
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      <div>{row.clubName}</div>
                      <span className="text-[10px] text-slate-400">{row.appliedDate}</span>
                    </div>
                  )
                },
                {
                  header: 'Academic Info',
                  accessor: (row: MembershipRequest) => (
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <div>{row.department}</div>
                      <span className="text-[10px] text-slate-400">{row.year}</span>
                    </div>
                  )
                },
                {
                  header: 'SOP & Skills',
                  accessor: (row: MembershipRequest) => (
                    <div className="max-w-xs">
                      {row.statement ? (
                        <button
                          onClick={() => setViewStatementReq(row)}
                          className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                        >
                          <FileText className="h-3.5 w-3.5" /> View SOP & Skills
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">No SOP provided</span>
                      )}
                    </div>
                  )
                },
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
                    if (row.status === 'Approved') {
                      return <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1"><Check className="h-3 w-3" /> Enrolled</span>;
                    }
                    if (row.status === 'Rejected') {
                      return <span className="text-[10px] text-rose-500 font-bold flex items-center gap-1"><X className="h-3 w-3" /> Rejected</span>;
                    }

                    return (
                      <div className="flex items-center gap-1.5">
                        {/* Approve */}
                        <Button
                          variant="secondary"
                          size="sm"
                          className="py-1 px-2.5 text-xs font-bold"
                          onClick={() => handleMembership(row.id, 'approve')}
                        >
                          <Check className="h-3.5 w-3.5 mr-1" /> Approve
                        </Button>

                        {/* Waitlist */}
                        {row.status !== 'Waitlisted' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="py-1 px-2.5 text-xs text-amber-600 border-amber-200 dark:border-amber-900/40 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                            onClick={() => handleOpenReasonModal(row, 'waitlist')}
                          >
                            <Clock className="h-3.5 w-3.5 mr-1" /> Waitlist
                          </Button>
                        )}

                        {/* Reject */}
                        <Button
                          variant="outline"
                          size="sm"
                          className="py-1 px-2.5 text-xs text-rose-500 border-rose-200 dark:border-rose-900/40 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          onClick={() => handleOpenReasonModal(row, 'reject')}
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

      {/* Reject / Waitlist Feedback Modal */}
      <RejectReasonModal
        isOpen={!!reasonModalReq}
        onClose={() => setReasonModalReq(null)}
        request={reasonModalReq}
        actionType={modalActionType}
      />

      {/* SOP Statement Popover Modal */}
      {viewStatementReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-500" /> Statement of Purpose (SOP)
              </h3>
              <button onClick={() => setViewStatementReq(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="font-bold text-slate-800 dark:text-slate-200">{viewStatementReq.studentName}</span>
                <span className="text-slate-400">{viewStatementReq.department} ({viewStatementReq.year})</span>
              </div>

              {viewStatementReq.skills && (
                <div className="space-y-1">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Technical / Soft Skills:</span>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {viewStatementReq.skills.split(',').map((sk, i) => (
                      <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold">
                        {sk.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <span className="font-bold text-slate-700 dark:text-slate-300">Statement of Purpose:</span>
                <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 leading-relaxed italic">
                  "{viewStatementReq.statement}"
                </p>
              </div>

              {viewStatementReq.rejectionReason && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-300 space-y-1">
                  <span className="font-bold flex items-center gap-1"><AlertCircle className="h-3.5 w-3.5" /> Rejection / Waitlist Feedback:</span>
                  <p>{viewStatementReq.rejectionReason}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="outline" size="sm" onClick={() => setViewStatementReq(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
