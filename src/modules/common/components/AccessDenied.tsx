import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Card, CardBody } from './Card';
import { Button } from './Button';

export const AccessDenied: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center px-6 animate-fade-in">
      <Card hoverable={false} className="max-w-md w-full border-rose-100 dark:border-rose-950/40 text-center p-8 bg-rose-500/[0.01]">
        <CardBody className="space-y-6 flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-rose-50 dark:bg-rose-950/20 text-rose-500 flex items-center justify-center">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold font-display text-slate-905 dark:text-white">403 - Access Denied</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Your active portal role does not have authorization to inspect this resource. Administrative clearance is required.
            </p>
          </div>
          <Button 
            variant="primary" 
            size="md" 
            onClick={() => navigate('/dashboard')}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            className="w-full bg-rose-600 hover:bg-rose-700"
          >
            Back to Dashboard
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};
