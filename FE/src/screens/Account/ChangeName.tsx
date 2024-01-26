import { StyleSheet, Text, View, Pressable, Image, TextInput, NativeSyntheticEvent, TextInputEndEditingEventData, Alert, } from 'react-native'
import React, { useState } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import Header from '../../component/Header/Header'
import ButtonBottom from '../../component/Button/Button'
import { HEIGHT, PADDING_HORIZONTAL, PADDING_TOP, WIDTH } from '../../utilities/utility'
import { useDispatch, useSelector } from 'react-redux'
import { updateName } from '../../redux/silces/Silces'
import AxiosInstance from '../../Axios/Axios'

const ChangeName = (props: any) => {
    const { setModalVisible } = props.action;
    const [name, setName] = useState<string>('')
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.SlicesReducer.user);

    const handleSaveName = async () => {
        if (name?.trim() === '' ||  name.length > 30) {
            Alert.alert('Thông báo', 'Vui lòng không để trống tên và để tên quá dài');
        } else {
        setModalVisible(false)
        dispatch(updateName(name))
        const responseUser = await AxiosInstance().post(`/users/updateInfoUser`, { _id: user._idUser, name: name });
        const responseUserInfor = await AxiosInstance().post(`/usersInfo/updateInfoUser`, { _id: user._idUser, username: name });
        }
    }

    return (
        <View style={styles.container}>
            <Header hideBack title='Tên' />
            <View style={styles.line}></View>

            <View style={styles.content}>
                <View style={styles.Name}>
                    <Text style={styles.txtName}>Họ và Tên</Text>
                    <View style={styles.input}>
                        <TextInput onEndEditing={(e: NativeSyntheticEvent<TextInputEndEditingEventData>) => { setName(e.nativeEvent.text) }} style={styles.txtInput} defaultValue={user.userName} />
                    </View>
                </View>
            </View>
            <Pressable onPress={handleSaveName} style={{ width: '100%', position: 'absolute', bottom: 15 }}>
                <ButtonBottom title='Lưu' />
            </Pressable>
        </View>
    )
}

export default ChangeName

const styles = StyleSheet.create({
    content: {},
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
        position: 'absolute',
        bottom: 30,
    },

    input: {
        width: '100%',
        height: 50,
        backgroundColor: "#FFFFFF",
        flexDirection: 'row',
        paddingLeft: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: "#9098B1",
        borderRadius: 5,
    },

    txtInput: {
        backgroundColor: "#FFFFFF",
        width: '100%',
        paddingLeft: 10,
        color: '#9098B1',
        fontSize: 14,
        fontFamily: 'Poppins',
        fontWeight: '700',
        lineHeight: 21.60,
        letterSpacing: 0.50,
    },

    txtName: {
        color: '#223263',
        fontSize: 18,
        fontFamily: 'Poppins',
        fontWeight: '700',
        lineHeight: 21,
        letterSpacing: 0.50,
        paddingBottom: 10,
        alignSelf: "flex-start"

    },

    Name: {
        alignItems: 'center',
        marginTop: 20,
        width: '90%',
    },

    line: {
        height: 0.5,
        backgroundColor: '#ADA8A8',
        width: '120%',
        marginTop: 20,
        position: 'relative',
        right: 20
    },

    container: {
        height: HEIGHT * 0.8,
        width: WIDTH,
        alignItems: 'center',
        paddingHorizontal: PADDING_HORIZONTAL,
        paddingTop: PADDING_TOP,
    }
})