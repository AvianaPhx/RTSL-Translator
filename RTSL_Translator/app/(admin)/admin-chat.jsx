import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { collection, getDocs, doc, getDoc, orderBy } from 'firebase/firestore';
import { db } from '../../firebaseConfig';


const AdminChat = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const roomsSnap = await getDocs(
          collection(db, 'adminRooms')
        );

        const loaded = await Promise.all(
          roomsSnap.docs.map(async (roomDoc) => {
            const data = roomDoc.data();
            const userSnap = await getDoc(doc(db, 'users', data.userId));
            const user = userSnap.exists() ? userSnap.data() : {};
            return {
              id: roomDoc.id,
              userId: data.userId,
              username: user.username,
              email:    user.email,
              createdAt: data.createdAt?.toDate?.() || null,
            };
          })
        );

        loaded.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

        setRooms(loaded);
      } catch (e) {
        console.error('Failed to load admin rooms:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const renderRoom = ({ item }) => (
    <Pressable
      onPress={() => router.push({ pathname: '/admin-chat/[roomId]', params: { roomId: item.id } })}
      className="px-4 py-3 border-b border-gray-700"
    >
      <Text className="text-white text-lg font-semibold">
        {item.username ?? item.email ?? item.userId}
      </Text>
      {item.createdAt && (
        <Text className="text-gray-400 text-sm">
          Started {item.createdAt.toLocaleString()}
        </Text>
      )}
    </Pressable>
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900 justify-center items-center">
        <ActivityIndicator size="large" color="#888" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      {rooms.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-400 text-lg">No chats yet</Text>
        </View>
      ) : (
        <FlatList
          data={rooms}
          keyExtractor={(r) => r.id}
          renderItem={renderRoom}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </SafeAreaView>
  );
};

export default AdminChat;
