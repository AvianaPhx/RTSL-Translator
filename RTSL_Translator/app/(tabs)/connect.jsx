import React, { useState, useEffect } from 'react';
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
  orderBy,
  startAt,
  endAt,
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
  const [friends, setFriends] = useState([]);
  const router = useRouter();

  // grab current user's email
  const userEmail = auth.currentUser?.email || '';

  // Load current user's friends list
  useEffect(() => {
    const loadFriends = async () => {
      try {
        const uid = auth.currentUser.uid;
        const ref = doc(db, 'friends', uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const arr = snap.data().friends || [];
          setFriends(arr);
        }
      } catch (err) {
        console.error('Failed to load friends', err);
      }
    };
    loadFriends();
  }, []);

  const searchUsers = async (email) => {
    if (!email) {
      setSearchResults([]);
      return;
    }
    try {
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        orderBy('email_lowercase'),
        startAt(email),
        endAt(email + '\uf8ff')
      );
      const snap = await getDocs(q);
      const users = snap.docs
        .map(d => ({ uid: d.id, ...d.data() }))
        .filter(u => u.uid !== auth.currentUser.uid);

      setSearchResults(users);
    } catch (err) {
      console.error(err);
      Alert.alert('Search error', 'Could not perform search right now.');
    }
  };

  useEffect(() => {
    const email = searchQuery.trim().toLowerCase();
    const timer = setTimeout(() => {
      searchUsers(email);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Send friend request
  const sendFriendRequest = async (receiverId) => {
    const senderId = auth.currentUser.uid;
    const frId = `${senderId}_${receiverId}`;
    const frRef = doc(db, 'friendRequests', frId);

    const existing = await getDoc(frRef);
    if (existing.exists()) {
      return Alert.alert('Request Exists', 'You already sent a request.');
    }

    try {
      await setDoc(frRef, {
        id: frId,
        senderId,
        receiverId,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
      Alert.alert('Request Sent', 'Please wait for approval.');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not send the request.');
    }
  };

  const renderItem = ({ item }) => {
    const isFriend = friends.includes(item.uid);
    return (
      <View className="bg-gray-700 p-4 rounded-xl my-3 flex-row items-center justify-between">
        <Text className="text-white text-lg font-semibold">{item.email}</Text>
        {isFriend ? (
          <Text className="text-green-400 font-medium">Already Friends</Text>
        ) : (
          <TouchableOpacity
            onPress={() => sendFriendRequest(item.uid)}
            className="bg-blue-600 p-2 rounded-lg"
          >
            <Text className="text-white">Send Request</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView className="bg-gray-900 flex-1 p-4">
      {/* show current user's email */}
      <Text className="font-bold text-4xl text-purple-400 text-center mb-4">
        {userEmail}
      </Text>

      <TouchableOpacity
        onPress={() => router.push('/friend')}
        className="bg-blue-600 p-3 rounded-lg mb-4"
      >
        <Text className="text-white font-semibold text-center">
          Go to Friends
        </Text>
      </TouchableOpacity>

      <View className="flex-row items-center justify-between mt-4 mb-4">
        <TextInput
          placeholder="Search by email…"
          placeholderTextColor="#888"
          autoCapitalize="none"
          keyboardType="email-address"
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="flex-1 p-3 bg-white text-black rounded-lg"
        />
      </View>

      <FlatList
        data={searchResults}
        keyExtractor={item => item.uid}
        renderItem={renderItem}
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
