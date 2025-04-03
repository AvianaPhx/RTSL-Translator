import React, { useState, useEffect } from 'react';
import { View, Text, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import TabButton from '@/components/TabButton';
import { useRouter } from 'expo-router';
import { auth, db } from '@/config/firebase';
import { doc, getDoc } from "firebase/firestore"; 

const Setting = () => {

  const routes = {
    accountDetail: "/account-detail",
    editProfile: "/edit-profile",
    changeLanguage: "/change-language",
    help: "/help",
    test: "/home"
  }

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const navigateTo = (path) => {
    setIsSubmitting(true);
  
    setTimeout(() => {
      setIsSubmitting(false);
      router.push(path); 
    }, 300);
  };

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser; // Get the logged-in user
        if (!user) return;

        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserData(userSnap.data()); // Store user data
        } else {
          console.log('No user data found!');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-gray-900"> 

      <View className="flex-1 px-5 items-center">
        <View className="w-full max-w-lg">

          {/* Header */}
          <View className="my-6">
            <Text className="font-bold text-5xl md:text-4xl text-purple-400">
              {userData?.username || 'User'}
            </Text>
            <Text className="text-white text-2xl md:text-xl mt-1">
              {auth.currentUser?.email}
            </Text>
          </View>

          {/* Account Settings */}
          <Text className="text-gray-400 font-semibold mb-2 text-lg">Account Settings</Text>

          {/* Account Details Button */}
          <TabButton 
            title="Account Details"
            handlePress={() => navigateTo(routes.accountDetail)}
            containerStyles="flex-row justify-between mb-4"
            textStyles="text-lg text-white"
            isLoading={isSubmitting}
            icon={<FontAwesome name="chevron-right" size={20} color="gray" />}
          />

          {/* Edit Profile Button */}
          <TabButton 
            title="Edit Profile"
            handlePress={() => navigateTo(routes.editProfile)}
            containerStyles="flex-row justify-between mb-4"
            textStyles="text-lg text-white"
            isLoading={isSubmitting}
            icon={<FontAwesome name="chevron-right" size={20} color="gray" />}
          />

          {/* Change Sign Language Button */}
          <TabButton 
            title="Change Sign Language"
            handlePress={() => navigateTo(routes.changeLanguage)}
            containerStyles="flex-row justify-between mb-4"
            textStyles="text-lg text-white"
            isLoading={isSubmitting}
            icon={<FontAwesome name="chevron-right" size={20} color="gray" />}
          />

          {/* More Info & Support */}
          <Text className="text-gray-400 font-semibold mb-3 text-lg">More info and support</Text>

          {/* Help Button */}
          <TabButton 
            title="Help"
            handlePress={() => navigateTo(routes.help)}
            containerStyles="flex-row justify-between mb-4"
            textStyles="text-lg text-white"
            isLoading={isSubmitting}
            icon={<FontAwesome name="chevron-right" size={20} color="gray" />}
          />

          {/* Terms & Services Button */}
          <TabButton 
            title="Terms & Services"
            handlePress={() => navigateTo(routes.test)}
            containerStyles="flex-row justify-between mb-4"
            textStyles="text-lg text-white"
            isLoading={isSubmitting}
            icon={<FontAwesome name="chevron-right" size={20} color="gray" />}
          />
          
          {/* User Guide Button */}
          <TabButton 
            title="User Guide"
            handlePress={() => navigateTo(routes.test)}
            containerStyles="flex-row justify-between mb-4"
            textStyles="text-lg text-white"
            isLoading={isSubmitting}
            icon={<FontAwesome name="chevron-right" size={20} color="gray" />}
          />

          {/* Logout */} 
          <Text className="text-gray-400 font-semibold mb-3 text-lg">Login</Text>

          {/* Logout Button */} 
          <TabButton 
            title="Logout"
            handlePress={() => Alert.alert("Logout", "Are you sure you want to log out?", [
              { text: "Cancel", style: "cancel" },
              { text: "Logout", onPress: () => router.replace('/sign-in') }
            ])}
            containerStyles="w-full items-center"
            textStyles="text-red-500 text-lg font-bold"
            isLoading={isSubmitting}
          />
        
        </View>
      </View>

    </SafeAreaView>
  )
}

export default Setting