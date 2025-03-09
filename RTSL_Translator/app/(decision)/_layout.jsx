import { View, Text } from 'react-native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React from 'react'

const DecisionLayout = () => {
  return (
    <>
    <Stack>
      <Stack.Screen 
        name='welcome'
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen 
        name='select'
        options={{
          headerShown: false
        }}
      />
    </Stack>
    <StatusBar backgroundColor="161622" style="dark"/>
    
    </>
  )
}

export default DecisionLayout