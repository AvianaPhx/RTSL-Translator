import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';

const Setting = () => {
  return (
    <SafeAreaView className="flex-1 p-5"> 

      {/* Header */}
      <View className="flex-row items-center justify-between mb-5">
        <View className="flex-1">
          <Text className="text-4xl font-bold text-purple-700">Aviana Phoenix</Text>
          <Text className="text-2xl text-gray-500">@avianaphx</Text>
        </View>
        <Image source={{ uri: 'https://your-avatar-url.com' }} className="w-12 h-12 rounded-full" />
      </View>

      {/* Account Settings */}
      <Text className="text-gray-700 font-semibold mb-2">Account Settings</Text>
      <TouchableOpacity className="bg-white p-4 rounded-xl flex-row justify-between mb-2">
        <Text className="text-lg">Account Details</Text>
        <FontAwesome name="chevron-right" size={20} color="gray" />
      </TouchableOpacity>
      <TouchableOpacity className="bg-white p-4 rounded-xl flex-row justify-between mb-2">
        <Text className="text-lg">Edit Profile</Text>
        <FontAwesome name="chevron-right" size={20} color="gray" />
      </TouchableOpacity>
      <TouchableOpacity className="bg-white p-4 rounded-xl flex-row justify-between mb-4">
        <Text className="text-lg">Change Sign Language</Text>
        <FontAwesome name="chevron-right" size={20} color="gray" />
      </TouchableOpacity>

            {/* More Info & Support */}
            <Text className="text-gray-700 font-semibold mb-2">More info and support</Text>
      <TouchableOpacity className="bg-white p-4 rounded-xl flex-row justify-between mb-2">
        <Text className="text-lg">Help</Text>
        <FontAwesome name="chevron-right" size={20} color="gray" />
      </TouchableOpacity>
      <TouchableOpacity className="bg-white p-4 rounded-xl flex-row justify-between mb-2">
        <Text className="text-lg">Terms & Services</Text>
        <FontAwesome name="chevron-right" size={20} color="gray" />
      </TouchableOpacity>
      <TouchableOpacity className="bg-white p-4 rounded-xl flex-row justify-between mb-4">
        <Text className="text-lg">User Guide</Text>
        <FontAwesome name="chevron-right" size={20} color="gray" />
      </TouchableOpacity>

      {/* Logout Button */}
      <Text className="text-gray-700 font-semibold mb-2">Login</Text>
      <TouchableOpacity className="bg-white p-4 rounded-xl items-center">
        <Text className="text-red-500 text-lg font-bold">Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default Setting