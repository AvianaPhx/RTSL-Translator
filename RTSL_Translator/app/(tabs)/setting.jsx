import React, { useState, useEffect } from 'react';
import { View, Text, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import TabButton from '@/components/TabButton';
import { useRouter } from 'expo-router';
import { auth, db } from '@/config/firebase';
import { doc, getDoc } from "firebase/firestore";
import { signOut } from 'firebase/auth';

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

      {/* Header */}
      <View className="m-5">
        <Text className="font-bold text-5xl md:text-4xl text-purple-400">
          {userData?.username || 'User'}
        </Text>
        <Text className="text-white text-2xl md:text-xl mt-1">
          {auth.currentUser?.email}
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-5 items-center">
          <View className="w-full max-w-lg">

            {/* Account Settings */}
            <Text className="text-gray-400 font-semibold mb-2 text-lg">Account Settings</Text>

            <TabButton title="Account Details" handlePress={() => navigateTo(routes.accountDetail)} containerStyles="flex-row justify-between mb-4" textStyles="text-lg text-white" isLoading={isSubmitting} icon={<FontAwesome name="chevron-right" size={20} color="gray" />} />
            <TabButton title="Edit Profile" handlePress={() => navigateTo(routes.editProfile)} containerStyles="flex-row justify-between mb-4" textStyles="text-lg text-white" isLoading={isSubmitting} icon={<FontAwesome name="chevron-right" size={20} color="gray" />} />
            <TabButton title="Change Sign Language" handlePress={() => navigateTo(routes.changeLanguage)} containerStyles="flex-row justify-between mb-4" textStyles="text-lg text-white" isLoading={isSubmitting} icon={<FontAwesome name="chevron-right" size={20} color="gray" />} />

            {/* More Info */}
            <Text className="text-gray-400 font-semibold mb-3 text-lg">More info and support</Text>

            <TabButton title="Help" handlePress={() => navigateTo(routes.help)} containerStyles="flex-row justify-between mb-4" textStyles="text-lg text-white" isLoading={isSubmitting} icon={<FontAwesome name="chevron-right" size={20} color="gray" />} />
            <TabButton title="Terms & Services" handlePress={() => navigateTo(routes.test)} containerStyles="flex-row justify-between mb-4" textStyles="text-lg text-white" isLoading={isSubmitting} icon={<FontAwesome name="chevron-right" size={20} color="gray" />} />
            <TabButton title="User Guide" handlePress={() => navigateTo(routes.test)} containerStyles="flex-row justify-between mb-4" textStyles="text-lg text-white" isLoading={isSubmitting} icon={<FontAwesome name="chevron-right" size={20} color="gray" />} />

            {/* Logout */}
            <Text className="text-gray-400 font-semibold mb-3 text-lg">Login</Text>
            <TabButton 
              title="Logout"
              handlePress={() => Alert.alert("Logout", "Are you sure you want to log out?", [
                { text: "Cancel", style: "cancel" },
                { text: "Logout", onPress: () => {
                  // Log out the user when "Yes" is pressed
                  signOut(auth)
                    .then(() => {
                      console.log('User logged out successfully');
                      router.replace('/sign-in'); // Redirect to the sign-in page
                    })
                    .catch((error) => {
                      console.error('Error logging out:', error);
                    });
                }}
              ])}
              containerStyles="w-full items-center mb-6"
              textStyles="text-red-500 text-xl font-bold"
              isLoading={isSubmitting}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Setting