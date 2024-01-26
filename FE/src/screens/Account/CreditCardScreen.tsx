import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from '../../component/Header/Header'
import { PatternFormat } from 'react-number-format'
import LinearGradient from 'react-native-linear-gradient'
import ButtonBottom from '../../component/Button/Button'

import { PropsAccount } from '../../component/Navigation/Props'
import { HEIGHT, PADDING_HORIZONTAL, PADDING_TOP } from '../../utilities/utility'


interface Card {
  id: number,
  type: string,
  numberCard: number,
  nameCard: string,
  dateCard: string
}



const CreditCardScreen = ({ navigation }: PropsAccount) => {
  return (
    <View style={{ paddingHorizontal: PADDING_HORIZONTAL, paddingTop: PADDING_TOP, height: HEIGHT }}>
      <Header title='Credit Card Or Debit' navigation={navigation} />
      <View>
        {data.map((item: Card) =>
          <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#46caf3', '#5cbae3', '#68b1d9']} style={styles.itemCardBank} key={item.id}>
            <View>
              <Image source={require('../../asset/image/visaIcon.png')} />
            </View>
            <View>
              <PatternFormat displayType='text' value={item.numberCard} format="#### #### #### ####" renderText={(numberCard) => <Text style={styles.numberCard}>{numberCard}</Text>} />
            </View>
            <View style={{ flexDirection: 'row', gap: 20 }}>
              <View>
                <Text style={styles.textCardCaption}>Card Holder</Text>
                <Text style={styles.textCardContent}>{item.nameCard}</Text>
              </View>
              <View>
                <Text style={styles.textCardCaption}>Card Expires</Text>
                <Text style={styles.textCardContent}>{item.dateCard}</Text>
              </View>
            </View>
          </LinearGradient >
        )}
      </View>
      <View style={{ position: 'absolute', bottom: 20, width: '100%', alignSelf: 'center' }}>
        <ButtonBottom title='Add Card' />
      </View>
    </View>

  )
}

export default CreditCardScreen

const styles = StyleSheet.create({
  textCardContent: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'Poppins',
    fontWeight: '700',
    lineHeight: 15,
    letterSpacing: 0.50,
  },
  textCardCaption: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '400',
    lineHeight: 15,
    letterSpacing: 0.50,
  },
  numberCard: {
    color: 'white',
    fontSize: 33,
    fontFamily: 'Poppins',
    fontWeight: '700',
    lineHeight: 36,
    letterSpacing: 0.50,
  },
  itemCardBank: {
    width: '100%',
    height: 200,
    marginTop: 20,
    borderRadius: 10,
    justifyContent: 'space-around',
    padding: 10
  }
})
const data: Card[] = [
  {
    id: 1,
    type: 'visa',
    numberCard: 1235302180941856,
    nameCard: 'Le Trung Hau',
    dateCard: '10/2023'
  },
  {
    id: 2,
    type: 'napas',
    numberCard: 2523236854678516,
    nameCard: 'Le Trung Nhan',
    dateCard: '10/2029'
  }
]