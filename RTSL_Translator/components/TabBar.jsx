import { View, Text, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import React from 'react'
import { useRouter } from 'expo-router';

const TabBar = () => {

    const router = useRouter();

    return (
        <View className="flex-row justify-around items-center bg-gray-800 p-4 rounded-2xl mt-auto shadow-md">
            <TouchableOpacity onPress={() => router.navigate('/home')}>
                <FontAwesome name="home" size={34} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/translator')}>
                <FontAwesome name="comment" size={34} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.navigate('/connect')}>
                <FontAwesome name="link" size={34} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.navigate('/setting')}>
                <FontAwesome name="cog" size={34} color="white" />
            </TouchableOpacity>
        </View>
    )
}

export default TabBar