import { StyleSheet, Text, View, ScrollView, Image, Pressable, FlatList, Alert, TextInput, Linking, AppState } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { PropsCart } from '../../component/Navigation/Props'
import ButtonBottom from '../../component/Button/Button'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BG_COLOR, HEIGHT, PADDING_HORIZONTAL, WIDTH } from '../../utilities/utility';
import { useDispatch, useSelector } from 'react-redux';
import { RouteProp, useFocusEffect, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list'
import AxiosInstance from '../../Axios/Axios'
import { NativeStackHeaderProps } from '@react-navigation/native-stack'
import { RootStackScreenEnumAccount } from '../../component/Root/RootStackAccount'
import axios from 'axios'
import moment from 'moment';
import crypto from 'crypto-js';
import qs from 'qs'
import { cartEmpty } from '../../redux/silces/Silces'
import { RootStackScreenEnumHome } from '../../component/Root/RootStackHome'
import { NumericFormat } from 'react-number-format'


type CartDetailRouteParams = {
    CartDetail: {
        Level?: string;
        totalAfterShipping?: number;
        generalPriceAfterShipping: number;
    };
};


const CartDetail = ({ navigation }: NativeStackHeaderProps) => {
    const listDataCart = useSelector((state: any) => {
        return state.SlicesReducer.user.cartItem;
    });
    const listProduct = listDataCart?.map((item: any) => {
        return {
            quantityProduct: item.quantity,
            productID: item.productID._id,
            sizeID: item.sizeProduct._id,
            colorID: item.colorProduct._id,
        }
    });
    const user = useSelector((state: any) => state.SlicesReducer.user);
    const address = useSelector((state: any) => state.SlicesReducer.user.address);

    const appState = useRef(AppState.currentState);
    const [checkOrder, setCheckOrder] = useState<any>();
    const [focusScreen, setFocusScreen] = useState<boolean>(false);


    const route = useRoute<RouteProp<CartDetailRouteParams, 'CartDetail'>>();
    const [totalAfterShipping, setTotalAfterShipping] = useState<number>(0);

    const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(true);
    const [isReceiverNameValid, setIsReceiverNameValid] = useState(true);
    const [paymentMethods, setPaymentMethods] = useState<{ _id: number, name: string }[]>([]);

    const [receiverName, setReceiverName] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [selectedAddress, setSelectedAddress] = useState<string>('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<any>();
    const dispatch = useDispatch();


    const handleReceiverNameChange = (text: string) => {
        setReceiverName(text);
        setIsReceiverNameValid(text.trim() !== '');
    };

    const handlePhoneNumberChange = (text: string) => {
        setPhoneNumber(text);
        setIsPhoneNumberValid(isValidPhoneNumber(text));
    };

    const handleOrderSubmit = () => {
        if (receiverName.trim() === '') {
            Alert.alert('Thông báo', 'Vui lòng nhập tên người nhận hàng');
            return;
        }

        if (phoneNumber.trim() === '' || !isValidPhoneNumber(phoneNumber)) {
            Alert.alert('Thông báo', 'Vui lòng nhập số điện thoại hợp lệ');
            return;
        }

        if (!selectedPaymentMethod) {
            Alert.alert('Thông báo', 'Vui lòng chọn phương thức thanh toán');
            return;
        }
        console.log(selectedAddress);

        if (Number(selectedAddress) == 1) {
            Alert.alert('Thông báo', 'Vui lòng chọn địa chỉ giao hàng');
            return;
        }

        checkPaymentMethod();
        // Thêm các bước xử lý tiếp theo sau khi kiểm tra thành công
    };



    const isValidPhoneNumber = (number: string) => {
        const phoneNumberRegex = /((09|03|07|08|05)+([0-9]{8})\b)/;
        return phoneNumberRegex.test(number);
    };

    useEffect(() => {
        setTotalAfterShipping(route.params?.totalAfterShipping ?? 0);
    }, [route.params]);


    useEffect(() => {
        const fetchPayment = async () => {
            try {
                const response = await AxiosInstance().get(`payment/getAllPaymentMethod`);
                const paymentMethods = response.data.data;
                setPaymentMethods(paymentMethods && Array.isArray(paymentMethods) ? paymentMethods : []);
            } catch (error) {
                console.error('Error fetching payment methods:', error);
            }
        };

        fetchPayment();
    }, []);
    const config = {
        app_id: "2553",
        key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
        key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
        endpoint: "https://sb-openapi.zalopay.vn/v2/create",
        endpoint2: "https://sb-openapi.zalopay.vn/v2/query"
    };

    const embed_data = {};
    const items = [{}];
    const transID = Math.floor(Math.random() * 1000000);

    // tao don hang
    const checkOutZaloPay = async () => {
        try {
            const order = {
                app_id: config.app_id,
                app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
                app_user: "Thewonder",
                app_time: Date.now(),
                item: JSON.stringify(items),
                embed_data: JSON.stringify(embed_data),
                amount: totalAfterShipping.toString(),
                description: `Zalopay - Thanh toán đơn hàng #${transID}`,
                bank_code: "zalopayapp",
                mac: "",
            };
            const data = config.app_id + "|"
                + order.app_trans_id + "|"
                + order.app_user + "|"
                + order.amount + "|"
                + order.app_time + "|"
                + order.embed_data + "|"
                + order.item;
            order.mac = crypto.HmacSHA256(data, config.key1).toString();
            const postData = {
                app_id: order.app_id,
                app_trans_id: order.app_trans_id,
                mac: "",
            }
            const data2 = postData.app_id + "|" + postData.app_trans_id + "|" + config.key1;
            postData.mac = crypto.HmacSHA256(data2, config.key1).toString();
            const res = await axios.post(config.endpoint, null, { params: order });
            const linkk = res.data.order_url;
            Linking.openURL(linkk);
            setCheckOrder(postData);

        } catch (err) {
            console.error(err);
        }
    };
    // check trang thai don hang
    const getStatusPayment = async () => {
        const postConfig = {
            method: 'post',
            url: config.endpoint2,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: qs.stringify(checkOrder)
        };

        try {
            const response = await axios(postConfig);
            console.log(JSON.stringify(response.data));
            if (response.data.return_code === 1) {
                const check = await AxiosInstance().post('/order/addOrder',
                    {
                        listProduct: listProduct,
                        userID: user._id,
                        voucher: route.params.Level,
                        phoneReceiver: phoneNumber,
                        nameReceiver: receiverName,
                        addressDelivery: selectedAddress,
                        payment: selectedPaymentMethod.name,
                        totalPrice: totalAfterShipping.toString(),
                    });
                if (check) {
                    updateCart();
                    Alert.alert('Thông báo', 'Thanh toán thành công');
                }
            }
            else {
                Alert.alert('Thông báo', 'Thanh toán chưa được thực hiện');
                return;
            };

        } catch (error) {
            console.log(error);
        }
    }

    const checkPaymentMethod = () => {
        selectedPaymentMethod.name === 'ZaloPay' ? checkOutZaloPay() : cod()
    }
    const cod = async () => {
        const check = await AxiosInstance().post('/order/addOrder',
            {
                listProduct: listProduct,
                userID: user._id,
                voucher: route.params.Level,
                phoneReceiver: phoneNumber,
                nameReceiver: receiverName,
                addressDelivery: selectedAddress,
                payment: selectedPaymentMethod.name,
                totalPrice: totalAfterShipping.toString(),
            });
        if (check) {
            updateCart();
            Alert.alert('Thông báo', 'Đặt hàng thành công');
        }
    }
    const updateCart = async () => {
        dispatch(cartEmpty([]));
        await AxiosInstance().post('/users/updateInfoUser', { _id: user._idUser, cartItem: [] });
        listProduct.map(async (item: any) => {
            await AxiosInstance().put(`/product/updateQuantityProduct/${item.productID}`, { quantityOfOrder: item.quantityProduct });
        })
        navigation.navigate('Home', { screen: RootStackScreenEnumHome.HomeScreen })
    }

    if (focusScreen === true) {
        getStatusPayment();
        setFocusScreen(false);
    }
    useFocusEffect(
        React.useCallback(() => {
            const subscription = AppState.addEventListener('change', nextAppState => {
                if (
                    appState.current.match(/inactive|background/) &&
                    nextAppState === 'active'
                ) {
                    setFocusScreen(true);
                }
                appState.current = nextAppState;
            });
            return () => {
                subscription.remove();
            };
        }, [])
    );
    const RenderItem = ({ item }: any) => {
        return (
            <View style={styles.itemCart}>
                <View>
                    {item.productID.image[0] !== null && (
                        <Image source={{ uri: item.productID.image[0] }} style={{ width: 72, height: 72 }} />
                    )}
                </View>
                <View style={{ flexDirection: 'column', height: '100%' }}>
                    <View style={styles.topItem}>
                        <View style={{ width: '80%', gap: 5 }}>
                            <Text style={styles.textTitleItem}>{item.productID.productName.length < 20 ? item.productID.productName : item.productID.productName.substring(0, 20) + "..."}</Text>
                            <View style={{ flexDirection: 'row', columnGap: 10, alignItems: 'center' }}>
                                <Text style={styles.textTitleItem}>Size: {item.sizeProduct.name}</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.textTitleItem}>Color: </Text>
                                    <View style={{ width: 20, height: 20, backgroundColor: `${item.colorProduct.code}`, borderRadius: 50 }}></View>
                                </View>
                            </View>
                        </View>

                    </View>
                    <View style={styles.bottomItem}>
                        <NumericFormat displayType={'text'} value={Number(item.productID.price)} allowLeadingZeros thousandSeparator="," renderText={(formattedValue: any) => <Text style={styles.textPrice}>{formattedValue + 'đ'} </Text>} />
                    </View>
                </View>
            </View >

        );
    };

    const RadioButton = ({ selected }: { selected: boolean }) => {
        return (
            <View style={[styles.radioButton, { backgroundColor: selected ? '#40BFFF' : 'transparent' }]}>
                {selected && <View style={styles.innerCircle} />}
            </View>
        );
    };

    const RenderPaymentItem = ({ paymentMethod }: { paymentMethod: any }) => {
        const [isSelected, setIsSelected] = useState(false);

        const handlePress = () => {
            setPaymentMethods((prevMethods) => {
                const updatedMethods = prevMethods.map((method) => ({
                    ...method,
                    isSelected: method === paymentMethod,

                }));
                console.log(paymentMethod.name);

                return updatedMethods;

            });
            setIsSelected(true);
            setSelectedPaymentMethod(paymentMethod);
        };

        return (
            <Pressable onPress={handlePress}>
                <View style={styles.paymentItemContainer}>
                    <RadioButton selected={paymentMethod.isSelected} />
                    {paymentMethod.linkIcon ? (
                        <Image source={{ uri: paymentMethod.linkIcon }} style={styles.imagePayment} />
                    ) : null}
                    <Text style={{ marginLeft: 10 }}>{paymentMethod.name}</Text>
                </View>
            </Pressable>
        );
    };


    return (
        <SafeAreaView style={{ paddingHorizontal: PADDING_HORIZONTAL, width: WIDTH, backgroundColor: BG_COLOR, height: '100%' }}>
            <View style={{ marginTop: 17 }}>
                <Text style={styles.txtTitlePage}>Giỏ Hàng</Text>
            </View>
            <View style={styles.line}></View>
            <View style={{ height: HEIGHT * 0.25, marginTop: '5%' }}>
                {listDataCart.length > 0 ?
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        renderItem={(object) => <RenderItem item={object.item} />}
                        data={listDataCart}
                        keyExtractor={(item: any) => item?.key}
                    /> : <Text style={{ fontSize: 20 }}>Chưa có sản phẩm</Text>}
            </View>
            <ScrollView
                style={{ marginTop: 15, height: 'auto' }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
                nestedScrollEnabled={true}
            >

                <View style={styles.itema}>
                    <View style={{ flexDirection: 'row' }}>
                        <TextInput
                            style={[
                                styles.textinput,
                                {
                                    borderColor: receiverName.trim() !== '' || isReceiverNameValid ? '#E5E5E5' : 'red',
                                },
                            ]}
                            value={receiverName}
                            onChangeText={handleReceiverNameChange}
                            placeholder="Tên người nhận hàng"
                        />
                        <TextInput
                            style={[
                                styles.textinput,
                                {
                                    borderColor: phoneNumber.trim() !== '' || isPhoneNumberValid ? '#E5E5E5' : 'red',
                                },
                            ]}
                            value={phoneNumber}
                            onChangeText={handlePhoneNumberChange}
                            placeholder="Số điện thoại"
                            keyboardType="numeric"
                        />
                    </View>

                    <View>
                        <SelectList
                            setSelected={setSelectedAddress}
                            data={address.map((address: any, index: any) => {
                                const value = `${address.street}, ${address.ward}, ${address.district}, ${address.city}`
                                return { key: index, value: value }
                            })}
                            save="value"
                            placeholder={selectedAddress}
                            defaultOption={{ key: 1, value: 'Chọn địa chỉ giao hàng' }}
                            boxStyles={{ borderRadius: 5, borderWidth: 0.5, marginTop: 10 }}
                            search={false}
                            inputStyles={{ width: '95%', fontSize: 15 }}
                            dropdownTextStyles={{ fontSize: 16 }}
                            dropdownItemStyles={{ borderBottomWidth: 0.5, borderBottomColor: '#b0b0b0', marginBottom: 5 }}
                            dropdownStyles={{ height: 150, borderWidth: 0.5 }}
                            notFoundText='Chưa có địa chỉ'
                        />
                        <View style={styles.addAdress}>
                            <Pressable onPress={() => navigation?.navigate('Account', { screen: RootStackScreenEnumAccount.AddressScreen })} >
                                <Text style={styles.textDetail}>Thêm địa chỉ</Text>
                            </Pressable>
                        </View>

                    </View>
                    <Text style={{ fontSize: 15, fontFamily: 'Poppins', fontWeight: '700', }}>Chọn phương thức thanh toán:</Text>
                    {paymentMethods && paymentMethods.map((paymentMethod) => (
                        <RenderPaymentItem key={paymentMethod._id} paymentMethod={paymentMethod} />
                    ))}


                </View>
                <View style={styles.itemTotalPrice}>
                    <Text style={styles.textBottomTotalLeft}>Tổng tiền (+ tiền giao hàng)</Text>
                    <NumericFormat displayType={'text'} value={Number(totalAfterShipping)} allowLeadingZeros thousandSeparator="," renderText={(formattedValue: any) => <Text style={styles.textBottomTotalRight}>{formattedValue + 'đ'} </Text>} />
                </View>
            </ScrollView>
            <View style={{ position: 'absolute', bottom: 0, width: '100%', alignSelf: 'center' }}>
                <Pressable onPress={() => handleOrderSubmit()}>
                    <ButtonBottom title='Thanh Toán' />
                </Pressable>
            </View>
            <View style={{ height: HEIGHT * 0.09 }} />
        </SafeAreaView>
    );
};

export default CartDetail;

const styles = StyleSheet.create({
    imagePayment: {
        width: 30,
        height: 30,
        marginLeft: 15,
        borderRadius: 20,
    },
    textDetail: {
        color: '#40a0d1',
        fontSize: 15,
        fontFamily: 'Poppins',
        fontWeight: '700',
        margin: 5,
    },
    addAdress: {
        alignSelf: 'flex-end',
    },
    paymentItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginTop: 10,
        width: '100%',
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerCircle: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#40BFFF',
    },
    addressItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderWidth: 0.5,
        borderRadius: 5,
        marginTop: 10,
    },

    textinput: {
        flex: 1,
        margin: 5,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        height: 40,
        width: '100%',
        padding: 10,
        fontSize: 15,
        alignSelf: 'center',
    },

    btnCheckOut: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 55,
        borderRadius: 5,
        marginTop: 34
    },
    textCheckOut: {
        color: 'white',
        fontSize: 24,
        fontFamily: 'Poppins',
        fontWeight: '700',
    },
    textBottomTotalRight: {
        color: '#40BFFF',
        fontSize: 14,
        fontFamily: 'Poppins',
        fontWeight: '700',
        lineHeight: 18,
        letterSpacing: 0.50,
    },
    textBottomTotalLeft: {
        color: '#223263',
        fontSize: 14,
        fontFamily: 'Poppins',
        fontWeight: '700',
        lineHeight: 18,
        letterSpacing: 0.50,
    },
    textHeaderTotalRight: {
        color: '#223263',
        fontSize: 14,
        fontFamily: 'Poppins',
        fontWeight: '400',
        lineHeight: 21.60,
        letterSpacing: 0.50,
    },
    textHeaderTotalLeft: {
        color: '#9098B1',
        fontSize: 14,
        fontFamily: 'Poppins',
        fontWeight: '400',
        letterSpacing: 0.50,
    },
    bottomTotalPrice: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 10,
        alignItems: 'center',
    },
    headerTotalPrice: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    itemTotalPrice: {
        padding: 10,
        borderWidth: 0.5,
        borderColor: '#9098B1',
        borderRadius: 5,
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    itema: {
        padding: 10,
        borderWidth: 0.5,
        borderColor: '#9098B1',
        borderRadius: 5,
        marginTop: 20,
    },
    topItem: {
        flexDirection: 'row',
        columnGap: 15,
        paddingLeft: 10,
    },
    bottomItem: {
        flexDirection: 'row',
        height: '50%',
        alignItems: 'center',
        paddingLeft: 10,
    },
    btnNumberCountMinus: {
        backgroundColor: '#EBF0FF',
        borderTopStartRadius: 5,
        borderBottomStartRadius: 5
    },
    btnNumberCountPlus: {
        backgroundColor: '#EBF0FF',
        borderTopEndRadius: 5,
        borderBottomEndRadius: 5
    },
    textNumberCount: {
        color: '#223263',
        fontSize: 16,
        fontFamily: 'Poppins',
        fontWeight: '400',
        lineHeight: 18,
        marginTop: 4,
        alignItems: 'center',
    },
    textPrice: {
        color: '#40BFFF',
        fontSize: 16,
        fontFamily: 'Poppins',
        fontWeight: '700',
        lineHeight: 16,
        letterSpacing: 0.50,
    },
    textTitleItem: {
        color: '#223263',
        fontSize: 16,
        fontFamily: 'Poppins',
        fontWeight: '700',
        letterSpacing: 0.50,
    },
    itemCart: {
        height: 90,
        backgroundColor: '#E5E5E5',
        borderRadius: 10,
        alignItems: 'center',
        flexDirection: 'row',
        padding: 10,
        marginBottom: 12
    },
    line: {
        position: 'absolute',
        width: WIDTH,
        height: 1,
        backgroundColor: '#E5E5E5',
        marginTop: 50,
    },
    txtTitlePage: {
        color: '#223263',
        fontSize: 18,
        fontFamily: 'Poppins',
        fontWeight: '700',
        lineHeight: 22,
        letterSpacing: 0.08,
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 5,
    },
    itemInfoContainer: {
        flexDirection: 'column',
        height: '100%',
        gap: 10,
    },
    quantityContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 80,
        height: 30,
        paddingHorizontal: 2,
        position: 'absolute',
        right: 30,
    },
})