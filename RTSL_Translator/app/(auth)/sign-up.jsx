import { auth, db } from '@/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

import { View, Text, Pressable, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const SignUp = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const submit = async () => {
    if (!agreeToTerms) {
      Alert.alert(
        'Terms & Conditions',
        'You must agree to the terms and conditions to continue.'
      );
      return;
    }

    const { username, email, password } = form;
    if (!username || !email || !password) {
      Alert.alert('Missing Fields', 'Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password
      );

      await setDoc(doc(db, 'users', user.uid), {
        username,
        email:           user.email,
        email_lowercase: user.email.toLowerCase(),
        role:            'member',
        createdAt:       serverTimestamp(),
      });

      router.replace('/sign-in');
    } catch (error) {
      setIsSubmitting(false);
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Email Already In Use', 'This email is already in use.');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Email Error', 'Please enter a valid email address.');
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('Password Error', 'Password should be at least 6 characters.');
      } else if (error.code === 'auth/too-many-requests') {
        Alert.alert('Too Many Requests', 'Too many attempts. Try again later.');
      } else {
        Alert.alert('Sign‑Up Error', error.message || 'Please try again later.');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="bg-gray-900 flex-1">
        <ScrollView className="bg-gray-900" contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 justify-center items-center px-5">
            <View className="w-full max-w-md">
              <Text className="text-5xl font-bold text-purple-400 text-center">
                Create an account
              </Text>

              <FormField
                title="Username"
                value={form.username}
                placeholder="Enter your username"
                handleChangeText={e => setForm({ ...form, username: e })}
                otherStyles="mt-7"
              />
              <FormField
                title="Email"
                value={form.email}
                placeholder="Enter your email address"
                handleChangeText={e => setForm({ ...form, email: e })}
                otherStyles="mt-5"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <FormField
                title="Password"
                value={form.password}
                placeholder="Enter your password"
                handleChangeText={e => setForm({ ...form, password: e })}
                otherStyles="mt-5"
                secureTextEntry
              />

              {/* Terms & Conditions */}
              <View className="flex-row items-center my-6">
                <Pressable
                  onPress={() => setAgreeToTerms(!agreeToTerms)}
                  className="w-8 h-8 border-2 border-white rounded-full justify-center items-center mr-2"
                >
                  {agreeToTerms && (
                    <Ionicons name="checkmark-circle" size={24} color="#fff" />
                  )}
                </Pressable>
                <Text className="text-gray-400 text-xl">
                  I agree to the{' '}
                  <Text className="text-purple-400 font-semibold text-xl">
                    terms & conditions
                  </Text>
                </Text>
              </View>

              {/* Sign Up Button */}
              <CustomButton
                title="Sign Up >"
                handlePress={submit}
                containerStyles="w-full mt-3"
                isLoading={isSubmitting}
              />

              {/* Sign In Link */}
              <View className="flex-row justify-center pt-5">
                <Text className="text-gray-400 text-xl">
                  Already have an account?
                </Text>
                <Pressable onPress={() => router.replace('/sign-in')}>
                  <Text className="text-purple-400 font-semibold text-xl ml-1">
                    Sign In
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
