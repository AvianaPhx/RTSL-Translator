import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'


const SignIn = () => {
  return (
    <View>
      <SafeAreaView>
        <Text>Login</Text>
      </SafeAreaView>   

    </View>

  )
}

export default SignIn

export const styles = StyleSheet.create({

    signText: {

    },
    
})