import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const signUp = () => {
  return (
    <View>
        <SafeAreaView style={styles.container}></SafeAreaView>

        <ScrollView>
            <View style={styles.signText}>
                <Text>Sign Up</Text>
            </View>
        </ScrollView>

    </View>
  )
}

export default signUp

const styles = StyleSheet.create({

    container: {
        backgroundColor: "black",
    },

    signText: {

    },
})
