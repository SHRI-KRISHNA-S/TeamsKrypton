import React, { useState } from 'react';
import { User, Lock, Bell, Eye, Shield, Save, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardBody, Button, Badge, useApp } from '../../common';

type SettingsTab = 'profile' | 'security' | 'notifications' | 'appearance';

export const SettingsModule: React.FC = () => {
  const { currentRole, theme, toggleTheme } = useApp();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states
  const [name, setName] = useState(
    currentRole === 'student' ? 'Amit Sharma' : currentRole === 'president' ? 'Alex Mercer' : 'Dr. Sarah Jenkins'
  );
  const [bio, setBio] = useState('Passionate about student activities and collaborative software development.');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    setTimeout(() => {
      setSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-slide-up">
      {/* Title */}
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-905 dark:text-white font-sans">Settings & Account Control</h1>
        <p className="text-xs text-slate-400 mt-1 font-medium">Update settings, secure passwords, configure notifications, and configure styling.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Side: Navigation Tabs */}
        <div className="md:col-span-4 space-y-1 bg-white dark:bg-[#0E1322]/50 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-2.5 h-max">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-3 text-xs font-semibold rounded-xl text-left cursor-pointer transition-colors ${
              activeTab === 'profile'
                ? 'bg-primary text-white'
                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900/60 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <User className="h-4.5 w-4.5 flex-shrink-0" />
            <span>Profile Information</span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-3 text-xs font-semibold rounded-xl text-left cursor-pointer transition-colors ${
              activeTab === 'security'
                ? 'bg-primary text-white'
                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900/60 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Lock className="h-4.5 w-4.5 flex-shrink-0" />
            <span>Credentials & Security</span>
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-3 text-xs font-semibold rounded-xl text-left cursor-pointer transition-colors ${
              activeTab === 'notifications'
                ? 'bg-primary text-white'
                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900/60 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Bell className="h-4.5 w-4.5 flex-shrink-0" />
            <span>Inbox Preferences</span>
          </button>
          <button
            onClick={() => setActiveTab('appearance')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-3 text-xs font-semibold rounded-xl text-left cursor-pointer transition-colors ${
              activeTab === 'appearance'
                ? 'bg-primary text-white'
                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900/60 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Eye className="h-4.5 w-4.5 flex-shrink-0" />
            <span>Portal Appearance</span>
          </button>
        </div>

        {/* Right Side: Tab Forms */}
        <div className="md:col-span-8">
          <Card hoverable={false}>
            <CardBody className="p-6 md:p-8">
              
              {/* Profile View */}
              {activeTab === 'profile' && (
                <form onSubmit={handleSave} className="space-y-6">
                  <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white border-b border-slate-50 dark:border-slate-800/60 pb-3">My Public Profile</h3>
                  
                  {/* Avatar upload simulator */}
                  <div className="flex items-center gap-5">
                    <img 
                      src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&q=80" 
                      alt="Avatar" 
                      className="h-16 w-16 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-850" 
                    />
                    <div className="space-y-1.5">
                      <Button variant="outline" size="sm" type="button" className="text-xs font-semibold">Change Avatar</Button>
                      <p className="text-[10px] text-slate-400">Supported formats: JPEG, PNG. Max size 2 MB.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-transparent text-slate-850 dark:text-slate-150 outline-none focus:border-primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Academic Email</label>
                      <input 
                        type="email" 
                        disabled
                        value="yourname@college.edu"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-400 cursor-not-allowed outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Biography / Core Skills</label>
                    <textarea 
                      rows={4}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-transparent text-slate-850 dark:text-slate-150 outline-none focus:border-primary"
                    />
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-50 dark:border-slate-800/40 pt-5">
                    {saveSuccess && (
                      <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                        <CheckCircle className="h-4.5 w-4.5" /> Details saved successfully!
                      </span>
                    )}
                    <Button variant="primary" size="sm" type="submit" isLoading={saving} className="ml-auto">
                      <Save className="h-4 w-4 mr-1.5" /> Save Changes
                    </Button>
                  </div>
                </form>
              )}

              {/* Security View */}
              {activeTab === 'security' && (
                <form onSubmit={handleSave} className="space-y-6">
                  <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white border-b border-slate-50 dark:border-slate-800/60 pb-3">Update Credentials</h3>
                  
                  <div className="space-y-4 max-w-md">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Current Security Key</label>
                      <input 
                        type="password" 
                        required
                        placeholder="••••••••"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-transparent text-slate-850 dark:text-slate-150 outline-none focus:border-primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">New Security Key</label>
                      <input 
                        type="password" 
                        required
                        placeholder="Enter robust key"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-transparent text-slate-850 dark:text-slate-150 outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-50 dark:border-slate-800/40 pt-5">
                    {saveSuccess && (
                      <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                        <CheckCircle className="h-4.5 w-4.5" /> Credentials modified!
                      </span>
                    )}
                    <Button variant="primary" size="sm" type="submit" isLoading={saving} className="ml-auto">
                      <Save className="h-4 w-4 mr-1.5" /> Update Key
                    </Button>
                  </div>
                </form>
              )}

              {/* Notifications View */}
              {activeTab === 'notifications' && (
                <form onSubmit={handleSave} className="space-y-6">
                  <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white border-b border-slate-50 dark:border-slate-800/60 pb-3">Inbox Preferences</h3>
                  
                  <div className="space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="h-4.5 w-4.5 rounded border-slate-150 text-primary focus:ring-primary mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-205">Event Registrations Approvals</div>
                        <p className="text-[10px] text-slate-450 leading-relaxed mt-0.5">Dispatches emails when registrations or proposals statuses modify.</p>
                      </div>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="h-4.5 w-4.5 rounded border-slate-150 text-primary focus:ring-primary mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-205">Campus Board Announcements</div>
                        <p className="text-[10px] text-slate-450 leading-relaxed mt-0.5">Receive immediate notifications on administrative board alerts.</p>
                      </div>
                    </label>
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-50 dark:border-slate-800/40 pt-5">
                    {saveSuccess && (
                      <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                        <CheckCircle className="h-4.5 w-4.5" /> Alert channels updated!
                      </span>
                    )}
                    <Button variant="primary" size="sm" type="submit" isLoading={saving} className="ml-auto">
                      <Save className="h-4 w-4 mr-1.5" /> Save Preferences
                    </Button>
                  </div>
                </form>
              )}

              {/* Appearance View */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white border-b border-slate-50 dark:border-slate-800/60 pb-3">Portal Appearance</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Theme Selectors</label>
                      <div className="grid grid-cols-2 gap-4 max-w-sm">
                        <button 
                          onClick={() => theme === 'dark' && toggleTheme()}
                          className={`p-4 rounded-xl border text-center font-bold text-xs cursor-pointer transition-all ${
                            theme === 'light' 
                              ? 'bg-indigo-50 border-primary text-primary' 
                              : 'bg-white border-slate-100 hover:border-slate-250 dark:bg-slate-900/35 dark:border-slate-800'
                          }`}
                        >
                          Light Mode
                        </button>
                        <button 
                          onClick={() => theme === 'light' && toggleTheme()}
                          className={`p-4 rounded-xl border text-center font-bold text-xs cursor-pointer transition-all ${
                            theme === 'dark' 
                              ? 'bg-indigo-950/20 border-primary text-primary' 
                              : 'bg-white border-slate-100 hover:border-slate-250 dark:bg-slate-900/35 dark:border-slate-800'
                          }`}
                        >
                          Dark Mode
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
