import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import LandingPage from './pages/public/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import SuccessfulLogin from './pages/auth/SuccessfulLogin'

// CLIENT PAGES
import ClientOnboarding from './pages/client/ClientOnboarding' 
import ClientLayout from './pages/client/ClientLayout'
import ClientHome from './pages/client/ClientHome'
import ClientMyJobs from './pages/client/ClientMyJobs'
import ClientApplicants from './pages/client/ClientApplicants'
import ClientPayment from './pages/client/ClientPayment'
import ClientChats from './pages/client/ClientChats'
import ClientProfile from './pages/client/ClientProfile'
import ClientPostJob from './pages/client/ClientPostJob' // NEW PAGE

// FREELANCER PAGES
import FreelancerOnboarding from './pages/freelancer/FreelancerOnboarding'
import FreelancerTutorials from './pages/freelancer/FreelancerTutorials'
import FreelancerVideoPlayer from './pages/freelancer/FreelancerVideoPlayer'
import FreelancerLayout from './pages/freelancer/FreelancerLayout'
import FreelancerHome from './pages/freelancer/FreelancerHome'
import ProjectDetails from './pages/freelancer/ProjectDetails'
import MyProjects from './pages/freelancer/MyProjects'
import RequestCoworker from './pages/freelancer/RequestCoworker'
import FreelancerChats from './pages/freelancer/FreelancerChats'
import JobStatus from './pages/freelancer/JobStatus'
import Collaboration from './pages/freelancer/Collaboration'
import CollaborationDetails from './pages/freelancer/CollaborationDetails'
import MyPostedCollabs from './pages/freelancer/MyPostedCollabs'
import EditCoworkerRequest from './pages/freelancer/EditCoworkerRequest'
import JobApplicants from './pages/freelancer/JobApplicants'
import ApplicantProfile from './pages/freelancer/ApplicantProfile'
import Wallet from './pages/freelancer/Wallet'
import Profile from './pages/freelancer/Profile'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/signup" element={<SignupPage />} />
        <Route path="/auth/login-success" element={<SuccessfulLogin />} />

        {/* CLIENT DASHBOARD PIPELINE */}
        <Route path="/client/onboarding" element={<ClientOnboarding />} />

        <Route path="/client/dashboard" element={<ClientLayout />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<ClientHome />} />
          <Route path="post" element={<ClientPostJob />} /> {/* DEDICATED POST ROUTE */}
          <Route path="my-jobs" element={<ClientMyJobs />} />
          <Route path="applicants/:jobId" element={<ClientApplicants />} />
          <Route path="payments" element={<ClientPayment />} />
          <Route path="messages" element={<ClientChats />} />
          <Route path="profile" element={<ClientProfile />} />
        </Route>

        {/* FREELANCER DASHBOARD PIPELINE */}
        <Route path="/freelancer/onboarding" element={<FreelancerOnboarding />} />
        <Route path="/freelancer/tutorial" element={<FreelancerTutorials />} />
        <Route path="/tutorial/watch/:id" element={<FreelancerVideoPlayer />} />

       
      {/* Freelancer Dashboard Routes (Nested) */}
<Route path="/freelancer/dashboard" element={<FreelancerLayout />}>
  
  {/* Automatically redirect the base dashboard path to /home */}
  <Route index element={<Navigate to="home" replace />} />
  
  {/* Main Dashboard Pages */}
  <Route path="home" element={<FreelancerHome />} />
  
  {/* Job Details Page */}
  <Route path="home/jobs/:id" element={<ProjectDetails />} />
  <Route path="projects" element={<MyProjects />} />
  <Route path="projects/request-coworker/:id" element={<RequestCoworker />} />
<Route path="messages" element={<FreelancerChats />} />
<Route path="messages/:chatId" element={<FreelancerChats />} />
<Route path="job-status" element={<JobStatus />} />
<Route path="collaboration" element={<Collaboration />} />
<Route path="collaboration/:collabId" element={<CollaborationDetails />} />
<Route path="posted-collabs" element={<MyPostedCollabs />} />
<Route path="posted-collabs/edit-collab/:jobId" element={<EditCoworkerRequest />} />
<Route path="posted-collabs/applicants/:jobId" element={<JobApplicants />} />
<Route path="posted-collabs/applicants/profile/:applicantID" element={<ApplicantProfile />} />
<Route path="payments" element={<Wallet />} />
<Route path="profile" element={<Profile />} />

  
</Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}