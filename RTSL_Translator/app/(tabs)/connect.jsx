import { View, Text, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context'
import React from 'react';
import TabBar from '@/components/TabBar';

const Connect = () => {

  const router = useRouter();

  return (
    <SafeAreaView className="bg-gray-900 flex-1">
      <Text className='text-white'>Connect</Text>


      {/* Tab Bar */}
      <View className="bottom-0 left-0 right-0 m-4">
        <TabBar />
      </View>
    </SafeAreaView>
  )
}

export default Connect