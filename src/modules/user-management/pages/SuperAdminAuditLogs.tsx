import React from 'react';
import { Card, CardBody, Badge, Table } from '../../common';

export const SuperAdminAuditLogs: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Platform Audit Trail</h1>
        <p className="text-xs text-slate-400 mt-1">Tamper-proof history of administrative actions.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="p-0">
          <Table 
            columns={[
              { header: 'Action Details', accessor: 'action' },
              { header: 'Initiated By', accessor: 'user' },
              { header: 'IP Coordinates', accessor: 'ip' },
              { header: 'Result', accessor: (row) => <Badge variant="secondary">{row.result}</Badge> }
            ]}
            data={[
              { action: 'Role permissions modified: committee', user: 'Root Admin', ip: '192.168.1.104', result: 'Success' },
              { action: 'Database backup checkpoint initialized', user: 'Cron Daemon', ip: 'localhost', result: 'Success' },
              { action: 'Emergency system configurations update', user: 'Root Admin', ip: '192.168.1.104', result: 'Success' }
            ]}
            keyExtractor={(row) => row.action}
          />
        </CardBody>
      </Card>
    </div>
  );
};
