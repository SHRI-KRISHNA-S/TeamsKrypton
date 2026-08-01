import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardBody, 
  Badge, 
  Button, 
  Table, 
  useApp, 
  ClubMember, 
  CommitteeRole 
} from '../../common';
import { MemberRoleModal } from '../components/MemberRoleModal';
import { AddMemberModal } from '../components/AddMemberModal';
import { 
  Users, 
  UserPlus, 
  Award, 
  ShieldAlert, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  UserCheck, 
  Crown,
  ChevronRight
} from 'lucide-react';

export const PresidentMembers: React.FC = () => {
  const { 
    clubMembers, 
    clubs, 
    updateMemberRole, 
    removeClubMember, 
    toggleMemberStatus, 
    currentRole 
  } = useApp();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [deptFilter, setDeptFilter] = useState<string>('All');
  const [yearFilter, setYearFilter] = useState<string>('All');
  const [selectedClubIdFilter, setSelectedClubIdFilter] = useState<string>('All');

  // Modal states
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedMemberForRole, setSelectedMemberForRole] = useState<ClubMember | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteConfirmMemberId, setDeleteConfirmMemberId] = useState<string | null>(null);

  const roles = ['All', 'President', 'Vice President', 'Secretary', 'Treasurer', 'Core Member', 'General Member'];
  const years = ['All', 'Year I', 'Year II', 'Year III', 'Year IV'];
  const depts = [
    'All',
    'Computer Science & Engineering',
    'Information Technology',
    'Mechanical Engineering',
    'Humanities & Social Sciences',
    'School of Management',
    'Media & Design',
  ];

  // Filtered dataset
  const filteredMembers = clubMembers.filter(m => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'All' ? true : m.role === roleFilter;
    const matchesDept = deptFilter === 'All' ? true : m.department === deptFilter;
    const matchesYear = yearFilter === 'All' ? true : m.academicYear === yearFilter;
    const matchesClub = selectedClubIdFilter === 'All' ? true : m.clubId === selectedClubIdFilter;

    return matchesSearch && matchesRole && matchesDept && matchesYear && matchesClub;
  });

  // Calculate stats
  const totalRoster = clubMembers.length;
  const executiveCount = clubMembers.filter(m => ['President', 'Vice President', 'Secretary', 'Treasurer'].includes(m.role)).length;
  const coreCount = clubMembers.filter(m => m.role === 'Core Member').length;
  const generalCount = clubMembers.filter(m => m.role === 'General Member').length;

  const handleOpenRoleModal = (member: ClubMember) => {
    setSelectedMemberForRole(member);
    setIsRoleModalOpen(true);
  };

  const handleConfirmDelete = (id: string) => {
    removeClubMember(id);
    setDeleteConfirmMemberId(null);
  };

  const getRoleBadgeVariant = (role: CommitteeRole) => {
    switch (role) {
      case 'President':
        return 'primary';
      case 'Vice President':
        return 'secondary';
      case 'Secretary':
      case 'Treasurer':
        return 'accent';
      case 'Core Member':
        return 'info';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Club Members & Committee Governance
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage executive designations, promote committee members, handle member enrollment, and oversee roster credentials.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 font-bold shadow-md shadow-indigo-500/10">
          <UserPlus className="h-4 w-4" /> Enroll New Member
        </Button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hoverable={false} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322]">
          <CardBody className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-bold font-display text-slate-900 dark:text-white">{totalRoster}</div>
              <div className="text-[10px] font-semibold text-slate-400">Total Members</div>
            </div>
          </CardBody>
        </Card>

        <Card hoverable={false} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322]">
          <CardBody className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <Crown className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-bold font-display text-amber-600 dark:text-amber-400">{executiveCount}</div>
              <div className="text-[10px] font-semibold text-slate-400">Executive Officers</div>
            </div>
          </CardBody>
        </Card>

        <Card hoverable={false} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322]">
          <CardBody className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-bold font-display text-sky-600 dark:text-sky-400">{coreCount}</div>
              <div className="text-[10px] font-semibold text-slate-400">Core Committee</div>
            </div>
          </CardBody>
        </Card>

        <Card hoverable={false} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322]">
          <CardBody className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-bold font-display text-slate-700 dark:text-slate-300">{generalCount}</div>
              <div className="text-[10px] font-semibold text-slate-400">General Members</div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filter and Search Controls */}
      <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#0E1322] space-y-3 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          {/* Search bar */}
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 w-full sm:w-80">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, student ID, email..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-xs text-slate-850 dark:text-slate-200 placeholder-slate-400"
            />
          </div>

          {/* Club selector if multiple */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Club:</span>
            <select
              value={selectedClubIdFilter}
              onChange={e => setSelectedClubIdFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 outline-none"
            >
              <option value="All">All Clubs</option>
              {clubs.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mr-1">
            <Filter className="h-3.5 w-3.5" /> Filters:
          </div>

          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 outline-none"
          >
            {roles.map(r => (
              <option key={r} value={r}>Role: {r}</option>
            ))}
          </select>

          <select
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 outline-none"
          >
            {depts.map(d => (
              <option key={d} value={d}>Dept: {d}</option>
            ))}
          </select>

          <select
            value={yearFilter}
            onChange={e => setYearFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 outline-none"
          >
            {years.map(y => (
              <option key={y} value={y}>Year: {y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Roster Table */}
      <Card hoverable={false} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322] overflow-hidden">
        <CardBody className="p-0">
          {filteredMembers.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Users className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Members Match Search Criteria</h3>
              <p className="text-xs text-slate-400">Try adjusting your filters or enroll a new member.</p>
            </div>
          ) : (
            <Table
              columns={[
                {
                  header: 'Member Profile',
                  accessor: (row: ClubMember) => (
                    <div className="flex items-center gap-3">
                      <img src={row.avatar} alt={row.name} className="h-9 w-9 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          {row.name}
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">{row.studentId}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold">{row.email}</span>
                      </div>
                    </div>
                  )
                },
                {
                  header: 'Department & Year',
                  accessor: (row: ClubMember) => (
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <div>{row.department}</div>
                      <span className="text-[10px] text-slate-400">{row.academicYear}</span>
                    </div>
                  )
                },
                {
                  header: 'Committee Role',
                  accessor: (row: ClubMember) => (
                    <Badge variant={getRoleBadgeVariant(row.role)} className="py-0.5 px-2 text-[10px] font-bold">
                      {row.role}
                    </Badge>
                  )
                },
                {
                  header: 'Status',
                  accessor: (row: ClubMember) => (
                    <Badge variant={row.status === 'Active' ? 'secondary' : 'accent'} className="py-0.5 px-1.5 text-[9px]">
                      {row.status}
                    </Badge>
                  )
                },
                {
                  header: 'Controls',
                  accessor: (row: ClubMember) => (
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Promote / Change Role */}
                      <button
                        title="Promote / Change Role"
                        onClick={() => handleOpenRoleModal(row)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-indigo-600 dark:text-indigo-400 cursor-pointer"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>

                      {/* Toggle Status */}
                      <button
                        title={row.status === 'Active' ? 'Set Inactive' : 'Set Active'}
                        onClick={() => toggleMemberStatus(row.id)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer"
                      >
                        {row.status === 'Active' ? <XCircle className="h-3.5 w-3.5 text-amber-500" /> : <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
                      </button>

                      {/* Remove Member */}
                      <button
                        title="Remove Member"
                        onClick={() => setDeleteConfirmMemberId(row.id)}
                        className="p-1.5 rounded-lg border border-rose-100 dark:border-rose-900/30 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )
                }
              ]}
              data={filteredMembers}
              keyExtractor={(row) => row.id}
            />
          )}
        </CardBody>
      </Card>

      {/* Role Change Modal */}
      <MemberRoleModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        member={selectedMemberForRole}
      />

      {/* Enroll New Member Modal */}
      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Delete Confirmation Dialog */}
      {deleteConfirmMemberId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl animate-scale-up">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Trash2 className="h-4 w-4 text-rose-500" /> Confirm Member Removal
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to remove this member from the club roster? This action will revoke their committee access.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setDeleteConfirmMemberId(null)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={() => handleConfirmDelete(deleteConfirmMemberId)}>
                Remove Member
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
