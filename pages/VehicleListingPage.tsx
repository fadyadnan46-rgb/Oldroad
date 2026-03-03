import React from 'react';
import { User } from '../types';

interface VehicleListingPageProps {
  user: User | null;
}

const VehicleListingPage: React.FC<VehicleListingPageProps> = ({ user }) => {
  return (
    <div>
      <h1>VehicleListingPage Component</h1>
    </div>
  );
};

export default VehicleListingPage;
