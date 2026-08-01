import React from 'react';
import { Award } from 'lucide-react';
import { Card, CardBody, Button } from '../../common';

export const PresidentGallery: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Club Gallery</h1>
        <p className="text-xs text-slate-400 mt-1">Post updates and upload photos of team events.</p>
      </div>
      <Card hoverable={false}>
        <CardBody className="py-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center">
          <Award className="h-8 w-8 text-purple-500 mb-2" />
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">Upload new club photos</h3>
          <Button variant="primary" size="sm" className="mt-4 bg-purple-600 hover:bg-purple-700">Choose Photos</Button>
        </CardBody>
      </Card>
    </div>
  );
};
