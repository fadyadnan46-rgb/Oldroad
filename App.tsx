
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { User, UserRole, Location as OfficeLocation } from './types';
import { MOCK_USERS, MOCK_LOCATIONS } from './constants';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import InventoryPage from './pages/InventoryPage';
import TradeInPage from './pages/TradeInPage';
import StaffTradePage from './pages/StaffTradePage';
import AuthPage from './pages/AuthPage';
import CustomerDashboard from './pages/dashboards/CustomerDashboard';
import SalesDashboard from './pages/dashboards/SalesDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import AboutPage from './pages/AboutPage';
import DispatchPage from './pages/TestPage';
import ContractsPage from './pages/ContractsPage';
import AccountantPage from './pages/AccountantPage';

const AppContent: React.FC<{
  currentUser: User | null;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  login: (email: string) => void;
  logout: () => void;
  locations: OfficeLocation[];
  setLocations: React.Dispatch<React.SetStateAction<OfficeLocation[]>>;
}> = ({ currentUser, isDarkMode, toggleDarkMode, login, logout, locations, setLocations }) => {
  const location = useLocation();
  
  // Hide footer on management and app-like pages to ensure full-screen experience
  const hideFooterRoutes = ['/accountant', '/dispatch', '/dashboard', '/manage-trades', '/contracts'];
  const shouldHideFooter = hideFooterRoutes.some(route => location.pathname.startsWith(route));

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <Navbar user={currentUser} logout={logout} />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/inventory" element={<InventoryPage user={currentUser} />} />
          <Route path="/trade-in" element={<TradeInPage user={currentUser} />} />
          <Route path="/manage-trades" element={<StaffTradePage user={currentUser} />} />
          <Route path="/contracts" element={<ContractsPage user={currentUser} />} />
          <Route path="/accountant" element={<AccountantPage user={currentUser} locations={locations} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/auth" element={<AuthPage onLogin={login} />} />
          <Route path="/dispatch" element={<DispatchPage user={currentUser} />} />
          
          <Route 
            path="/dashboard" 
            element={
              currentUser ? (
                currentUser.role === UserRole.ADMIN ? <AdminDashboard user={currentUser} darkMode={isDarkMode} toggleDarkMode={toggleDarkMode} locations={locations} setLocations={setLocations} /> :
                currentUser.role === UserRole.SALES ? <SalesDashboard user={currentUser} darkMode={isDarkMode} toggleDarkMode={toggleDarkMode} /> :
                <CustomerDashboard user={currentUser} darkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
              ) : <Navigate to="/auth" />
            } 
          />

          <Route path="/test" element={<Navigate to="/dispatch" replace />} />
        </Routes>
      </main>

      {!shouldHideFooter && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [locations, setLocations] = useState<OfficeLocation[]>(MOCK_LOCATIONS);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return next;
    });
  };

  const login = (email: string) => {
    const user = MOCK_USERS.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
    } else {
      alert("User not found. Try admin@oldroad.auto, sales@oldroad.auto, or customer@gmail.com");
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <Router>
      <AppContent 
        currentUser={currentUser} 
        isDarkMode={isDarkMode} 
        toggleDarkMode={toggleDarkMode} 
        login={login} 
        logout={logout}
        locations={locations}
        setLocations={setLocations}
      />
    </Router>
  );
};

export default App;
