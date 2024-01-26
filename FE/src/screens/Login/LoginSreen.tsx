import { Image, StyleSheet, Text, View, Button, Pressable, ScrollView, useWindowDimensions, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import React, { useEffect, useState } from 'react'
import { Checkbox, InputItem } from '@ant-design/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { TouchableOpacity } from 'react-native';

import { RootStackScreenEnumLogin } from '../../component/Root/RootStackLogin';
import AxiosInstance from '../../Axios/Axios';
import { BG_COLOR, HEIGHT, PADDING_HORIZONTAL, PADDING_TOP, WIDTH } from '../../utilities/utility';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import Realm from 'realm';
import { AccessToken, GraphRequest, GraphRequestManager, LoginButton, LoginManager, Profile } from 'react-native-fbsdk-next';
import { useDispatch, useSelector } from 'react-redux';
import { LoginFacebook, LoginGoogle, isLoading, isLogin, updatePass, updateUser } from '../../redux/silces/Silces';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import Spinner from 'react-native-loading-spinner-overlay';
import Loading from '../../component/Loading/Loading';

interface Login {
  email: string;
  password: string;
}
interface User {
  _id: string;
  _idUser: string;
  email: string;
  userName: string | null | undefined;
  cartItem: [];
  avatar: string | null | undefined;
  gender: string;
  birthDay: string;
  address: [],
  phone: string;
}

const LoginScreen = (props: any) => {
  const { navigation }: NativeStackHeaderProps = props;

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [pictureURL, setPictureURL] = useState<any>(null);
  const [checkBoxRemember, setCheckBoxRemember] = useState<boolean>(email && password ? true : false);
  const isLoginState = useSelector((state: any) => state.SlicesReducer.isLogin);
  const dispatch = useDispatch();

  useEffect(() => {
    const getDataStorage = async () => {
      const emailStorage = await AsyncStorage.getItem('email');
      const passwordStorage = await AsyncStorage.getItem('password');
      if (emailStorage && passwordStorage) {
        setEmail(emailStorage);
        setPassword(passwordStorage);

      }
    }
    getDataStorage()
  }, [])


  const handleSubmit = (data: User) => {
    console.log('check');
    dispatch(updateUser({ _id: data._id, _idUser: data._idUser, email: data.email, userName: data.userName, cartItem: data.cartItem, avatar: data.avatar, gender: data.gender, birthDay: data.birthDay, address: data.address, phone: data.phone }))
    dispatch(isLogin(!isLoginState));
  }
  const handlePass = () => {
    dispatch(updatePass(password))
  }
  const handleLogin = () => {
    dispatch(isLogin(false));
  }
  const login = async (info: Login) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@gmail.com$/;

    try {
      if (email == '') {
        Alert.alert('Vui lòng email không được để trống')
      } else if (!emailPattern.test(email)) {
        Alert.alert('Email không hợp lệ')
      } else if (password == '') {
        Alert.alert('Vui lòng nhập mật khẩu')
      } else {
        const result = await AxiosInstance().post('/auth/login', { email: info.email, password: info.password });
        const userInfo = result?.data.user;
        userInfo && dispatch(isLoading(true));
        console.log(userInfo);
        if (result.data.status) {
          const response = await AxiosInstance().post(`/users/getUser/${userInfo._id}`, { name: userInfo.username, email: userInfo.email });
          const user = response.data.data;
          await AsyncStorage.setItem('token', response?.data.access_token);
          user && dispatch(isLoading(false));
          if (user.active) {
            if (userInfo.role === 'user') {
              if (checkBoxRemember) {
                await AsyncStorage.setItem('email', email);
                await AsyncStorage.setItem('password', password);
              }
              handleSubmit({ _id: user._id, _idUser: userInfo._id, email: userInfo.email, userName: userInfo.username, cartItem: user.cartItem, avatar: user.avatar, gender: user.gender, birthDay: user.birthDay, address: user.address, phone: user.phone })
              handlePass()
            } else {
              console.warn("Tài khoản không có quyền đăng nhập !");
            }
          } else {
            console.warn("Tài khoản đã bị khóa !");
          }

        } else {
          console.log(result.data.message);
        }
      }
    } catch (error) {
      console.log('Error: ', error);
    }
    return [];
  }
  const app = new Realm.App({
    id: "application-0-kbkng",
  });
  GoogleSignin.configure({
    webClientId: '866351015855-93hj0ef6h9er4f7er5l3vujtev37tkar.apps.googleusercontent.com',
  });
  // Handle user state changes
  async function onGoogleButtonPress() {
    // Check if your device supports Google Play
    try {
      // Sign into Google
      dispatch(isLoading(true));
      await GoogleSignin.hasPlayServices();
      const { idToken }: any = await GoogleSignin.signIn();
      const userGoogle = await GoogleSignin.signIn();

      // use Google ID token to sign into Realm
      const credential = Realm.Credentials.google({ idToken });
      const userRealm = await app.logIn(credential);
      console.log("signed in as Realm user Google", userRealm.id);
      if (userRealm) {
        const response = await AxiosInstance().post(`/users/getUser/${userRealm.id}`, { name: userGoogle.user.name, email: userGoogle.user.email });
        const user = response.data.data;
        console.log('user', user);

        await AsyncStorage.setItem('token', response?.data.access_token);
        user && dispatch(isLoading(false));
        if (user.active) {
          handleSubmit({ _id: user._id, _idUser: user._idUser, email: userGoogle.user.email, userName: userGoogle?.user?.givenName, cartItem: user.cartItem, avatar: userGoogle?.user.photo, gender: user.gender, birthDay: user.birthDay, address: user.address, phone: user.phone })
          dispatch(LoginGoogle(true));
        } else {
          dispatch(LoginGoogle(false));
          console.warn("Tài khoản đã bị khóa !!")
        }
      } else {
        dispatch(isLoading(false));
        console.log("Login failed");
      }
    } catch (error: any) {
      // handle errors
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        dispatch(isLoading(false));
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        dispatch(isLoading(false));
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        dispatch(isLoading(false));
        // play services not available or outdated
      } else {
        dispatch(isLoading(false));
        // some other error happened
      }
    }
  }
  async function onFaceBookButtonPress() {
    let userFacebook: Profile;
    LoginManager.logInWithPermissions(["public_profile", "email"]).then(
      function (result) {
        if (result.isCancelled) {
          console.log("==> Login cancelled");
        } else {
          dispatch(isLoading(true)),
            AccessToken.getCurrentAccessToken().then(
              (data: any) => {
                Profile.getCurrentProfile().then(
                  function (currentProfile) {
                    console.log("Fb access token", data?.accessToken?.toString());
                    const graphRequest = new GraphRequest('/me', {
                      accessToken: data?.accessToken,
                      parameters: {
                        fields: {
                          string: 'picture.type(large)',
                        },
                      },
                    }, (error, result: any) => {
                      if (error) {
                        console.error(error)
                      } else {
                        setPictureURL(result?.picture.data.url);
                      }
                    })
                    new GraphRequestManager().addRequest(graphRequest).start()
                    if (currentProfile) {
                      userFacebook = currentProfile;
                    }
                  }
                );
                const credentials = Realm.Credentials.facebook(data?.accessToken?.toString());
                app.logIn(credentials).then(async userFace => {
                  console.log(`Logged in with id: ${userFace.id}`);
                  if (userFace) {
                    const response = await AxiosInstance().post(`/users/getUser/${userFace.id}`, { name: userFacebook.name, email: userFacebook.email });
                    console.log(userFacebook);
                    const user = response.data.data;
                    await AsyncStorage.setItem('token', response?.data.access_token);
                    user && dispatch(isLoading(false));
                    if (user.active) {
                      console.log("UserFacebook", user);
                      handleSubmit({
                        _id: user._id, _idUser: user._idUser, email: '', userName: userFacebook.name, cartItem: user.cartItem, avatar: pictureURL, gender: user.gender, birthDay: user.birthDay, address: user.address, phone: user.phone,
                      })
                      dispatch(LoginFacebook(true));
                    } else {
                      dispatch(LoginFacebook(false));
                      console.warn("Tài khoản không bị khóa !!")
                    }
                  } else {
                    console.log("Login failed");
                  }
                });

              }
            )
        }
      },
      function (error) {
        console.log("==> Login fail with error: " + error);
      }
    );
  }

  return (
    <KeyboardAwareScrollView>
      <Loading />

      <View style={{ paddingHorizontal: PADDING_HORIZONTAL, paddingTop: PADDING_TOP, width: WIDTH, backgroundColor: BG_COLOR, height: HEIGHT }}>
        <Pressable style={{ position: 'absolute', left: 10, top: 10 }} onPress={handleLogin}>
          <Icon name='chevron-back-outline' size={28} />
        </Pressable>
        <View style={styles.header}>
          <Image style={{ width: 130, height: 130 }} source={require('../../asset/image/logoTW.png')} />
          <Text style={styles.textHeader}>The Wonder</Text>
        </View>
        <View>
          <Text style={styles.textWelcome}>CHÀO MỪNG TỚI TW-STORE</Text>
        </View>
        <View style={styles.input}>
          <View style={styles.email}>
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
          <View style={styles.password}>
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
        </View>
        <View style={{ flexDirection: 'row', marginTop: 17 }}>
          <Checkbox onChange={(e: any) => setCheckBoxRemember(e.target.checked)} style={{ width: 150 }}><Text style={styles.checkBox}>Nhớ tài khoản</Text></Checkbox>
          <TouchableOpacity onPress={() => navigation.navigate(RootStackScreenEnumLogin.VerificationScreen)} style={{ position: 'absolute', right: 0 }}>
            <Text style={styles.checkBox}>Quên mật khẩu?</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={() => login({ email, password })}>
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#46caf3', '#5cbae3', '#68b1d9']} style={styles.btnLogin} >
              <Text style={styles.textLogin}>Đăng Nhập</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 23, marginTop: 17 }}>
          <View style={{ width: '40%', backgroundColor: '#9098B1', height: 0.5 }} />
          <Text style={styles.textOR}>HOẶC</Text>
          <View style={{ width: '40%', backgroundColor: '#9098B1', height: 0.5 }} />
        </View>
        <View style={{ marginTop: 17 }}>
          <TouchableOpacity onPress={onGoogleButtonPress} style={styles.btnLoginWith}>
            <Icon name='logo-google' size={20} style={{ position: 'absolute', left: 20 }} />
            <Text style={styles.textLoginWith}>Đăng nhập bằng Google</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onFaceBookButtonPress} style={[styles.btnLoginWith, { marginTop: 17 }]}>
            <Icon name='logo-facebook' size={20} style={{ position: 'absolute', left: 20 }} />
            <Text style={styles.textLoginWith}>Đăng nhập bằng FaceBook</Text>
          </TouchableOpacity>

        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 17 }}>
          <Text style={styles.textDontAcc}>Bạn không có tài khoản? </Text>
          <Pressable onPress={() => navigation.navigate(RootStackScreenEnumLogin.RegisterScreen)}>
            <Text style={styles.textRegister}>Đăng ký</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAwareScrollView >
  )
}

export default LoginScreen

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
  password: {
    borderColor: '#E3E8F8',
    borderWidth: 1,
    justifyContent: 'center',
    borderRadius: 5,
    height: 50,
    marginTop: 10
  },
  email: {
    borderColor: '#E3E8F8',
    borderWidth: 1,
    justifyContent: 'center',
    borderRadius: 5,
    height: 50,
  },
  input: {
    marginTop: HEIGHT / 13
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