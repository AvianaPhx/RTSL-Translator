import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useState } from 'react'
import { icons } from '../constants'

const FormField = ({ title, value, placeholder, handleChangeText, otherStyles, ...props}) => {

const [showPassword, setshowPassword] = useState(false)  
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className='text-black font-pmedium text-xl'>{title}</Text>

      <View className='border-b border-gray-300 flex-row items-center py-2 mb-2'>
        <TextInput 
          className='flex-1 font-psemibold text-xl'
          value={value}
          placeholder={placeholder}
          placeholderTextColor='#7b7b8b'
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
        />

        {title === 'Password' && (
          <TouchableOpacity onPress={() =>
            setshowPassword(!showPassword)
          }>
            <Image source={!showPassword ? icons.eyeHide : icons.eye} style={{ width: 32, height: 32 }} resizeMode='contain'/>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default FormField