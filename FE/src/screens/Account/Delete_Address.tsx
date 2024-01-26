import { StyleSheet, Text, View, Pressable, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import Button from '../../component/Button/Button'
import LinearGradient from 'react-native-linear-gradient'

const Delete_Address = () => {
    return (
        <View style={styles.container}>
            <Icon name='warning' size={70} color='#FB7181' />
            <Text style={styles.title}>Confirmation</Text>
            <Text style={styles.content}>Are you sure wanna delete address</Text>
            <Button />
            <TouchableOpacity style={styles.btnCancel}>
                <Pressable >
                    <Text style={styles.txtCancel}>Cancel</Text>
                </Pressable>
            </TouchableOpacity>
        </View>
    )
}

export default Delete_Address

const styles = StyleSheet.create({
    btnCancel: {
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#9098B1",
        backgroundColor: "#EBF0FF",
        height: 50,
        width: "90%",
        alignSelf: 'center',
        marginTop: 10,
    },

    txtCancel: {
        color: '#9098B1',
        fontSize: 14,
        fontFamily: 'Poppins',
        fontWeight: '700',
        lineHeight: 25.20,
        letterSpacing: 0.50,
    },

    txtSave: {
        color: 'white',
        fontSize: 14,
        fontFamily: 'Poppins',
        fontWeight: '700',
        lineHeight: 25.20,
        letterSpacing: 0.50,
    },

    btnSave: {
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#FFFFFF",
        backgroundColor: "#46CAF3",
        height: 50,
        width: "90%",
        alignSelf: 'center',
        marginTop: 10,
    },

    content: {
        color: '#223263',
        fontSize: 14,
        fontFamily: 'Poppins',
        fontWeight: '400',
        lineHeight: 21.60,
        letterSpacing: 0.50,
        marginTop: 10,
    },

    title: {
        color: '#223263',
        fontSize: 26,
        fontFamily: 'Poppins',
        fontWeight: '700',
        lineHeight: 36,
        letterSpacing: 0.50,
        marginTop: 10,
    },

    container: {
        alignItems: 'center',
        top: 150,
    },
})