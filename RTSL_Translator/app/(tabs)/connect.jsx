import { View, Text, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context'
import React from 'react';
import TabBar from '@/components/TabBar';

const Connect = () => {

  const router = useRouter();

  return (
    <SafeAreaView>
      <Text>Connect</Text>


      {/* Tab Bar */}
      <TabBar />
    </SafeAreaView>
  )
}

export default Connect