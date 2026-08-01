import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardBody, 
  Badge, 
  Button, 
  Table, 
  useApp, 
  Club 
} from '../../common';
import { ClubFormModal } from '../components/ClubFormModal';
import { ClubAssignModal } from '../components/ClubAssignModal';
import { 
  Plus, 
  Search, 
  Edit3, 
  UserCheck, 
  Archive, 
  Trash2, 
  Shield, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Filter,
  RefreshCw
} from 'lucide-react';

export const AdminClubs: React.FC = () => {
  const { 
    clubs, 
    currentRole, 
    changeClubStatus, 
    archiveClub, 
    deleteClub 
  } = useApp();

  // State management for modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [clubToEdit, setClubToEdit] = useState<Club | null>(null);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [clubToAssign, setClubToAssign] = useState<Club | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Confirmation modal state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const categories = ['All', 'Technical', 'Engineering', 'Arts & Humanities', 'Business', 'Creative Arts', 'Sports', 'Media'];
  const statuses = ['All', 'Active', 'Inactive', 'Archived'];

  // Filtered dataset
  const filteredClubs = clubs.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (c.code && c.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.facultyCoordinator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.president.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' ? true : c.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' ? true : c.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Calculate statistics
  const totalClubs = clubs.length;
  const activeClubs = clubs.filter(c => c.status === 'Active').length;
  const inactiveClubs = clubs.filter(c => c.status === 'Inactive').length;
  const archivedClubs = clubs.filter(c => c.status === 'Archived').length;
  const totalMembers = clubs.reduce((acc, curr) => acc + (curr.membersCount || 0), 0);

  const handleOpenCreate = () => {
    setClubToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (club: Club) => {
    setClubToEdit(club);
    setIsFormModalOpen(true);
  };

  const handleOpenAssign = (club: Club) => {
    setClubToAssign(club);
    setIsAssignModalOpen(true);
  };

  const handleConfirmDelete = (id: string) => {
    deleteClub(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Clubs Governance Console
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Create campus student clubs, assign faculty advisors, toggle activity status, and manage registry credentials.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={handleOpenCreate} className="flex items-center gap-2 font-bold shadow-md shadow-indigo-500/10">
          <Plus className="h-4 w-4" /> Create New Club
        </Button>
      </div>

      {/* Statistical Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card hoverable={false} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322]/60">
          <CardBody className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-bold font-display text-slate-900 dark:text-white">{totalClubs}</div>
              <div className="text-[10px] font-semibold text-slate-400">Total Registry</div>
            </div>
          </CardBody>
        </Card>

        <Card hoverable={false} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322]/60">
          <CardBody className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-bold font-display text-emerald-600 dark:text-emerald-400">{activeClubs}</div>
              <div className="text-[10px] font-semibold text-slate-400">Active Clubs</div>
            </div>
          </CardBody>
        </Card>

        <Card hoverable={false} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322]/60">
          <CardBody className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <XCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-bold font-display text-amber-600 dark:text-amber-400">{inactiveClubs}</div>
              <div className="text-[10px] font-semibold text-slate-400">Inactive</div>
            </div>
          </CardBody>
        </Card>

        <Card hoverable={false} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322]/60">
          <CardBody className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500">
              <Archive className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-bold font-display text-slate-700 dark:text-slate-300">{archivedClubs}</div>
              <div className="text-[10px] font-semibold text-slate-400">Archived</div>
            </div>
          </CardBody>
        </Card>

        <Card hoverable={false} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322]/60 col-span-2 lg:col-span-1">
          <CardBody className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-bold font-display text-slate-900 dark:text-white">{totalMembers}</div>
              <div className="text-[10px] font-semibold text-slate-400">Enrolled Students</div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filter Controls Bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#0E1322]/80 shadow-sm">
        {/* Search */}
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 w-full sm:w-72">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by club, code, advisor..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-xs text-slate-850 dark:text-slate-200 placeholder-slate-400"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <Filter className="h-3.5 w-3.5" /> Filter:
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 outline-none"
          >
            {statuses.map(st => (
              <option key={st} value={st}>Status: {st}</option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 outline-none"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>Category: {cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Clubs Datatable */}
      <Card hoverable={false} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322] overflow-hidden">
        <CardBody className="p-0">
          {filteredClubs.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Users className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Clubs Found</h3>
              <p className="text-xs text-slate-400">Try clearing your filters or create a new club.</p>
            </div>
          ) : (
            <Table
              columns={[
                {
                  header: 'Club & Tag',
                  accessor: (row: Club) => (
                    <div className="flex items-center gap-3">
                      <img src={row.logo} alt={row.name} className="h-10 w-10 rounded-xl object-cover border border-slate-100 dark:border-slate-800 shadow-sm" />
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          {row.name}
                          {row.code && <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">{row.code}</span>}
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold">{row.category} • {row.membersCount || 0} Members</span>
                      </div>
                    </div>
                  )
                },
                {
                  header: 'Faculty Coordinator',
                  accessor: (row: Club) => (
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {row.facultyCoordinator || <span className="text-slate-400 italic">Unassigned</span>}
                    </div>
                  )
                },
                {
                  header: 'President',
                  accessor: (row: Club) => (
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {row.president || <span className="text-slate-400 italic">Unassigned</span>}
                    </div>
                  )
                },
                {
                  header: 'Status',
                  accessor: (row: Club) => (
                    <div className="flex items-center gap-1.5">
                      <Badge 
                        variant={row.status === 'Active' ? 'secondary' : row.status === 'Inactive' ? 'accent' : 'neutral'}
                        className="py-0.5 px-2 text-[10px]"
                      >
                        {row.status || 'Active'}
                      </Badge>
                      <span className="text-[9px] text-slate-400 uppercase font-bold">({row.visibility || 'Public'})</span>
                    </div>
                  )
                },
                {
                  header: 'Actions',
                  accessor: (row: Club) => (
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Assign Leaders */}
                      <button
                        title="Assign Faculty / President"
                        onClick={() => handleOpenAssign(row)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-indigo-600 dark:text-indigo-400 cursor-pointer"
                      >
                        <UserCheck className="h-3.5 w-3.5" />
                      </button>

                      {/* Edit Details */}
                      <button
                        title="Edit Club Details"
                        onClick={() => handleOpenEdit(row)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>

                      {/* Status Toggle dropdown / buttons */}
                      {row.status === 'Active' ? (
                        <button
                          title="Deactivate Club"
                          onClick={() => changeClubStatus(row.id, 'Inactive')}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-600 dark:text-amber-400 cursor-pointer"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                        </button>
                      ) : (
                        <button
                          title="Activate Club"
                          onClick={() => changeClubStatus(row.id, 'Active')}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 cursor-pointer"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </button>
                      )}

                      {/* Archive */}
                      {row.status !== 'Archived' && (
                        <button
                          title="Archive Club"
                          onClick={() => archiveClub(row.id)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
                        >
                          <Archive className="h-3.5 w-3.5" />
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        title="Delete Club"
                        onClick={() => setDeleteConfirmId(row.id)}
                        className="p-1.5 rounded-lg border border-rose-100 dark:border-rose-900/30 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )
                }
              ]}
              data={filteredClubs}
              keyExtractor={(row) => row.id}
            />
          )}
        </CardBody>
      </Card>

      {/* Club Create / Edit Form Modal */}
      <ClubFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        clubToEdit={clubToEdit}
      />

      {/* Leadership Assignment Modal */}
      <ClubAssignModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        club={clubToAssign}
      />

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl animate-scale-up">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Trash2 className="h-4 w-4 text-rose-500" /> Confirm Club Deletion
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to permanently remove this club from the registry? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={() => handleConfirmDelete(deleteConfirmId)}>
                Delete Permanently
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
