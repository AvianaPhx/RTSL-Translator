import { View, Text, Image } from 'react-native'
import { icons } from '../../constants'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { Slot, SplashScreen, Stack } from 'expo-router'

const TabsLayout = () => {
    return (
        <>
        <Stack>
          <Stack.Screen name="home" options={{ headerShown: false }} />
          <Stack.Screen name="translator" options={{ headerShown: false }} />
          <Stack.Screen name="connect" options={{ headerShown: false }} />
          <Stack.Screen name="setting" options={{ headerShown: false }} />
        </Stack>
  
        <StatusBar backgroundColor="161622" style="light" />
      </>
    )
  }
  

export default TabsLayout