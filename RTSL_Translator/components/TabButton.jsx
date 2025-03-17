import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'


const TabButton = ({ title, handlePress, isLoading, containerStyles, textStyles, icon}) => {
  return (
    <TouchableOpacity
        onPress={handlePress}
        disabled={isLoading}
        className={`bg-white p-4 rounded-xl ${containerStyles}`}
    >
        <Text className={`${textStyles}`}>{title}</Text>
        {icon}
    </TouchableOpacity>
  )
}

export default TabButton