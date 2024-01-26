import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import Header from '../../component/Header/Header'
import { StackNavigationProp } from '@react-navigation/stack'
import { PADDING_HORIZONTAL, PADDING_TOP } from '../../utilities/utility'

interface Item {
    id: number,
    icon: string,
    namePayment: string,
    nameScreen: string
}

type ScreenProps = {
    navigation: any
  }

const PaymentScreen = ({navigation} : ScreenProps) => {
    return (
        <View style={{ paddingHorizontal: PADDING_HORIZONTAL, paddingTop: PADDING_TOP }}>
            <Header title={'Payment'} navigation={navigation}/>
            <View>
                {data.map((item: Item) => {
                    return (
                        <TouchableOpacity style={styles.itemPayment} key={item.id} onPress={() => navigation.navigate(item.nameScreen) }>
                            <Icon name={item.icon} color={'#000000'} size={25} />
                            <Text style={styles.textItemPayment}>{item.namePayment}</Text>
                        </TouchableOpacity>
                    )
                })}
            </View>
        </View>
    )
}

export default PaymentScreen

const styles = StyleSheet.create({
    textItemPayment: {
        color: '#223263',
        fontSize: 18,
        fontFamily: 'Poppins',
        fontWeight: '700',
        lineHeight: 18,
        letterSpacing: 0.50,
    },
    itemPayment: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 60,
        gap: 20,
        marginTop: 5
    },
    
})
const data = [
    {
        id: 1,
        icon: 'card-outline',
        namePayment: 'Credit Card Or Debit',
        nameScreen: 'CreditCardScreen'
    },
    {
        id: 2,
        icon: 'logo-paypal',
        namePayment: 'PayPal',
        nameScreen: 'PaypalScreen'
    },
    {
        id: 3,
        icon: 'wallet-sharp',
        namePayment: 'Bank Transfer',
        nameScreen: 'BankTransferScreen'
    }
]