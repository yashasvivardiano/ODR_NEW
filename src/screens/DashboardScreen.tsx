import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuthStore } from '../store/authStore';

const DashboardScreen: React.FC = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout, style: 'destructive' },
      ]
    );
  };

  const handleDisputeResolution = () => {
    Alert.alert('Dispute Resolution', 'Dispute resolution feature coming soon!');
  };

  const handleMediation = () => {
    Alert.alert('Mediation', 'Mediation feature coming soon!');
  };

  const handleArbitration = () => {
    Alert.alert('Arbitration', 'Arbitration feature coming soon!');
  };

  const handleCaseHistory = () => {
    Alert.alert('Case History', 'Case history feature coming soon!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome back!</Text>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <Text style={styles.title}>ODR Platform</Text>
          <Text style={styles.subtitle}>Online Dispute Resolution</Text>

          {/* Feature Cards */}
          <View style={styles.cardsContainer}>
            <TouchableOpacity style={styles.card} onPress={handleDisputeResolution}>
              <Text style={styles.cardIcon}>⚖️</Text>
              <Text style={styles.cardTitle}>Dispute Resolution</Text>
              <Text style={styles.cardDescription}>
                Start a new dispute resolution process
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card} onPress={handleMediation}>
              <Text style={styles.cardIcon}>🤝</Text>
              <Text style={styles.cardTitle}>Mediation</Text>
              <Text style={styles.cardDescription}>
                Request mediation services
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card} onPress={handleArbitration}>
              <Text style={styles.cardIcon}>⚡</Text>
              <Text style={styles.cardTitle}>Arbitration</Text>
              <Text style={styles.cardDescription}>
                Fast-track arbitration process
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card} onPress={handleCaseHistory}>
              <Text style={styles.cardIcon}>📋</Text>
              <Text style={styles.cardTitle}>Case History</Text>
              <Text style={styles.cardDescription}>
                View your previous cases
              </Text>
            </TouchableOpacity>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <Text style={styles.statsTitle}>Quick Stats</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>Active Cases</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>Resolved</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>Pending</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  cardsContainer: {
    marginBottom: 32,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  statsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default DashboardScreen;
