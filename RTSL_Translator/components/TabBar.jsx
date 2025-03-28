import { View, Text, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import React from 'react'
import { useRouter } from 'expo-router';

const TabBar = () => {

    const router = useRouter();

    return (
        <View className="flex-row justify-around items-center bg-white p-4 rounded-2xl mt-auto shadow-md">
            <TouchableOpacity onPress={() => router.push('/home')}>
                <FontAwesome name="home" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/translator')}>
                <FontAwesome name="language" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/connect')}>
                <FontAwesome name="comment" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.replace('/setting')}>
                <FontAwesome name="cog" size={24} color="black" />
            </TouchableOpacity>
        </View>
    )
}

export default TabBar