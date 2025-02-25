import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'


const SignIn = () => {
  return (
    <View>
        <SafeAreaView style={styles.container}></SafeAreaView>

        <ScrollView>
            <View style={styles.signText}>
                <Text>Sign In</Text>
            </View>
        </ScrollView>

    </View>

  )
}

export default SignIn

export const styles = StyleSheet.create({
    container: {
        backgroundColor: "black",
    },

    signText: {

    },
    
})