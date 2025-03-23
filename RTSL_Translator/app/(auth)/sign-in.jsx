import { View, Text, Pressable, Image, Alert, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';
import { router, Link } from 'expo-router';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'; // Import Firebase functions
import { auth } from '@/config/firebase'; // Import Firebase config

const SignIn = () => {

  // Form For Sign IN
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  // Error Messages
  const errorMessages = {
    "auth/wrong-password": "Incorrect password. Please double-check and try again.",
    "auth/invalid-credential": "Invalid credentials. Please check your email and password.",
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    setIsSubmitting(true);

    const { email, password } = form;

    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please fill in all fields');
      setIsSubmitting(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace({ pathname: '/welcome', params: { username: email.split('@')[0] } });
    } catch (error) {
      setIsSubmitting(false);
      
      // Fetch custom error message or use default
      const errorMessage = errorMessages[error.code] || 'Something went wrong. Please try again later.';
      
      Alert.alert('Sign-In Error', errorMessage);
    }
  };

  const handleForgotPassword = async () => {
    if (!form.email) {
      Alert.alert('Forgot Password', 'Please enter your email to reset your password.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, form.email);
      Alert.alert('Password Reset', 'A password reset link has been sent to your email.');
    } catch (error) {
      let errorMessage = 'Failed to send reset email. Try again later.';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No user found with this email.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      }
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <SafeAreaView className="bg-white flex-1">
      <View className="flex-1 justify-center items-center p-5 w-full">

        <Text className="text-5xl font-bold text-purple-900">Sign In</Text>

        <View className="w-full max-w-md">
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
            secureTextEntry
          />

          <View className="flex-row my-6">
            <Pressable onPress={handleForgotPassword}>
              <Text className="text-purple-600 font-psemibold">Forgot Password?</Text>
            </Pressable>
          </View>

          <CustomButton
            title="Sign In >"
            handlePress={submit}
            containerStyles="w-full"
            isLoading={isSubmitting}
          />

          <Text className="text-center text-xl text-gray-500 my-4">or sign in with</Text>

          <View className="flex-row justify-center">
            {[...Array(3)].map((_, index) => (
              <Image
                key={index}
                source={require('../../assets/icons/bookmark.png')}
                style={{ width: 40, height: 40, marginHorizontal: 15 }}
              />
            ))}
          </View>

          <View className="flex-row justify-center pt-5">
            <Text className="text-center text-xl text-gray-500">Don't have an account?</Text>
            <Link href="/sign-up" className="font-psemibold text-xl text-purple-600 ml-2">
              Sign Up
            </Link>
          </View>

        </View>
      </View>
    </SafeAreaView>
);
};

export default SignIn;
