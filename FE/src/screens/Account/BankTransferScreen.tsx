import { Dimensions, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from '../../component/Header/Header'
import { PropsAccount } from '../../component/Navigation/Props'

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');
const BankTransferScreen = ({ navigation }: PropsAccount) => {
  return (
    <View  style={{flex: 1}}>
      <StatusBar barStyle={'light-content'} />
      <View style={{ height: 100, backgroundColor: 'red'}}></View>
      <ScrollView>
        <View style={{ height: 120, backgroundColor: 'red'}}></View>
        <View style={{ height: HEIGHT * 2, backgroundColor: '#776767' }}></View>
      </ScrollView>
    </View>
  )
}

export default BankTransferScreen

const styles = StyleSheet.create({})