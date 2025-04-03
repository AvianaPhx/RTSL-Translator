import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import TabBar from '@/components/TabBar';
import { auth, db } from '@/config/firebase';
import { doc, getDoc } from "firebase/firestore"; 

const Home = () => {
  const router = useRouter();
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

    <SafeAreaView className="bg-gray-900 flex-1">

      {/* Header */}
      <View className="mx-4 mt-6">
        <Text className="font-bold text-4xl md:text-4xl text-purple-400">
          Hello, {userData?.username || 'User'}
        </Text>
        <Text className="text-white text-xl md:text-xl mt-1">
          Welcome to RTSL-Translator
        </Text>
      </View>

      <View className="flex-1 px-4">
        {/* Scrollable Content */}
        <ScrollView className="mt-" contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}>

          {/* Buttons */}
          <View className="gap-4 mt-9">
            <TouchableOpacity 
              className="flex-row items-center bg-gray-800 p-6 rounded-lg shadow-md w-full"
              onPress={() => router.push('/connect')}
            >
              <FontAwesome name="user-plus" size={30} color="white" />
              <Text className="ml-3 text-2xl text-white">
                Connect with a Friend!
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="flex-row items-center bg-gray-800 p-6 rounded-lg shadow-md w-full mt-2"
              onPress={() => router.push('/connect')}
            >
              <MaterialIcons name="bar-chart" size={30} color="white" />
              <Text className="ml-3 text-2xl text-white">
                Show Your Stats
              </Text>
            </TouchableOpacity>
          </View>

          {/* Info Sections */}
          <View className="gap-4 mt-10">
            <View className="bg-gray-800 p-6 rounded-lg shadow-md">
              <Text className="text-2xl font-bold text-white">
                RTSL-Translator
              </Text>
              <Text className="text-sm text-white mt-1">
                Break communication barriers with our app! Using advanced AI and computer vision, the app translates sign language into text and speech in real time.
              </Text>
            </View>

            <View className="bg-gray-800 p-6 rounded-lg shadow-md mt-2">
              <Text className="text-2xl font-bold text-white">
                Check Your Stats
              </Text>
              <Text className="text-sm text-white mt-1">
                Track your sign language progress with detailed insights on your most-used signs, strengths, and areas for improvement.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Bottom Navigation - Fixed at Bottom */}
      <View className="bottom-0 left-0 right-0 m-4">
        <TabBar />
      </View>
    </SafeAreaView>
  );
};

export default Home;
