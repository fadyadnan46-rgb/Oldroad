import React from 'react';
import { User } from '../types';

interface TradeInPageProps {
  user: User | null;
}

const TradeInPage: React.FC<TradeInPageProps> = ({ user }) => {
  return (
    <div>
      <h1>TradeInPage Component</h1>
    </div>
  );
};

export default TradeInPage;
