import React, { useState } from 'react';
import { QrCode, CheckCircle2 } from 'lucide-react';
import { Card, CardBody, Button } from '../../common';

export const VolunteerScanner: React.FC = () => {
  const [ticketStatus, setTicketStatus] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  const simulateScan = () => {
    setScanning(true);
    setTicketStatus(null);
    setTimeout(() => {
      setScanning(false);
      setTicketStatus('verified');
      alert('Simulated Scan: Attendance logged for Student Amit Sharma (ID: ST-8932). Verification Success!');
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-slide-up max-w-md mx-auto">
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white text-center">Simulated QR Code Scanner</h1>
        <p className="text-xs text-slate-400 mt-1 text-center">Scan event tickets or badge check-ins.</p>
      </div>
      <Card hoverable={false} className="border-teal-200 dark:border-teal-900/40">
        <CardBody className="flex flex-col items-center py-8 space-y-6">
          <div className="h-48 w-full bg-slate-100 dark:bg-slate-900 rounded-2xl flex flex-col justify-center items-center text-xs text-slate-400 border-2 border-dashed border-slate-350 dark:border-slate-800 relative overflow-hidden">
            {scanning && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-teal-500 animate-bounce" />
            )}
            <QrCode className="h-10 w-10 text-teal-500 mb-2" />
            <span className="font-semibold">{scanning ? 'Simulating lens capture...' : 'Finder Box Ready'}</span>
          </div>

          <Button 
            variant="primary" 
            size="md" 
            isLoading={scanning} 
            onClick={simulateScan}
            className="w-full bg-teal-650 hover:bg-teal-700"
          >
            Trigger Scan Simulation
          </Button>

          {ticketStatus === 'verified' && (
            <div className="flex gap-2 items-center text-xs font-bold text-emerald-500">
              <CheckCircle2 className="h-4.5 w-4.5" />
              <span>Badge verified successfully!</span>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
