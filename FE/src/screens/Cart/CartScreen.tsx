import { StyleSheet, Text, View, ScrollView, Image, Pressable, FlatList, Dimensions, Alert, } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import { InputItem, Stepper } from '@ant-design/react-native'
import { PropsCart } from '../../component/Navigation/Props'
import ButtonBottom from '../../component/Button/Button'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BG_COLOR, HEIGHT, PADDING_HORIZONTAL, WIDTH } from '../../utilities/utility';
import { useDispatch, useSelector } from 'react-redux';
import { removeItem, updateQuantity } from '../../redux/silces/Silces'
import AxiosInstance from '../../Axios/Axios'
import { useNavigation } from '@react-navigation/native'
import { NumericFormat } from 'react-number-format'


const CartScreen = ({ navigation }: PropsCart) => {
    const navigations = useNavigation<{
        navigate: (screen: string, params?: { totalAfterShipping?: number; Level?: any; generalPriceAfterShipping: number }) => void;
    }>();


    const listData = useSelector((state: any) => {
        return state.SlicesReducer.user.cartItem;
    });
    const user = useSelector((state: any) => {
        return state.SlicesReducer.user;
    });
    const isUser = useSelector((state: any) => state.SlicesReducer.user._idUser);

    const [voucher, setVoucher] = useState()
    const [discountLevel, setDiscountLevel] = useState<number>(0);
    const [discountedPrice, setDiscountedPrice] = useState<number>(0);
    const [isVoucherApplied, setIsVoucherApplied] = useState(false);
    const [inputBorderColor, setInputBorderColor] = useState('#9098B1');
    const [coupon, setCoupon] = useState<string>('');
    const [isInvalidCoupon, setIsInvalidCoupon] = useState<boolean>(false);



    const [checkRemoveItem, setCheckRemoveItem] = useState<boolean>(false);

    const dispatch = useDispatch();

    const totalItem = listData.reduce((total: any, item: { quantity: any }) => total + item.quantity, 0);

    const generalPrice = listData.reduce((previousValue: number, currentItem: any) => previousValue + currentItem.productID?.price * currentItem.quantity, 0);

    const cart: { key: any, productID: any; sizeProduct: any; colorProduct: any; quantity: number }[] = [];
    const shipping = generalPrice < 3000000 ? generalPrice * 0.05 : generalPrice * 0.02

    const generalPriceAfterShipping = generalPrice + (shipping);

    useEffect(() => {
        const fetchVoucher = async () => {
            try {
                const response = await AxiosInstance().get('promotion/getAllPromotion');
                setVoucher(response.data);
            } catch (error) {
                console.error('Error fetching voucher:', error);
            }
        };

        fetchVoucher();
    }, []);

    const handleApplyCoupon = async () => {
        try {
            const response = await AxiosInstance().get(`promotion/getAllPromotion`);
            const appliedPromotion = response.data.find((promo: { discountCode: string }) => promo.discountCode === coupon);

            if (appliedPromotion) {
                const discountLevelValue = appliedPromotion.discountLevel;
                const discountAmount = (generalPriceAfterShipping * discountLevelValue) / 100;
                const discountedPriceValue = generalPriceAfterShipping - discountAmount;

                // Cập nhật giá trị discountLevel và discountedPrice vào state
                setDiscountLevel(discountLevelValue);
                setDiscountedPrice(discountedPriceValue);
                setIsVoucherApplied(true);
                setIsInvalidCoupon(false); // Không có lỗi nữa
                setInputBorderColor('#9098B1'); // Màu sắc khi có voucher
                console.log(`Applied discount: ${discountLevelValue}%`);
            } else {
                console.log('Invalid coupon code');
                setIsVoucherApplied(false);
                setIsInvalidCoupon(true); // Có lỗi khi mã giảm giá không hợp lệ
                setInputBorderColor('red'); // Màu sắc khi mã giảm giá không hợp lệ
            }
        } catch (error) {
            console.error('Error applying coupon:', error);
        }
    };

    const createTwoButtonAlert = () =>
        Alert.alert('Thông báo', 'Không có sản phẩm trong giỏ hàng của bạn ! ', [
            { text: 'OK' }
        ]);


    const handleRemoveItem = async (key: number) => {
        dispatch(removeItem(key));
        setCheckRemoveItem(true);

    }
    const handleRemoveData = async () => {
        listData.map((item: any) => {
            cart.push({ key: item.key, productID: item.productID._id, sizeProduct: item.sizeProduct._id, colorProduct: item.colorProduct._id, quantity: 1 })
        }
        )
        await AxiosInstance().post('/users/updateInfoUser', { _id: user._idUser, cartItem: cart });
        setCheckRemoveItem(false);
    }
    checkRemoveItem && handleRemoveData();


    const RenderItem = ({ item }: { item: any }) => {
        const [quantity, setQuantity] = useState<number>(item.quantity);

        const changeQuantityUp = () => {
            const newQuantity = quantity < 10 ? quantity + 1 : 10;
            setQuantity(newQuantity);
            dispatch(updateQuantity({ id: item.productID._id, quantity: newQuantity }));
        };

        const changeQuantityDown = () => {
            const newQuantity = quantity > 1 ? quantity - 1 : 1;
            setQuantity(newQuantity);
            dispatch(updateQuantity({ id: item.productID._id, quantity: newQuantity }));
        };


        return (
            <View style={styles.itemCart}>
                <View>
                    {item.productID.image[0] !== null && (
                        <Image source={{ uri: item.productID.image[0] }} style={{ width: 72, height: 72 }} />
                    )}
                </View>
                <View style={{ flexDirection: 'column', height: '100%' }}>
                    <View style={styles.topItem}>
                        <View style={{ width: '65%', gap: 10 }}>
                            <Text style={styles.textTitleItem}>{item.productID.productName.length < 15 ? item.productID.productName : item.productID.productName.substring(0, 15) + "..."}</Text>
                            <View style={{ flexDirection: 'row', columnGap: 20 }}>
                                <Text style={styles.textTitleItem}>Size: {item.sizeProduct.name}</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.textTitleItem}>Size: </Text>
                                    <View style={{ width: 20, height: 20, backgroundColor: `${item.colorProduct.code}`, borderRadius: 50 }}></View>
                                </View>
                            </View>
                        </View>
                        <Pressable onPress={() => handleRemoveItem(item.key)}>
                            <Icon name='trash-outline' color='#9e9e9e' size={25} />
                        </Pressable>
                    </View>
                    <View style={styles.bottomItem}>
                        <NumericFormat displayType={'text'} value={Number(item.productID.price)} allowLeadingZeros thousandSeparator="," renderText={(formattedValue: any) => <Text style={styles.textPrice}>{formattedValue + 'đ'} </Text>} />
                        <View style={{ flexDirection: 'row', backgroundColor: 'white', borderRadius: 5, alignItems: 'center', justifyContent: 'space-between', width: 100, height: 30, paddingHorizontal: 2, position: 'absolute', right: 30 }}>
                            <Pressable onPress={() => changeQuantityDown()} style={quantity > 1 ? styles.btnNumberCountMinus : [styles.btnNumberCountMinus, { backgroundColor: '#E5E5E5' }]}><Icon name='remove-outline' size={25} /></Pressable>
                            <Text style={styles.textNumberCount}>{item.quantity}</Text>
                            <Pressable onPress={() => changeQuantityUp()} style={quantity < 10 ? styles.btnNumberCountPlus : [styles.btnNumberCountPlus, { backgroundColor: '#E5E5E5' }]}><Icon name='add-outline' size={25} /></Pressable>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    return (
        (isUser != '') ? <SafeAreaView style={{ paddingHorizontal: PADDING_HORIZONTAL, width: WIDTH, backgroundColor: BG_COLOR }}  >
            <View style={{ marginTop: 17 }}>
                <Text style={styles.txtTitlePage}>Giỏ Hàng</Text>
            </View>
            <View style={styles.line}></View>
            <View style={{ height: HEIGHT * 0.35, marginTop: '11%' }}>
                {listData.length > 0 ?
                    <FlatList
                        scrollEnabled={false}
                        renderItem={(object) => <RenderItem item={object.item} />}
                        data={listData}
                        keyExtractor={(item: any) => item?.key}
                    /> : <Text style={{ fontSize: 20 }}>Chưa có sản phẩm</Text>}
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
            >

                <View style={{ height: HEIGHT * 0.8 }}>


                    <View style={{ borderWidth: 1, borderColor: isInvalidCoupon ? 'red' : inputBorderColor, borderRadius: 5, marginTop: 25 }}>
                        <InputItem
                            style={{ fontSize: 16 }}
                            value={coupon}
                            onChange={(value: any) => {
                                setCoupon(value);
                                setIsVoucherApplied(false);
                                setIsInvalidCoupon(false); // Ẩn lỗi khi người dùng bắt đầu nhập lại
                            }}
                            placeholder={isInvalidCoupon ? "Mã giảm giá không hợp lệ" : "Nhập mã giảm giá"}
                            extra={
                                <Pressable onPress={handleApplyCoupon} style={styles.btnApply}>
                                    <Text style={styles.textApply}>Áp dụng</Text>
                                </Pressable>
                            }
                        />
                    </View>

                    <View style={styles.itemTotalPrice}>
                        <View style={styles.headerTotalPrice}>
                            <Text style={styles.textHeaderTotalLeft}>Tổng giá sản phẩm ({totalItem})</Text>
                            <NumericFormat displayType={'text'} value={Number(generalPrice)} allowLeadingZeros thousandSeparator="," renderText={(formattedValue: any) => <Text style={styles.textHeaderTotalRight}>{formattedValue + 'đ'} </Text>} />
                        </View>
                        <View style={styles.headerTotalPrice}>
                            <Text style={styles.textHeaderTotalLeft}>Phí giao hàng</Text>
                            <NumericFormat displayType={'text'} value={Number(shipping)} allowLeadingZeros thousandSeparator="," renderText={(formattedValue: any) => <Text style={styles.textHeaderTotalRight}>{formattedValue + 'đ'} </Text>} />
                        </View>
                        <View style={styles.headerTotalPrice}>
                            <Text style={styles.textHeaderTotalLeft}>Giảm giá</Text>
                            <Text style={styles.textHeaderTotalRight}>{isVoucherApplied ? `${discountLevel}%` : '0%'}</Text>
                        </View>
                        <View style={styles.bottomTotalPrice}>
                            <Text style={styles.textBottomTotalLeft}>Tổng giá</Text>
                            <NumericFormat displayType={'text'} value={Number(isVoucherApplied ? discountedPrice : generalPriceAfterShipping)} allowLeadingZeros thousandSeparator="," renderText={(formattedValue: any) => <Text style={styles.textBottomTotalRight}>{formattedValue + 'đ'} </Text>} />
                        </View>

                    </View>
                    <View style={{ marginTop: 15 }}>
                        <Pressable onPress={() => listData.length > 0 ? navigations.navigate('CartDetail', {
                            Level: isVoucherApplied ? discountLevel : '0',
                            totalAfterShipping: isVoucherApplied ? discountedPrice : generalPriceAfterShipping,
                            generalPriceAfterShipping

                        }) : createTwoButtonAlert()}>
                            <ButtonBottom title='Xác Nhận' />
                        </Pressable>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView > : <View>
            <Image style={{ alignSelf: 'center', marginTop: '30%', width: 300, height: 300 }} source={require('../../asset/image/nodata.png')} />
            <Text style={{ alignSelf: 'center', marginTop: 40, fontSize: 22, fontWeight: '500', color: '#1E4F5F', lineHeight: 24 }}>Vui lòng đăng nhập !</Text>
        </View>
    )
}

export default CartScreen

const styles = StyleSheet.create({
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
        borderTopWidth: 0.5,
        borderColor: '#9098B1',
        alignItems: 'center',
    },
    headerTotalPrice: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    itemTotalPrice: {
        padding: 16,
        borderWidth: 0.5,
        borderColor: '#9098B1',
        borderRadius: 5,
        marginTop: 20
    },
    btnApply: {
        backgroundColor: '#40BFFF',
        width: 65,
        height: '101%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        right: -16,
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5
    },
    textApply: {
        color: 'white',
        fontSize: 14,
        fontFamily: 'Poppins',
        fontWeight: '700',
        lineHeight: 21.60,
        letterSpacing: 0.50,
    },
    topItem: {
        width: '100%',
        flexDirection: 'row',
        columnGap: 25,
        paddingLeft: 20,
    },
    bottomItem: {
        flexDirection: 'row',
        height: '50%',
        alignItems: 'center',
        paddingLeft: 20,
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
        fontSize: 18,
        fontFamily: 'Poppins',
        fontWeight: '400',
        lineHeight: 18,
        letterSpacing: 0.06,
        marginTop: 4,
    },
    textPrice: {
        color: '#40BFFF',
        fontSize: 15,
        fontFamily: 'Poppins',
        fontWeight: '700',
        lineHeight: 18,
        letterSpacing: 0.50,
    },
    textTitleItem: {
        color: '#223263',
        fontSize: 15,
        fontFamily: 'Poppins',
        fontWeight: '700',
        lineHeight: 18,
        letterSpacing: 0.50,
    },
    itemCart: {
        height: 110,
        backgroundColor: '#E5E5E5',
        borderRadius: 10,
        alignItems: 'center',
        flexDirection: 'row',
        padding: 15,
        marginBottom: 16
    },
    line: {
        position: 'absolute',
        width: WIDTH,
        height: 1,
        backgroundColor: '#E5E5E5',
        marginTop: 60,

    },
    txtTitlePage: {
        color: '#223263',
        fontSize: 20,
        fontFamily: 'Poppins',
        fontWeight: '700',
        lineHeight: 24,
        letterSpacing: 0.08,
    }
})
