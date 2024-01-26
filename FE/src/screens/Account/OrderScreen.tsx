import { StyleSheet, Text, View, TouchableOpacity, FlatList, Modal, Pressable, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../component/Header/Header'
import { PropsAccount } from '../../component/Navigation/Props';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import * as Animatable from 'react-native-animatable';
import ButtonBottom from '../../component/Button/Button';
import { listOrder } from '../../redux/silces/HomeSelector';
import { HEIGHT, WIDTH } from '../../utilities/utility';
import { RootStackScreenAccount, RootStackScreenEnumAccount } from '../../component/Root/RootStackAccount';
import StatusDeliver from './StatusDeliver';
import AxiosInstance from '../../Axios/Axios';
import { useIsFocused } from '@react-navigation/native';
import Order_Detail from './Order_Detail';
import { NumericFormat } from 'react-number-format';



const OrderScreen = ({ navigation }: PropsAccount, props: any) => {
    const isFocus = useIsFocused();
    const [dateStatus, setDateStatus] = useState<string>('');
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [status, setStatus] = useState<string>('');
    const [_idOrder, set_idOrder] = useState<string>('');
    const user = useSelector((state: any) => state.SlicesReducer.user);
    const [listOrder, setListOrder] = useState<[]>();
    const [nameModal, setNameModal] = useState<string>('');
    const [refreshingOrder, setRefreshingOrder] = useState<boolean>(false);

    
    const fetchListOrder = async () => {
        const response = await AxiosInstance().get(`order/getOrderByIdUser/${user._id}`);
        setListOrder(response.data);  
    }
    useEffect(() => {
        if (isFocus) {
            fetchListOrder();
        }
    }, [isFocus])
    const onRefreshOrder = React.useCallback(() => {
        setRefreshingOrder(true);
        fetchListOrder();
        setTimeout(() => {
            setRefreshingOrder(false);
        }, 2000);
      }, []);


    const RenderItem = (props: any) => {
        const { data } = props;
        const { item } = data;
        const date = new Date(item.bookingDate);

        return <TouchableOpacity style={styles.box} onPress={() => { setModalVisible(true), set_idOrder(item._id), setNameModal('Order_Detail') }}>
            <View>
                <Text style={styles.MaCode}>{item.orderCode}</Text>
                <Text style={styles.title}>Ngày đặt hàng : {date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()}</Text>
                <View style={styles.boxBottom}>
                    <Text style={styles.title}>Sản Phẩm : </Text>
                    <Text style={styles.content}>{item?.listProduct.length} sản phẩm</Text>
                </View>
                <View style={styles.boxBottom}>
                    <Text style={styles.title}>Giá : </Text>
                    <NumericFormat displayType={'text'} value={Number(item.totalPrice )} allowLeadingZeros thousandSeparator="," renderText={(formattedValue: any) => <Text style={styles.price}>{formattedValue + 'đ'} </Text>} />
                </View>
                <View style={styles.boxBottom}>
                    <Text style={styles.title}>Trạng thái giao hàng</Text>
                    <TouchableOpacity onPress={() => { setModalVisible(true), setStatus(item.status), setDateStatus(date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()), setNameModal('StatusDeliver') }}>
                        <Icon name='chevron-forward-outline' size={25} color={'#525252'} />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity >;
    };

    return (
        <View style={styles.container}>
            <Modal
                transparent={false}
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => true} >
                <View style={{ height: '100%' }}>
                    {
                        (nameModal == 'StatusDeliver') ?
                            <StatusDeliver state={{ dateStatus, status }} /> :
                            <Order_Detail state={{_idOrder}} />
                    }
                    <Animatable.View animation={'bounceIn'} style={{ paddingHorizontal: 20, position: 'relative', bottom: 10 }}>
                        <Pressable onPress={() => { setModalVisible(false) }}>
                            <ButtonBottom title='Thoát' />
                        </Pressable>
                    </Animatable.View>
                </View>
            </Modal>
            <Header title='Order' navigation={navigation} />
            <View style={styles.line}></View>
            <FlatList
                showsVerticalScrollIndicator={false}
                style={{ marginBottom: 100 }}
                data={listOrder?.reverse()}
                renderItem={(item) => <RenderItem navigation={navigation} data={item}></RenderItem>}
                refreshControl={
                    <RefreshControl refreshing={refreshingOrder} onRefresh={onRefreshOrder} />
                  }
            />
        </View>
    )
}

export default OrderScreen

const styles = StyleSheet.create({
    boxBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    price: {
        color: 'black',
        fontSize: 14,
        fontFamily: 'Poppins',
        fontWeight: '700',
        lineHeight: 21.60,
        letterSpacing: 0.50,
    },

    content: {
        color: '#223263',
        fontSize: 14,
        fontFamily: 'Poppins',
        fontWeight: '400',
        lineHeight: 21.60,
        letterSpacing: 0.50,
    },

    title: {
        color: '#223263',
        fontSize: 14,
        fontFamily: 'Poppins',
        fontWeight: '400',
        lineHeight: 21.60,
        letterSpacing: 0.50,
        paddingVertical: 5,
    },

    MaCode: {
        color: '#223263',
        fontSize: 16,
        fontFamily: 'Poppins',
        fontWeight: '700',
        lineHeight: 21,
        letterSpacing: 0.50,
        paddingVertical: 5,
    },

    box: {
        borderWidth: 0.5,
        padding: 15,
        marginTop: 15,
        width: '100%',
        alignSelf: 'center',
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
        width: WIDTH,
        height: HEIGHT,
        paddingTop: 20,
        paddingHorizontal: 20,
    }
})