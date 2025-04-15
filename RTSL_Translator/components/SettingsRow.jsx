import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const SettingsRow = ({label, value, onPress, isDestructive, custom}) => {
  return (
    <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        className={`flex-row items-center justify-between py-4 ${custom}`}
    >
        <View className="flex-1">
          <Text 
            className={`${
              isDestructive ? 'text-red-400' : 'text-white'
            } text-ls font-semibold`}
          >
            {label}
          </Text>
          {value ? (
            <Text className="text-gray-400 text-lg mt-1">{value}</Text>
          ) : null}
        </View>
        <Text className="text-gray-500">{'>'}</Text>
    </TouchableOpacity>
  )
}

export default SettingsRow