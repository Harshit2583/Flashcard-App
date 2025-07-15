import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDeck } from '../context/DeckContext';

const CompletedScreen = () => {
  const { completedCards, getDeckById } = useDeck();

  const renderCompletedCard = ({ item }) => {
    const deck = getDeckById(item.deckId);
    
    return (
      <View style={styles.cardItem}>
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.deckName}>{deck?.name || 'Unknown Deck'}</Text>
            <View style={styles.completedBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#34C759" />
              <Text style={styles.completedText}>Completed</Text>
            </View>
          </View>
          <Text style={styles.cardQuestion}>{item.question}</Text>
          <Text style={styles.cardAnswer}>{item.answer}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={completedCards}
        renderItem={renderCompletedCard}
        keyExtractor={(item) => `${item.id}-${item.deckId}`}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="checkmark-circle-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No completed cards yet</Text>
            <Text style={styles.emptySubtext}>
              Complete some cards in your decks to see them here!
            </Text>
          </View>
        }
        ListHeaderComponent={
          completedCards.length > 0 ? (
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Completed Cards</Text>
              <Text style={styles.headerSubtitle}>
                {completedCards.length} card{completedCards.length !== 1 ? 's' : ''} completed
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  listContainer: {
    padding: 16,
  },
  header: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1c1c1e',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8e8e93',
  },
  cardItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  deckName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  completedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#34C759',
  },
  cardQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1c1c1e',
    marginBottom: 8,
  },
  cardAnswer: {
    fontSize: 14,
    color: '#8e8e93',
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8e8e93',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#c7c7cc',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default CompletedScreen; 