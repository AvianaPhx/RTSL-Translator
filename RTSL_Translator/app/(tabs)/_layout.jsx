import { View, Text, Image } from 'react-native'
import { Tabs, Redirect } from 'expo-router'
import { icons } from '../../constants'
import React from 'react'

const TabIcon = ({ icon, color, name, focused }) => {
    return (
        <View className='items-center mt-4 '>
            <Image 
                source={icon}
                resizeMode="contain"
                tintColor={color}
                style={{ width: 24, height: 24 }}
            />
            <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`}>{name}</Text>
        </View>
    )
}

const TabsLayout = () => {
  return (
    <>
        <Tabs
        screenOptions={{
            tabBarShowLabel: false
        }}>
            <Tabs.Screen 
                name='home'
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon 
                            icon={icons.home}
                            color={color}
                            name="Home"
                            focused={focused}
                        />
                    )
                }}
            />
            <Tabs.Screen 
                name='translator'
                options={{
                    title: 'Translator',
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon 
                            icon={icons.home}
                            color={color}
                            name="Translate"
                            focused={focused}
                        />
                    )
                }}
            />
            <Tabs.Screen 
                name='connect'
                options={{
                    title: 'Connect',
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon 
                            icon={icons.home}
                            color={color}
                            name="Connect"
                            focused={focused}
                        />
                    )
                }}
            />
            <Tabs.Screen 
                name='setting'
                options={{
                    title: 'Setting',
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon 
                            icon={icons.home}
                            color={color}
                            name="Setting"
                            focused={focused}
                        />
                    )
                }}
            />
        </Tabs>
    </>
  )
}

export default TabsLayout