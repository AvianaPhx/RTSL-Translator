import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  Image,
  Animated,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SettingsRow from '@/components/SettingsRow';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  deleteUser,
  signOut
} from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';

const AccountDetail = () => {
  const router = useRouter();
  const [userData, setUserData]             = useState(null);
  const [loading, setLoading]               = useState(true);
  const [phone, setPhone]                   = useState('');
  const [username, setUsername]             = useState('');
  const [profileBase64, setProfileBase64]   = useState(null);
  const [newPhone, setNewPhone]             = useState('');
  const [newUsername, setNewUsername]       = useState('');
  const [password, setPassword]             = useState('');
  const [newPassword, setNewPassword]       = useState('');
  const [modalVisible, setModalVisible]     = useState(false);
  const [editField, setEditField]           = useState('');
  const fadeAnim = useState(new Animated.Value(0))[0];

  // Load user profile from Firestore
  const fetchUserData = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) return;
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists()) {
        const d = snap.data();
        setUserData(d);
        setPhone(d.phone || '');
        setUsername(d.username || '');
        setProfileBase64(d.profilePictureBase64 || null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Pick & store Base64 in Firestore
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return Alert.alert('Permission required', 'Please allow photo access.');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1,1],
      quality: 0.7,
    });
    if (result.canceled) return;
    const uri = result.assets[0].uri;

    try {
      // read file as base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      // save to Firestore
      const user = auth.currentUser;
      await updateDoc(doc(db, 'users', user.uid), {
        profilePictureBase64: base64
      });
      setProfileBase64(base64);
    } catch (err) {
      console.error(err);
      Alert.alert('Upload failed', 'Could not store image.');
    }
  };

  // Update phone/username
  const handleUpdateField = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const ref = doc(db, 'users', user.uid);
    try {
      if (editField === 'phone') {
        if (!newPhone.trim()) throw new Error('Phone cannot be empty');
        await updateDoc(ref, { phone: newPhone });
      } else {
        if (!newUsername.trim()) throw new Error('Username cannot be empty');
        await updateDoc(ref, { username: newUsername });
      }
      Alert.alert('Success', `${editField} updated`);
      closeModal();
      fetchUserData();
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  // Change password
  const handleChangePassword = async () => {
    if (!password || !newPassword) {
      return Alert.alert('Error','Enter current & new passwords');
    }
    try {
      const user = auth.currentUser;
      const cred = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, newPassword);
      Alert.alert('Success','Password updated');
      closeModal();
      setPassword(''); setNewPassword('');
    } catch (e) {
      console.error(e);
      Alert.alert(
        'Error',
        e.code==='auth/wrong-password'
          ? 'Current password incorrect'
          : 'Failed to update password'
      );
    }
  };

  // Delete account
  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will remove all your data. Continue?',
      [
        { text:'Cancel', style:'cancel' },
        {
          text:'Delete', style:'destructive', onPress: async () => {
            try {
              const user = auth.currentUser;
              await deleteDoc(doc(db,'users',user.uid));
              await deleteUser(user);
              await signOut(auth);
              router.replace('/sign-in');
            } catch (e) {
              console.error(e);
              Alert.alert('Error','Failed to delete account');
            }
          }
        }
      ]
    );
  };

  // Modal controls
  const openModal = field => {
    setEditField(field);
    if (field==='phone') setNewPhone(phone);
    if (field==='username') setNewUsername(username);
    if (field==='password'){
      setPassword(''); setNewPassword('');
    }
    setModalVisible(true);
    Animated.timing(fadeAnim,{toValue:1,duration:300,useNativeDriver:true}).start();
  };
  const closeModal = () => {
    Animated.timing(fadeAnim,{toValue:0,duration:300,useNativeDriver:true})
      .start(()=>setModalVisible(false));
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900 justify-center items-center">
        <Text className="text-white">Loading...</Text>
      </SafeAreaView>
    );
  }

  // initial letter fallback
  const initial = username?.charAt(0).toUpperCase() || '?';

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <ScrollView contentContainerStyle={{padding:20}} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <TouchableOpacity onPress={pickImage} className="self-center mb-6">
          {profileBase64 ? (
            <Image
              source={{ uri:`data:image/jpeg;base64,${profileBase64}` }}
              style={{ width:100, height:100, borderRadius:50 }}
            />
          ) : (
            <View style={{
              width:100, height:100, borderRadius:50,
              backgroundColor:'#555', justifyContent:'center',alignItems:'center'
            }}>
              <Text className="text-white text-4xl">{initial}</Text>
            </View>
          )}
          <View style={{
            position:'absolute', bottom:0, right:0,
            backgroundColor:'#0008', padding:6, borderRadius:20
          }}>
            <Ionicons name="camera" size={20} color="#fff"/>
          </View>
        </TouchableOpacity>

        {/* Name & Email */}
        <Text className="text-white text-2xl font-semibold text-center mb-2">{username}</Text>
        <Text className="text-gray-400 text-center mb-8">{auth.currentUser.email}</Text>

        {/* Account Info */}
        <Text className="text-gray-400 font-semibold mb-2">Account Information</Text>
        <View className="bg-gray-800 rounded-lg p-4 mb-6 space-y-2">
          <SettingsRow label="Username" value={username} onPress={()=>openModal('username')} />
          <SettingsRow label="Email" value={auth.currentUser.email}/>
          <SettingsRow label="Phone" value={phone||'Not set'} onPress={()=>openModal('phone')}/>
          <SettingsRow label="Password" value="••••••••" onPress={()=>openModal('password')}/>
        </View>

        {/* Account Management */}
        <Text className="text-gray-400 font-semibold mb-2">Account Management</Text>
        <View className="bg-gray-800 rounded-lg p-4">
          <SettingsRow label="Delete Account" isDestructive onPress={handleDeleteAccount}/>
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal visible={modalVisible} transparent animationType="none" onRequestClose={closeModal}>
        <Animated.View style={{
          flex:1, backgroundColor:'rgba(0,0,0,0.5)',
          justifyContent:'center', alignItems:'center', opacity:fadeAnim
        }}>
          <View className="w-80 bg-gray-700 p-5 rounded-lg">
            <Text className="text-white text-xl font-bold mb-4">
              {editField==='phone' ? 'Change Phone'
                : editField==='username' ? 'Change Username'
                : 'Change Password'}
            </Text>

            {editField==='phone' && (
              <TextInput
                value={newPhone}
                onChangeText={setNewPhone}
                placeholder="New phone"
                keyboardType="phone-pad"
                className="bg-gray-600 text-white p-2 rounded mb-4"
              />
            )}
            {editField==='username' && (
              <TextInput
                value={newUsername}
                onChangeText={setNewUsername}
                placeholder="New username"
                className="bg-gray-600 text-white p-2 rounded mb-4"
              />
            )}
            {editField==='password' && (
              <>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Current password"
                  secureTextEntry
                  className="bg-gray-600 text-white p-2 rounded mb-4"
                />
                <TextInput
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="New password"
                  secureTextEntry
                  className="bg-gray-600 text-white p-2 rounded mb-4"
                />
              </>
            )}

            <TouchableOpacity
              onPress={
                editField==='phone' || editField==='username'
                  ? handleUpdateField
                  : handleChangePassword
              }
              className="bg-blue-500 py-2 rounded-lg"
            >
              <Text className="text-white text-center">Save Changes</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={closeModal} className="bg-red-500 py-2 rounded-lg mt-3">
              <Text className="text-white text-center">Cancel</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
};

export default AccountDetail;
