import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

const Home = () => {
  return (
    <View className="flex-1 bg-gray-100 p-5">
      {/* Header */}
      <View className="items-center mb-5">
        <Text className="text-6xl font-bold text-purple-900 text-center">Hello, Aviana</Text>
        <Text className="text-2xl text-gray-700 text-center">Welcome to RTSL-Translator</Text>
        <Image source={{ uri: 'https://your-avatar-url.com' }} className="w-12 h-12 rounded-full mt-2" />
      </View>
      
      {/* Buttons */}
      <TouchableOpacity className="flex-row items-center bg-white p-4 rounded-lg mb-2">
        <FontAwesome name="user-plus" size={24} color="black" />
        <Text className="ml-3 text-lg">Connect with a Friend!</Text>
      </TouchableOpacity>

      <TouchableOpacity className="flex-row items-center bg-white p-4 rounded-lg mb-2">
        <MaterialIcons name="bar-chart" size={24} color="black" />
        <Text className="ml-3 text-lg">Show Your Stats</Text>
      </TouchableOpacity>

      {/* Info Sections */}
      <View className="bg-white p-4 rounded-lg mb-2">
        <Text className="text-lg font-bold">RTSL-Translator</Text>
        <Text className="text-sm text-gray-600 mt-1">
          Break communication barriers with our app! Using advanced AI and computer vision, the app translates sign language into text and speech in real time.
        </Text>
      </View>

      <View className="bg-white p-4 rounded-lg mb-2">
        <Text className="text-lg font-bold">Check Your Stats</Text>
        <Text className="text-sm text-gray-600 mt-1">
          Track your sign language progress with detailed insights on your most-used signs, strengths, and areas for improvement.
        </Text>
      </View>

      {/* Bottom Navigation */}
      <View className="flex-row justify-around p-4 bg-white rounded-2xl mt-5">
        <FontAwesome name="home" size={24} color="black" />
        <FontAwesome name="comment" size={24} color="black" />
        <FontAwesome name="bar-chart" size={24} color="black" />
        <FontAwesome name="cog" size={24} color="black" />
      </View>
    </View>
  );
};

export default Home;