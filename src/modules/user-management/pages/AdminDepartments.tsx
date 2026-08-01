import React from 'react';
import { Card, CardBody, ProgressBar } from '../../common';

export const AdminDepartments: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Department Registries</h1>
        <p className="text-xs text-slate-400 mt-1">Review department analytics and student coordinates.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span>Computer Science & Engineering</span>
              <span>450 Active Students</span>
            </div>
            <ProgressBar value={450} max={600} color="primary" />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
