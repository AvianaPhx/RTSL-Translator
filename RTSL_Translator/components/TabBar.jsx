import { View, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import React from 'react'
import { useRouter, usePathname } from 'expo-router';

const TabBar = () => {

    const router = useRouter();
    const pathname = usePathname();

    const goTo = (path) => {
        if (pathname !== path) {
            router.replace(path);
        }
    };

    return (
        <View className="flex-row justify-around items-center bg-gray-800 p-4 rounded-2xl mt-auto shadow-md">
            <TouchableOpacity onPress={() => goTo('/home')}>
                <FontAwesome name="home" size={34} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => goTo('/translator')}>
                <FontAwesome name="comment" size={34} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => goTo('/connect')}>
                <FontAwesome name="link" size={34} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => goTo('/setting')}>
                <FontAwesome name="cog" size={34} color="white" />
            </TouchableOpacity>
        </View>
    )
}

export default TabBar