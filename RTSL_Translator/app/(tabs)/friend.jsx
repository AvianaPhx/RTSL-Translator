import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { auth, db } from '../../firebaseConfig';
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  updateDoc,
  doc,
  setDoc,
  arrayUnion
} from 'firebase/firestore';

const Friend = () => {
  const user = auth.currentUser;
  const uid = user?.uid;
  const router = useRouter();

  const [pendingRequests, setPendingRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [friendsList, setFriendsList] = useState([]);

  useEffect(() => {
    if (!uid) return;
    (async () => {
      try {
        // 1) Sent pending
        const sentSnap = await getDocs(
          query(
            collection(db, 'friendRequests'),
            where('senderId', '==', uid),
            where('status', '==', 'pending')
          )
        );
        const sent = await Promise.all(
          sentSnap.docs.map(async d => {
            const { receiverId, id } = d.data();
            const uSnap = await getDoc(doc(db, 'users', receiverId));
            const uData = uSnap.exists() ? uSnap.data() : {};
            return { id, user: uData };
          })
        );
        setPendingRequests(sent);

        // 2) Received pending
        const recSnap = await getDocs(
          query(
            collection(db, 'friendRequests'),
            where('receiverId', '==', uid),
            where('status', '==', 'pending')
          )
        );
        const received = await Promise.all(
          recSnap.docs.map(async d => {
            const { senderId, id } = d.data();
            const uSnap = await getDoc(doc(db, 'users', senderId));
            const uData = uSnap.exists() ? uSnap.data() : {};
            return { id, senderId, user: uData };
          })
        );
        setReceivedRequests(received);

        // 3) Friends list
        const frSnap = await getDoc(doc(db, 'friends', uid));
        const friendIds = frSnap.exists() ? frSnap.data().friends : [];
        const friends = await Promise.all(
          friendIds.map(async fid => {
            const uSnap = await getDoc(doc(db, 'users', fid));
            const uData = uSnap.exists() ? uSnap.data() : {};
            return { id: fid, user: uData };
          })
        );
        setFriendsList(friends);
      } catch (error) {
        console.error('Error loading friends data', error);
      }
    })();
  }, [uid]);

  const acceptRequest = async ({ id, senderId }) => {
    try {
      await updateDoc(doc(db, 'friendRequests', id), { status: 'approved' });
      await setDoc(doc(db, 'friends', uid), { friends: arrayUnion(senderId) }, { merge: true });
      await setDoc(doc(db, 'friends', senderId), { friends: arrayUnion(uid) }, { merge: true });
      Alert.alert('Accepted', 'You are now friends!');
      setReceivedRequests(r => r.filter(req => req.id !== id));
      const uSnap = await getDoc(doc(db, 'users', senderId));
      if (uSnap.exists()) setFriendsList(f => [...f, { id: senderId, user: uSnap.data() }]);
    } catch (error) {
      console.error('Error accepting request', error);
    }
  };

  const declineRequest = async (id) => {
    try {
      await updateDoc(doc(db, 'friendRequests', id), { status: 'rejected' });
      Alert.alert('Declined', 'Friend request rejected.');
      setReceivedRequests(r => r.filter(req => req.id !== id));
    } catch (error) {
      console.error('Error rejecting request', error);
    }
  };

  const initial = username => username?.charAt(0).toUpperCase() || '?';

  const renderAvatar = (userObj) => {
    if (userObj?.profilePictureBase64) {
      return (
        <Image
          source={{ uri: `data:image/jpeg;base64,${userObj.profilePictureBase64}` }}
          className="w-12 h-12 rounded-full mr-3"
        />
      );
    }
    return (
      <View className="w-12 h-12 rounded-full bg-gray-600 justify-center items-center mr-3">
        <Text className="text-white text-lg font-bold">
          {initial(userObj?.username)}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900 p-4">
      <Text className="text-white text-2xl font-semibold text-center mb-4">
        Friends
      </Text>

      {/* Pending Requests */}
      <Text className="text-white text-lg font-medium mb-2">
        Pending Requests Sent
      </Text>
      <FlatList
        data={pendingRequests}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View className="flex-row items-center bg-gray-800 p-3 rounded-lg my-2">
            {renderAvatar(item.user)}
            <Text className="text-white flex-1">{item.user.username}</Text>
            <FontAwesome name="clock-o" size={20} color="yellow" />
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-gray-400 text-center my-2">
            No pending requests.
          </Text>
        }
      />

      {/* Incoming Requests */}
      <Text className="text-white text-lg font-medium mt-6 mb-2">
        Incoming Requests
      </Text>
      <FlatList
        data={receivedRequests}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View className="flex-row items-center bg-gray-800 p-3 rounded-lg my-2">
            {renderAvatar(item.user)}
            <Text className="text-white flex-1">{item.user.username}</Text>
            <TouchableOpacity
              onPress={() => acceptRequest(item)}
              className="bg-green-600 p-2 rounded-lg mr-2"
            >
              <Text className="text-white">Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => declineRequest(item.id)}
              className="bg-red-600 p-2 rounded-lg"
            >
              <Text className="text-white">Decline</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-gray-400 text-center my-2">
            No incoming requests.
          </Text>
        }
      />

      {/* Friends List */}
      <Text className="text-white text-lg font-medium mt-6 mb-2">
        Your Friends
      </Text>
      <FlatList
        data={friendsList}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/chat',
                params: {
                  chatId: [uid, item.id].sort().join('_'),
                  friendName: item.user.username,
                },
              })
            }
            className="flex-row items-center bg-gray-800 p-3 rounded-lg my-2"
          >
            {renderAvatar(item.user)}
            <Text className="text-white">{item.user.username}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text className="text-gray-400 text-center my-2">
            No friends yet.
          </Text>
        }
      />
    </SafeAreaView>
  );
};

export default Friend;
