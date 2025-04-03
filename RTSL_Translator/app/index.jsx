import { View, Text, ImageBackground, Pressable, Dimensions, ScrollView } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import backgroundCover from "@/assets/images/Avatar.png"
import CustomButton from '@/components/CustomButton'


const App = () => {
  return (
    <SafeAreaView className="bg-gray-900 flex-1">
      <ScrollView className="bg-gray-900" contentContainerStyle={{ flexGrow: 1}}>
        <View className="flex-1">
          <ImageBackground source={backgroundCover} resizeMode="cover" className="w-full h-full justify-end">
            
            <View className="bg-gray-900 w-full h-[45%] rounded-t-3xl p-5 ">
            
              <Text className="my-2 text-purple-400 text-6xl font-bold">Welcome</Text>
              <Text className="text-gray-400 text-2xl my-3">Please login or sign up to continue using our app</Text>

              <View>
                <CustomButton 
                  title="Get Started  &gt;"
                  handlePress={() => router.replace('/sign-up')}
                  containerStyles="w-full mt-3"
                />
                <View className="flex-row mt-6">
                  <Text className="text-gray-400 text-2xl">You already have an account?</Text>
                  
                  <Pressable onPress={() => router.replace("/sign-in")}>
                    <Text className="text-purple-400 text-2xl font-bold ml-2">Login</Text>
                  </Pressable>

                </View>

              </View>
            </View>
          </ImageBackground>
        </View>
      </ScrollView>
    </SafeAreaView>

  )
}

export default App
