import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { DeckProvider } from './context/DeckContext';

import DeckListScreen from './screens/DeckListScreen';
import DeckDetailScreen from './screens/DeckDetailScreen';
import QuizScreen from './screens/QuizScreen';
import CompletedScreen from './screens/CompletedScreen';
import ImportantScreen from './screens/ImportantScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const DeckStack = (props) => (
  <Stack.Navigator>
    <Stack.Screen 
      name="DeckList" 
      children={(navProps) => <DeckListScreen {...navProps} setIsAuthenticated={props.setIsAuthenticated} isAuthenticated={props.isAuthenticated} />} 
      options={{ title: 'My Decks' }}
    />
    <Stack.Screen 
      name="DeckDetail" 
      component={DeckDetailScreen} 
      options={{ title: 'Deck Details' }}
    />
    <Stack.Screen 
      name="Quiz" 
      component={QuizScreen} 
      options={{ title: 'Quiz' }}
    />
  </Stack.Navigator>
);

const TabNavigator = (props) => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Decks') {
          iconName = focused ? 'library' : 'library-outline';
        } else if (route.name === 'Completed') {
          iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
        } else if (route.name === 'Important') {
          iconName = focused ? 'star' : 'star-outline';
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen 
      name="Decks" 
      children={() => <DeckStack setIsAuthenticated={props.setIsAuthenticated} isAuthenticated={props.isAuthenticated} />} 
      options={{ headerShown: false }}
    />
    <Tab.Screen 
      name="Completed" 
      component={CompletedScreen} 
      options={{ title: 'Completed Cards' }}
    />
    <Tab.Screen 
      name="Important" 
      component={ImportantScreen} 
      options={{ title: 'Important Cards' }}
    />
  </Tab.Navigator>
);

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      setIsAuthenticated(!!token);
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    // Optionally show a splash/loading screen here
    return null;
  }

  return (
    <DeckProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isAuthenticated ? (
            <Stack.Screen name="Main">
              {() => <TabNavigator setIsAuthenticated={setIsAuthenticated} isAuthenticated={isAuthenticated} />}
            </Stack.Screen>
          ) : (
            <>
              <Stack.Screen name="LoginScreen">
                {(props) => <LoginScreen {...props} setIsAuthenticated={setIsAuthenticated} isAuthenticated={isAuthenticated} />}
              </Stack.Screen>
              <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </DeckProvider>
  );
}
