import React from 'react';
import { User } from '../types';

interface TestPageProps {
  user: User | null;
}

const TestPage: React.FC<TestPageProps> = ({ user }) => {
  return (
    <div>
      <h1>TestPage Component</h1>
    </div>
  );
};

export default TestPage;
