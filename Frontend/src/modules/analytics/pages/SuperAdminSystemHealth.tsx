import React from 'react';
import { Card, CardBody } from '../../common';

export const SuperAdminSystemHealth: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Infrastructure Health</h1>
        <p className="text-xs text-slate-400 mt-1 font-medium">Uptime monitoring of database and api endpoints.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hoverable={false}>
          <CardBody className="space-y-2 text-center">
            <div className="text-2xl font-bold text-emerald-500 font-display">99.98%</div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">API Gateway Uptime</div>
          </CardBody>
        </Card>
        <Card hoverable={false}>
          <CardBody className="space-y-2 text-center">
            <div className="text-2xl font-bold text-emerald-500 font-display">Healthy</div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Database Cluster</div>
          </CardBody>
        </Card>
        <Card hoverable={false}>
          <CardBody className="space-y-2 text-center">
            <div className="text-2xl font-bold text-indigo-500 font-display">42ms</div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Avg Response Latency</div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
