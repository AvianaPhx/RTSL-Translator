import { View, Text, TextInput, Pressable, Image, Alert} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';
import { router, Link } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '@/config/firebase';


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
      Alert.alert('Terms & Conditions', 'You must agree to the terms and conditions to continue.');
      return;
    }

    setIsSubmitting(true);
    const { email, password, username } = form;
  
    if (!username || !email || !password) {
      Alert.alert('Missing Fields', 'Please fill in all fields');
      setIsSubmitting(false);
      return;
    }
  
    try {
      // Create the user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User signed up:', user);
  
      // Navigate to the login page after successful sign-up
      router.replace('/sign-in');
    } catch (error) {
      setIsSubmitting(false);
  
      console.error('Sign-up error:', error); // Log the complete error for debugging
  
      // Handle Firebase errors
      let errorMessage = 'An error occurred, please try again later.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already in use.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many attempts. Please try again later.';
      } else {
        errorMessage = error.message || errorMessage; // Fallback to detailed error message
      }
  
      // Show error message
      Alert.alert('Sign-Up Error', errorMessage);

    }
  };
  

  return (
    <SafeAreaView className='bg-white h-full p-5'>
      <View className='w-full justify-center'>
        <Text className="text-5xl font-bold text-purple-900">Create an account</Text>

        <FormField 
          title="Username"
          value={form.username}
          handleChangeText={(e) => setForm({ ...form, username: e })}
          otherStyles="mt-7"
        />
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

          <Pressable onPress={() => setAgreeToTerms(!agreeToTerms)} className={`w-5 h-5 rounded-full mr-2 ${agreeToTerms ? 'bg-purple-600' : 'bg-purple-200'}`} />

          <Text className='text-gray-600 text-xl'>
            I agree to the <Text className='text-purple-600 font-psemibold'>terms & conditions</Text>
          </Text>

        </View>

        <CustomButton 
          title="Sign Up &gt;"
          handlePress={submit}
          containerStyles="w-full"
          isLoading={isSubmitting}
        />

        <Text className='text-center text-xl text-gray-500 my-4'>or sign up with</Text>

        <View className='flex-row justify-center'>
          <Image source={require('../../assets/icons/bookmark.png')} style={{ width: 40, height: 40, marginHorizontal: 30 }} />
          <Image source={require('../../assets/icons/bookmark.png')} style={{ width: 40, height: 40, marginHorizontal: 30 }} />
          <Image source={require('../../assets/icons/bookmark.png')} style={{ width: 40, height: 40, marginHorizontal: 30 }} />
        </View>

        <View className='justify-center pt-5 flex-row gap-2'>
          <Text className='text-center text-xl text-gray-500 mr-2 my-4'>
            Already have an account?
          </Text>
          <Pressable onPress={() => router.replace('/sign-in')}>
            <Text className='font-psemibold text-xl text-purple-600 my-4'>
              Sign In
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;
