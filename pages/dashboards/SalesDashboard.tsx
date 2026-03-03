import React from 'react';
import { User } from '../../types';

interface SalesDashboardProps {
  user: User;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const SalesDashboard: React.FC<SalesDashboardProps> = ({ user, darkMode, toggleDarkMode }) => {
  return (
    <div>
      <h1>SalesDashboard Component</h1>
    </div>
  );
};

export default SalesDashboard;
