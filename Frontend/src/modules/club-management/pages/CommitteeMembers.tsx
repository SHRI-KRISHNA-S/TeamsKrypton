import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardBody, 
  Badge, 
  Table, 
  useApp, 
  ClubMember, 
  CommitteeRole 
} from '../../common';
import { 
  Users, 
  Crown, 
  Award, 
  Mail, 
  Building, 
  Search, 
  Filter, 
  CheckCircle, 
  Shield 
} from 'lucide-react';

export const CommitteeMembers: React.FC = () => {
  const { clubMembers, clubs } = useApp();

  const [selectedClubId, setSelectedClubId] = useState<string>('club-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');

  // Filter members for active club
  const clubRoster = clubMembers.filter(m => m.clubId === selectedClubId || selectedClubId === 'All');

  const filteredRoster = clubRoster.filter(m => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'All' ? true : m.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Extract executive officers (President, VP, Secretary, Treasurer)
  const executiveOfficers = clubRoster.filter(m => 
    ['President', 'Vice President', 'Secretary', 'Treasurer'].includes(m.role)
  );

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

  const activeClubObj = clubs.find(c => c.id === selectedClubId);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <Crown className="h-6 w-6 text-amber-500" />
            Executive Committee & Club Rosters
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Directory of executive officers, committee leads, and enrolled student members across campus organizations.
          </p>
        </div>

        {/* Club Selector Tabs */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none max-w-full py-1">
          {clubs.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedClubId(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer border whitespace-nowrap transition-all ${
                selectedClubId === c.id
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-[#0E1322] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Executive Committee Showcase */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Shield className="h-4 w-4 text-indigo-500" />
          Executive Officers ({activeClubObj?.name || 'Selected Club'})
        </h3>

        {executiveOfficers.length === 0 ? (
          <Card className="p-6 text-center border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322]/50">
            <CardBody className="py-4 text-slate-400 text-xs">
              No executive officers assigned to this roster yet.
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {executiveOfficers.map(officer => (
              <Card key={officer.id} hoverable={true} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322]">
                <CardBody className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <img src={officer.avatar} alt={officer.name} className="h-12 w-12 rounded-full object-cover border-2 border-indigo-500/30 shadow-md" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{officer.name}</h4>
                      <Badge variant={getRoleBadgeVariant(officer.role)} className="py-0.5 px-2 text-[9px] mt-0.5 font-bold">
                        {officer.role}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Building className="h-3.5 w-3.5 text-slate-400" />
                      <span className="truncate">{officer.department}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      <span className="truncate">{officer.email}</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* General Roster Table Header & Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#0E1322]">
          {/* Search */}
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 max-w-md w-full">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search member roster..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-xs text-slate-850 dark:text-slate-200 placeholder-slate-400"
            />
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1"><Filter className="h-3.5 w-3.5"/> Role:</span>
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 outline-none"
            >
              <option value="All">All Roles</option>
              <option value="President">President</option>
              <option value="Vice President">Vice President</option>
              <option value="Secretary">Secretary</option>
              <option value="Treasurer">Treasurer</option>
              <option value="Core Member">Core Member</option>
              <option value="General Member">General Member</option>
            </select>
          </div>
        </div>

        {/* Full Datatable */}
        <Card hoverable={false} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322] overflow-hidden">
          <CardBody className="p-0">
            {filteredRoster.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs space-y-2">
                <Users className="h-8 w-8 mx-auto text-slate-300 dark:text-slate-600" />
                <p>No members match the current search filter.</p>
              </div>
            ) : (
              <Table
                columns={[
                  {
                    header: 'Member Profile',
                    accessor: (row: ClubMember) => (
                      <div className="flex items-center gap-3">
                        <img src={row.avatar} alt={row.name} className="h-9 w-9 rounded-full object-cover border border-slate-100 dark:border-slate-800 shadow-sm" />
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
                    header: 'Department',
                    accessor: (row: ClubMember) => (
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {row.department}
                      </div>
                    )
                  },
                  {
                    header: 'Year',
                    accessor: (row: ClubMember) => (
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {row.academicYear}
                      </div>
                    )
                  },
                  {
                    header: 'Designation Role',
                    accessor: (row: ClubMember) => (
                      <Badge variant={getRoleBadgeVariant(row.role)} className="py-0.5 px-2 text-[10px] font-bold">
                        {row.role}
                      </Badge>
                    )
                  },
                  {
                    header: 'Joined Date',
                    accessor: (row: ClubMember) => (
                      <div className="text-xs text-slate-400">
                        {row.joinedDate}
                      </div>
                    )
                  }
                ]}
                data={filteredRoster}
                keyExtractor={(row) => row.id}
              />
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
