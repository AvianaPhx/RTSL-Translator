import React from 'react';
import { View, Text, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import TabBar from '@/components/TabBar';

const Home = () => {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  return (
    <View className="flex-1" style={{ padding: width * 0.05 }}> 
      
      {/* Header */}
      <View className="items-center mb-6">
        <Text className="font-bold text-purple-900 text-center" style={{ fontSize: width * 0.08 }}>Hello, Aviana</Text>
        <Text className="text-gray-700 text-center" style={{ fontSize: width * 0.045 }}>Welcome to RTSL-Translator</Text>
        <Image source={{ uri: 'https://your-avatar-url.com' }} className="rounded-full mt-3" style={{ width: width * 0.15, height: width * 0.15 }} />
      </View>

      {/* Buttons */}
      <TouchableOpacity className="flex-row items-center bg-white p-4 rounded-lg mb-3 shadow-md"
        onPress={() => router.push('/connect')}>
        <FontAwesome name="user-plus" size={24} color="black" />
        <Text className="ml-3 text-lg">Connect with a Friend!</Text>
      </TouchableOpacity>

      <TouchableOpacity className="flex-row items-center bg-white p-4 rounded-lg mb-3 shadow-md"
        onPress={() => router.push('/stats')}>
        <MaterialIcons name="bar-chart" size={24} color="black" />
        <Text className="ml-3 text-lg">Show Your Stats</Text>
      </TouchableOpacity>

      {/* Info Sections */}
      <View className="bg-white p-4 rounded-lg mb-3 shadow-md">
        <Text className="text-lg font-bold">RTSL-Translator</Text>
        <Text className="text-sm text-gray-600 mt-1">
          Break communication barriers with our app! Using advanced AI and computer vision, the app translates sign language into text and speech in real time.
        </Text>
      </View>

      <View className="bg-white p-4 rounded-lg mb-3 shadow-md">
        <Text className="text-lg font-bold">Check Your Stats</Text>
        <Text className="text-sm text-gray-600 mt-1">
          Track your sign language progress with detailed insights on your most-used signs, strengths, and areas for improvement.
        </Text>
      </View>

      {/* Tab Bar */}
      <TabBar />

    </View>
  );
};

export default Home;
