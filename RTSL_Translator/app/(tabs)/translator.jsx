// app/screens/Translator.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '@/config/firebase';
import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore';
import { useRouter } from 'expo-router';
import TabBar from '@/components/TabBar';

const Translator = () => {
  const [friendsList, setFriendsList] = useState([]);
  const [previews, setPreviews] = useState({});
  const [lastReads, setLastReads] = useState({});
  const uid = auth.currentUser?.uid;
  const router = useRouter();

  // Load friends
  useEffect(() => {
    if (!uid) return;
    (async () => {
      const frSnap = await getDoc(doc(db, 'friends', uid));
      const friendIds = frSnap.exists() ? frSnap.data().friends : [];
      const friends = await Promise.all(
        friendIds.map(async fid => {
          const uSnap = await getDoc(doc(db, 'users', fid));
          return {
            uid: fid,
            ...(uSnap.exists()
              ? uSnap.data()
              : { username: 'Unknown', profilePictureBase64: null }),
          };
        })
      );
      setFriendsList(friends);
    })();
  }, [uid]);

  // Real-time preview & lastRead
  useEffect(() => {
    if (!uid || friendsList.length === 0) return;
    const unsubscribers = friendsList.map(friend => {
      const ids = [uid, friend.uid].sort();
      const chatId = `${ids[0]}_${ids[1]}`;

      // latest message listener
      const qMsg = query(
        collection(db, 'chats', chatId, 'messages'),
        orderBy('createdAt', 'desc'),
        limit(1)
      );
      const unsubMsg = onSnapshot(qMsg, snap => {
        if (!snap.empty) {
          const msg = snap.docs[0].data();
          setPreviews(prev => ({ ...prev, [friend.uid]: msg }));
        }
      });

      // lastRead listener
      const unsubMeta = onSnapshot(doc(db, 'chats', chatId), metaSnap => {
        const meta = metaSnap.exists() ? metaSnap.data().lastRead || {} : {};
        setLastReads(prev => ({ ...prev, [friend.uid]: meta[uid] || null }));
      });

      return () => {
        unsubMsg();
        unsubMeta();
      };
    });
    return () => unsubscribers.forEach(fn => fn());
  }, [friendsList, uid]);

  const renderAvatar = user =>
    user.profilePictureBase64 ? (
      <Image
        source={{ uri: `data:image/jpeg;base64,${user.profilePictureBase64}` }}
        className="w-12 h-12 rounded-full mr-3"
      />
    ) : (
      <View className="w-12 h-12 rounded-full bg-gray-600 justify-center items-center mr-3">
        <Text className="text-white font-bold">
          {user.username?.[0]?.toUpperCase() || '?'}
        </Text>
      </View>
    );

  const openChat = friend => {
    const ids = [uid, friend.uid].sort();
    const chatId = `${ids[0]}_${ids[1]}`;
    const encodedName = encodeURIComponent(friend.username);

    // clear the new-message highlight by updating local lastReads
    const preview = previews[friend.uid];
    if (preview && preview.senderId !== uid) {
      setLastReads(prev => ({
        ...prev,
        [friend.uid]: preview.createdAt
      }));
    }

    router.push(
      `chat?chatId=${chatId}&friendUid=${friend.uid}&friendName=${encodedName}`
    );
  };

  return (
    <SafeAreaView className="bg-gray-900 flex-1">
      <Text className="text-white text-2xl font-semibold text-center my-4">
        Messages
      </Text>

      <FlatList
        data={friendsList}
        keyExtractor={item => item.uid}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
        renderItem={({ item }) => {
          const p = previews[item.uid] || {};
          const lastRead = lastReads[item.uid];
          const isFromOther = p.senderId && p.senderId !== uid;
          const unread =
            isFromOther &&
            ( !lastRead || p.createdAt?.toMillis() > lastRead.toMillis() );

          return (
            <TouchableOpacity
              onPress={() => openChat(item)}
              className={`flex-row items-center p-4 mb-3 mx-4 rounded-lg ${
                unread ? 'bg-purple-700' : 'bg-gray-800'
              }`}
            >
              {renderAvatar(item)}
              <View className="flex-1">
                <Text className="text-white text-lg font-medium">
                  {item.username}
                </Text>
                {unread ? (
                  <Text className="text-white text-sm font-semibold">
                    New message
                  </Text>
                ) : p.text ? (
                  <Text className="text-gray-300 text-sm truncate">
                    {p.text}
                  </Text>
                ) : null}
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text className="text-gray-400 text-center mt-8">
            No friends to show.
          </Text>
        }
      />

      <View className="absolute bottom-0 left-0 right-0 m-4">
        <TabBar />
      </View>
    </SafeAreaView>
  );
};

export default Translator;
