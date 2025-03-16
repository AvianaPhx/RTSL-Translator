import { View, Text } from 'react-native'
import React from 'react'

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
        </Stack>
        <StatusBar backgroundColor="161622" style="dark"/>
    </>
  )
}

export default SettingLayout