import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import { PropsAccount } from '../../component/Navigation/Props'
import { HEIGHT, PADDING_HORIZONTAL, PADDING_TOP, WIDTH } from '../../utilities/utility'
import ButtonBottom from '../../component/Button/Button'
import { useDispatch, useSelector } from 'react-redux'
import { cartEmpty, isLoading, isLogin, updateUser } from '../../redux/silces/Silces'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { LoginManager } from 'react-native-fbsdk-next'
import Loading from '../../component/Loading/Loading'
import { RootStackScreenEnumLogin } from '../../component/Root/RootStackLogin'


const AccountScreen = ({ navigation }: any) => {
  const isUser = useSelector((state: any) => state.SlicesReducer.user._idUser);
  const isLoginState = useSelector((state: any) => state.SlicesReducer.isLogin);

  const dispatch = useDispatch();

  const handleLogout = async ({ navigation }: any) => {
    dispatch(isLoading(true));
    await GoogleSignin.signOut();
    await LoginManager.logOut();
    navigation.navigate('Home', { screen: 'HomesScreen' });
    setTimeout(async () => {
      dispatch(updateUser({ _id: '', _idUser: '', email: '', userName: '', cartItem: [], avatar: '', gender: '', birthDay: '', address: null, phone: '' }));
      dispatch(isLoading(false));
    }, 1000);
  }
  const handleLogin = () => {
    dispatch(isLogin(true));
  }
  return (
    <View style={[styles.container,]}>
      <Loading />
      <Text style={styles.title}>Tài Khoản</Text>
      <View style={styles.line}></View>

      <View>
        {data.map((item) =>
          <TouchableOpacity disabled={isUser == '' ? true : false} style={styles.button} key={item.id} onPress={() => navigation?.navigate(item.screen)}>
            <Icon name={item.icon} size={25} color={'#525252'} />
            <Text style={styles.txtbtn}>{item.name}</Text>
          </TouchableOpacity>
        )}

      </View>
      {isUser == '' ?
        <Pressable onPress={() => handleLogin()} style={{ width: '100%', position: 'absolute', bottom: 120, alignSelf: 'center' }}>
          <ButtonBottom title='Đăng nhập' />
        </Pressable> :
        <Pressable onPress={() => { handleLogout({ navigation }) }} style={{ width: '100%', position: 'absolute', bottom: 120, alignSelf: 'center' }}>
          <ButtonBottom title='Đăng Xuất' />
        </Pressable>}
    </View>
  )
}

export default AccountScreen

const styles = StyleSheet.create({
  txtbtn: {
    color: '#223263',
    fontSize: 16,
    fontFamily: 'Poppins',
    fontWeight: '700',
    lineHeight: 18,
    letterSpacing: 0.50,
    paddingLeft: 15,
  },

  button: {
    flexDirection: 'row',
    width: '100%',
    height: 60,
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
  title: {
    color: '#223263',
    fontSize: 20,
    fontFamily: 'Poppins',
    fontWeight: '700',
    lineHeight: 24,
    letterSpacing: 0.08,
  },
  container: {
    width: WIDTH,
    height: HEIGHT,
    paddingTop: PADDING_TOP,
    paddingHorizontal: PADDING_HORIZONTAL
  }
})

const data = [
  {
    id: 1,
    name: 'Hồ sơ',
    icon: 'person-sharp',
    screen: 'ProfileScreen'
  },
  {
    id: 2,
    name: 'Đơn hàng',
    icon: 'bag-check-sharp',
    screen: 'OrderScreen'

  },
  {
    id: 3,
    name: 'Địa chỉ',
    icon: 'location-sharp',
    screen: 'AddressScreen'

  }
]