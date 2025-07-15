import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDeck } from '../context/DeckContext';
import Flashcard from '../components/Flashcard';

const QuizScreen = ({ route, navigation }) => {
  const { deckId } = route.params;
  const { getDeckById, getActiveCards, markCompleted, markImportant, markReview } = useDeck();
  
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cards, setCards] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const deck = getDeckById(deckId);

  useEffect(() => {
    if (deck) {
      const activeCards = getActiveCards(deckId);
      setCards(activeCards);
      if (activeCards.length === 0) {
        setQuizCompleted(true);
      }
    }
  }, [deckId, deck]);

  useEffect(() => {
    // Update cards when they change
    const activeCards = getActiveCards(deckId);
    setCards(activeCards);
    
    if (activeCards.length === 0 && cards.length > 0) {
      setQuizCompleted(true);
    }
  }, [deckId]);

  const handleSwipeRight = () => {
    if (cards[currentCardIndex]) {
      markCompleted(cards[currentCardIndex].id, deckId);
      nextCard();
    }
  };

  const handleSwipeLeft = () => {
    if (cards[currentCardIndex]) {
      markReview(cards[currentCardIndex].id, deckId);
      nextCard();
    }
  };

  const handleSwipeUp = () => {
    if (cards[currentCardIndex]) {
      markImportant(cards[currentCardIndex].id, deckId);
      nextCard();
    }
  };

  const nextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestart = () => {
    Alert.alert(
      'Restart Quiz',
      'Are you sure you want to restart this quiz?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Restart', 
          onPress: () => {
            setCurrentCardIndex(0);
            setQuizCompleted(false);
            const activeCards = getActiveCards(deckId);
            setCards(activeCards);
          }
        },
      ]
    );
  };

  const handleExit = () => {
    navigation.goBack();
  };

  if (!deck) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Deck not found</Text>
      </View>
    );
  }

  if (quizCompleted) {
    return (
      <View style={styles.container}>
        <View style={styles.completedContainer}>
          <Ionicons name="checkmark-circle" size={80} color="#34C759" />
          <Text style={styles.completedTitle}>Quiz Completed!</Text>
          <Text style={styles.completedSubtitle}>
            Great job! You've completed all cards in this deck.
          </Text>
          
          <View style={styles.completedStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{cards.length}</Text>
              <Text style={styles.statLabel}>Cards Studied</Text>
            </View>
          </View>

          <View style={styles.completedActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.restartButton]}
              onPress={handleRestart}
            >
              <Ionicons name="refresh" size={20} color="white" />
              <Text style={styles.restartButtonText}>Restart Quiz</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.exitButton]}
              onPress={handleExit}
            >
              <Ionicons name="arrow-back" size={20} color="#007AFF" />
              <Text style={styles.exitButtonText}>Exit Quiz</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  if (cards.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="checkmark-circle" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No cards to study</Text>
          <Text style={styles.emptySubtext}>
            All cards in this deck have been completed!
          </Text>
          <TouchableOpacity
            style={styles.exitButton}
            onPress={handleExit}
          >
            <Text style={styles.exitButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const currentCard = cards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / cards.length) * 100;

  return (
    <View style={styles.container}>
      {/* Progress Header */}
      <View style={styles.progressHeader}>
        <TouchableOpacity style={styles.backButton} onPress={handleExit}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>
            {currentCardIndex + 1} of {cards.length}
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>
        
        <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
          <Ionicons name="refresh" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Flashcard */}
      <Flashcard
        card={currentCard}
        onSwipeRight={handleSwipeRight}
        onSwipeLeft={handleSwipeLeft}
        onSwipeUp={handleSwipeUp}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 50,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  backButton: {
    padding: 8,
  },
  progressInfo: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8e8e93',
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#e1e1e1',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  restartButton: {
    padding: 8,
  },
  completedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  completedTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1c1c1e',
    marginTop: 24,
    marginBottom: 12,
  },
  completedSubtitle: {
    fontSize: 16,
    color: '#8e8e93',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  completedStats: {
    marginBottom: 32,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 14,
    color: '#8e8e93',
    marginTop: 4,
  },
  completedActions: {
    width: '100%',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  restartButton: {
    backgroundColor: '#007AFF',
  },
  exitButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  restartButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  exitButtonText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#8e8e93',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#c7c7cc',
    textAlign: 'center',
    marginBottom: 32,
  },
});

export default QuizScreen; 