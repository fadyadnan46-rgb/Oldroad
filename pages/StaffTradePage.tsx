import React from 'react';
import { User } from '../types';

interface StaffTradePageProps {
  user: User | null;
}

const StaffTradePage: React.FC<StaffTradePageProps> = ({ user }) => {
  return (
    <div>
      <h1>StaffTradePage Component</h1>
    </div>
  );
};

export default StaffTradePage;
