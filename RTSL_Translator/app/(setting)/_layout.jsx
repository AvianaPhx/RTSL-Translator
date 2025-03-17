import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const SettingLayout = () => {
  return (
    <>
        <Stack>
            <Stack.Screen 
              name='account-detail'
              options={{
                headerShown: false
              }}
            />
            <Stack.Screen 
              name='edit-profile'
              options={{
                headerShown: false
              }}
            />
            <Stack.Screen 
              name='change-language'
              options={{
                headerShown: false
              }}
            />
            <Stack.Screen 
              name='help'
              options={{
                headerShown: false
              }}
            />
        </Stack>
        <StatusBar backgroundColor="161622" style="dark"/>
    </>
  )
}

export default SettingLayout