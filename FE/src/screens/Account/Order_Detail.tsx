import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../component/Header/Header'
import Icon from 'react-native-vector-icons/Ionicons';
import Button from '../../component/Button/Button'
import Item from '@ant-design/react-native/lib/list/ListItem';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import AxiosInstance from '../../Axios/Axios';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { NumericFormat } from 'react-number-format';



interface Order_Details {
  _id: string,
  addressDelivery: string,
  bookingDate: string,
  deliveryDate: string,
  listProduct: [{
    colorID: [],
    productID: {
      productName: string,
      price: string,
      name: string,
      image: [],
    },
    quantityProduct: number,
    sizeID: [],
  }],
  nameReceiver: string,
  orderCode: number,
  payment: string,
  phoneReceiver: string,
  status: number,
  totalPrice: string,
  userID: string,
  voucher: string,
}



const Order_Detail = (props: any) => {
  const { _idOrder } = props.state;
  const [listOrder, setListOrder] = useState<Order_Details>();
  const isFocus = useIsFocused();


  console.log(listOrder?.listProduct);


  useEffect(() => {
    const fetchListCategory = async () => {
      const response = await AxiosInstance().get(`order/getOrderByID/${_idOrder}`);
      setListOrder(response.data)
    }
    if (isFocus) {
      fetchListCategory();
    }
  }, [isFocus])

  return (
    <ScrollView style={styles.container}
      showsVerticalScrollIndicator={false}>
      <View style={{ paddingLeft: 20, paddingTop: 40 }}>
        <Text style={{ color: '#223263', fontSize: 19, fontFamily: 'Poppins', fontWeight: '700', lineHeight: 24, letterSpacing: 0.50, }}>Chi Tiết Đặt Hàng</Text>
      </View>
      <View style={styles.line}></View>
      <View style={{ paddingHorizontal: 20, }}>
        <Text style={styles.txtTitle}>Sản Phẩm</Text>
        {listOrder?.listProduct.map((item: any) =>
          <View key={item.productID._id} style={styles.boxProduct}>
            <Image style={styles.product_Image} source={{ uri: item.productID.image[0] }} />

            <View style={{ width: '70%', rowGap: 5 }}>
              <Text style={styles.txtName_Product}>{item.productID.productName}</Text>
              <NumericFormat displayType={'text'} value={Number(item.productID.price)} allowLeadingZeros thousandSeparator="," renderText={(formattedValue: any) => <Text style={styles.txtPrice_Product}>{formattedValue + 'đ'} </Text>} />

              <View style={{ flexDirection: 'row' , width: '90%', justifyContent: 'space-between'}}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.txtPrice_Product}>Màu : </Text>
                  <Text style={styles.txtPrice_ProductName}>{item.colorID.name}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.txtPrice_Product}>Size : </Text>
                  <Text style={styles.txtPrice_ProductName}>{item.sizeID.name}</Text>
                </View>
                <View style={{ flexDirection: 'row'}}>
                  <Text style={styles.txtPrice_Product}>SL : </Text>
                  <Text style={styles.txtPrice_ProductName}>{item.quantityProduct}</Text>
                </View>

              </View>
            </View>
          </View>
        )}

        < Text style={styles.txtTitle}>Thông tin giao hàng</Text>
        <View style={styles.boxShipping}>

          <View style={styles.content}>
            <Text style={styles.txtLeft}>Ngày giao hàng</Text>
            <Text style={styles.txtRight}>{listOrder?.deliveryDate}</Text>
          </View>
          <View style={styles.content}>
            <Text style={styles.txtLeft}>Mã giao hàng</Text>
            <Text style={styles.txtRight}>{listOrder?.orderCode}</Text>
          </View>
          <View style={styles.content}>
            <Text style={styles.txtLeft}>Thanh toán</Text>
            <Text style={styles.txtRight}>{listOrder?.payment}</Text>
          </View>
          <View style={styles.content}>
            <Text style={styles.txtLeft}>Số điện thoại nhận hàng</Text>
            <Text style={styles.txtRight}>{listOrder?.phoneReceiver}</Text>
          </View>
          <View style={styles.content}>
            <Text style={styles.txtLeft}>Địa chỉ</Text>
            <Text style={styles.txtRight}>{listOrder?.addressDelivery}</Text>
          </View>
          <View style={styles.content}>
            <Text style={styles.txtPrice_Product}>Tổng tiền</Text>
            <NumericFormat displayType={'text'} value={Number(listOrder?.totalPrice)} allowLeadingZeros thousandSeparator="," renderText={(formattedValue: any) => <Text style={styles.txtPrice_Product}>{formattedValue + 'đ'} </Text>} />
          </View>
        </View>
      </View>
    </ScrollView >
  )
}

export default Order_Detail

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10
  },
  boxShipping: {
    borderWidth: 0.5,
    padding: 15,
    marginTop: 15,
    width: '100%',
    alignSelf: 'center',
    borderRadius: 5,
  },
  txtRight: {
    color: '#223263',
    fontSize: 14,
    fontFamily: 'Poppins',
    fontWeight: '400',
    lineHeight: 21.60,
    letterSpacing: 0.50,
    width: '40%',
    textAlign: 'right',
  },

  txtLeft: {
    color: '#223263',
    fontSize: 14,
    fontFamily: 'Poppins',
    fontWeight: '400',
    lineHeight: 21.60,
    letterSpacing: 0.50,

  },

  txtPrice_Product: {
    color: 'black',
    fontSize: 14,
    fontFamily: 'Poppins',
    fontWeight: '700',
    lineHeight: 18,
    letterSpacing: 0.50,
    marginTop: 5,
  },
  txtPrice_ProductName: {
    color: '#223263',
    fontSize: 14,
    fontFamily: 'Poppins',
    fontWeight: '400',
    lineHeight: 18,
    letterSpacing: 0.50,
    marginTop: 5,
  },

  txtName_Product: {
    color: '#223263',
    fontSize: 14,
    fontFamily: 'Poppins',
    fontWeight: '700',
    lineHeight: 18,
    letterSpacing: 0.50,
  },

  icon_Heart: {
    paddingTop: 10,

  },

  product_Image: {
    width: 70,
    height: 70,
    borderRadius: 5,
  },

  boxProduct: {
    borderWidth: 0.5,
    padding: 15,
    marginTop: 15,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 5,
  },

  txtTitle: {
    color: '#223263',
    fontSize: 18,
    fontFamily: 'Poppins',
    fontWeight: '700',
    lineHeight: 21,
    letterSpacing: 0.50,
    paddingTop: 20,
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
    width: '100%',
    height: '100%',
    paddingTop: 20,
    bottom: 50,
  }
})

