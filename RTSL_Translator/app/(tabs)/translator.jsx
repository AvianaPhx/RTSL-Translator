import { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView } from 'react-native';
import { Camera, useCameraPermissions } from 'expo-camera'; // Correct import
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/config/firebase';
import TabBar from '@/components/TabBar';

const Translator = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const cameraRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const router = useRouter();
  
  // Camera permissions handling
  const [cameraPermission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (cameraPermission?.status === 'undetermined') {
      requestPermission(); // Request permission if not yet determined
    } else {
      setHasPermission(cameraPermission?.status === 'granted');
    }
  }, [cameraPermission, requestPermission]);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (inputText.trim()) {
      await addDoc(collection(db, 'messages'), {
        text: inputText,
        timestamp: new Date(),
      });
      setInputText('');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', padding: 16 }}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#6B46C1' }}>&lt; RTSL-Translator</Text>
      </TouchableOpacity>

      <View style={{ marginTop: 16, borderWidth: 1, borderRadius: 8, overflow: 'hidden', height: 250, backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' }}>

        {/* {hasPermission === null ? (
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#6B46C1' }}>Requesting Camera Permission...</Text>
        ) : hasPermission === false ? (
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#6B46C1' }}>Camera permission denied</Text>
        ) : (
          <Camera ref={cameraRef} style={{ flex: 1, width: '100%' }} />
        )} */}
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={{ padding: 8, backgroundColor: '#E5E7EB', marginVertical: 4, borderRadius: 8 }}>
            {item.text}
          </Text>
        )}
        style={{ marginTop: 16, flex: 1 }}
      />

      <KeyboardAvoidingView>
        <View style={{ flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, padding: 8 }}>
          <TextInput
            style={{ flex: 1, borderWidth: 1, borderRadius: 8, padding: 8 }}
            placeholder="Type Message . . ."
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity 
            onPress={sendMessage} 
            style={{ marginLeft: 8, padding: 8, backgroundColor: '#6B46C1', borderRadius: 8 }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <TabBar />
    </SafeAreaView>
  );
};

export default Translator;
