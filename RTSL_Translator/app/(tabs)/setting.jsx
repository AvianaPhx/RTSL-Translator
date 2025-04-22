import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import TabButton from '@/components/TabButton';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '@/config/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

const Setting = () => {
  const routes = {
    accountDetail: '/account-detail',
    test: '/home',
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // fetch user profile
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) setUserData(snap.data());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const initial = userData?.username?.[0]?.toUpperCase() || '?';

  const navigateTo = (path) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push(path);
    }, 300);
  };

  const chatWithAdmin = async () => {
    const uid = auth.currentUser.uid;
    const roomRef = doc(db, 'adminRooms', uid);
    const snap = await getDoc(roomRef);
    if (!snap.exists()) {
      await setDoc(roomRef, {
        userId: uid,
        createdAt: serverTimestamp(),
      });
    }
    // now redirect to user-help
    router.push('/user-help');
  };

  const confirmLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await signOut(auth);
          router.replace('/sign-in');
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <View className="flex-row justify-between items-center mx-5 my-4">
        <View>
          <Text className="font-bold text-5xl text-purple-400">
            {userData?.username || 'User'}
          </Text>
          <Text className="text-white text-2xl mt-1">
            {auth.currentUser?.email}
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigateTo(routes.accountDetail)}>
          {userData?.profilePictureBase64 ? (
            <Image
              source={{ uri: `data:image/jpeg;base64,${userData.profilePictureBase64}` }}
              className="w-20 h-20 rounded-full"
            />
          ) : (
            <View className="w-20 h-20 rounded-full bg-gray-700 justify-center items-center">
              <Text className="text-white text-2xl font-bold">{initial}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-5 items-center">
          <View className="w-full max-w-lg">
            <Text className="text-gray-400 font-semibold mb-2 text-lg">
              Account Settings
            </Text>
            <TabButton
              title="Account Details"
              handlePress={() => navigateTo(routes.accountDetail)}
              containerStyles="flex-row justify-between mb-4"
              textStyles="text-lg text-white"
              isLoading={isSubmitting}
              icon={<FontAwesome name="chevron-right" size={20} color="gray" />}
            />
            <TabButton
              title="Edit Profile"
              handlePress={() => navigateTo(routes.accountDetail)}
              containerStyles="flex-row justify-between mb-4"
              textStyles="text-lg text-white"
              isLoading={isSubmitting}
              icon={<FontAwesome name="chevron-right" size={20} color="gray" />}
            />

            <Text className="text-gray-400 font-semibold mb-3 text-lg">
              More info and support
            </Text>
            <TabButton
              title="Chat with Admin"
              handlePress={chatWithAdmin}
              containerStyles="flex-row justify-between mb-4"
              textStyles="text-lg text-white"
              isLoading={false}
              icon={<FontAwesome name="chevron-right" size={20} color="gray" />}
            />
            <TabButton
              title="Terms & Services"
              handlePress={() => navigateTo(routes.test)}
              containerStyles="flex-row justify-between mb-4"
              textStyles="text-lg text-white"
              isLoading={isSubmitting}
              icon={<FontAwesome name="chevron-right" size={20} color="gray" />}
            />
            <TabButton
              title="User Guide"
              handlePress={() => navigateTo(routes.test)}
              containerStyles="flex-row justify-between mb-4"
              textStyles="text-lg text-white"
              isLoading={isSubmitting}
              icon={<FontAwesome name="chevron-right" size={20} color="gray" />}
            />

            <Text className="text-gray-400 font-semibold mb-3 text-lg">Login</Text>
            <TabButton
              title="Logout"
              handlePress={confirmLogout}
              containerStyles="w-full items-center mb-6"
              textStyles="text-red-500 text-xl font-bold"
              isLoading={isSubmitting}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Setting;
