import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Card, CardBody, Badge, Button, Table } from '../../common';

export const PresidentMembers: React.FC = () => {
  const [members, setMembers] = useState([
    { id: '1', name: 'Jane Doe', role: 'Volunteer', status: 'Active' },
    { id: '2', name: 'Mark Smith', role: 'Committee Member', status: 'Active' },
    { id: '3', name: 'Alice Johnson', role: 'Student Member', status: 'Active' }
  ]);

  const removeMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    alert('Simulated Action: Member credentials removed from roster.');
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Manage Club Members</h1>
        <p className="text-xs text-slate-400 mt-1">Edit designations, view roles, or remove members from rosters.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="p-0">
          <Table 
            columns={[
              { header: 'Member Name', accessor: 'name' },
              { header: 'Designation Role', accessor: 'role' },
              { header: 'Current Status', accessor: (row) => <Badge variant="secondary">{row.status}</Badge> },
              { 
                header: 'Control', 
                accessor: (row) => (
                  <Button variant="outline" size="sm" className="text-rose-500 border-rose-200" onClick={() => removeMember(row.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                ) 
              }
            ]}
            data={members}
            keyExtractor={(row) => row.id}
          />
        </CardBody>
      </Card>
    </div>
  );
};
