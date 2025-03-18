import { View, Text, Pressable, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';
import { router, Link } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import Firebase auth function
import { auth } from '../../config/firebase'; // Import auth from your Firebase config

const SignIn = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    setIsSubmitting(true);

    const { email, password } = form;

    // Simple validation for empty fields
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please fill in all fields');
      setIsSubmitting(false);
      return;
    }

    try {
      // Authenticate the user using Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password);
      
      // Redirect to the welcome screen after successful login
      router.replace({ pathname: '/welcome', params: { username: email.split('@')[0] } });

    } catch (error) {
      setIsSubmitting(false);
      
      console.error('Sign-in error:', error); // Log the complete error for debugging

      // Handle Firebase errors
      let errorMessage = 'An error occurred, please try again later.';
      if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No user found with this email address.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many attempts. Please try again later.';
      } else {
        errorMessage = error.message || errorMessage;
      }

      // Show error message
      Alert.alert('Sign-In Error', errorMessage);
    }
  };

  return (
    <SafeAreaView className='bg-white h-full p-5'>
      <View className='w-full justify-center'>
        <Text className="text-5xl font-bold text-purple-900">Sign In</Text>

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

        <View className='flex-row items-center my-6'>
          <Pressable className='w-5 h-5 bg-purple-200 rounded-full mr-2' />
          <Text className='text-purple-600 font-psemibold'>Forgot Password?</Text>
        </View>

        <CustomButton 
          title="Sign In &gt;"
          handlePress={submit}
          containerStyles="w-full"
          isLoading={isSubmitting}
        />

        <Text className='text-center text-xl text-gray-500 my-4'>or sign in with</Text>

        <View className='flex-row justify-center'>
          <Image source={require('../../assets/icons/bookmark.png')} style={{ width: 40, height: 40, marginHorizontal: 30 }} />
          <Image source={require('../../assets/icons/bookmark.png')} style={{ width: 40, height: 40, marginHorizontal: 30 }} />
          <Image source={require('../../assets/icons/bookmark.png')} style={{ width: 40, height: 40, marginHorizontal: 30 }} />
        </View>

        <View className='justify-center pt-5 flex-row gap-2'>
          <Text className='text-center text-xl text-gray-500 mr-2 my-4'>
            Don't have an account?
          </Text>
          <Link href='/sign-up' className='font-psemibold text-xl text-purple-600 my-4'>Sign Up</Link>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
