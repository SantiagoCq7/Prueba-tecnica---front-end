import React from 'react';
import { LoginForm } from '../components/auth';
import loginBg from '../assets/images/Background.png';

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-white">
      {/* Imagen de Fondo */}
      <div className="absolute inset-0 z-0">
        <img 
          src={loginBg} 
          alt="Background" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Contenedor del Formulario de Login */}
      <div className="relative z-10 w-full max-w-md px-4">
        <LoginForm />
      </div>
    </div>
  );
};
