import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from '../../component/Header/Header'
import { PropsAccount } from '../../component/Navigation/Props'
import { PADDING_HORIZONTAL, PADDING_TOP } from '../../utilities/utility'



const PaypalScreen = ({ navigation }: PropsAccount) => {
  return (
    <View style={{ paddingHorizontal: PADDING_HORIZONTAL, paddingTop: PADDING_TOP }}>
      <Header title='Paypal' navigation={navigation} />
    </View>
  )
}

export default PaypalScreen

const styles = StyleSheet.create({})