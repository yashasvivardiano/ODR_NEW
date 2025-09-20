import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuthStore } from './src/store/authStore';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import FilingFormExample from './FilingFormExample';
import HearingAIDashboard from './HearingAIDashboard';
import RealAudioUpload from './RealAudioUpload';
import HistoryScreen from './HistoryScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'login' | 'signup'>('login');
  const [currentView, setCurrentView] = useState('menu');
  const { isAuthenticated, user, logout } = useAuthStore();

  const navigateToSignUp = () => setCurrentScreen('signup');
  const navigateToLogin = () => setCurrentScreen('login');

  // If not authenticated, show auth screens
  if (!isAuthenticated) {
    if (currentScreen === 'signup') {
      return <SignUpScreen onNavigateToLogin={navigateToLogin} />;
    }
    return <LoginScreen onNavigateToSignUp={navigateToSignUp} />;
  }

  // If authenticated, show AI system
  if (currentView === 'filing') {
    return <FilingFormExample />;
  }
  
  if (currentView === 'hearing') {
    return <HearingAIDashboard />;
  }
  
  if (currentView === 'real-audio') {
    return <RealAudioUpload />;
  }
  
  if (currentView === 'history') {
    return <HistoryScreen onBack={() => setCurrentView('menu')} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ODR AI System</Text>
        <View style={styles.userInfo}>
          <Text style={styles.welcomeText}>Welcome, {user?.name}!</Text>
          <TouchableOpacity onPress={logout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => setCurrentView('filing')}
      >
        <Text style={styles.buttonText}>🤖 AI Filing Assistant</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => setCurrentView('hearing')}
      >
        <Text style={styles.buttonText}>🎥 Court Hearing AI (Mock)</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.realButton]}
        onPress={() => setCurrentView('real-audio')}
      >
        <Text style={styles.buttonText}>🎤 Real Audio Processing</Text>
        <Text style={styles.newBadge}>NEW</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.historyButton]}
        onPress={() => setCurrentView('history')}
      >
        <Text style={styles.buttonText}>📋 View History</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    padding: 20,
  },
  header: {
    width: '100%',
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: '#4A5568',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#E53E3E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  logoutText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  realButton: {
    backgroundColor: '#10B981',
    position: 'relative',
  },
  historyButton: {
    backgroundColor: '#8B5CF6',
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    right: 12,
    backgroundColor: '#F59E0B',
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
});
