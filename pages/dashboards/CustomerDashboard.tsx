import React from 'react';
import { User } from '../../types';

interface CustomerDashboardProps {
  user: User;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ user, darkMode, toggleDarkMode }) => {
  return (
    <div>
      <h1>CustomerDashboard Component</h1>
    </div>
  );
};

export default CustomerDashboard;
