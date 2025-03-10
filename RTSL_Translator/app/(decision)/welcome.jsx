import { View, Text, Animated, Pressable } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '@/components/CustomButton'
import { Redirect, router, Link } from 'expo-router'

const Welcome = ({ route }) => {
  const translateY = useRef(new Animated.Value(0)).current; // For moving up
  const fadeAnim = useRef(new Animated.Value(0)).current; // For fading in
  const username = route?.params?.username || 'User'; // Get username from navigation params

  useEffect(() => {
    // Delay before moving up
    setTimeout(() => {
      Animated.timing(translateY, {
        toValue: -50, // Move up
        duration: 1000, // Movement duration
        useNativeDriver: true,
      }).start(() => {
        // After moving up, fade in the sign language selection
        Animated.timing(fadeAnim, {
          toValue: 2, // Make it fully visible
          duration: 800,
          useNativeDriver: true,
        }).start();
      });
    }, 1000); // Hold for 1 second before moving up
  }, []);

   // Function to handle language selection
   const handleLanguageSelect = (language) => {
    console.log(`Selected: ${language}`);
    router.push('/home'); // Redirect to Home screen
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-white px-5">
      {/* Moving Up Animation */}
      <Animated.View style={{ transform: [{ translateY }] }} className="items-center justify-center">
        <Text className="text-6xl font-bold text-purple-900 text-center">Hello, {username}</Text>
        <Text className="text-2xl text-gray-700 text-center">Welcome to RTSL-Translator</Text>
      </Animated.View>

      {/* Fade In Animation for Sign Language Selection */}
      <Animated.View style={{ opacity: fadeAnim }} className="w-full">
        <Text className="text-2xl font-pregular text-gray-800 ">
          Which Sign Language do you want to translate?
        </Text>
        <View className="mt-5 space-y-4">
          <Pressable onPress={() => handleLanguageSelect('ASL')}>
            <Text className="text-white bg-violet-400 px-5 py-6 rounded-lg mb-6 text-center text-2xl">
              American Sign Language (ASL)
            </Text>
          </Pressable>
          <Pressable onPress={() => handleLanguageSelect('BSL')}>
            <Text className="text-white bg-violet-400 px-5 py-6 rounded-lg mb-6 text-center text-2xl">
              British Sign Language (BSL)
            </Text>
          </Pressable>
          <Pressable onPress={() => handleLanguageSelect('OGS')}>
            <Text className="text-white bg-violet-400 px-5 py-6 rounded-lg mb-6 text-center text-2xl">
              Austrian Sign Language (OGS)
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default Welcome;
