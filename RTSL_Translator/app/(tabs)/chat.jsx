// app/screens/Chat.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { auth, db } from '@/config/firebase';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { FontAwesome } from '@expo/vector-icons';

const Chat = () => {
  const { chatId, friendName } = useLocalSearchParams();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const me = auth.currentUser.uid;
  const flatListRef = useRef(null);

  useEffect(() => {
    if (!chatId) return;
    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('createdAt', 'asc')
    );
    const unsub = onSnapshot(q, snap => {
      const msgs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setMessages(msgs);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    });

    // mark as read
    updateDoc(doc(db, 'chats', chatId), {
      [`lastRead.${me}`]: serverTimestamp(),
    });

    return unsub;
  }, [chatId]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    await addDoc(collection(db, 'chats', chatId, 'messages'), {
      senderId: me,
      text: text.trim(),
      createdAt: serverTimestamp(),
    });
    setText('');
  };

  const renderItem = ({ item }) => {
    const sentByMe = item.senderId === me;
    const time = item.createdAt
      ?.toDate()
      .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return (
      <View
        className={`mb-2 flex-row ${
          sentByMe ? 'justify-end' : 'justify-start'
        }`}
      >
        <View
          className={`max-w-3/4 p-3 rounded-xl ${
            sentByMe ? 'bg-purple-600' : 'bg-gray-700'
          }`}
        >
          <Text className="text-white">{item.text}</Text>
          {time && (
            <Text className="text-gray-300 text-xs mt-1 text-right">
              {time}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="bg-gray-900 flex-1">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-gray-800">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <FontAwesome name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: '/user-profile',
              params: {
                chatId,
                friendName,
              },
            })
          }
        >
          <Text className="text-white text-lg font-semibold">{friendName}</Text>
        </TouchableOpacity>
        <View style={{ width: 32 }} />
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 12 }}
      />

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="bg-gray-900 px-4 py-3"
      >
        <View className="flex-row items-center bg-gray-800 rounded-full px-4 py-2">
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type a message..."
            placeholderTextColor="#888"
            className="flex-1 text-white"
          />
          <TouchableOpacity
            onPress={sendMessage}
            disabled={!text.trim()}
            className={`${text.trim() ? 'opacity-100' : 'opacity-50'}`}
          >
            <FontAwesome name="send" size={24} color="#5C3AED" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chat;
