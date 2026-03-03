import React from 'react';
import { User } from '../types';

interface SettingsPageProps {
  user: User;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ user }) => {
  return (
    <div>
      <h1>SettingsPage Component</h1>
    </div>
  );
};

export default SettingsPage;
