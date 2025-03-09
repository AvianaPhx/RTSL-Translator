import { View, Text, TextInput, Pressable, Image } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton'
import { Redirect, router, Link } from 'expo-router'

const SignUp = () => {

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = () => {

  }

  return (
    <SafeAreaView className='bg-white h-full p-5'>
      <View className='w-full justify-center '>
        <Text className="text-5xl font-bold text-purple-900">Create an account</Text>
        <FormField 
          title="Username"
          value={form.username}
          handleChangeText={(e) => setForm({ ...form,
            username: e
          })}
          otherStyles="mt-7"
          keyboardType="email-address"
        />
        <FormField 
          title="Email"
          value={form.email}
          handleChangeText={(e) => setForm({ ...form,
            email: e
          })}
          otherStyles="mt-7"
          keyboardType="email-address"
        />
        <FormField 
          title="Password"
          value={form.passwordl}
          handleChangeText={(e) => setForm({ ...form,
            password: e
          })}
          otherStyles="mt-7"
        />

        <View className='flex-row items-center my-6'>
          <Pressable className='w-5 h-5 bg-purple-200 rounded-full mr-2' />
          <Text className='text-gray-600 text-xl'>I agree to the <Text className='text-purple-600 font-psemibold'>terms & conditions</Text></Text>
        </View>

        <CustomButton 
          title="Sign Up"
          handlePress={submit}
          containerStyles="w-full "
          isLoading={isSubmitting}
        />

        <Text className='text-center text-xl text-gray-500 my-4'>or sign up with</Text>

        <View className='flex-row justify-center'>
          <Image source={require('../../assets/icons/bookmark.png')} style={{ width: 40, height: 40, marginLeft: 30, marginRight: 30 }} />
          <Image source={require('../../assets/icons/bookmark.png')} style={{ width: 40, height: 40, marginLeft: 30, marginRight: 30 }} />
          <Image source={require('../../assets/icons/bookmark.png')} style={{ width: 40, height: 40, marginLeft: 30, marginRight: 30 }} />
        </View>

        <View className='justify-center pt-5 flex-row gap-2'>
          <Text className='text-center text-xl text-gray-500 mr-2 my-4'>
            you already have an account? 
          </Text>
          <Link href='/sign-in' className=' font-psemibold text-xl text-purple-600 my-4'>Sign In</Link>
        </View>
      </View>
      


      

    </SafeAreaView>

    // <SafeAreaView className='bg-white h-full p-5'>
    //   <Text className='text-3xl font-bold text-purple-900 mb-5'>Create an account</Text>
      
    //   <Text className='text-gray-600'>Username</Text>
    //   <View className='border-b border-gray-300 flex-row items-center py-2 mb-4'>
    //     <TextInput className='flex-1' placeholder='John Doe' />
    //     <Image source={require('../../assets/icons/bookmark.png')} className='w-5 h-5' />
    //   </View>

    //   <Text className='text-gray-600'>Email address</Text>
    //   <View className='border-b border-gray-300 flex-row items-center py-2 mb-4'>
    //     <TextInput className='flex-1' placeholder='john.doe@gmail.com' keyboardType='email-address' />
    //     <Image source={require('../../assets/icons/bookmark.png')} className='w-5 h-5' />
    //   </View>

    //   <Text className='text-gray-600'>Password</Text>
    //   <View className='border-b border-gray-300 flex-row items-center py-2 mb-4'>
    //     <TextInput className='flex-1' placeholder='************' secureTextEntry />
    //     <Image source={require('../../assets/icons/bookmark.png')} className='w-5 h-5' />
    //   </View>

    //   <View className='flex-row items-center mb-4'>
    //     <Pressable className='w-5 h-5 bg-purple-200 rounded-full mr-2' />
    //     <Text className='text-gray-600'>I agree to the <Text className='text-purple-600'>terms & conditions</Text></Text>
    //   </View>
      
    //   <Pressable className='bg-purple-600 py-3 rounded-lg mt-3'>
    //     <Text className='text-white text-center text-lg'>Sign Up</Text>
    //   </Pressable>
      
    //   <Text className='text-center text-gray-500 my-4'>or sign up with</Text>
      
    //   <View className='flex-row justify-center space-x-4'>
    //     <Image source={require('../../assets/icons/bookmark.png')} className='w-10 h-10' />
    //     <Image source={require('../../assets/icons/bookmark.png')} className='w-10 h-10' />
    //     <Image source={require('../../assets/icons/bookmark.png')} className='w-10 h-10' />
    //   </View>
      
    //   <View className='flex-row justify-center mt-6'>
    //     <Text className='text-gray-600'>You already have an account?</Text>
    //     <Pressable>
    //       <Text className='text-purple-600 font-bold ml-2'>Login</Text>
    //     </Pressable>
    //   </View>
    // </SafeAreaView>
  );
};

export default SignUp;
