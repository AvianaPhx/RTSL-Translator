import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Modal, ScrollView, Image, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SettingsRow from '@/components/SettingsRow';
import { auth, db } from '@/config/firebase';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';  // Ensure this import

const AccountDetail = () => {
  const avatarUri = '/RTSL_Translator/assets/images/Avatar2.png';

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState(""); 
  const [username, setUsername] = useState(""); 
  const [newPhone, setNewPhone] = useState(""); // New phone number to be updated
  const [newUsername, setNewUsername] = useState(""); // New username to be updated
  const [password, setPassword] = useState(""); // Current password for re-authentication
  const [newPassword, setNewPassword] = useState(""); // New password for change
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility
  const [editField, setEditField] = useState(""); // To track which field is being edited (username, phone, password)

  const fadeAnim = useState(new Animated.Value(0))[0]; // Initial opacity set to 0

  // Function to fetch user data from Firestore
  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserData(userSnap.data());
        setPhone(userSnap.data()?.phone || "");
        setUsername(userSnap.data()?.username || "");
      } else {
        console.log('No user data found!');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Function to update the phone number in Firestore and refresh the data
  const handleUpdatePhone = async () => {
    if (newPhone.trim() === "") {
      Alert.alert("Error", "Phone number cannot be empty");
      return;
    }

    try {
      const user = auth.currentUser;
      if (user && newPhone) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          phone: newPhone
        });

        Alert.alert("Success", "Phone number updated successfully");
        setModalVisible(false); // Close modal
        fetchUserData(); // Refresh the data after update
      } else {
        Alert.alert("Error", "Please enter a valid phone number");
      }
    } catch (error) {
      console.error("Error updating phone number:", error);
      Alert.alert("Error", "Something went wrong while updating your phone number.");
    }
  };

  // Function to update the username in Firestore and refresh the data
  const handleUpdateUsername = async () => {
    if (newUsername.trim() === "") {
      Alert.alert("Error", "Username cannot be empty");
      return;
    }

    try {
      const user = auth.currentUser;
      if (user && newUsername) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          username: newUsername
        });

        Alert.alert("Success", "Username updated successfully");
        setModalVisible(false); // Close modal
        fetchUserData(); // Refresh the data after update
      } else {
        Alert.alert("Error", "Please enter a valid username");
      }
    } catch (error) {
      console.error("Error updating username:", error);
      Alert.alert("Error", "Something went wrong while updating your username.");
    }
  };

  // Function to change the password (requires re-authentication)
  const handleChangePassword = async () => {
    if (password.trim() === "" || newPassword.trim() === "") {
      Alert.alert("Error", "Please enter both the current and new passwords");
      return;
    }

    const user = auth.currentUser;
    if (user && password && newPassword) {
      try {
        // Reauthenticate the user
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);

        // After successful reauthentication, update the password
        await user.updatePassword(newPassword);

        Alert.alert("Success", "Password updated successfully");
        setPassword("");
        setNewPassword("");
        setModalVisible(false);
      } catch (error) {
        console.error("Error changing password:", error);
        Alert.alert("Error", "Incorrect password or failed to update password.");
      }
    }
  };

  // Handle modal visibility and fade effect
  const openModal = (field) => {
    setEditField(field); // Track which field is being edited
    if (field === "phone") {
      setNewPhone(phone); // Pre-fill the input with the current phone number
    } else if (field === "username") {
      setNewUsername(username); // Pre-fill the input with the current username
    } else if (field === "password") {
      setPassword(""); // Reset password fields
      setNewPassword("");
    }
    setModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900 justify-center items-center">
        <Text className="text-white">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <ScrollView className="px-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="items-center justify-center mt-6 mb-8">
          <Image source={{ uri: avatarUri }} className="w-28 h-28 rounded-full border-2 border-gray-400" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5 }} />
          <Text className="text-white text-3xl font-bold mt-4">{userData?.username || 'User'}</Text>
          <Text className="text-gray-400 text-xl">{auth.currentUser?.email || 'user@example.com'}</Text>
        </View>

        <View className="mb-4">
          <Text className="text-gray-400 font-semibold text-lg mb-2">Account Information</Text>
          <View className="bg-gray-800 rounded-lg" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 3 }}>
            <View className="px-4 pb-2">
              <SettingsRow label="UserName" value={userData?.username || '@username'} custom="border-b border-gray-700" onPress={() => openModal("username")} />
              <SettingsRow label="Email" value={auth.currentUser?.email || 'user@example.com'} custom="border-b border-gray-700" onPress={() => {}} />
              <SettingsRow label="Phone" value={userData?.phone || 'Not Provided'} custom="border-b border-gray-700" onPress={() => openModal("phone")} />
              <SettingsRow label="Password" value={"*******"} custom="border-b border-gray-700" onPress={() => openModal("password")} />
            </View>
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-gray-400 font-semibold text-lg mb-2">Account Management</Text>
          <View className="bg-gray-800 rounded-lg" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 3 }}>
            <View className="px-4 pb-2">
              <SettingsRow label="Delete Account" onPress={() => {}} isDestructive />
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal visible={modalVisible} animationType="fade" transparent={true} onRequestClose={closeModal}>
        <Animated.View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(31, 41, 55, 0.9)', opacity: fadeAnim }]}>
          <View className="w-80 bg-gray-600 p-5 rounded-lg">
            <Text className="text-white text-xl font-bold mb-4">{editField === "phone" ? "Change Phone Number" : editField === "username" ? "Change Username" : "Change Password"}</Text>

            {editField === "phone" && (
              <TextInput className="bg-gray-700 text-white p-2 rounded mb-4" placeholder="Enter new phone number" value={newPhone} onChangeText={setNewPhone} keyboardType="phone-pad" />
            )}

            {editField === "username" && (
              <TextInput className="bg-gray-700 text-white p-2 rounded mb-4" placeholder="Enter new username" value={newUsername} onChangeText={setNewUsername} />
            )}

            {editField === "password" && (
              <>
                <TextInput className="bg-gray-700 text-white p-2 rounded mb-4" placeholder="Enter current password" value={password} onChangeText={setPassword} secureTextEntry />
                <TextInput className="bg-gray-700 text-white p-2 rounded mb-4" placeholder="Enter new password" value={newPassword} onChangeText={setNewPassword} secureTextEntry />
              </>
            )}
            
            <TouchableOpacity onPress={editField === "phone" ? handleUpdatePhone : editField === "username" ? handleUpdateUsername : handleChangePassword} className="bg-blue-500 py-2 rounded-lg">
              <Text className="text-white text-center">Save Changes</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={closeModal} className="bg-red-500 py-2 rounded-lg mt-4">
              <Text className="text-white text-center">Cancel</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
};

export default AccountDetail;
