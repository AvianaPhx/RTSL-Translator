import { View, Text, ImageBackground, Pressable, ScrollView } from 'react-native'
import React from 'react'
import { Redirect, router, Link } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import backgroundCover from "@/assets/images/Avatar.png"
import { LinearGradient } from 'expo-linear-gradient'
import CustomButton from '@/components/CustomButton'

const App = () => {
  return (
        <View className="flex-1">
          <ImageBackground source={backgroundCover} resizeMode="cover" className="w-full h-full justify-end">
            
            <View className="bg-white w-full h-[45%] rounded-t-3xl p-5 shadow-md shadow-black">
            
              <Text className="my-2 text-[#3D266A] text-6xl font-bold">Welcome</Text>
              <Text className="text-[#7A7A7A] text-2xl my-3">Please login or sign up to continue using our app</Text>

              <View>
                <CustomButton 
                  title="Get Started"
                  handlePress={() => router.push('/sign-up')}
                  containerStyles="w-full mt-3"
                />
                {/* Gradient Button */}
                {/* <Link href="/sign-up" asChild>
                  <Pressable className="mt-3 h-16 rounded-lg justify-center bg-black bg-opacity-75 p-2" colors={["#A076F9", "#8461DB"]}>

                      <Text className="text-white text-3xl font-bold text-center">Get Started &gt;</Text>

                  </Pressable>
                </Link> */}

                {/* Login Text */}
                <View className="flex-row mt-6">
                  <Text className="text-[#7A7A7A] text-2xl">You already have an account?</Text>
                  
                  <Pressable onPress={() => router.push("/sign-in")}>
                    <Text className="text-[#8461DB] text-2xl font-bold ml-2">Login</Text>
                  </Pressable>

                </View>

              </View>
            </View>

          </ImageBackground>

        </View>
  )
}

export default App
