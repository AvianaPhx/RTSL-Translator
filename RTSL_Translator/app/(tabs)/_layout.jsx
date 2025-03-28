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
                style={{ width: 40, height: 29}}
            />
            {/* <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`} style={{ maxWidth: 100, flexShrink: 1 }}>
                {name}
            </Text> */}
        </View>
    )
}

const TabsLayout = () => {
  return (
    <>
        <Tabs
        screenOptions={{
            tabBarShowLabel: false,
            tabBarActiveTintColor: '#78539F',
            tabBarInactiveTintColor: '#CDCDE0',
            tabBarStyle: {
                backgroundColor: '#000000',
                borderTopWidth: 1,
                borderTopColor: '#232533',
                height: 56,
            }
        }}>
            <Tabs.Screen 
                name='home'
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarStyle: { display: 'none' },
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
                    tabBarStyle: { display: 'none' },
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
                    tabBarStyle: { display: 'none' },
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
                    tabBarStyle: { display: 'none' },
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