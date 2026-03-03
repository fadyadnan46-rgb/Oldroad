import React from 'react';

interface AuthPageProps {
  onLogin: (email: string) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  return (
    <div>
      <h1>AuthPage Component</h1>
    </div>
  );
};

export default AuthPage;
