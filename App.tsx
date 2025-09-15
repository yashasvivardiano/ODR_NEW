import React, { useState } from 'react';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'login' | 'signup'>('login');

  const navigateToSignUp = () => setCurrentScreen('signup');
  const navigateToLogin = () => setCurrentScreen('login');

  if (currentScreen === 'signup') {
    return <SignUpScreen onNavigateToLogin={navigateToLogin} />;
  }

  return <LoginScreen onNavigateToSignUp={navigateToSignUp} />;
}

