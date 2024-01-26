import { Image, StyleSheet, Text, View, Pressable, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Animatable from 'react-native-animatable';
import Header from '../../component/Header/Header'
import { PropsAccount } from '../../component/Navigation/Props'
import { uid } from 'uid'
import Icon from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import ChangePass from './ChangePass'
import { Modal, Provider } from '@ant-design/react-native'
import ButtonBottom from '../../component/Button/Button'
import Birthday from './Birthday'
import Email from './Email'
import Phone from './Phone'
import Gender from './Gender'
import ChangeName from './ChangeName';
import { BG_COLOR, PADDING_HORIZONTAL, PADDING_TOP } from '../../utilities/utility';
import {useSelector } from 'react-redux';
import { LoginFacebook, LoginGoogle, isLogin } from '../../redux/silces/Silces';


const ProfileScreen = ({ navigation }: PropsAccount) => {
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [nameModal, setNameModal] = useState<string>('');
    const user = useSelector((state: any) => state.SlicesReducer.user);
    const checkLogin = useSelector((state: any) => (state.SlicesReducer.LoginGoogle || state.SlicesReducer.LoginFacebook) ? true : false);
    return (
        <Provider>
            <Modal
                transparent={false}
                visible={modalVisible}
                animationType="slide-up"
                onRequestClose={() => true}
            >
                <View style={{ height: '100%' }}>
                    {
                        (nameModal == 'ChangeGender') ?
                            <Gender action={{ setModalVisible }}/> :
                            (nameModal == 'ChangeBirthDay') ?
                                <Birthday action={{ setModalVisible }} /> :
                                (nameModal == 'ChangeEmail') ?
                                    <Email action={{ setModalVisible }}/> :
                                    (nameModal == 'ChangePhone') ?
                                        <Phone action={{ setModalVisible }} /> :
                                        (nameModal == 'ChangePassword') ?
                                            <ChangePass action={{ setModalVisible }}/> :
                                            <ChangeName action={{ setModalVisible }}/>
                    }
                    <Animatable.View animation={'bounceIn'} style={{ paddingHorizontal: PADDING_HORIZONTAL, position: 'relative', bottom: 10 }}>
                        <Pressable onPress={() => { setModalVisible(false) }}>
                            <ButtonBottom title='Hủy' />
                        </Pressable>
                    </Animatable.View>
                </View>
            </Modal>
            <View style={styles.container}>
                <View>
                    <Header title='Hồ Sơ' navigation={navigation} />
                </View>
                <View style={styles.line}></View>

                <View style={styles.profile}>
                    <Image style={styles.img} source={{ uri: user.avatar ? user.avatar : 'https://scontent.fsgn19-1.fna.fbcdn.net/v/t1.30497-1/84628273_176159830277856_972693363922829312_n.jpg?stp=c15.0.50.50a_cp0_dst-jpg_p50x50&_nc_cat=1&ccb=1-7&_nc_sid=810bd0&_nc_ohc=1Peipfkz73QAX9Opczx&_nc_ht=scontent.fsgn19-1.fna&edm=AHgPADgEAAAA&oh=00_AfA0ykMKLDzMu0UJN8-3Ww8udPTFOHhS9J3niaG790lIkA&oe=657EF4D9' }} />
                    <View style={styles.name}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                            <Text style={styles.txtName}>{user.userName}</Text>
                            {checkLogin ? <></> :
                                <Pressable onPress={() => { setModalVisible(true), setNameModal('ChangeName') }}>
                                    <MaterialCommunityIcons name='account-edit-outline' size={20} />
                                </Pressable>}
                        </View>
                    </View>
                </View>

                <View style={styles.Content}>
                    <View style={styles.Content_left}>
                        <Icon name='male-female' size={30} color={'#444444'} />
                        <Text style={styles.txtContent}>Giới tính</Text>
                    </View>
                    <View style={styles.Content_right}>
                        <Text style={styles.txtHint}>{user.gender}</Text>
                        <Pressable onPress={() => { setModalVisible(true); setNameModal('ChangeGender') }}>
                            <Icon name='chevron-forward-outline' size={25} color={'#9098B1'} />
                        </Pressable>
                    </View>
                </View>

                <View style={styles.Content}>
                    <View style={styles.Content_left}>
                        <Icon name='calendar-sharp' size={30} color={'#444444'} />
                        <Text style={styles.txtContent}>Ngày sinh</Text>
                    </View>
                    <View style={styles.Content_right}>
                        <Text style={styles.txtHint}>{user.birthDay}</Text>
                        <Pressable onPress={() => { setModalVisible(true); setNameModal('ChangeBirthDay') }}>
                            <Icon name='chevron-forward-outline' size={25} color={'#9098B1'} />
                        </Pressable>
                    </View>
                </View>

                <View style={styles.Content}>
                    <View style={styles.Content_left}>
                        <Icon name='mail-unread' size={30} color={'#444444'} />
                        <Text style={styles.txtContent}>Email</Text>
                    </View>
                    <View style={styles.Content_right}>
                        <Text style={styles.txtHint}>{user.email}</Text>
                        <Pressable onPress={() => { !checkLogin && setModalVisible(true); !checkLogin && setNameModal('ChangeEmail') }}>
                            {!checkLogin && <Icon name='chevron-forward-outline' size={25} color={'#9098B1'} />}
                        </Pressable>
                    </View>
                </View>

                <View style={styles.Content}>
                    <View style={styles.Content_left}>
                        <Icon name='phone-portrait' size={30} color={'#444444'} />
                        <Text style={styles.txtContent}>Số điện thoại</Text>
                    </View>
                    <View style={styles.Content_right}>
                        <Text style={styles.txtHint}>{user.phone}</Text>
                        <Pressable onPress={() => { setModalVisible(true); setNameModal('ChangePhone') }}>
                            <Icon name='chevron-forward-outline' size={25} color={'#9098B1'} />
                        </Pressable>
                    </View>
                </View>
                {checkLogin ? <></> :
                    <View style={styles.Content}>
                        <View style={styles.Content_left}>
                            <Icon name='keypad' size={30} color={'#444444'} />
                            <Text style={styles.txtContent}>Đổi mật khẩu</Text>
                        </View>
                        <View style={styles.Content_right}>
                            <Text style={styles.txtHint}>*********</Text>
                            <Pressable onPress={() => { setModalVisible(true); setNameModal('ChangePassword') }}>
                                <Icon name='chevron-forward-outline' size={25} color={'#9098B1'} />
                            </Pressable>
                        </View>
                    </View>}
            </View >
        </Provider>

    )
}

export default ProfileScreen

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
    },
    modalView: {
        width: '80%',
        height: '60%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },







    txtContent: {
        color: '#223263',
        fontSize: 16,
        fontFamily: 'Poppins',
        fontWeight: '700',
        letterSpacing: 0.50,
        paddingLeft: 10,
        alignSelf: 'center',
    },
    txtHint: {
        color: '#9098B1',
        fontSize: 14,
        fontFamily: 'Poppins',
        fontWeight: '400',
        lineHeight: 21.60,
        letterSpacing: 0.50,
        paddingRight: 5,
    },

    Content_right: {
        flexDirection: 'row',
    },

    Content_left: {
        flexDirection: 'row',
    },

    Content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 60,
    },

    txtUsername: {
        color: '#9098B1',
        fontSize: 12,
        fontFamily: 'Poppins',
        fontWeight: '400',
        lineHeight: 21.60,
        letterSpacing: 0.50,
        paddingTop: 5,
    },

    txtName: {
        color: '#223263',
        fontSize: 20,
        fontFamily: 'Poppins',
        fontWeight: '700',
        lineHeight: 21,
        letterSpacing: 0.50,
    },
    name: {
        paddingLeft: 20,
    },

    img: {
        width: 80,
        height: 80,
        borderRadius: 50,
    },

    profile: {
        flexDirection: 'row',
        height: 120,
        alignItems: 'center',
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
        paddingTop: PADDING_TOP,
        paddingHorizontal: PADDING_HORIZONTAL,
        backgroundColor: BG_COLOR
    }
})