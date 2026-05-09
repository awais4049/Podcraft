import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { HomeScreen } from './screens/HomeScreen';
import { LoginScreen } from './screens/LoginScreen';
import { WizardScreen } from './screens/WizardScreen';
import { EpisodeDetailScreen } from './screens/EpisodeDetailScreen';
import { PodcastProfileScreen } from './screens/PodcastProfileScreen';
import { BottomNav } from './components/layout/BottomNav';
import { authService } from './services/authService';
import { AnimatePresence, motion } from 'motion/react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = authService.getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

export default function App() {
  const location = useLocation();
  const showNav = !['/login', '/wizard'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <AnimatePresence mode="wait">
        <Routes location={location}>
          <Route path="/login" element={<PageWrapper><LoginScreen /></PageWrapper>} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <PageWrapper><HomeScreen /></PageWrapper>
            </ProtectedRoute>
          } />

          <Route path="/wizard" element={
            <ProtectedRoute>
              <PageWrapper><WizardScreen /></PageWrapper>
            </ProtectedRoute>
          } />

          <Route path="/episode/:id" element={
            <ProtectedRoute>
              <PageWrapper><EpisodeDetailScreen /></PageWrapper>
            </ProtectedRoute>
          } />

          {/* Placeholder routes for navigation */}
          <Route path="/projects" element={<ProtectedRoute><PageWrapper><HomeScreen /></PageWrapper></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><PageWrapper><div className="p-8 text-white">Search Coming Soon</div></PageWrapper></ProtectedRoute>} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <PageWrapper><PodcastProfileScreen /></PageWrapper>
            </ProtectedRoute>
          } />
        </Routes>
      </AnimatePresence>
      
      {showNav && <BottomNav />}
    </div>
  );
}
