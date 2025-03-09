import { View, Text, TextInput, Pressable, Image } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton'
import { Redirect, router, Link } from 'expo-router'


const SignIn = () => {

  const [form, setForm] = useState({
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
          <Text className='text-purple-600 font-psemibold'>Forgot Password?</Text>
        </View>

        <CustomButton 
          title="Sign Up"
          handlePress={submit}
          containerStyles="w-full"
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
            Don't have an account? 
          </Text>
          <Link href='/sign-up' className=' font-psemibold text-xl text-purple-600 my-4'>Log In</Link>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default SignIn