import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '@/config/firebase';
import { useRouter } from 'expo-router';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Role filter: 'all', 'member', 'admin'
  const [filterRole, setFilterRole] = useState('all');
  // Search by email
  const [searchQuery, setSearchQuery] = useState('');

  // Create modal
  const [modalVisible, setModalVisible] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'member' });
  // Edit form
  const [editingUid, setEditingUid] = useState(null);
  const [editForm, setEditForm] = useState({ username: '', email: '', role: 'member' });

  const router = useRouter();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'users'));
      setUsers(snap.docs.map(d => ({ uid: d.id, ...d.data() })));
    } catch {
      Alert.alert('Error', 'Unable to load users.');
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  // Create a new user
  const handleCreate = async () => {
    const { username, email, password, role } = newUser;
    if (!username || !email || !password) {
      return Alert.alert('Validation', 'All fields are required.');
    }
    setSaving(true);
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password
      );
      await setDoc(doc(db, 'users', user.uid), {
        username,
        email: user.email,
        role,
        createdAt: serverTimestamp(),
      });
      setNewUser({ username: '', email: '', password: '', role: 'member' });
      setModalVisible(false);
      fetchUsers();
    } catch (e) {
      Alert.alert('Error', e.code.includes('email-already') ? 'Email already in use.' : e.message);
    }
    setSaving(false);
  };

  // Begin editing existing user
  const beginEdit = u => {
    setEditingUid(u.uid);
    setEditForm({ username: u.username, email: u.email, role: u.role });
  };

  // Save edited user
  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', editingUid), editForm);
      setEditingUid(null);
      fetchUsers();
    } catch {
      Alert.alert('Error', 'Unable to save changes.');
    }
    setSaving(false);
  };

  // Delete a user
  const confirmDelete = uid => {
    Alert.alert('Delete', 'Remove this user?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
          await deleteDoc(doc(db, 'users', uid));
          if (editingUid === uid) setEditingUid(null);
          fetchUsers();
        }},
    ]);
  };

  const renderItem = ({ item }) => {
    const isEditing = item.uid === editingUid;
    return (
      <View className="bg-gray-800 p-4 rounded-lg mb-3">
        {isEditing ? (
          <>
            <TextInput
              value={editForm.username}
              onChangeText={t => setEditForm(f => ({ ...f, username: t }))}
              placeholder="Username"
              placeholderTextColor="#666"
              className="bg-gray-700 text-white px-3 py-2 rounded mb-2"
            />
            <TextInput
              value={editForm.email}
              onChangeText={t => setEditForm(f => ({ ...f, email: t }))}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#666"
              className="bg-gray-700 text-white px-3 py-2 rounded mb-2"
            />
            <View className="flex-row mb-2">
              {['member','admin'].map(r => (
                <Pressable
                  key={r}
                  onPress={() => setEditForm(f => ({ ...f, role: r }))}
                  className={`px-3 py-1 rounded mr-2 ${editForm.role===r ? 'bg-purple-500' : 'border border-gray-500'}`}>
                  <Text className={`text-lg ${editForm.role===r ? 'text-white':'text-gray-300'}`}>{r.charAt(0).toUpperCase()+r.slice(1)}</Text>
                </Pressable>
              ))}
            </View>
            <View className="flex-row justify-end space-x-4">
              <Pressable onPress={() => setEditingUid(null)}><Text className="text-gray-400">Cancel</Text></Pressable>
              <Pressable onPress={handleSaveEdit} disabled={saving}><Text className="text-blue-400">{saving ? 'Saving...' : 'Save'}</Text></Pressable>
            </View>
          </>
        ) : (
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-white text-lg font-semibold">{item.username}</Text>
              <Text className="text-gray-300">{item.email}</Text>
              <Text className="text-blue-300 capitalize mt-1">{item.role}</Text>
            </View>
            <View className="flex-row space-x-4">
              <Pressable onPress={() => beginEdit(item)}><Text className="text-green-400">Edit</Text></Pressable>
              <Pressable onPress={() => confirmDelete(item.uid)}><Text className="text-red-400">Delete</Text></Pressable>
            </View>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900 justify-center items-center">
        <ActivityIndicator size="large" color="#888" />
      </SafeAreaView>
    );
  }

  // Apply filters and search
  const filteredUsers = users
    .filter(u => filterRole === 'all' || u.role === filterRole)
    .filter(u => searchQuery.trim() === '' || u.email.toLowerCase().includes(searchQuery.trim().toLowerCase()));

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <KeyboardAvoidingView behavior={Platform.OS==='ios' ? 'padding' : 'height'} className="flex-1">
        {/* Header with filters, search, and create */}
        <View className="p-4 border-b border-gray-700">
          <Text className="text-2xl font-bold text-white mb-2">User Management</Text>
          <View className="flex-row justify-start space-x-2 mb-3">
            {['all','member','admin'].map(r => (
              <TouchableOpacity
                key={r}
                onPress={() => setFilterRole(r)}
                className={`px-3 py-1 rounded ${filterRole===r ? 'bg-blue-600':'border border-gray-600'}`}>
                <Text className="text-white capitalize">{r==='all' ? 'All' : r.charAt(0).toUpperCase()+r.slice(1)}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity className="ml-auto px-3 py-1 bg-blue-600 rounded-md" onPress={() => setModalVisible(true)}>
              <Text className="text-white font-medium">+ Create</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center bg-gray-800 rounded-lg p-2">
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search by email..."
              placeholderTextColor="#888"
              autoCapitalize="none"
              keyboardType="email-address"
              className="flex-1 text-white px-2"
            />
          </View>
        </View>

        {/* Create Modal */}
        <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
          <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
            <View className="bg-gray-800 w-11/12 p-4 rounded-lg">
              <Text className="text-xl font-bold text-white mb-4">New User</Text>
              <TextInput value={newUser.username} onChangeText={t=>setNewUser(f=>({...f,username:t}))} placeholder="Username" placeholderTextColor="#666" className="bg-gray-700 text-white px-3 py-2.rounded mb-3" />
              <TextInput value={newUser.email} onChangeText={t=>setNewUser(f=>({...f,email:t}))} placeholder="Email" keyboardType="email-address" autoCapitalize="none" placeholderTextColor="#666" className="bg-gray-700 text-white px-3 py-2.rounded mb-3" />
              <TextInput value={newUser.password} onChangeText={t=>setNewUser(f=>({...f,password:t}))} placeholder="Password" secureTextEntry placeholderTextColor="#666" className="bg-gray-700 text-white px-3 py-2.rounded mb-3" />
              <View className="flex-row mb-4">
                {['member','admin'].map(r=>(
                  <Pressable key={r} onPress={()=>setNewUser(f=>({...f,role:r}))} className={`px-3 py-1.rounded mr-2 ${newUser.role===r?'bg-purple-500':'border border-gray-500'}`}>
                    <Text className={`text-lg ${newUser.role===r?'text-white':'text-gray-300'}`}>{r.charAt(0).toUpperCase()+r.slice(1)}</Text>
                  </Pressable>
                ))}
              </View>
              <View className="flex-row justify-end space-x-4">
                <Pressable onPress={()=>setModalVisible(false)}><Text className="text-gray-400">Cancel</Text></Pressable>
                <Pressable onPress={handleCreate} disabled={saving}><Text className="text-blue-400">{saving?'Creating...':'Create'}</Text></Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {/* Users List */}
        <FlatList
          data={filteredUsers}
          keyExtractor={u=>u.uid}
          renderItem={renderItem}
          contentContainerStyle={{ padding:16, paddingBottom:100 }}
          ListEmptyComponent={()=>(
            <View className="justify-center items-center mt-20">
              <Text className="text-gray-400 text-lg">No users found.</Text>
            </View>
          )}
        />

        {/* Bottom Navigation */}
        <View className="absolute bottom-0 left-0 right-0 bg-gray-800 flex-row justify-around py-3 border-t border-gray-700">
            <Pressable onPress={() => router.push('/user-management')} className="items-center">
                <Text className="text-white">Users</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/admin-chat')} className="items-center">
                <Text className="text-white">Admin Chat</Text>
            </Pressable>
            <Pressable onPress={() => Alert.alert(
                'Logout',
                'Are you sure you want to logout?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Yes', style: 'destructive', onPress: async () => { await auth.signOut(); router.replace('/sign-in'); } },
                ]
                )} className="items-center">
                <Text className="text-red-400">Logout</Text>
            </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default UserManagement;
