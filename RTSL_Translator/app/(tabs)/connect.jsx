import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Text,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '@/config/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  getDoc,
  doc,
} from 'firebase/firestore';
import TabBar from '@/components/TabBar';
import { useRouter } from 'expo-router';

const Connect = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const router = useRouter();

  // Exact-match search on `email`
  const searchUsers = async () => {
    const email = searchQuery.trim();
    if (!email) {
      setSearchResults([]);
      return;
    }
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const snap = await getDocs(q);

      const users = snap.docs
        .map(d => ({ uid: d.id, ...d.data() }))
        .filter(u => u.uid !== auth.currentUser.uid);

      setSearchResults(users);
      if (users.length === 0) {
        Alert.alert('No users found', 'Double‐check the exact email.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Search error', 'Could not search right now.');
    }
  };

  // Send friend request: doc ID = `${sender}_${receiver}`
  const sendFriendRequest = async (receiverId) => {
    const senderId = auth.currentUser.uid;
    const frId = `${senderId}_${receiverId}`;
    const frRef = doc(db, 'friendRequests', frId);

    // Already exists?
    const existing = await getDoc(frRef);
    if (existing.exists()) {
      return Alert.alert('Request Exists', 'You already sent a request.');
    }

    try {
      await setDoc(frRef, {
        id:       frId,       // include the doc ID in the data
        senderId,
        receiverId,
        status:   'pending',
        createdAt: new Date().toISOString(),
      });
      Alert.alert('Request Sent', 'Please wait for approval.');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not send the request.');
    }
  };

  return (
    <SafeAreaView className="bg-gray-900 flex-1 p-4">
      <TouchableOpacity
        onPress={() => router.push('/friend')}
        className="bg-blue-600 p-3 rounded-lg mb-4"
      >
        <Text className="text-white font-semibold text-center">
          Go to Friends
        </Text>
      </TouchableOpacity>

      <View className="flex-row items-center justify-between mt-4">
        <TextInput
          placeholder="Search by exact email…"
          placeholderTextColor="#888"
          autoCapitalize="none"
          keyboardType="email-address"
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="flex-1 p-3 bg-white text-black rounded-lg mr-2"
        />
        <TouchableOpacity
          onPress={searchUsers}
          className="p-3 bg-blue-600 rounded-lg"
        >
          <Text className="text-white font-semibold">Search</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={searchResults}
        keyExtractor={item => item.uid}
        renderItem={({ item }) => (
          <View className="bg-gray-700 p-4 rounded-xl my-3 flex-row items-center justify-between">
            <Text className="text-white text-lg font-semibold">
              {item.email}
            </Text>
            <TouchableOpacity
              onPress={() => sendFriendRequest(item.uid)}
              className="bg-blue-600 p-2 rounded-lg"
            >
              <Text className="text-white">Send Request</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-white text-center mt-4">No users found</Text>
        }
        className="mt-4"
      />

      <View className="absolute bottom-0 left-0 right-0 m-4">
        <TabBar />
      </View>
    </SafeAreaView>
  );
};

export default Connect;
