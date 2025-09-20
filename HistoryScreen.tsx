// History Screen - View all user activities
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useHistoryStore, HistoryItem } from './HistoryStore';

interface HistoryScreenProps {
  onBack: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ onBack }) => {
  const { items, clearHistory, getItemsByType } = useHistoryStore();
  const [selectedFilter, setSelectedFilter] = useState<'all' | HistoryItem['type']>('all');

  const filteredItems = selectedFilter === 'all' 
    ? items 
    : getItemsByType(selectedFilter);

  const getStatusColor = (status: HistoryItem['status']) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'processing': return '#F59E0B';
      case 'failed': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getTypeIcon = (type: HistoryItem['type']) => {
    switch (type) {
      case 'filing': return '🤖';
      case 'hearing': return '🎥';
      case 'audio_processing': return '🎤';
      default: return '📄';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all history? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: clearHistory 
        }
      ]
    );
  };

  const handleItemPress = (item: HistoryItem) => {
    Alert.alert(
      'History Item Details',
      `Type: ${item.type}\nStatus: ${item.status}\nTime: ${formatDate(item.timestamp)}\n\nDescription: ${item.description}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Activity History</Text>
        <TouchableOpacity onPress={handleClearHistory} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, selectedFilter === 'all' && styles.filterTabActive]}
          onPress={() => setSelectedFilter('all')}
        >
          <Text style={[styles.filterTabText, selectedFilter === 'all' && styles.filterTabTextActive]}>
            All ({items.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterTab, selectedFilter === 'filing' && styles.filterTabActive]}
          onPress={() => setSelectedFilter('filing')}
        >
          <Text style={[styles.filterTabText, selectedFilter === 'filing' && styles.filterTabTextActive]}>
            🤖 Filing ({getItemsByType('filing').length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterTab, selectedFilter === 'hearing' && styles.filterTabActive]}
          onPress={() => setSelectedFilter('hearing')}
        >
          <Text style={[styles.filterTabText, selectedFilter === 'hearing' && styles.filterTabTextActive]}>
            🎥 Hearing ({getItemsByType('hearing').length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterTab, selectedFilter === 'audio_processing' && styles.filterTabActive]}
          onPress={() => setSelectedFilter('audio_processing')}
        >
          <Text style={[styles.filterTabText, selectedFilter === 'audio_processing' && styles.filterTabTextActive]}>
            🎤 Audio ({getItemsByType('audio_processing').length})
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* History Items */}
      <ScrollView style={styles.historyList}>
        {filteredItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No history items found</Text>
            <Text style={styles.emptyStateSubtext}>
              Your activity will appear here after you use the AI features
            </Text>
          </View>
        ) : (
          filteredItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.historyItem}
              onPress={() => handleItemPress(item)}
            >
              <View style={styles.historyItemHeader}>
                <View style={styles.historyItemLeft}>
                  <Text style={styles.historyItemIcon}>{getTypeIcon(item.type)}</Text>
                  <View style={styles.historyItemContent}>
                    <Text style={styles.historyItemTitle}>{item.title}</Text>
                    <Text style={styles.historyItemDescription} numberOfLines={2}>
                      {item.description}
                    </Text>
                  </View>
                </View>
                <View style={styles.historyItemRight}>
                  <View 
                    style={[
                      styles.statusBadge, 
                      { backgroundColor: getStatusColor(item.status) }
                    ]}
                  >
                    <Text style={styles.statusBadgeText}>{item.status}</Text>
                  </View>
                  <Text style={styles.historyItemTime}>
                    {formatDate(item.timestamp)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A202C',
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
  },
  filterContainer: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  filterTabActive: {
    backgroundColor: '#007AFF',
  },
  filterTabText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  filterTabTextActive: {
    color: 'white',
  },
  historyList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  historyItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  historyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  historyItemLeft: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 12,
  },
  historyItemIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  historyItemContent: {
    flex: 1,
  },
  historyItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A202C',
    marginBottom: 4,
  },
  historyItemDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  historyItemRight: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusBadgeText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  historyItemTime: {
    fontSize: 12,
    color: '#94A3B8',
  },
});

export default HistoryScreen;
