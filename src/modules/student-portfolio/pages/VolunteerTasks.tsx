import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { Card, CardHeader, CardBody, Badge } from '../../common';

export const VolunteerTasks: React.FC = () => {
  const [tasks, setTasks] = useState([
    { id: '1', name: 'Swag Box unpacking & cataloging', deadline: 'Today, 04:00 PM', done: false },
    { id: '2', name: 'Mounting banners at seminar hall entrance', deadline: 'Today, 06:00 PM', done: true },
    { id: '3', name: 'Safety screening gates setup support', deadline: 'Tomorrow, 08:00 AM', done: false },
  ]);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Volunteer Tasks</h1>
        <p className="text-xs text-slate-400 mt-1">Review and mark completion on your operational checkpoints.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card hoverable={false} className="md:col-span-2">
          <CardHeader><h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Assigned Checkpoints</h3></CardHeader>
          <CardBody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {tasks.map(t => (
              <div key={t.id} className="flex justify-between items-center py-3.5 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={t.done} 
                    onChange={() => toggleTask(t.id)}
                    className="h-4.5 w-4.5 rounded border-slate-150 text-teal-650 focus:ring-teal-500 cursor-pointer"
                  />
                  <div>
                    <h4 className={`text-xs font-bold ${t.done ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-100'}`}>{t.name}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1"><Clock className="h-3 w-3" /> {t.deadline}</p>
                  </div>
                </div>
                <Badge variant={t.done ? 'secondary' : 'neutral'}>{t.done ? 'Finished' : 'Pending'}</Badge>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
