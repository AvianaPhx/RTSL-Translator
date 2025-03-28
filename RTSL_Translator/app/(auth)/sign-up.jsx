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
  
      // Handle Firebase errors
      let errorMessage = 'An error occurred, please try again later.';
      if (error.code === 'email-already-in-use') {
        errorMessage = 'This email is already in use.';
      } else if (error.code === 'weak-password') {
        errorMessage = 'Password should be at least 6 characters.';
      } else if (error.code === 'invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error.code === 'too-many-requests') {
        errorMessage = 'Too many attempts. Please try again later.';
      } else {
        errorMessage = error.message || errorMessage; // Fallback to detailed error message
      }
  
      // Show error message
      Alert.alert('Sign-Up Error', errorMessage);

    }
  };
  

  return (
    <SafeAreaView className="bg-white flex-1">
      <View className="flex-1 justify-center items-center px-5">
        <View className="w-full max-w-md">
          <Text className="text-5xl font-bold text-purple-900 text-center">Create an account</Text>
  
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
            otherStyles="mt-5"
            keyboardType="email-address"
          />
          <FormField 
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-5"
            secureTextEntry
          />
  
          {/* Terms & Conditions */}
          <View className="flex-row items-center my-6">
            <Pressable 
              onPress={() => setAgreeToTerms(!agreeToTerms)} 
              className={`w-5 h-5 rounded-full mr-2 ${agreeToTerms ? 'bg-purple-600' : 'bg-purple-200'}`} 
            />
            <Text className="text-gray-600 text-xl">
              I agree to the <Text className="text-purple-600 font-semibold text-xl">terms & conditions</Text>
            </Text>
          </View>
  
          {/* Sign Up Button */}
          <CustomButton 
            title="Sign Up &gt;"
            handlePress={submit}
            containerStyles="w-full mt-3"
            isLoading={isSubmitting}
          />
  
          <Text className="text-center text-gray-500 my-5 text-xl">or sign up with</Text>
  
          {/* Social Sign-In Buttons */}
          <View className="flex-row justify-center gap-5">
            <Image source={require('../../assets/icons/bookmark.png')} style={{ width: 40, height: 40 }} />
            <Image source={require('../../assets/icons/bookmark.png')} style={{ width: 40, height: 40 }} />
            <Image source={require('../../assets/icons/bookmark.png')} style={{ width: 40, height: 40 }} />
          </View>
  
          {/* Sign In Link */}
          <View className="flex-row justify-center pt-5">
            <Text className="text-gray-500 text-xl">Already have an account?</Text>
            <Pressable onPress={() => router.replace('/sign-in')}>
              <Text className="text-purple-600 font-semibold text-xl ml-1">Sign In</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
  
};

export default SignUp;
