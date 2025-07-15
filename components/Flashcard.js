import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Flashcard = ({ card, onSwipeRight, onSwipeLeft, onSwipeUp }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  
  const flipAnimation = useRef(new Animated.Value(0)).current;
  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;

  const flipCard = () => {
    const toValue = isFlipped ? 0 : 1;
    
    Animated.spring(flipAnimation, {
      toValue,
      useNativeDriver: true,
      tension:0,
      friction: 8,
    }).start();
    
    setIsFlipped(!isFlipped);
    setShowAnswer(!showAnswer);
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [
      { translateX: pan.x },
      { translateY: pan.y },
      { rotateY: frontInterpolate },
      { scale: scale },
    ],
  };

  const backAnimatedStyle = {
    transform: [
      { translateX: pan.x },
      { translateY: pan.y },
      { rotateY: backInterpolate },
      { scale: scale },
    ],
  };

  return (
    <View style={styles.container}>
      <Animated.View style={styles.cardContainer}>
        {/* Front of card */}
        <Animated.View style={[styles.card, styles.cardFront, frontAnimatedStyle]}>
          <View style={styles.cardContent}>
            <Text style={styles.cardText}>{card.question}</Text>
            <TouchableOpacity style={styles.flipButton} onPress={flipCard}>
              <Ionicons name="eye" size={20} color="#007AFF" />
              <Text style={styles.flipButtonText}>Show Answer</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Back of card */}
        <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
          <View style={styles.cardContent}>
            <Text style={styles.cardText}>{card.answer}</Text>
            <TouchableOpacity style={styles.flipButton} onPress={flipCard}>
              <Ionicons name="eye-off" size={20} color="#007AFF" />
              <Text style={styles.flipButtonText}>Show Question</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>

      {/* Action Buttons for Swipe Alternatives */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.completeButton]}
          onPress={onSwipeRight}
        >
          <Ionicons name="checkmark-circle" size={20} color="white" />
          <Text style={styles.actionButtonText}>Complete</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.reviewButton]}
          onPress={onSwipeLeft}
        >
          <Ionicons name="refresh" size={20} color="white" />
          <Text style={styles.actionButtonText}>Review</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.importantButton]}
          onPress={onSwipeUp}
        >
          <Ionicons name="star" size={20} color="white" />
          <Text style={styles.actionButtonText}>Important</Text>
        </TouchableOpacity>
      </View>

      {/* Swipe Instructions */}
      <View style={styles.instructions}>
        <View style={styles.instructionItem}>
          <Ionicons name="checkmark-circle" size={16} color="#34C759" />
          <Text style={styles.instructionText}>Complete</Text>
        </View>
        <View style={styles.instructionItem}>
          <Ionicons name="refresh" size={16} color="#FF9500" />
          <Text style={styles.instructionText}>Review</Text>
        </View>
        <View style={styles.instructionItem}>
          <Ionicons name="star" size={16} color="#FF3B30" />
          <Text style={styles.instructionText}>Important</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cardContainer: {
    width: '100%',
    height: 400,
    position: 'relative',
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 16,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  cardFront: {
    backgroundColor: 'white',
    backfaceVisibility: 'hidden',
  },
  cardBack: {
    backgroundColor: '#f8f9fa',
    backfaceVisibility: 'hidden',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  cardText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1c1c1e',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 20,
  },
  flipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f2f2f7',
    gap: 8,
  },
  flipButtonText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 6,
    flex: 1,
  },
  completeButton: {
    backgroundColor: '#34C759',
  },
  reviewButton: {
    backgroundColor: '#FF9500',
  },
  importantButton: {
    backgroundColor: '#FF3B30',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  instructions: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  instructionItem: {
    alignItems: 'center',
    gap: 4,
  },
  instructionText: {
    fontSize: 12,
    color: '#8e8e93',
    textAlign: 'center',
  },
});

export default Flashcard; 