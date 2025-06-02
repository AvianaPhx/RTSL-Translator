import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import TabBar from '@/components/TabBar';

import { auth, db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const Home = () => {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          setUserData(snap.data());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // derive initial if no picture
  const initial = userData?.username?.charAt(0).toUpperCase() || '?';

  return (
    <SafeAreaView className="bg-gray-900 flex-1">
      {/* Header */}
      <View className="flex-row justify-between items-center mx-4 mt-6 mb-6">
        <View>
          <Text className="font-bold text-4xl text-purple-400">
            Hello, {userData?.username || 'User'}
          </Text>
          <Text className="text-white text-xl mt-1">
            Welcome to RTSL-Translator
          </Text>
        </View>

        {/* Profile Avatar */}
        <TouchableOpacity onPress={() => router.push('/account-detail')}>
          {userData?.profilePictureBase64 ? (
            <Image
              source={{ uri: `data:image/jpeg;base64,${userData.profilePictureBase64}` }}
              className="w-20 h-20 rounded-full"
            />
          ) : (
            <View className="w-20 h-20 rounded-full bg-gray-700 justify-center items-center">
              <Text className="text-white text-xl">{initial}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View className="flex-1 px-4">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* Buttons */}
          <View className="gap-4 mt-2">
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
              onPress={() => router.push('/translator')}
            >
              <MaterialIcons name="link" size={30} color="white" />
              <Text className="ml-3 text-2xl text-white">
                Chat With Friends
              </Text>
            </TouchableOpacity>
          </View>

          {/* Info Sections */}
          <View className="gap-4 mt-7">
            <View className="bg-gray-800 p-6 rounded-lg shadow-md">
              <Text className="ml-3 text-2xl text-white">
                RTSL-Translator
              </Text>
              <Text className='ml-3 text-white'>
                Break communication barriers with our app! Using advanced AI and computer vision, the app translates sign language gestures into text and speech in real time.
              </Text>
            </View>

            <View className="bg-gray-800 p-6 rounded-lg shadow-md mt-2">
              <Text className="ml-3 text-2xl text-white">
                Connect with a Friend!
              </Text>
              <Text className='ml-3 text-white'>
                Track your sign language progress with detailed insights on your most-used signs, translation accuracy, and overall performance.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Bottom Navigation */}
      <View className="absolute bottom-0 left-0 right-0 m-4">
        <TabBar />
      </View>
    </SafeAreaView>
  );
};

export default Home;
