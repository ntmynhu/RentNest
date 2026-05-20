import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { BrowsePage } from './pages/BrowsePage';
import { ListingDetailPage } from './pages/ListingDetailPage';
import { TenantDashboard } from './pages/TenantDashboard';
import { LandlordDashboardNew } from './pages/LandlordDashboardNew';
import { AdminPanel } from './pages/AdminPanel';
import { AuthPage } from './pages/AuthPage';
import { MessagesPage } from './pages/MessagesPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="browse" element={<BrowsePage />} />
            <Route path="listing/:id" element={<ListingDetailPage />} />
            <Route path="tenant/dashboard" element={<TenantDashboard />} />
            <Route path="landlord/dashboard" element={<LandlordDashboardNew />} />
            <Route path="admin" element={<AdminPanel />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="auth" element={<AuthPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
