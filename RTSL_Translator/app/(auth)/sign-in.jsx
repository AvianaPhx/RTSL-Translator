import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const SignIn = () => {
  return (
    <SafeAreaView className='bg-white h-full'>
      <View className='w-full justify-center min-h-[85vh] px-4 my-6'> 
        <Text>Sign In</Text>
      </View>
    </SafeAreaView>
  )
}

export default SignIn