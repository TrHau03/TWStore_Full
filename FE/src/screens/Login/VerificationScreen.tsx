import { Alert, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient'
import {
    CodeField,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { InputItem } from '@ant-design/react-native';
import { BG_COLOR, PADDING_HORIZONTAL } from '../../utilities/utility';
import AxiosInstance from '../../Axios/Axios';
import ForgotPass from './ForgotPass';
import { RootStackScreenEnumLogin } from '../../component/Root/RootStackLogin';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';

const VerificationScreen = (props: any) => {
    const { navigation }: NativeStackHeaderProps = props;
    const [value, setValue] = useState<string>('');
    const [verify, setVerify] = useState<boolean>(false);
    const [codeFieldProps, getCellOnLayout] = useClearByFocusCell({
        value,
        setValue,
    });

    const [email, setEmail] = useState<string>('');
    const [OTP, setOTP] = useState<number>()
    console.log(OTP)

    const fetchSendMail = async () => {
        const resultUsersInfor = await AxiosInstance().get(`/usersInfo/getEmailAllUsersInfor`);
        const checkEmail = resultUsersInfor.data.indexOf(email);    

        if (checkEmail >= 0) {
            const response = await AxiosInstance().post(`/usersInfo/VerifyEmail`, { email: email });
            setOTP(response.data.random);
            setVerify(true);
        } else {
            Alert.alert('Email không tồn tại và không được để trống !')
        }
    }

    const verifyOTP = async () => {
        if (OTP === parseInt(value)) {
            navigation.navigate('ForgotPass', {email: email});
        } else {
            setValue('');
            Alert.alert('Mã OTP không khớp !')
        }
    }
    return (
        <KeyboardAwareScrollView>
            <View style={{ paddingHorizontal: PADDING_HORIZONTAL, alignItems: 'center', backgroundColor: BG_COLOR }}>
                <View style={{ marginTop: 100 }}>
                    <Image source={require('../../asset/image/Verification.png')} />
                    <Text style={styles.textOTP}>Mã Xác Minh OTP</Text>
                </View>
                {(!verify) ?
                    <View style={{ width: '100%', alignItems: 'center' }}>
                        <Text style={styles.text}>Chúng tôi sẽ gửi cho bạn một mã xác minh tới email bạn nhập ở dưới</Text>
                        <Text style={styles.textEnterEmail}>Nhập email</Text>
                        <InputItem
                            style={{ borderBottomWidth: 1, borderBottomColor: '#5F98DC', fontSize: 20 }}
                            type='email-address'
                            onChangeText={setEmail}
                            value={email}
                            placeholder="Email">

                        </InputItem>

                        <View style={{ width: '100%' }}>
                            <TouchableOpacity onPress={() => fetchSendMail()}>
                                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#46caf3', '#5cbae3', '#68b1d9']} style={styles.btnLogin} >
                                    <Text style={styles.textLogin}>Gửi OTP</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                    :
                    <View style={{ width: '100%', alignItems: 'center' }}>
                        <Text style={styles.textEnterOTP}>Nhập mã OTP đã được gửi đến</Text>
                        <Text style={styles.textEmail}>{email}</Text>
                        <CodeField
                            {...codeFieldProps}
                            keyboardType="numeric"
                            returnKeyType='none'
                            value={value}
                            cellCount={6}
                            onChangeText={setValue}
                            //render từng ô input number
                            renderCell={({ index, symbol, isFocused }) => (
                                <Text
                                    style={[styles.cell, isFocused && styles.focusCell]}
                                    key={index}
                                    onLayout={getCellOnLayout(index)}>
                                    {symbol}
                                </Text>
                            )}
                        />
                        <View style={{ width: '100%' }}>
                            <TouchableOpacity onPress={() => { verifyOTP() }}>
                                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#46caf3', '#5cbae3', '#68b1d9']} style={styles.btnLogin} >
                                    <Text style={styles.textLogin}>Xác Minh</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>}
            </View>
        </KeyboardAwareScrollView>
    )
}

export default VerificationScreen

const styles = StyleSheet.create({
    textEnterEmail: {
        alignSelf: 'center',
        marginTop: 50,
        color: '#818181',
        fontSize: 15,
        fontFamily: 'Poppins',
        fontWeight: '300',
    },
    textEmail: {
        color: 'black',
        fontSize: 20,
        fontFamily: 'Poppins',
        fontWeight: '600',
    },
    textEnterOTP: {
        color: 'black',
        fontSize: 22,
        fontFamily: 'Poppins',
        fontWeight: '300',
        marginTop: 60
    },
    cell: {
        marginTop: 30,
        marginHorizontal: 10,
        width: 40,
        height: 40,
        lineHeight: 38,
        fontSize: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#5F98DC',
        textAlign: 'center',
    },
    focusCell: {
        borderColor: '#000',
    },
    btnLogin: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 55,
        borderRadius: 5,
        marginTop: 34
    },
    textLogin: {
        color: 'white',
        fontSize: 24,
        fontFamily: 'Poppins',
        fontWeight: '700',
    },

    text: {
        textAlign: 'center',
        color: 'black',
        fontSize: 16,
        fontFamily: 'Poppins',
        fontWeight: '300',
        marginTop: 30
    },
    textOTP: {
        color: 'black',
        fontSize: 30,
        fontFamily: 'Poppins',
        fontWeight: '500',
        marginTop: 50
    },
})