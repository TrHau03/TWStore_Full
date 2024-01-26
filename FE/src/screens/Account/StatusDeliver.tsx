import { Image, StyleSheet, Text, View, FlatList } from 'react-native'
import React from 'react'

import Icon from 'react-native-vector-icons/Ionicons';

import { COLORS } from '../../utilities';

const StatusDeliver = (props: any) => {
    const { dateStatus, status } = props.state;
    return (
        <View style={styles.container}>
            <Text style={styles.textTitle}>Trạng Thái Giao Hàng</Text>
            <View style={{ flexDirection: 'row', marginTop: 25 }}>
                <Icon name='calendar-outline' size={22} color={'#223263'} />
                <Text style={styles.textDate}>{dateStatus}</Text>
            </View>
            <View style={styles.grpcontent}>
                <View style={{ marginRight: '8%', gap: 110 }}>
                    <Icon name='checkmark-done-circle' size={25} color={(status >= 2 && status < 6) ? COLORS.green : status === 6 ? COLORS.red : COLORS.gray} />
                    <Icon name='checkmark-done-circle' size={25} color={status >= 3 && status < 6 ? COLORS.green : COLORS.gray} />
                    <Icon name='checkmark-done-circle' size={25} color={status >= 4 && status < 6 ? COLORS.green : COLORS.gray} />
                    <Icon name='checkmark-done-circle' size={25} color={status === 5 ? COLORS.green : COLORS.gray} />
                </View>
                <View style={styles.content}>
                    {status === 6 ?
                        <View style={styles.item}>
                            <Image source={require('../../asset/image/ongoing1.png')} />
                            <Text style={styles.textItem}>Đã đặt hàng thất bại</Text>
                        </View>
                        :
                        <View style={styles.item}>
                            <Image source={require('../../asset/image/ongoing1.png')} />
                            <Text style={styles.textItem}>Đã xác nhận đơn hàng</Text>
                        </View>
                    }
                    <View style={styles.item}>
                        <Image source={require('../../asset/image/ongoing2.png')} />
                        <Text style={styles.textItem}>Đang đóng gói</Text>
                    </View>
                    <View style={styles.item}>
                        <Image source={require('../../asset/image/ongoing3.png')} />
                        <Text style={styles.textItem}>Đơn hàng đang được giao</Text>
                    </View>
                    <View style={styles.item}>
                        <Image source={require('../../asset/image/ongoing4.png')} />
                        <Text style={styles.textItem}>Đơn hàng đã được giao thành công</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default StatusDeliver

const styles = StyleSheet.create({
    textTitle: {
        color: '#223263',
        fontSize: 20,
        fontFamily: 'Klarna Text',
        fontWeight: '700',
        letterSpacing: 1.28,
    },

    grpcontent: {
        flexDirection: 'row',
        marginTop: 40
    },
    textItem: {
        color: '#223263',
        marginLeft: 30,
        fontSize: 16
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: 70,
    },
    content: {
        width: '80%',
        justifyContent: 'space-between',
        marginTop: -10,
    },
    textTime: {
        color: '#F37A20',
        fontSize: 14,
        fontWeight: '400'
    },
    calendar: {
        width: '8%',
        height: '100%'
    },
    textDate: {
        alignItems: 'center',
        color: '#223263',
        fontSize: 16,
        fontFamily: 'Klarna Text',
        fontWeight: '700',
        letterSpacing: 1.28,
        marginLeft: 10
    },

    container: {
        width: '90%',
        height: '90%',
        paddingTop: 20,
        paddingHorizontal: 20
    }
})