import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const Home = () => {

  getAuth().onAuthStateChanged((user) => {
    if (!user) router.replace('/');
  });
  
  return (
    <View>
      <Text>Sign Out</Text>
      <TouchableOpacity onPress={() => auth.signOut()}>
        <Text>Sign Out</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Home