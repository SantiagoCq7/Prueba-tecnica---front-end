import React from 'react';
import logo from '../../assets/images/Logo Be Kind Network.png';

export const Logo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img src={logo} alt="Be Kind Network" className="h-12 w-auto" />
    </div>
  );
};
