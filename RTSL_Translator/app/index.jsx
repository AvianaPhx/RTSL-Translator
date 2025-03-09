import { Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';
import { SafeAreaFrameContext, SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
    return (
        <SafeAreaView>
            <View>
                <Text className='text-3xl'>
                    Native Tailwind
                </Text>
                <Text>Hello</Text>
            </View>
        </SafeAreaView>
    );
}