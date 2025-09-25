import React, { useState } from 'react';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import { useAuthStore } from './src/store/authStore';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'login' | 'signup' | 'dashboard'>('login');
  const { isAuthenticated } = useAuthStore();

  const navigateToSignUp = () => setCurrentScreen('signup');
  const navigateToLogin = () => setCurrentScreen('login');
  const navigateToDashboard = () => setCurrentScreen('dashboard');

  // Show dashboard if user is authenticated
  if (isAuthenticated) {
    return <DashboardScreen />;
  }

  // Show login/signup screens if not authenticated
  if (currentScreen === 'signup') {
    return <SignUpScreen onNavigateToLogin={navigateToLogin} />;
  }

  return <LoginScreen onNavigateToSignUp={navigateToSignUp} />;
}

