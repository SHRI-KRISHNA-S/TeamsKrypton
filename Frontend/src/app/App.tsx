import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Common module imports
import { AppProvider, DashboardLayout } from '../modules/common';
import { ProtectedRoute } from '../modules/common/guards/ProtectedRoute';

// Feature module imports
import { AuthPages } from '../modules/auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '../modules/auth';
import { Dashboards, PresidentAnalytics, FacultyAnalytics, AdminAnalytics, SuperAdminSystemHealth, SuperAdminAnalytics as SuperAdminAnalyticsView } from '../modules/analytics';
import { ClubModule, PresidentMembers, PresidentOverview, FacultyClubs, FacultyApprovals, AdminClubs, PresidentGallery } from '../modules/club-management';
import { EventModule, CalendarModule } from '../modules/event-management';
import { MembershipModule, PresidentRequests, FacultyMembershipApprovals } from '../modules/membership';
import { OpportunityModule } from '../modules/opportunity-hub';
import { CertificateModule } from '../modules/certificates';
import { AnnouncementModule } from '../modules/notifications';
import { ReportsModule, PresidentReports, FacultyReports, AdminReports } from '../modules/reports';
import { ActivityFeed } from '../modules/student-portfolio';
import { SettingsModule, AdminUsers, AdminFaculty, AdminDepartments, SuperAdminUsers, SuperAdminRoles, SuperAdminPermissions, SuperAdminOrganizations, SuperAdminAuditLogs } from '../modules/user-management';
import { PresidentAttendance, FacultyAttendance } from '../modules/attendance';
import { CampusFeed, UserProfile, PostDetails, ClubFeed, CreatePost, MyPosts } from '../modules/campus-connect';
import { CampusLeaderboard } from '../modules/campus-leaderboard';

const queryClient = new QueryClient();

const PublicRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : element;
};

function App() {
  const allRoles = ['student', 'president', 'faculty', 'admin', 'superadmin'];

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppProvider>
          <Router>
            <Routes>
              {/* Public Views */}
              <Route path="/" element={<PublicRoute element={<AuthPages />} />} />
              <Route path="/auth" element={<Navigate to="/" replace />} />

          {/* Core Portal Dashboard Views wrapped in layout */}
          <Route
            path="/*"
            element={
              <DashboardLayout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboards />} />
                  
                  {/* Student / Core Links */}
                  <Route path="/clubs" element={<ProtectedRoute allowedRoles={['student', 'president', 'faculty', 'admin', 'superadmin']} element={<ClubModule />} />} />
                  <Route path="/explore-clubs" element={<ProtectedRoute allowedRoles={['student', 'president', 'faculty', 'admin', 'superadmin']} element={<ClubModule />} />} />
                  <Route path="/my-clubs" element={<ProtectedRoute allowedRoles={['student']} element={<ClubModule />} />} />
                  
                  <Route path="/events" element={<ProtectedRoute allowedRoles={['student', 'president', 'admin', 'superadmin']} element={<EventModule />} />} />
                  <Route path="/calendar" element={<ProtectedRoute allowedRoles={['student']} element={<CalendarModule />} />} />
                  <Route path="/announcements" element={<ProtectedRoute allowedRoles={['student', 'president', 'admin', 'superadmin']} element={<AnnouncementModule />} />} />
                  <Route path="/opportunities" element={<ProtectedRoute allowedRoles={['student']} element={<OpportunityModule />} />} />
                  <Route path="/certificates" element={<ProtectedRoute allowedRoles={['student']} element={<CertificateModule />} />} />
                  <Route path="/activity-feed" element={<ProtectedRoute allowedRoles={['student', 'president', 'faculty', 'admin', 'superadmin']} element={<ActivityFeed />} />} />

                  {/* Campus Connect Links */}
                  <Route path="/campus-connect" element={<ProtectedRoute allowedRoles={['student', 'president', 'faculty', 'admin', 'superadmin']} element={<CampusFeed />} />} />
                  <Route path="/campus-connect/profile/:userId" element={<ProtectedRoute allowedRoles={['student', 'president', 'faculty', 'admin', 'superadmin']} element={<UserProfile />} />} />
                  <Route path="/campus-connect/post/:postId" element={<ProtectedRoute allowedRoles={['student', 'president', 'faculty', 'admin', 'superadmin']} element={<PostDetails />} />} />
                  <Route path="/campus-connect/club/:clubId" element={<ProtectedRoute allowedRoles={['student', 'president', 'faculty', 'admin', 'superadmin']} element={<ClubFeed />} />} />
                  <Route path="/campus-connect/create" element={<ProtectedRoute allowedRoles={['student', 'president', 'faculty', 'admin', 'superadmin']} element={<CreatePost />} />} />
                  <Route path="/campus-connect/my-posts" element={<ProtectedRoute allowedRoles={['student', 'president', 'faculty', 'admin', 'superadmin']} element={<MyPosts />} />} />

                  {/* Campus Leaderboard Links */}
                  <Route path="/campus-leaderboard" element={<ProtectedRoute allowedRoles={['student', 'president', 'faculty', 'admin', 'superadmin']} element={<CampusLeaderboard />} />} />
                  <Route path="/profile/:userId" element={<ProtectedRoute allowedRoles={['student', 'president', 'faculty', 'admin', 'superadmin']} element={<UserProfile />} />} />

                  {/* Club President specific */}
                  <Route path="/president/overview" element={<ProtectedRoute allowedRoles={['president']} element={<PresidentOverview />} />} />
                  <Route path="/president/requests" element={<ProtectedRoute allowedRoles={['president']} element={<PresidentRequests />} />} />
                  <Route path="/president/members" element={<ProtectedRoute allowedRoles={['president']} element={<PresidentMembers />} />} />
                  <Route path="/president/attendance" element={<ProtectedRoute allowedRoles={['president']} element={<PresidentAttendance />} />} />
                  <Route path="/president/gallery" element={<ProtectedRoute allowedRoles={['president']} element={<PresidentGallery />} />} />
                  <Route path="/president/reports" element={<ProtectedRoute allowedRoles={['president']} element={<PresidentReports />} />} />
                  <Route path="/president/analytics" element={<ProtectedRoute allowedRoles={['president']} element={<PresidentAnalytics />} />} />

                  {/* Faculty Coordinator specific */}
                  <Route path="/faculty/clubs" element={<ProtectedRoute allowedRoles={['faculty']} element={<FacultyClubs />} />} />
                  <Route path="/faculty/approvals" element={<ProtectedRoute allowedRoles={['faculty']} element={<FacultyApprovals />} />} />
                  <Route path="/faculty/membership-approvals" element={<ProtectedRoute allowedRoles={['faculty']} element={<FacultyMembershipApprovals />} />} />
                  <Route path="/faculty/attendance" element={<ProtectedRoute allowedRoles={['faculty']} element={<FacultyAttendance />} />} />
                  <Route path="/faculty/reports" element={<ProtectedRoute allowedRoles={['faculty']} element={<FacultyReports />} />} />
                  <Route path="/faculty/analytics" element={<ProtectedRoute allowedRoles={['faculty']} element={<FacultyAnalytics />} />} />

                  {/* College Admin specific */}
                  <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']} element={<AdminUsers />} />} />
                  <Route path="/admin/clubs" element={<ProtectedRoute allowedRoles={['admin']} element={<AdminClubs />} />} />
                  <Route path="/admin/departments" element={<ProtectedRoute allowedRoles={['admin']} element={<AdminDepartments />} />} />
                  <Route path="/admin/faculty" element={<ProtectedRoute allowedRoles={['admin']} element={<AdminFaculty />} />} />
                  <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['admin']} element={<AdminReports />} />} />
                  <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['admin']} element={<AdminAnalytics />} />} />

                  {/* Super Admin specific */}
                  <Route path="/superadmin/organizations" element={<ProtectedRoute allowedRoles={['superadmin']} element={<SuperAdminOrganizations />} />} />
                  <Route path="/superadmin/users" element={<ProtectedRoute allowedRoles={['superadmin']} element={<SuperAdminUsers />} />} />
                  <Route path="/superadmin/roles" element={<ProtectedRoute allowedRoles={['superadmin']} element={<SuperAdminRoles />} />} />
                  <Route path="/superadmin/permissions" element={<ProtectedRoute allowedRoles={['superadmin']} element={<SuperAdminPermissions />} />} />
                  <Route path="/superadmin/audit-logs" element={<ProtectedRoute allowedRoles={['superadmin']} element={<SuperAdminAuditLogs />} />} />
                  <Route path="/superadmin/system-health" element={<ProtectedRoute allowedRoles={['superadmin']} element={<SuperAdminSystemHealth />} />} />
                  <Route path="/superadmin/analytics" element={<ProtectedRoute allowedRoles={['superadmin']} element={<SuperAdminAnalyticsView />} />} />

                  {/* Legacy general modules mapping */}
                  <Route path="/memberships" element={<ProtectedRoute allowedRoles={['president', 'faculty', 'admin', 'superadmin']} element={<MembershipModule />} />} />
                  <Route path="/reports" element={<ProtectedRoute allowedRoles={['president', 'faculty', 'admin', 'superadmin']} element={<ReportsModule />} />} />
                  
                  {/* General settings */}
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
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

