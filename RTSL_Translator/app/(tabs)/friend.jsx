import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db, auth } from '@/config/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore'; // Firestore methods
import { FontAwesome } from '@expo/vector-icons'; // For the icon

const Friend = () => {
  const [pendingRequests, setPendingRequests] = useState([]); // Store pending requests (sent by the logged-in user)
  const [receivedRequests, setReceivedRequests] = useState([]); // Store incoming requests (received by the logged-in user)
  const [friendsList, setFriendsList] = useState([]); // Store friends list for the logged-in user

  useEffect(() => {
    const fetchRequests = async () => {
      const user = auth.currentUser;
      if (user) {
        // Fetch pending requests for the current user (sent by them)
        const sentRequestsRef = collection(db, 'friendRequests');
        const sentRequestsQuery = query(sentRequestsRef, where('senderId', '==', user.uid), where('status', '==', 'pending'));
        const sentRequestsSnapshot = await getDocs(sentRequestsQuery);
        const sentRequests = sentRequestsSnapshot.docs.map(doc => doc.data());
        setPendingRequests(sentRequests);

        // Fetch incoming friend requests (received by the logged-in user)
        const receivedRequestsRef = collection(db, 'friendRequests');
        const receivedRequestsQuery = query(receivedRequestsRef, where('receiverId', '==', user.uid), where('status', '==', 'pending'));
        const receivedRequestsSnapshot = await getDocs(receivedRequestsQuery);
        const receivedRequests = receivedRequestsSnapshot.docs.map(doc => doc.data());
        setReceivedRequests(receivedRequests);

        // Fetch the list of friends (approved friends for the logged-in user)
        const friendsRef = doc(db, 'friends', user.uid);
        const friendsSnapshot = await getDoc(friendsRef);
        if (friendsSnapshot.exists()) {
          setFriendsList(friendsSnapshot.data().friends || []);
        }
      }
    };

    fetchRequests();
  }, []);

  // Accept a friend request
  const acceptRequest = async (friendRequestId, senderId) => {
    // Update the friend request status to 'approved'
    const friendRequestRef = doc(db, 'friendRequests', friendRequestId);
    await updateDoc(friendRequestRef, { status: 'approved' });

    // Add the sender to the logged-in user's friends list
    const user = auth.currentUser;
    const friendsRef = doc(db, 'friends', user.uid);
    await updateDoc(friendsRef, {
      friends: [...friendsList, senderId]
    });

    // Add the logged-in user to the sender's friends list
    const senderFriendsRef = doc(db, 'friends', senderId);
    await updateDoc(senderFriendsRef, {
      friends: [...friendsList, user.uid]
    });

    Alert.alert("Friend Request Accepted", "You are now friends!");

    // Refresh the requests and friends lists
    setReceivedRequests(receivedRequests.filter(request => request.senderId !== senderId));
  };

  // Decline a friend request
  const declineRequest = async (friendRequestId) => {
    const friendRequestRef = doc(db, 'friendRequests', friendRequestId);
    await updateDoc(friendRequestRef, { status: 'rejected' });

    Alert.alert("Friend Request Rejected", "You have rejected the friend request.");

    // Refresh the received requests list
    setReceivedRequests(receivedRequests.filter(request => request.id !== friendRequestId));
  };

  return (
    <SafeAreaView className="bg-gray-900 flex-1 p-4">
      <Text className="text-white text-3xl font-semibold text-center mt-8 mb-4">
        Friends
      </Text>

      {/* Pending Requests Section */}
      <View>
        <Text className="text-white text-2xl font-semibold">Pending Requests (Sent)</Text>
        <FlatList
          data={pendingRequests}
          keyExtractor={(item) => item.receiverId}  // Use receiverId as the key
          renderItem={({ item }) => (
            <View className="bg-gray-700 p-4 rounded-xl my-3">
              <Text className="text-white">{item.receiverId}</Text>
              <FontAwesome name="clock" size={20} color="yellow" />
            </View>
          )}
          ListEmptyComponent={<Text className="text-white text-center mt-4">No Pending Requests</Text>}
        />
      </View>

      {/* Friend Requests Section */}
      <View className="mt-6">
        <Text className="text-white text-2xl font-semibold">Friend Requests (Received)</Text>
        <FlatList
          data={receivedRequests}
          keyExtractor={(item) => item.senderId}  // Use senderId as the key
          renderItem={({ item }) => (
            <View className="bg-gray-700 p-4 rounded-xl my-3 flex-row justify-between items-center">
              <Text className="text-white">{item.senderId}</Text>
              <View className="flex-row">
                <TouchableOpacity
                  onPress={() => acceptRequest(item.id, item.senderId)}
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
            </View>
          )}
          ListEmptyComponent={<Text className="text-white text-center mt-4">No Friend Requests</Text>}
        />
      </View>

      {/* Friends Section */}
      <View className="mt-6">
        <Text className="text-white text-2xl font-semibold">Friends</Text>
        <FlatList
          data={friendsList}
          keyExtractor={(item) => item}  // Use item as the key (assuming item is the user's uid)
          renderItem={({ item }) => (
            <View className="bg-gray-700 p-4 rounded-xl my-3">
              <Text className="text-white">{item}</Text>
            </View>
          )}
          ListEmptyComponent={<Text className="text-white text-center mt-4">No Friends</Text>}
        />
      </View>

    </SafeAreaView>
  );
};

export default Friend;
