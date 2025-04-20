import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, FlatList, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '@/config/firebase';
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore'; // Firestore methods
import TabBar from '@/components/TabBar';
import { useRouter } from 'expo-router';

const Connect = () => {
  const [searchQuery, setSearchQuery] = useState(''); // Search query for users
  const [searchResults, setSearchResults] = useState([]); // Store the search results
  const router = useRouter(); // For navigation

  // Search for users in Firestore  
  const searchUsers = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]); // Clear results if no query
      return;
    }

    // Normalize the search query
    const normalizedQuery = searchQuery.toLowerCase().replace(/\s+/g, ''); // Convert to lowercase and remove spaces

    // Query Firestore for users whose username starts with the search query (ignoring case and spaces)
    const usersRef = collection(db, 'users');
    const q = query(usersRef);

    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs
      .map(doc => doc.data())
      .filter(user => 
        user.username.toLowerCase().includes(normalizedQuery) && 
        user.uid !== auth.currentUser.uid // Exclude the current user
      ); // Filter users based on normalized search query and exclude the current user

    setSearchResults(users); // Set the search results
  };

  // Send Friend Request
  const sendFriendRequest = async (receiverId) => {
    const senderId = auth.currentUser.uid;

    // Check if receiverId is valid
    if (!receiverId) {
      Alert.alert("Error", "Invalid user selected. Please try again.");
      return;
    }

    // Check if a friend request already exists between these two users
    const friendRequestRef = doc(db, 'friendRequests', `${senderId}_${receiverId}`);
    const friendRequestSnap = await getDoc(friendRequestRef);

    if (!friendRequestSnap.exists()) {
      const requestData = {
        senderId,
        receiverId,
        status: 'pending', // Set initial status as pending
      };

      try {
        // Store the friend request in the Firestore database
        await setDoc(friendRequestRef, requestData); 

        // Show the alert after successfully sending the request
        Alert.alert("Request Sent", "You have sent a friend request. Please wait for the other user to approve.");
      } catch (error) {
        console.error("Error sending friend request:", error);
        Alert.alert("Error", "There was an issue sending your friend request.");
      }
    } else {
      Alert.alert("Request Exists", "A friend request already exists between these users.");
    }
  };

  // Navigate to Friends page
  const navigateToFriends = () => {
    router.push('friend'); // Navigate to the friends screen
  };

  return (
    <SafeAreaView className="bg-gray-900 flex-1 p-4">

      {/* Friends Button */}
      <TouchableOpacity onPress={navigateToFriends} className="bg-blue-600 p-3 rounded-lg mb-4">
        <Text className="text-white font-semibold text-center">Go to Friends</Text>
      </TouchableOpacity>

      {/* Search Section */}
      <View className="flex-row items-center justify-between mt-4">
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery} // Update search query on each keystroke
          placeholder="Search for users..."
          className="flex-1 p-3 bg-white text-black rounded-lg mr-2"
        />
        <TouchableOpacity 
          onPress={searchUsers} // Search triggered by clicking the button
          className="p-3 bg-blue-600 rounded-lg"
        >
          <Text className="text-white font-semibold">Search</Text>
        </TouchableOpacity>
      </View>

      {/* Search Results */}
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.uid || item.username} // Fallback to username if uid is missing
        renderItem={({ item }) => (
          <View className="bg-gray-700 p-4 rounded-xl my-3 flex-row items-center justify-between">
            <Text className="text-white text-lg font-semibold">{item.username}</Text>

            {/* Send Friend Request Button */}
            <TouchableOpacity
              onPress={() => sendFriendRequest(item.uid)} // Send friend request to the selected user
              className="bg-blue-600 p-2 rounded-lg mt-2"
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

      {/* Tab Bar */}
      <View className="bottom-0 left-0 right-0">
        <TabBar />
      </View>
    </SafeAreaView>
  );
};

export default Connect;
