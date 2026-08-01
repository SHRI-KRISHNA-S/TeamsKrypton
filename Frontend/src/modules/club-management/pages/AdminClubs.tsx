import React from 'react';
import { Card, CardBody, Badge, Table } from '../../common';

export const AdminClubs: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Clubs Registry</h1>
        <p className="text-xs text-slate-400 mt-1">Create student clubs or assign faculty advisors.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="p-0">
          <Table 
            columns={[
              { header: 'Club Name', accessor: 'name' },
              { header: 'Category', accessor: 'cat' },
              { header: 'Advisor', accessor: 'advisor' },
              { header: 'Status', accessor: (row) => <Badge variant="secondary">{row.status}</Badge> }
            ]}
            data={[
              { name: 'Coding Club', cat: 'Technical', advisor: 'Dr. Sarah Jenkins', status: 'Active' },
              { name: 'Robotics Association', cat: 'Engineering', advisor: 'Prof. Marcus Vance', status: 'Active' }
            ]}
            keyExtractor={(row) => row.name}
          />
        </CardBody>
      </Card>
    </div>
  );
};
