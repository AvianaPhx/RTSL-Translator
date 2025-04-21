// app/screens/UserProfile.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/config/firebase';
import { FontAwesome } from '@expo/vector-icons';

const UserProfile = () => {
  const { chatId } = useLocalSearchParams();
  const router = useRouter();
  const [friendData, setFriendData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const me = auth.currentUser.uid;
      const friendUid = chatId.split('_').find(id => id !== me);
      const docSnap = await getDoc(doc(db, 'users', friendUid));
      if (docSnap.exists()) setFriendData(docSnap.data());
    };
    fetchData();
  }, []);

  if (!friendData) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900 justify-center items-center">
        <ActivityIndicator size="large" color="white" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-900 px-6 py-4">
      {/* Back */}
      <TouchableOpacity onPress={() => router.back()} className="mb-5">
        <FontAwesome name="arrow-left" size={24} color="white" />
      </TouchableOpacity>

      {/* Header */}
      <Text className="text-white text-2xl font-bold mb-6 text-center">User Profile</Text>

      {/* Profile Picture */}
      <View className="items-center mb-6">
        {friendData.profilePictureBase64 ? (
          <Image
            source={{ uri: `data:image/jpeg;base64,${friendData.profilePictureBase64}` }}
            className="w-32 h-32 rounded-full shadow-lg"
          />
        ) : (
          <View className="w-32 h-32 rounded-full bg-gray-600 justify-center items-center shadow-lg">
            <Text className="text-white text-4xl font-bold">
              {friendData.username?.charAt(0).toUpperCase() || '?'}
            </Text>
          </View>
        )}
      </View>

      {/* Info Card */}
      <View className="bg-gray-800 rounded-2xl p-5 space-y-4 shadow-md">
        <View className="border-b border-gray-600 pb-2">
          <Text className="text-gray-400 text-sm">Username</Text>
          <Text className="text-white text-lg">{friendData.username || 'N/A'}</Text>
        </View>

        <View className="border-b border-gray-600 pb-2">
          <Text className="text-gray-400 text-sm">Email</Text>
          <Text className="text-white text-lg">{friendData.email || 'N/A'}</Text>
        </View>

        <View>
          <Text className="text-gray-400 text-sm">Phone Number</Text>
          <Text className="text-white text-lg">{friendData.phone || 'Not provided'}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default UserProfile;
