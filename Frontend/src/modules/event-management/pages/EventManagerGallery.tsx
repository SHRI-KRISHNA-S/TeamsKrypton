import React from 'react';
import { Calendar } from 'lucide-react';
import { Card, CardBody, Button } from '../../common';

export const EventManagerGallery: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Event Media Manager</h1>
        <p className="text-xs text-slate-400 mt-1">Upload and catalog photography highlights for student reviews.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="py-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center">
          <Calendar className="h-8 w-8 text-orange-500 mb-2" />
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">Drop your event photography folders here</h3>
          <p className="text-[10px] text-slate-400 mt-1">Supports raw, PNG, and JPEG. Max upload folder size: 100 MB.</p>
          <Button variant="primary" size="sm" className="mt-4 bg-orange-650 hover:bg-orange-700">Choose Files</Button>
        </CardBody>
      </Card>
    </div>
  );
};
