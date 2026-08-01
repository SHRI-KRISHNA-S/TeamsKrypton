import React from 'react';
import { Card, CardBody, Badge, Table } from '../../common';

export const SuperAdminOrganizations: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Campus Chapters</h1>
        <p className="text-xs text-slate-400 mt-1">Review global settings for registered campus branches.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="p-0">
          <Table 
            columns={[
              { header: 'Branch Name', accessor: 'name' },
              { header: 'Database Instance', accessor: 'db' },
              { header: 'Status', accessor: (row) => <Badge variant="secondary">{row.status}</Badge> }
            ]}
            data={[
              { name: 'Tech Central Campus', db: 'postgres-prod-01', status: 'Connected' },
              { name: 'West Valley Campus', db: 'postgres-prod-02', status: 'Connected' }
            ]}
            keyExtractor={(row) => row.name}
          />
        </CardBody>
      </Card>
    </div>
  );
};
