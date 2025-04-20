import { useState, useEffect, useRef } from 'react';
import { View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import TabBar from '@/components/TabBar';

const Translator = () => {

  return (
    <SafeAreaView className="bg-gray-900 flex-1">
      
      {/* Tab Bar */}
      <View className="bottom-0 left-0 right-0 m-4">
        <TabBar />
      </View>
    </SafeAreaView>
  );
};

export default Translator;
