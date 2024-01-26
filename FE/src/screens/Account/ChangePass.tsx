import { StyleSheet, Text, View, Pressable, Image, TextInput, NativeSyntheticEvent, TextInputEndEditingEventData, Alert, } from 'react-native'
import React, { useState } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Modal, Provider } from '@ant-design/react-native'
import ButtonBottom from '../../component/Button/Button'
import Icon from 'react-native-vector-icons/Ionicons'
import { HEIGHT, PADDING_HORIZONTAL, PADDING_TOP } from '../../utilities/utility'
import AxiosInstance from '../../Axios/Axios'
import { useDispatch, useSelector } from 'react-redux'
import { updatePass } from '../../redux/silces/Silces'

const ChangePass = (props: any) => {
    const { setModalVisible } = props.action;
    const [oldPass, setOldPass] = useState<string>('');
    const [newPass, setNewPass] = useState<string>('');
    const [againPass, setAgainPass] = useState<string>('');
    const user = useSelector((state: any) => state.SlicesReducer.user);
    const dispatch = useDispatch();

    const handleSaveChangePass = async () => {
        if (oldPass.trim() === '' || newPass.trim() === '' || againPass.trim() === '') {
            return Alert.alert('Xin vui lòng không để trống các ô')
        } else {
            if (user.password === oldPass) {
                if (newPass === againPass) {
                    setModalVisible(false)
                    dispatch(updatePass(newPass))
                    const response = await AxiosInstance().post(`/usersInfo/ChangePassword/`, { email: user.email, oldPassword: oldPass, newPassword: newPass });
                } else {
                    Alert.alert('Mật khẩu không khớp');
                }
            } else {
                return Alert.alert('Mật khẩu cũ không đúng')
            }
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.txtTitle}>Đổi Mật Khẩu</Text>
            <View style={styles.line}></View>
            <Text style={styles.txtEmail}>Mật khẩu cũ</Text>
            <View style={styles.input}>
                <Icon name='lock-closed-sharp' size={25} color={'#5c5c5c'} />
                <TextInput secureTextEntry={true} style={styles.txtInput} onEndEditing={(e: NativeSyntheticEvent<TextInputEndEditingEventData>) => { setOldPass(e.nativeEvent.text) }} />
            </View>
            <Text style={styles.txtEmail}>Mật khẩu mới</Text>
            <View style={styles.input}>
                <Icon name='lock-closed-sharp' size={25} color={'#5c5c5c'} />
                <TextInput secureTextEntry={true} style={styles.txtInput} onEndEditing={(e: NativeSyntheticEvent<TextInputEndEditingEventData>) => { setNewPass(e.nativeEvent.text) }} />
            </View>
            <Text style={styles.txtEmail}>Nhập lại mật khẩu mới</Text>
            <View style={styles.input}>
                <Icon name='lock-closed-sharp' size={25} color={'#5c5c5c'} />
                <TextInput secureTextEntry={true} style={styles.txtInput} onEndEditing={(e: NativeSyntheticEvent<TextInputEndEditingEventData>) => { setAgainPass(e.nativeEvent.text) }} />
            </View>
            <Pressable onPress={handleSaveChangePass} style={{ width: '100%', position: 'absolute', bottom: 15, alignSelf: 'center' }}>
                <ButtonBottom title='Lưu' />
            </Pressable>
        </View>

    )
}

export default ChangePass

const styles = StyleSheet.create({
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
        width: "100%",
        alignSelf: 'center',
        position: 'absolute',
        bottom: 100,
    },

    input: {
        height: 50,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#9098B1",
        borderRadius: 5,
        flexDirection: 'row',
        paddingLeft: 10,
        alignItems: 'center',
    },

    txtInput: {
        color: '#9098B1',
        fontSize: 14,
        fontFamily: 'Poppins',
        fontWeight: '700',
        lineHeight: 21.60,
        letterSpacing: 0.50,
        marginLeft: 10,
        width: '100%',
    },

    txtEmail: {
        color: '#223263',
        fontSize: 18,
        fontFamily: 'Poppins',
        fontWeight: '700',
        lineHeight: 21,
        letterSpacing: 0.50,
        marginBottom: 10,
        alignSelf: 'flex-start',
        marginTop: 10,
    },

    line: {
        height: 0.5,
        backgroundColor: '#ADA8A8',
        width: '120%',
        marginTop: 20,
        position: 'relative',
        right: 20
    },

    txtTitle: {
        color: '#223263',
        fontSize: 22,
        fontFamily: 'Poppins',
        fontWeight: '700',
        lineHeight: 24,
        letterSpacing: 0.08,
        paddingLeft: 10,
        alignSelf: 'center'
    },
    container: {
        height: HEIGHT * 0.8,
        paddingHorizontal: PADDING_HORIZONTAL,
        paddingTop: PADDING_TOP,
    }
})