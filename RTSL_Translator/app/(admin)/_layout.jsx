import { View, Text } from 'react-native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React from 'react'

const AdminLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen 
          name='admin-chat'
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen 
          name='user-management'
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen 
          name='user-help'
          options={{
            headerShown: false
          }}
        />
      </Stack>
      <StatusBar style="light"/>
    </>
  )
}

export default AdminLayout