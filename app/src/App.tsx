import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Skeleton } from './components/ui/skeleton';
import { Toaster } from 'sonner';
import { useSikStore } from './store/useSikStore';
import { Login } from './features/auth/Login';

// Lazy loading feature components
const MySik = lazy(() => import('./features/dashboard/MySik').then(module => ({ default: module.MySik })));
const RequestForm = lazy(() => import('./features/request/RequestForm').then(module => ({ default: module.RequestForm })));
const ApprovalWorkflow = lazy(() => import('./features/approval/ApprovalWorkflow').then(module => ({ default: module.ApprovalWorkflow })));
const CheckPoint = lazy(() => import('./features/security/CheckPoint').then(module => ({ default: module.CheckPoint })));
const UserManagement = lazy(() => import('./features/admin/UserManagement').then(module => ({ default: module.UserManagement })));
const ActivityLog = lazy(() => import('./features/admin/ActivityLog').then(module => ({ default: module.ActivityLog })));

// Global Loading State
const PageLoader = () => (
  <div className="space-y-6 animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
       {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 rounded-[32px]" />)}
    </div>
    <Skeleton className="h-[400px] w-full rounded-[32px]" />
  </div>
);

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useSikStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  const { isAuthenticated } = useSikStore();

  return (
    <Router>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
        
        <Route 
          path="/*" 
          element={
            <AuthGuard>
              <DashboardLayout>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<MySik />} />
                    <Route path="/request" element={<RequestForm />} />
                    <Route path="/approval" element={<ApprovalWorkflow />} />
                    <Route path="/security" element={<CheckPoint />} />
                    <Route path="/admin/users" element={<UserManagement />} />
                    <Route path="/admin/logs" element={<ActivityLog />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </DashboardLayout>
            </AuthGuard>
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;
