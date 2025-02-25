import { View, Text, StyleSheet, ImageBackground, Pressable, Button } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import backgroundCover from "@/assets/images/Avatar.png"
import { LinearGradient } from 'expo-linear-gradient'

const app = () => {
  return (
    <View style={styles.container}>
      <ImageBackground source={backgroundCover} resizeMode='cover' style={styles.image}>
        
        <View style={styles.slide_container}>
        
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.desc}>Please login or sign up to continue using our app</Text>

          <View>

            {/* Gradient Button */}
            <Link href="/register" asChild>
              <Pressable>
                <LinearGradient colors={["#A076F9", "#8461DB"]} style={styles.button}>
                  <Text style={styles.buttonText}>Get Started &gt;</Text>
                </LinearGradient>
              </Pressable>
            </Link>

            {/* Login Text */}
            <View style={styles.logText}>
              <Text style={styles.descSmall}>You already have an account?</Text>

              <Link href="/login" asChild>
                <Pressable>
                  <Text style={styles.loginText}>Login</Text>
                </Pressable>
              </Link>
            </View>

          </View>
        </View>

      </ImageBackground>

    </View>
  )
}

export default app

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },

  image: {
    width: '100%',
    height: '100%',
    justifyContent: "flex-end",
  },

  slide_container: {
    backgroundColor: "white",
    width: "100%",
    height: "45%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },

  log_text:{
    flex: 1,
    flexDirection: 'column',
    
  },

  title: {
    marginTop: '2%',
    color: "#3D266A",
    fontSize: 52,
    fontWeight: "bold",
  },

  desc: {
    color: "#7A7A7A",
    fontSize: 23,
    marginVertical: 10,
  },

  descSmall: {
    color: "#7A7A7A",
    fontSize: 23,
  },

  logText: {
    flexDirection: "row",
    marginTop: 20,
  },

  loginText: {
    color: "#8461DB",
    fontSize: 23,
    fontWeight: "bold",
    marginLeft: 5,
  },

  link: {
    color: 'white',
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
    textDecorationLine: "underline",
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 4,
  },

  button: {
    marginTop: '3%',
    height: 60,
    borderRadius: 10,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.75)',
    padding: 6,
  },

  buttonText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
})