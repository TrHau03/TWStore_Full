import { StyleSheet, Text, View, Pressable, Image, TextInput } from 'react-native'
import React, { useState } from 'react'
import { SelectList } from 'react-native-dropdown-select-list'
import Header from '../../component/Header/Header'
import ButtonBottom from '../../component/Button/Button'
import { HEIGHT, PADDING_HORIZONTAL, PADDING_TOP, WIDTH } from '../../utilities/utility'
import { useDispatch, useSelector } from 'react-redux'
import { updateGender } from '../../redux/silces/Silces'
import AxiosInstance from '../../Axios/Axios'



const Gender = (props: any) => {
    const dispatch = useDispatch();
    const { setModalVisible } = props.action;
    const [gender, setGender] = useState<string>('');
    
    const user = useSelector((state: any) => state.SlicesReducer.user);



    const listGender = [
        { key: '1', value: 'Nam' },
        { key: '2', value: 'Nữ' },
        { key: '3', value: 'Khác' },
    ]
    

    const handleSaveGender = async () => {
        setModalVisible(false)
        dispatch(updateGender(gender))
        const response = await AxiosInstance().post(`/users/updateInfoUser/`, { _id: user._idUser, gender: gender });
    }


    return (
        <View style={styles.container}>
            <Header hideBack={true} title='Giới Tính' />

            <View style={styles.line}></View>

            <View style={styles.Gender}>
                <Text style={styles.txtGender}>Chọn giới tính</Text>
                <SelectList
                    setSelected={setGender}
                    data={listGender}
                    save="value"
                    boxStyles={{ borderRadius: 5 }}
                    defaultOption={{ key: user.gender, value: user.gender }}
                    search={false}
                    inputStyles={{ width: '95%', fontSize: 16 }}
                    dropdownTextStyles={{ fontSize: 16 }}
                    dropdownItemStyles={{ borderBottomWidth: 0.5, borderBottomColor: '#b0b0b0', marginBottom: 5 }}
                    dropdownStyles={{ height: 150 }}
                />
            </View>


            <Pressable onPress={handleSaveGender} style={{ width: '100%', position: 'absolute', bottom: 15 }}>
                <ButtonBottom title='Lưu' />
            </Pressable>
        </View>
    )
}

export default Gender

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
        width: "90%",
        alignSelf: 'center',
        position: 'absolute',
        bottom: 30,
    },

    input: {
        width: '100%',
        height: 50,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#9098B1",
        borderRadius: 5,
    },

    txtGender: {
        color: '#223263',
        fontSize: 18,
        fontFamily: 'Poppins',
        fontWeight: '700',
        lineHeight: 21,
        letterSpacing: 0.50,
        paddingBottom: 10,
        alignSelf: 'flex-start'
    },

    Gender: {
        marginTop: 20,
        alignItems: 'center',
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

    txtTitle: {
        color: '#223263',
        fontSize: 16,
        fontFamily: 'Poppins',
        fontWeight: '700',
        lineHeight: 24,
        letterSpacing: 0.08,
        paddingLeft: 10,
    },
    title: {
        flexDirection: 'row',
        paddingLeft: 20,
    },

    container: {
        height: HEIGHT * 0.8,
        width: WIDTH,
        alignItems: 'center',
        paddingHorizontal: PADDING_HORIZONTAL,
        paddingTop: PADDING_TOP,
    }
})