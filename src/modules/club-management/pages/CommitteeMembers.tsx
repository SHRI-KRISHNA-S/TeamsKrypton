import React from 'react';
import { Card, CardBody, Table } from '../../common';

export const CommitteeMembers: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Club Rosters</h1>
        <p className="text-xs text-slate-400 mt-1">Directory of registered members in your department clubs.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="p-0">
          <Table 
            columns={[
              { header: 'Member Profile', accessor: 'name' },
              { header: 'Departement', accessor: 'dept' },
              { header: 'Roster Role', accessor: 'role' },
              { header: 'Term Joined', accessor: 'term' }
            ]}
            data={[
              { name: 'Amit Sharma', dept: 'CS Department', role: 'Student Member', term: 'Winter 2025' },
              { name: 'Alex Mercer', dept: 'CS Department', role: 'Club President', term: 'Fall 2024' },
              { name: 'Nisha Patel', dept: 'ME Department', role: 'Volunteer Staff', term: 'Fall 2025' }
            ]}
            keyExtractor={(row) => row.name}
          />
        </CardBody>
      </Card>
    </div>
  );
};
