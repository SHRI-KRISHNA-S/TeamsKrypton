import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { LandingPage } from './pages/LandingPage';
import { AuthPages } from './pages/AuthPages';
import { Dashboards } from './pages/Dashboards';
import { ClubModule } from './pages/ClubModule';
import { EventModule } from './pages/EventModule';
import { MembershipModule } from './pages/MembershipModule';
import { OpportunityModule } from './pages/OpportunityModule';
import { AnnouncementModule } from './pages/AnnouncementModule';
import { CertificateModule } from './pages/CertificateModule';
import { ReportsModule } from './pages/ReportsModule';
import { CalendarModule } from './pages/CalendarModule';
import { ActivityFeed } from './pages/ActivityFeed';
import { SettingsModule } from './pages/SettingsModule';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Public Views */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPages />} />

          {/* Core Portal Dashboard Views wrapped in layout */}
          <Route
            path="/*"
            element={
              <DashboardLayout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboards />} />
                  <Route path="/clubs" element={<ClubModule />} />
                  <Route path="/events" element={<EventModule />} />
                  <Route path="/memberships" element={<MembershipModule />} />
                  <Route path="/opportunities" element={<OpportunityModule />} />
                  <Route path="/announcements" element={<AnnouncementModule />} />
                  <Route path="/certificates" element={<CertificateModule />} />
                  <Route path="/reports" element={<ReportsModule />} />
                  <Route path="/calendar" element={<CalendarModule />} />
                  <Route path="/activity-feed" element={<ActivityFeed />} />
                  <Route path="/settings" element={<SettingsModule />} />
                  {/* Catchall redirection */}
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </DashboardLayout>
            }
          />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
