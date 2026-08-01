import React, { useState, useRef } from 'react';
import { 
  Award, 
  Download, 
  Search, 
  Eye, 
  Trash2, 
  Edit3, 
  Plus, 
  Upload, 
  FileText, 
  X, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Loader2,
  ExternalLink,
  Tag
} from 'lucide-react';
import { Card, CardHeader, CardBody, CardFooter, Button, Modal, useApp, Certificate, Badge } from '../../common';
import { useAuth } from '../../auth/hooks/useAuth';

export const CertificateModule: React.FC = () => {
  const { certificates, uploadCertificate, deleteCertificate } = useApp();
  const { user } = useAuth();
  const currentRole = user ? user.role : 'student';

  const [search, setSearch] = useState('');
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  
  // Upload and Edit Form states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  // Form Inputs
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Hackathon');
  const [issuedBy, setIssuedBy] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [description, setDescription] = useState('');
  const [skillsText, setSkillsText] = useState('');
  const [certificateId, setCertificateId] = useState('');
  const [verificationUrl, setVerificationUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Progress & Validation states
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const categories = [
    'Academic', 'Hackathon', 'Workshop', 'Internship', 'Course Completion',
    'Competition', 'Volunteer', 'Sports', 'Cultural', 'Technical Event',
    'Research', 'Leadership', 'Other'
  ];

  const filteredCerts = certificates.filter(c => 
    c.event.toLowerCase().includes(search.toLowerCase()) || 
    (c.certificateId && c.certificateId.toLowerCase().includes(search.toLowerCase())) ||
    c.category?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    setFormError('');
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    
    if (!allowedTypes.includes(file.type)) {
      setFormError('Invalid format. Please upload PDF, JPG, JPEG, or PNG.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
      setFormError('File size exceeds the 10 MB limit.');
      return;
    }

    setSelectedFile(file);
  };

  const triggerUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    if (!selectedFile && !isEditing) {
      setFormError('Please select a certificate document to upload.');
      return;
    }

    setUploading(true);
    setUploadProgress(10);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => (prev < 90 ? prev + 15 : prev));
    }, 150);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('issuedBy', issuedBy);
      formData.append('issueDate', issueDate);
      if (expiryDate) formData.append('expiryDate', expiryDate);
      formData.append('description', description);
      
      const skillsArr = skillsText.split(',').map(s => s.trim()).filter(Boolean);
      formData.append('skills', JSON.stringify(skillsArr));
      
      if (certificateId) formData.append('certificateId', certificateId);
      if (verificationUrl) formData.append('verificationUrl', verificationUrl);
      
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const res = await uploadCertificate(formData);
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (res) {
        setTimeout(() => {
          resetForm();
          setShowUploadModal(false);
        }, 300);
      } else {
        setFormError('Failed to upload certificate. Please try again.');
      }
    } catch (err: any) {
      clearInterval(progressInterval);
      setFormError(err.response?.data?.message || 'Error occurred during upload.');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setCategory('Hackathon');
    setIssuedBy('');
    setIssueDate('');
    setExpiryDate('');
    setDescription('');
    setSkillsText('');
    setCertificateId('');
    setVerificationUrl('');
    setSelectedFile(null);
    setIsEditing(false);
    setEditId(null);
    setUploadProgress(0);
    setFormError('');
  };

  const triggerDownload = (cert: Certificate) => {
    if (cert.downloadUrl && cert.downloadUrl !== '#') {
      window.open(cert.downloadUrl, '_blank');
    } else {
      alert('Certificate document not available for download.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this certificate?')) {
      await deleteCertificate(id);
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg md:text-xl font-bold font-display text-slate-905 dark:text-white">Credentials Vault</h1>
          <p className="text-xs text-slate-400 mt-1">Access, upload, and verify your professional achievements.</p>
        </div>

        {currentRole === 'student' && (
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => { resetForm(); setShowUploadModal(true); }}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Upload Certificate
          </Button>
        )}
      </div>

      {/* Search and filters */}
      <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-slate-105 dark:border-slate-800 bg-white dark:bg-slate-900/60 max-w-md">
        <Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />
        <input 
          type="text" 
          placeholder="Filter by certificate ID, category or title..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-none outline-none w-full text-xs text-slate-850 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
        />
      </div>

      {/* Gallery Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCerts.length === 0 ? (
          <div className="md:col-span-3 text-center py-12 bg-white dark:bg-[#0E1322]/40 rounded-2xl border border-slate-100 dark:border-slate-800/80">
            <Award className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <p className="text-xs font-semibold text-slate-450 dark:text-slate-400">No certificates matching filter found.</p>
          </div>
        ) : (
          filteredCerts.map(cert => (
            <Card key={cert.id} hoverable={true} className="flex flex-col h-full border-t-4 border-t-indigo-500">
              <CardBody className="space-y-4 flex-grow">
                <div className="flex justify-between items-start">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 flex items-center justify-center">
                    <Award className="h-5 w-5" />
                  </div>
                  
                  {/* Status Badges */}
                  <div className="flex flex-col items-end gap-1.5">
                    {cert.status === 'APPROVED' && (
                      <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 select-none">
                        <CheckCircle2 className="h-3 w-3" /> Verified
                      </span>
                    )}
                    {cert.status === 'PENDING' && (
                      <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30 select-none animate-pulse">
                        <Clock className="h-3 w-3" /> Pending Review
                      </span>
                    )}
                    {cert.status === 'REJECTED' && (
                      <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-450 border border-rose-100 dark:border-rose-900/30 select-none">
                        <AlertCircle className="h-3 w-3" /> Rejected
                      </span>
                    )}
                    <span className="text-[9px] font-mono text-slate-400 tracking-wide font-bold">{cert.certificateId}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Badge variant="primary" className="text-[9px] py-0.5 px-2 bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-100 dark:border-indigo-900/25 text-indigo-500 font-semibold">{cert.category}</Badge>
                  <h3 className="text-xs font-bold font-display text-slate-900 dark:text-white line-clamp-1">{cert.event}</h3>
                  <p className="text-[10px] text-slate-400 font-semibold">{cert.approvedBy || 'Self-Uploaded Certificate'}</p>
                  
                  <div className="flex justify-between text-[9px] text-slate-400 font-bold border-t border-slate-50 dark:border-slate-800/40 pt-2.5">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {cert.date}</span>
                    <span className="text-emerald-500">AP: +{cert.activityPoints || 50}</span>
                  </div>
                </div>
              </CardBody>
              
              <CardFooter className="flex gap-2 border-t border-slate-50 dark:border-slate-800/40 bg-slate-50/20 dark:bg-slate-900/10">
                <Button variant="outline" size="sm" className="w-full text-[11px] font-semibold py-1.5" onClick={() => setSelectedCert(cert)}>
                  <Eye className="h-3.5 w-3.5 mr-1" /> View
                </Button>
                
                {cert.downloadUrl && cert.downloadUrl !== '#' && (
                  <Button variant="outline" size="sm" className="w-full text-[11px] font-semibold py-1.5" onClick={() => triggerDownload(cert)}>
                    <Download className="h-3.5 w-3.5 mr-1" /> Get File
                  </Button>
                )}

                {currentRole === 'student' && cert.status === 'PENDING' && (
                  <Button variant="ghost" size="sm" className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20" onClick={() => handleDelete(cert.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {/* Upload/Details Form Modal */}
      {showUploadModal && (
        <Modal
          isOpen={showUploadModal}
          onClose={() => { resetForm(); setShowUploadModal(false); }}
          title={isEditing ? 'Edit Certificate Details' : 'Upload Extracurricular Certificate'}
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => { resetForm(); setShowUploadModal(false); }}>Cancel</Button>
              <Button 
                variant="primary" 
                size="sm" 
                isLoading={uploading}
                onClick={triggerUploadSubmit}
              >
                {isEditing ? 'Update Details' : 'Submit for Review'}
              </Button>
            </>
          }
        >
          <form onSubmit={triggerUploadSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            {formError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/35 rounded-xl text-rose-600 dark:text-rose-450 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Document Upload Area (Only for Uploading, or replacing) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Supporting Document (Max 10 MB)</label>
              
              <div 
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                  dragActive 
                    ? 'border-primary bg-indigo-50/10 dark:bg-indigo-950/10' 
                    : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/20 dark:bg-slate-900/10'
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                />
                <Upload className="h-7 w-7 text-slate-400 mx-auto mb-2" />
                {selectedFile ? (
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-xs mx-auto">{selectedFile.name}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Click to replace file</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-bold text-slate-650 dark:text-slate-350">Drag & drop your certificate, or <span className="text-primary hover:underline">browse files</span></p>
                    <p className="text-[10px] text-slate-400 mt-1 font-semibold">Supported formats: PDF, JPG, JPEG, PNG</p>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Bar (Only during Uploading) */}
            {uploading && (
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                  <span>Uploading file...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-105 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Certificate Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. HackTech 2026 Winner"
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-transparent text-slate-850 dark:text-slate-150 outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-150 outline-none focus:border-primary"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat} className="dark:bg-[#0E1322]">{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Issuing Organization</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Google Developers Student Clubs"
                  value={issuedBy} 
                  onChange={(e) => setIssuedBy(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-transparent text-slate-850 dark:text-slate-150 outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Certificate ID (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. CERT-HT-2026-92"
                  value={certificateId} 
                  onChange={(e) => setCertificateId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-transparent text-slate-850 dark:text-slate-150 outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Date Issued</label>
                <input 
                  type="date" 
                  required
                  value={issueDate} 
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-transparent text-slate-850 dark:text-slate-150 outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Expiry Date (Optional)</label>
                <input 
                  type="date" 
                  value={expiryDate} 
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-transparent text-slate-850 dark:text-slate-150 outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Verification URL (Optional)</label>
              <input 
                type="url" 
                placeholder="e.g. https://certificates.google.com/verify/..."
                value={verificationUrl} 
                onChange={(e) => setVerificationUrl(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-transparent text-slate-850 dark:text-slate-150 outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Skills Earned (Comma-separated)</label>
              <input 
                type="text" 
                placeholder="e.g. React, TypeScript, UI Design, AWS"
                value={skillsText} 
                onChange={(e) => setSkillsText(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-transparent text-slate-850 dark:text-slate-150 outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Description</label>
              <textarea 
                rows={3}
                placeholder="Describe details about the certificate, event guidelines, or context..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-transparent text-slate-850 dark:text-slate-150 outline-none focus:border-primary"
              />
            </div>
          </form>
        </Modal>
      )}

      {/* Details/Verification Preview Modal */}
      {selectedCert && (
        <Modal
          isOpen={!!selectedCert}
          onClose={() => setSelectedCert(null)}
          title="Extracurricular Credentials Verification"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setSelectedCert(null)}>Close</Button>
              {selectedCert.downloadUrl && selectedCert.downloadUrl !== '#' && (
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={() => triggerDownload(selectedCert)}
                >
                  <Download className="h-4 w-4 mr-2" /> Download Document
                </Button>
              )}
            </>
          }
        >
          <div className="space-y-6">
            
            {/* Document Render Panel */}
            <div className="border border-slate-100 dark:border-slate-800/80 rounded-2xl bg-slate-50/20 dark:bg-slate-900/10 p-3 flex items-center justify-center overflow-hidden min-h-[220px]">
              {selectedCert.downloadUrl && selectedCert.downloadUrl !== '#' ? (
                selectedCert.documentType?.includes('pdf') ? (
                  <iframe 
                    src={selectedCert.downloadUrl} 
                    className="w-full h-80 border-none rounded-xl"
                    title="Certificate Preview"
                  />
                ) : (
                  <img 
                    src={selectedCert.downloadUrl} 
                    alt={selectedCert.event}
                    className="max-h-80 mx-auto object-contain rounded-xl shadow-md border dark:border-slate-800"
                  />
                )
              ) : (
                /* Fallback Visual Seal */
                <div className="text-center p-8 space-y-4 select-none relative overflow-hidden w-full">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
                    <Award className="h-40 w-40 text-primary animate-pulse" />
                  </div>
                  <h4 className="text-sm font-bold font-display text-indigo-500">CERTIFICATE OF PARTICIPATION</h4>
                  <p className="text-[10px] text-slate-400 italic">This document officially recognizes that</p>
                  <h3 className="text-base font-extrabold font-display text-slate-900 dark:text-white">Student Recipient</h3>
                  <p className="text-[10px] text-slate-450 leading-normal max-w-xs mx-auto">
                    has successfully registered, attended, and completed requirements for the event:
                  </p>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{selectedCert.event}</h4>
                </div>
              )}
            </div>

            {/* Document Metadata Details */}
            <div className="space-y-4 border-t border-slate-50 dark:border-slate-800/40 pt-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold block">CATEGORY</span>
                  <span className="font-semibold text-slate-850 dark:text-slate-200">{selectedCert.category || 'Extracurricular'}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-bold block">ISSUED BY</span>
                  <span className="font-semibold text-slate-850 dark:text-slate-200">{selectedCert.approvedBy || 'Self-Uploaded'}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-bold block">VERIFIED LEDGER ID</span>
                  <span className="font-semibold text-slate-850 dark:text-slate-200 font-mono">{selectedCert.certificateId}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-bold block">ISSUE DATE</span>
                  <span className="font-semibold text-slate-850 dark:text-slate-200">{selectedCert.date}</span>
                </div>
              </div>

              {selectedCert.verificationUrl && (
                <div>
                  <span className="text-[9px] text-slate-400 font-bold block">VERIFICATION GATEWAY</span>
                  <a 
                    href={selectedCert.verificationUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline font-semibold flex items-center gap-1.5 mt-1"
                  >
                    <span>Click to verify authenticity</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}

              {selectedCert.skills && selectedCert.skills.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[9px] text-slate-400 font-bold block">ACQUIRED SKILLS</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCert.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-[9px] py-0.5 px-2 flex items-center gap-1 font-semibold">
                        <Tag className="h-2.5 w-2.5" /> {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedCert.remarks && (
                <div className="p-3 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/40">
                  <span className="text-[9px] text-slate-400 font-bold block">REMARKS & REMINISCENCES</span>
                  <p className="text-xs text-slate-650 dark:text-slate-350 mt-1 leading-normal italic">
                    "{selectedCert.remarks}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
