import React from 'react';
import { User, Location } from '../types';

interface AccountantPageProps {
  user: User | null;
  locations: Location[];
}

const AccountantPage: React.FC<AccountantPageProps> = ({ user, locations }) => {
  return (
    <div>
      <h1>AccountantPage Component</h1>
    </div>
  );
};

export default AccountantPage;
