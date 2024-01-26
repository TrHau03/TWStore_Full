import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const SplashSreen = () => {
  return (
    <View style={{backgroundColor: '#1C1C1C', width: '100%', height:'100%',justifyContent:'center'}}>
      <Image source={require('../../asset/image/logoTW.png')}/>
    </View>
  )
}

export default SplashSreen

const styles = StyleSheet.create({})