import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import TabButton from '@/components/TabButton';
import { router, Link } from 'expo-router';
import { useRouter } from 'expo-router';

const Setting = () => {

  const routes = {
    accountDetail: "/account-detail",
    editProfile: "/edit-profile",
    changeLanguage: "/change-language",
    help: "/help",
    test: "/setting"
  }

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const navigateTo = (path) => {
    setIsSubmitting(true);
  
    setTimeout(() => {
      setIsSubmitting(false);
      router.push(path); 
    });
  };

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

      {/* Account Details Button */}
      <TabButton 
        title="Account Details"
        handlePress={() => navigateTo(routes.accountDetail)}
        containerStyles="flex-row justify-between mb-4"
        textStyles="text-lg"
        isLoading={isSubmitting}
        icon={<FontAwesome name="chevron-right" size={20} color="gray" />}
      />

      {/* Edit Profile Button */}
      <TabButton 
        title="Edit Profile"
        handlePress={() => navigateTo(routes.editProfile)}
        containerStyles="flex-row justify-between mb-4"
        textStyles="text-lg"
        isLoading={isSubmitting}
        icon={<FontAwesome name="chevron-right" size={20} color="gray" />}
      />

      {/* Change Sign Language Button */}
      <TabButton 
        title="Change Sign Language"
        handlePress={() => navigateTo(routes.changeLanguage)}
        containerStyles="flex-row justify-between mb-4"
        textStyles="text-lg"
        isLoading={isSubmitting}
        icon={<FontAwesome name="chevron-right" size={20} color="gray" />}
      />

      {/* More Info & Support */}
      <Text className="text-gray-700 font-semibold mb-2">More info and support</Text>

      {/* Help Button */}
      <TabButton 
        title="Help"
        handlePress={() => navigateTo(routes.help)}
        containerStyles="flex-row justify-between mb-4"
        textStyles="text-lg"
        isLoading={isSubmitting}
        icon={<FontAwesome name="chevron-right" size={20} color="gray" />}
      />

      {/* Terms & Services Button */}
      <TabButton 
        title="Terms & Services"
        handlePress={() => navigateTo(routes.test)}
        containerStyles="flex-row justify-between mb-4"
        textStyles="text-lg"
        isLoading={isSubmitting}
        icon={<FontAwesome name="chevron-right" size={20} color="gray" />}
      />
      
      {/* User Guide Button */}
      <TabButton 
        title="User Guide"
        handlePress={() => navigateTo(routes.test)}
        containerStyles="flex-row justify-between mb-4"
        textStyles="text-lg"
        isLoading={isSubmitting}
        icon={<FontAwesome name="chevron-right" size={20} color="gray" />}
      />

      {/* Logout */} 
      <Text className="text-gray-700 font-semibold mb-2">Login</Text>

      {/* Logout Button */} 
      <TabButton 
        title="Logout"
        handlePress={() => navigateTo('sign-in')}
        containerStyles="w-full items-center"
        textStyles="text-red-500 text-lg font-bold"
        isLoading={isSubmitting}
      />

    </SafeAreaView>
  )
}

export default Setting