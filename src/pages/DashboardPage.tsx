import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/layouts/DashboardLayout';
import DashboardHome from '../components/dashboard/DashboardHome';
import AspirantList from '../components/aspirant/AspirantList';
import AspirantDetails from '../components/aspirant/AspirantDetails';
import AspirantForm from '../components/aspirant/AspirantForm';
import ApplicationList from '../components/aspirant/ApplicationList';
import ApplicationDetails from '../components/aspirant/ApplicationDetails';
import ApplicationForm from '../components/aspirant/ApplicationForm';
import BranchList from '../components/branch/BranchList';
import BranchDetails from '../components/branch/BranchDetails';
import BranchForm from '../components/branch/BranchForm';
import BranchAdminList from '../components/branch-admin/BranchAdminList';
import BranchAdminForm from '../components/branch-admin/BranchAdminForm';
import CourseList from '../components/course/CourseList';
import CourseBuilder from '../components/course/CourseBuilder';
import CourseWizard from '../components/course/CourseWizard';
import InterviewList from '../components/interview/InterviewList';
import InterviewDetails from '../components/interview/InterviewDetails';
import ProjectList from '../components/project/ProjectList';
import ProjectView from '../components/project/ProjectView';
import CertificateList from '../components/certificate/CertificateList';
import CertificateDetails from '../components/certificate/CertificateDetails';
import AnnouncementList from '../components/announcement/AnnouncementList';
import AnnouncementForm from '../components/announcement/AnnouncementForm';
import XPDashboard from '../components/xp/XPDashboard';
import XPSettings from '../components/xp/XPSettings';
import DailyGoals from '../components/xp/DailyGoals';
import StreakRules from '../components/xp/StreakRules';
import ReportsDashboard from '../components/reports/ReportsDashboard';
import SettingsPage from '../components/settings/SettingsPage';

const DashboardPage: React.FC = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<DashboardHome />} />
        
        {/* Aspirant Routes */}
        <Route path="aspirants" element={<AspirantList />} />
        <Route path="aspirants/new" element={<AspirantForm />} />
        <Route path="aspirants/:id" element={<AspirantDetails />} />
        <Route path="aspirants/:id/edit" element={<AspirantForm />} />
        
        {/* Application Routes */}
        <Route path="aspirants/applications" element={<ApplicationList />} />
        <Route path="aspirants/applications/form" element={<ApplicationForm />} />
        <Route path="aspirants/applications/:id" element={<ApplicationDetails />} />
        
        {/* Branch Routes */}
        <Route path="branches" element={<BranchList />} />
        <Route path="branches/new" element={<BranchForm />} />
        <Route path="branches/:id" element={<BranchDetails />} />
        <Route path="branches/:id/edit" element={<BranchForm />} />
        
        {/* Branch Admin Routes */}
        <Route path="branch-admins" element={<BranchAdminList />} />
        <Route path="branch-admins/new" element={<BranchAdminForm />} />
        <Route path="branch-admins/:id/edit" element={<BranchAdminForm />} />
        
        {/* Course Routes */}
        <Route path="courses" element={<CourseList />} />
        <Route path="courses/new" element={<CourseWizard />} />
        <Route path="courses/:id" element={<CourseWizard />} />
        <Route path="courses/:id/edit" element={<CourseBuilder />} />
        
        {/* Interview Routes */}
        <Route path="interviews" element={<InterviewList />} />
        <Route path="interviews/:id" element={<InterviewDetails />} />
        
        {/* Project Routes */}
        <Route path="projects" element={<ProjectList />} />
        <Route path="projects/:id" element={<ProjectView />} />
        
        {/* Certificate Routes */}
        <Route path="certificates" element={<CertificateList />} />
        <Route path="certificates/:id" element={<CertificateDetails />} />
        
        {/* Announcement Routes */}
        <Route path="announcements" element={<AnnouncementList />} />
        <Route path="announcements/new" element={<AnnouncementForm />} />
        
        {/* XP & Streak Routes */}
        <Route path="xp" element={<XPDashboard />} />
        <Route path="xp/settings" element={<XPSettings />} />
        <Route path="xp/daily-goals" element={<DailyGoals />} />
        <Route path="xp/streak-rules" element={<StreakRules />} />
        
        {/* Reports Route */}
        <Route path="reports" element={<ReportsDashboard />} />
        
        {/* Settings Route */}
        <Route path="settings" element={<SettingsPage />} />
      </Routes>
    </DashboardLayout>
  );
};

export default DashboardPage;