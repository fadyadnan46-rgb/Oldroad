import React from 'react';
import { Location } from '../types';

interface LocationsPageProps {
  locations: Location[];
}

const LocationsPage: React.FC<LocationsPageProps> = ({ locations }) => {
  return (
    <div>
      <h1>LocationsPage Component</h1>
    </div>
  );
};

export default LocationsPage;
