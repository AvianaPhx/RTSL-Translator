import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, useWindowDimensions, ActivityIndicator } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import TabBar from '@/components/TabBar';
import { auth, db } from '@/config/firebase';
import { doc, getDoc } from "firebase/firestore"; 

const Home = () => {
  // const router = useRouter();
  // const { width, height } = useWindowDimensions();

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

    <SafeAreaView className='bg-gray-900 flex-1'>

      {/* Header */}
      <View className='mx-3 ml-3'>
        <Text className="font-bold text-4xl text-purple-400">Hello, {userData?.username || 'User'}</Text>
        <Text className="text-gray-400 text-xl">Welcome to RTSL-Translator</Text>
      </View>
      
      <View className='m-4'>
        {/* Buttons */}
        <TouchableOpacity className="flex-row items-center bg-gray-400 p-4 rounded-lg mb-3 shadow-md" onPress={() => router.push('')}>
          <FontAwesome name="user-plus" size={24} color="black" />
          <Text className="ml-3 text-lg">Connect with a Friend!</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center bg-gray-400 p-4 rounded-lg mb-3 shadow-md" onPress={() => router.push('')}>
          <MaterialIcons name="bar-chart" size={24} color="black" />
          <Text className="ml-3 text-lg">Show Your Stats</Text>
        </TouchableOpacity>
      </View>

      <View className='m-4'>
        {/* Info Sections */}
        <View className="bg-gray-400 p-4 rounded-lg mb-3 shadow-md">
          <Text className="text-lg font-bold">RTSL-Translator</Text>
          <Text className="text-sm text-gray-600 mt-1">
            Break communication barriers with our app! Using advanced AI and computer vision, the app translates sign language into text and speech in real time.
          </Text>
        </View>

        <View className="bg-gray-400 p-4 rounded-lg mb-3 shadow-md">
          <Text className="text-lg font-bold">Check Your Stats</Text>
          <Text className="text-sm text-gray-600 mt-1">
            Track your sign language progress with detailed insights on your most-used signs, strengths, and areas for improvement.
          </Text>
        </View>
      </View>



    {/* Tab Bar */}
    <TabBar />

    </SafeAreaView>

    // <SafeAreaView className="flex-1" style={{ padding: width * 0.05 }}>


    //   <View> 
        
    //     {/* Header */}
    //     <View className="items-center">
    //       <Text className="font-bold text-purple-900 text-center" style={{ fontSize: width * 0.08 }}>Hello, Aviana</Text>
    //       <Text className="text-gray-700 text-center" style={{ fontSize: width * 0.045 }}>Welcome to RTSL-Translator</Text>
    //       <Image source={{ uri: 'https://your-avatar-url.com' }} className="rounded-full mt-3" style={{ width: width * 0.15, height: width * 0.15 }} />
    //     </View>

    //     {/* Buttons */}
    //     <TouchableOpacity className="flex-row items-center bg-white p-4 rounded-lg mb-3 shadow-md"
    //       onPress={() => router.push('/connect')}>
    //       <FontAwesome name="user-plus" size={24} color="black" />
    //       <Text className="ml-3 text-lg">Connect with a Friend!</Text>
    //     </TouchableOpacity>

    //     <TouchableOpacity className="flex-row items-center bg-white p-4 rounded-lg mb-3 shadow-md"
    //       onPress={() => router.push('/stats')}>
    //       <MaterialIcons name="bar-chart" size={24} color="black" />
    //       <Text className="ml-3 text-lg">Show Your Stats</Text>
    //     </TouchableOpacity>

    //     {/* Info Sections */}
    //     <View className="bg-white p-4 rounded-lg mb-3 shadow-md">
    //       <Text className="text-lg font-bold">RTSL-Translator</Text>
    //       <Text className="text-sm text-gray-600 mt-1">
    //         Break communication barriers with our app! Using advanced AI and computer vision, the app translates sign language into text and speech in real time.
    //       </Text>
    //     </View>

    //     <View className="bg-white p-4 rounded-lg mb-3 shadow-md">
    //       <Text className="text-lg font-bold">Check Your Stats</Text>
    //       <Text className="text-sm text-gray-600 mt-1">
    //         Track your sign language progress with detailed insights on your most-used signs, strengths, and areas for improvement.
    //       </Text>
    //     </View>

    //     {/* Tab Bar */}
    //     <TabBar />

    //   </View>
    // </SafeAreaView>

  );
};

export default Home;
