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

const ImportantScreen = () => {
  const { importantCards, getDeckById } = useDeck();

  const renderImportantCard = ({ item }) => {
    const deck = getDeckById(item.deckId);
    
    return (
      <View style={styles.cardItem}>
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.deckName}>{deck?.name || 'Unknown Deck'}</Text>
            <View style={styles.importantBadge}>
              <Ionicons name="star" size={16} color="#FF9500" />
              <Text style={styles.importantText}>Important</Text>
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
        data={importantCards}
        renderItem={renderImportantCard}
        keyExtractor={(item) => `${item.id}-${item.deckId}`}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="star-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No important cards yet</Text>
            <Text style={styles.emptySubtext}>
              Swipe up on cards during quizzes to mark them as important!
            </Text>
          </View>
        }
        ListHeaderComponent={
          importantCards.length > 0 ? (
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Important Cards</Text>
              <Text style={styles.headerSubtitle}>
                {importantCards.length} card{importantCards.length !== 1 ? 's' : ''} marked as important
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
  importantBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff7e6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  importantText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF9500',
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

export default ImportantScreen; 