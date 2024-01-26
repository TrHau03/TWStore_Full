import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, View, Button, Pressable, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Checkbox, InputItem } from '@ant-design/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { TouchableOpacity } from 'react-native';
import { NativeStackHeaderProps, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native';
import { RootStackParamListLogin, RootStackScreenEnumLogin } from '../../component/Root/RootStackLogin';
import AxiosInstance from '../../Axios/Axios';
import { BG_COLOR, HEIGHT, PADDING_HORIZONTAL, PADDING_TOP } from '../../utilities/utility';
import Loading from '../../component/Loading/Loading';
import { useDispatch } from 'react-redux';
import { isLoading } from '../../redux/silces/Silces';



interface Register {
    name: string,
    email: string,
    password: string,
    passwordAgain: string
}


const RegisterScreen = (props: any) => {
    const { navigation }: NativeStackHeaderProps = props;

    const dispatch = useDispatch();
    useEffect(() => {
        const setData = async () => {
            await AsyncStorage.setItem('checkSlide', 'true');
        }
        setData();
    }, [])
    const [name, setName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordAgain, setPasswordAgain] = useState<string>('');


    const register = async (user: Register) => {
        const emailPattern = /^[a-zA-Z0-9._-]+@gmail.com$/;

        try {
            console.log('register', user);
            if (name == '') {
                Alert.alert("Vui lòng tên không được để trống");
            } else if (email == '') {
                Alert.alert("Vui lòng email không được để trống");
            } else if (!emailPattern.test(email)) {
                Alert.alert("Email không hợp lệ");
            } else if (password == '') {
                Alert.alert("Vui lòng mật khẩu không được để trống");
            } else if (passwordAgain == '') {
                Alert.alert("Vui lòng nhập lại mật khẩu không được để trống");
            } else {
                if (user.password != user.passwordAgain) {
                    return Alert.alert('Thông báo', 'Mật khẩu không trùng khớp!', [
                        { text: 'OK' }
                    ]);;
                }
                dispatch(isLoading(true));
                const result = await AxiosInstance().post('/usersInfo/RegisterUser', { username: user.name, email: user.email, password: user.password });
                if (result) {
                    dispatch(isLoading(false));
                    navigation.navigate(RootStackScreenEnumLogin.LoginScreen);
                }
            }
        } catch (error) {
            console.log('getNews Error: ', error);
        }
    }
    return (
        <View>
            <Loading />
            <View style={{ paddingHorizontal: PADDING_HORIZONTAL, paddingTop: PADDING_TOP, backgroundColor: BG_COLOR, height: HEIGHT }}>
                <View style={styles.header}>
                    <Image style={{ width: 130, height: 130 }} source={require('../../asset/image/logoTW.png')} />
                    <Text style={styles.textHeader}>The Wonder</Text>
                </View>
                <View>
                    <Text style={styles.textWelcome}>ĐĂNG KÝ TÀI KHOẢN</Text>
                </View>
                <View style={styles.input}>
                    <View style={styles.textinput}>
                        <InputItem
                            style={{ fontSize: 16 }}
                            value={name}
                            onChange={(value: any) => {
                                setName(value)
                            }}
                            labelNumber={2}
                            placeholder="Nhập đầy đủ họ và tên">
                            <Icon name="person-outline" size={25} color="#9098B1" />
                        </InputItem>
                    </View>
                    <View style={styles.textinput}>
                        <InputItem
                            style={{ fontSize: 16 }}
                            value={email}
                            onChange={(value: any) => {
                                setEmail(value)
                            }}
                            labelNumber={2}
                            placeholder="Nhập email">
                            <Icon name="mail-outline" size={25} color="#9098B1" />
                        </InputItem>
                    </View>
                    <View style={styles.textinput}>
                        <InputItem
                            type='password'
                            style={{ fontSize: 16 }}
                            value={password}
                            onChange={(value: any) => {
                                setPassword(value)
                            }}
                            labelNumber={2}
                            placeholder="Nhập mật khẩu">
                            <Icon name="lock-closed-outline" size={25} color="#9098B1" />
                        </InputItem>
                    </View>
                    <View style={styles.textinput}>
                        <InputItem
                            type='password'
                            style={{ fontSize: 16 }}
                            value={passwordAgain}
                            onChange={(value: any) => {
                                setPasswordAgain(value)
                            }}
                            labelNumber={2}
                            placeholder="Nhập lại mật khẩu">
                            <Icon name="lock-closed-outline" size={25} color="#9098B1" />
                        </InputItem>
                    </View>
                </View>
                <View>
                    <TouchableOpacity onPress={() => register({ name, email, password, passwordAgain })} >
                        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#46caf3', '#5cbae3', '#68b1d9']} style={styles.btnLogin} >
                            <Text style={styles.textLogin}>Đăng Ký</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 30 }}>
                    <Text style={styles.textDontAcc}>Bạn đã có tài khoản? </Text>
                    <Pressable onPress={() => navigation.navigate('LoginScreen')}>
                        <Text style={styles.textRegister}>Đăng Nhập</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

export default RegisterScreen

const styles = StyleSheet.create({
    textRegister: {
        color: '#1C1C1C',
        fontSize: 15,
        fontFamily: 'Poppins',
        fontWeight: '700',
        lineHeight: 18,
        letterSpacing: 0.50,
    },
    textDontAcc: {
        color: '#9098B1',
        fontSize: 15,
        fontFamily: 'Poppins',
        fontWeight: '400',
        lineHeight: 18,
        letterSpacing: 0.50,
    },
    textLoginWith: {
        color: '#9098B1',
        fontSize: 16,
        fontFamily: 'Poppins',
        fontWeight: '700',
        lineHeight: 25.20,
        letterSpacing: 0.50,
    },
    btnLoginWith: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 55,
        borderWidth: 0.5,
        borderColor: '#B1B7CA',
        borderRadius: 5,
    },
    textOR: {
        color: '#9098B1',
        fontSize: 14,
        fontFamily: 'Poppins',
        fontWeight: '700',
        lineHeight: 21,
        letterSpacing: 0.07,
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
    textForgot: {
        alignItems: 'flex-end'
    },
    checkBox: {
        color: '#1C1C1C',
        fontSize: 15,
        fontFamily: 'Poppins',
        fontWeight: '700',
        lineHeight: 18,
        letterSpacing: 0.50,
    },

    textinput: {
        borderColor: '#E3E8F8',
        borderWidth: 1,
        justifyContent: 'center',
        borderRadius: 5,
        height: 50,
        marginTop: 20
    },
    input: {
        marginTop: 35
    },
    textWelcome: {
        color: '#223263',
        fontSize: 24,
        fontFamily: 'Poppins',
        fontWeight: '700',
        lineHeight: 36,
        letterSpacing: 0.50,
    },
    textHeader: {
        color: '#223263',
        fontSize: 30,
        fontFamily: 'Poppins',
        fontWeight: '700',
        lineHeight: 36,
        letterSpacing: 0.50,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    }
})