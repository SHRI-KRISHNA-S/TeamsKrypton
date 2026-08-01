import React from 'react';
import { Card, CardBody, Table } from '../../common';

export const AdminFaculty: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Faculty Directory</h1>
        <p className="text-xs text-slate-400 mt-1">Roster of assigned faculty coordinators.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="p-0">
          <Table 
            columns={[
              { header: 'Faculty Name', accessor: 'name' },
              { header: 'Academic Dept', accessor: 'dept' },
              { header: 'Coordinated Club', accessor: 'club' }
            ]}
            data={[
              { name: 'Dr. Sarah Jenkins', dept: 'CSE Dept', club: 'Coding Club' },
              { name: 'Prof. Marcus Vance', dept: 'Mechanical Dept', club: 'Robotics Association' }
            ]}
            keyExtractor={(row) => row.name}
          />
        </CardBody>
      </Card>
    </div>
  );
};
