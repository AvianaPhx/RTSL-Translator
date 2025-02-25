import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { createUserWithEmailAndPassword } from '@firebase/auth';

const register = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signIn = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password)
      if (user) router.replace('/(tabs)')
    } catch (error) {
      console.log(error)
      alert("Sign in failed: " + error.message);
    }
  }

  const signUp = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password)
      if (user) router.replace('/(tabs)')
    } catch (error) {
      console.log(error)
      alert("Sign in failed: " + error.message);
    }
  }

  return (
    <SafeAreaView>
      <Text>Login</Text>
      <TextInput placeholder='email' value={email} onChangeText={setEmail}/>
      <TextInput placeholder='password' value={password} onChangeText={setPassword}/>
      <TouchableOpacity onPress={signIn}>
        <Text>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={signUp}>
        <Text>Make Account</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default register

const styles = StyleSheet.create({})