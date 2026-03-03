import React from 'react';
import { User } from '../types';

interface ContractsPageProps {
  user: User | null;
}

const ContractsPage: React.FC<ContractsPageProps> = ({ user }) => {
  return (
    <div>
      <h1>ContractsPage Component</h1>
    </div>
  );
};

export default ContractsPage;
