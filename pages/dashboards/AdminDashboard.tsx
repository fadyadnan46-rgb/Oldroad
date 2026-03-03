import React from 'react';
import { User, Location } from '../../types';

interface AdminDashboardProps {
  user: User;
  darkMode: boolean;
  toggleDarkMode: () => void;
  locations: Location[];
  setLocations: React.Dispatch<React.SetStateAction<Location[]>>;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, darkMode, toggleDarkMode, locations, setLocations }) => {
  return (
    <div>
      <h1>AdminDashboard Component</h1>
    </div>
  );
};

export default AdminDashboard;
