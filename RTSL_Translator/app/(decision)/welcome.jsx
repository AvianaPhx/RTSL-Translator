import { View, Text, Animated } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { auth, db } from '@/config/firebase';
import { doc, getDoc } from "firebase/firestore"; 

const Welcome = ({ route }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current; // For scaling effect
  const fadeAnim = useRef(new Animated.Value(0)).current; // For fade-in effect
  const username = route?.params?.username || 'User'; // Get username from navigation params
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if(!user) return;

        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserData(userSnap.data());
        } else {
          console.log('No user data found!');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
    fetchUserData();
  }, []);

  useEffect(() => {
    // Start scaling and fading animation immediately
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1.2, // Scale to 1.3 times the original size
        duration: 3000, // 2 seconds for growing
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1, // Fade to fully visible
        duration: 1000, // Fast fade-in effect (500ms)
        useNativeDriver: true,
      }),
    ]).start(() => {
      // After the animation completes, redirect to /home
      setTimeout(() => {
        router.replace('/home'); // Redirect to home
      }, 800); // Wait a bit before redirecting
    });
  }, []);

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-white px-5">
      {/* Fading and growing animation for text */}
      <Animated.View
        style={{ 
          transform: [{ scale: scaleAnim }],
          opacity: fadeAnim, // Apply the fade-in animation
        }}
        className="items-center justify-center"
      >
        <Text className="text-6xl font-bold text-purple-900 text-center">Hello, {userData?.username || 'User'}</Text>
        <Text className="text-2xl text-gray-700 text-center">Welcome to RTSL-Translator</Text>
      </Animated.View>
    </SafeAreaView>
  );
};

export default Welcome;
