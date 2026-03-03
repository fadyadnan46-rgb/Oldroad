import React from 'react';
import { User } from '../types';

interface InventoryPageProps {
  user: User | null;
}

const InventoryPage: React.FC<InventoryPageProps> = ({ user }) => {
  return (
    <div>
      <h1>InventoryPage Component</h1>
    </div>
  );
};

export default InventoryPage;
