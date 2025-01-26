import { View, Text, StyleSheet, ImageBackground } from 'react-native'
import React from 'react'
import backgroundCover from "@/assets/images/Avatar2.png"

const explore = () => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={backgroundCover}
        resizeMode='cover'
        style={styles.image}
      >
        <Text style={styles.text}>Contact Us</Text>
      </ImageBackground>
    </View>
  )
}

export default explore

const styles = StyleSheet.create ({

  container: {
    flex: 1,
    flexDirection: 'column', 
  },

  image: {
    width: '100%',
    height: '100%',
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },

  text: {
    color: 'white',
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  }
})