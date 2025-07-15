import React, { createContext, useContext, useReducer } from 'react';

// Initial state
const initialState = {
  decks: [],
  completedCards: [],
  importantCards: [],
  reviewCards: [],
};

// Action types
const ACTIONS = {
  ADD_DECK: 'ADD_DECK',
  ADD_CARD: 'ADD_CARD',
  MARK_COMPLETED: 'MARK_COMPLETED',
  MARK_IMPORTANT: 'MARK_IMPORTANT',
  MARK_REVIEW: 'MARK_REVIEW',
  REMOVE_DECK: 'REMOVE_DECK',
  REMOVE_CARD: 'REMOVE_CARD',
};

// Reducer function
const deckReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD_DECK:
      return {
        ...state,
        decks: [...state.decks, action.payload],
      };
    
    case ACTIONS.ADD_CARD:
      return {
        ...state,
        decks: state.decks.map(deck =>
          deck.id === action.payload.deckId
            ? { ...deck, cards: [...deck.cards, action.payload.card] }
            : deck
        ),
      };
    
    case ACTIONS.MARK_COMPLETED:
      const { cardId, deckId } = action.payload;
      const cardToComplete = state.decks
        .find(deck => deck.id === deckId)
        ?.cards.find(card => card.id === cardId);
      
      if (cardToComplete) {
        return {
          ...state,
          completedCards: [...state.completedCards, { ...cardToComplete, deckId }],
        };
      }
      return state;
    
    case ACTIONS.MARK_IMPORTANT:
      const importantCard = state.decks
        .find(deck => deck.id === action.payload.deckId)
        ?.cards.find(card => card.id === action.payload.cardId);
      
      if (importantCard) {
        return {
          ...state,
          importantCards: [...state.importantCards, { ...importantCard, deckId: action.payload.deckId }],
        };
      }
      return state;
    
    case ACTIONS.MARK_REVIEW:
      const reviewCard = state.decks
        .find(deck => deck.id === action.payload.deckId)
        ?.cards.find(card => card.id === action.payload.cardId);
      
      if (reviewCard) {
        return {
          ...state,
          reviewCards: [...state.reviewCards, { ...reviewCard, deckId: action.payload.deckId }],
        };
      }
      return state;
    
    case ACTIONS.REMOVE_DECK:
      return {
        ...state,
        decks: state.decks.filter(deck => deck.id !== action.payload),
        completedCards: state.completedCards.filter(card => card.deckId !== action.payload),
        importantCards: state.importantCards.filter(card => card.deckId !== action.payload),
        reviewCards: state.reviewCards.filter(card => card.deckId !== action.payload),
      };
    
    case ACTIONS.REMOVE_CARD:
      return {
        ...state,
        decks: state.decks.map(deck =>
          deck.id === action.payload.deckId
            ? { ...deck, cards: deck.cards.filter(card => card.id !== action.payload.cardId) }
            : deck
        ),
      };
    
    default:
      return state;
  }
};

// Create context
const DeckContext = createContext();

// Provider component
export const DeckProvider = ({ children }) => {
  const [state, dispatch] = useReducer(deckReducer, initialState);

  // Helper functions
  const addDeck = (name, description = '') => {
    const newDeck = {
      id: Date.now().toString(),
      name,
      description,
      cards: [],
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: ACTIONS.ADD_DECK, payload: newDeck });
    return newDeck.id;
  };

  const addCard = (deckId, question, answer) => {
    const newCard = {
      id: Date.now().toString(),
      question,
      answer,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: ACTIONS.ADD_CARD, payload: { deckId, card: newCard } });
  };

  const markCompleted = (cardId, deckId) => {
    dispatch({ type: ACTIONS.MARK_COMPLETED, payload: { cardId, deckId } });
  };

  const markImportant = (cardId, deckId) => {
    dispatch({ type: ACTIONS.MARK_IMPORTANT, payload: { cardId, deckId } });
  };

  const markReview = (cardId, deckId) => {
    dispatch({ type: ACTIONS.MARK_REVIEW, payload: { cardId, deckId } });
  };

  const removeDeck = (deckId) => {
    dispatch({ type: ACTIONS.REMOVE_DECK, payload: deckId });
  };

  const removeCard = (cardId, deckId) => {
    dispatch({ type: ACTIONS.REMOVE_CARD, payload: { cardId, deckId } });
  };

  const getDeckById = (deckId) => {
    return state.decks.find(deck => deck.id === deckId);
  };

  const getCardsByDeck = (deckId) => {
    const deck = getDeckById(deckId);
    return deck ? deck.cards : [];
  };

  const getActiveCards = (deckId) => {
    const allCards = getCardsByDeck(deckId);
    const completedCardIds = state.completedCards
      .filter(card => card.deckId === deckId)
      .map(card => card.id);
    
    return allCards.filter(card => !completedCardIds.includes(card.id));
  };

  const value = {
    ...state,
    addDeck,
    addCard,
    markCompleted,
    markImportant,
    markReview,
    removeDeck,
    removeCard,
    getDeckById,
    getCardsByDeck,
    getActiveCards,
  };

  return (
    <DeckContext.Provider value={value}>
      {children}
    </DeckContext.Provider>
  );
};

// Custom hook to use the context
export const useDeck = () => {
  const context = useContext(DeckContext);
  if (!context) {
    throw new Error('useDeck must be used within a DeckProvider');
  }
  return context;
}; 