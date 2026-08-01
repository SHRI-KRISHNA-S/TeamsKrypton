import React, { useState } from 'react';
import { Award, Download, Search, Eye, ExternalLink, Calendar, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardBody, CardFooter, Button, Modal, useApp, Certificate } from '../../common';

export const CertificateModule: React.FC = () => {
  const { certificates } = useApp();
  const [search, setSearch] = useState('');
  
  // Modal preview state
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [downloading, setDownloading] = useState(false);

  const filteredCerts = certificates.filter(c => 
    c.event.toLowerCase().includes(search.toLowerCase()) || 
    c.certificateId.toLowerCase().includes(search.toLowerCase())
  );

  const triggerDownload = (cert: Certificate) => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      // Simulate file download by popping up an alert/success
      alert(`Download success: Certificate ${cert.certificateId} file saved to local Downloads folder.`);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Title */}
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Credentials Vault</h1>
        <p className="text-xs text-slate-400 mt-1">Access, preview, and download your verified extracurricular achievements.</p>
      </div>

      {/* Search and filters */}
      <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 max-w-md">
        <Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />
        <input 
          type="text" 
          placeholder="Filter by certificate ID or event name..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-none outline-none w-full text-xs text-slate-850 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
        />
      </div>

      {/* Gallery Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCerts.map(cert => (
          <Card key={cert.id} hoverable={true} className="flex flex-col h-full border-t-4 border-t-amber-500">
            <CardBody className="space-y-4 flex-grow">
              <div className="flex justify-between items-start">
                <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-500 flex items-center justify-center">
                  <Award className="h-5 w-5" />
                </div>
                <span className="text-[9px] font-bold text-slate-400 tracking-wide font-sans">{cert.certificateId}</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-bold font-display text-slate-900 dark:text-white">{cert.event}</h3>
                <p className="text-[9px] text-slate-400 font-semibold flex items-center gap-1"><Calendar className="h-3 w-3" /> Issued on: {cert.date}</p>
              </div>
            </CardBody>
            <CardFooter className="flex gap-2 border-t border-slate-50 dark:border-slate-800/40">
              <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => setSelectedCert(cert)}>
                <Eye className="h-3.5 w-3.5 mr-1.5" /> Preview
              </Button>
              <Button variant="primary" size="sm" className="w-full text-xs" onClick={() => triggerDownload(cert)}>
                <Download className="h-3.5 w-3.5 mr-1.5" /> Download
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Preview Modal */}
      {selectedCert && (
        <Modal
          isOpen={!!selectedCert}
          onClose={() => setSelectedCert(null)}
          title="Extracurricular Credentials Verification"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setSelectedCert(null)}>Close</Button>
              <Button 
                variant="primary" 
                size="sm" 
                isLoading={downloading}
                onClick={() => triggerDownload(selectedCert)}
              >
                <Download className="h-4 w-4 mr-2" /> Download PDF
              </Button>
            </>
          }
        >
          {/* Certificate visual mock */}
          <div className="border-8 border-slate-100 dark:border-slate-800 p-8 rounded-2xl bg-white dark:bg-[#0E1322] space-y-6 text-center shadow-inner relative overflow-hidden">
            {/* Visual background seal */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
              <Award className="h-56 w-56 text-primary" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold font-display text-indigo-500">CERTIFICATE OF PARTICIPATION</h2>
              <span className="text-[10px] text-slate-400 font-bold tracking-wider">SECURED ACADEMIC CREDENTIALS</span>
            </div>

            <div className="space-y-1.5">
              <p className="text-[11px] text-slate-400 italic">This document officially recognizes that</p>
              <h3 className="text-base font-extrabold font-display text-slate-900 dark:text-white">Amit Sharma</h3>
              <p className="text-[11px] text-slate-450 max-w-sm mx-auto leading-normal">
                has successfully registered, attended, and completed requirements for the event
              </p>
              <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200 mt-2">{selectedCert.event}</h4>
            </div>

            <div className="flex justify-between items-end border-t border-slate-100 dark:border-slate-800/80 pt-6 mt-6 text-left">
              <div>
                <span className="text-[9px] text-slate-400 font-bold block">VERIFIED LEDGER ID</span>
                <span className="text-[10px] text-slate-800 dark:text-slate-200 font-mono font-bold">{selectedCert.certificateId}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-slate-400 font-bold block">ISSUE DATE</span>
                <span className="text-[10px] text-slate-800 dark:text-slate-200 font-semibold">{selectedCert.date}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
