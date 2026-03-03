import React from 'react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  logout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, logout }) => {
  return (
    <div>
      <h1>Navbar Component</h1>
    </div>
  );
};

export default Navbar;
