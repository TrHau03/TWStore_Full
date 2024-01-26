import { StyleSheet, Text, View, ImageBackground, FlatList, Pressable, Image, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import AxiosInstance from '../../Axios/Axios'
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { RootStackScreenEnumOffer } from '../../component/Root/RootStackOffer';
import { useIsFocused } from '@react-navigation/native';
import { useSelector } from 'react-redux';


const OfferHome = ({ navigation }: NativeStackHeaderProps | any) => {

  const [event, setEvent] = useState<[]>([]);
  const [couponHighest, setCouponHighest] = useState<any>();
  const [refreshingOffer, setRefreshingOffer] = useState<boolean>(false);

  const isFocused = useIsFocused();

  const fetchEvent = async () => {
    const response = await AxiosInstance().get(`event/getAllEvent`);
    const coupon = await AxiosInstance().get(`promotion/getCouponHighest`);
    setCouponHighest(coupon.data);
    setEvent(response.data.filter((item: any) => {
      return new Date(item.soNgayGiamgia).getTime() > new Date().getTime();
    }));
  }
  useEffect(() => {
    if (isFocused) {
      fetchEvent();
    }
  }, [isFocused])

  const onRefreshOffer = React.useCallback(() => {
    setRefreshingOffer(true);
    fetchEvent();
    setTimeout(() => {
      setRefreshingOffer(false);
    }, 2000);
  }, []);

  const renderItem = ({ item }: any) => {
    return (
      <Pressable onPress={() => navigation.navigate(RootStackScreenEnumOffer.OfferScreen, { item })}>
        <ImageBackground
          source={{ uri: item.eventImage }}
          style={styles.backgroundimg}>
          <Text style={styles.textbackgroundimg}>{item.eventName}</Text>
        </ImageBackground>
      </Pressable>
    )
  }
  return (
    <View style={styles.container}>
      {couponHighest ? <View style={styles.cupon}>
        <Text style={styles.textcupon}>Sử dụng “{couponHighest?.discountCode}” Mã cho phiếu giảm giá {couponHighest?.discountLevel}% off</Text>
      </View> : (<View>
        <Image style={{ alignSelf: 'center', marginTop: '30%', width: 300, height: 300 }} source={require('../../asset/image/nodata.png')} />
        <Text style={{ alignSelf: 'center', marginTop: 40, fontSize: 22, fontWeight: '500', color: '#1E4F5F', lineHeight: 24 }}>Hiện không có phiếu giảm giá !!!</Text>
      </View>)}
      <FlatList
        showsVerticalScrollIndicator={false}
        data={event}
        keyExtractor={(item: any) => item._id.toString()}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshingOffer} onRefresh={onRefreshOffer} />
        } />
    </View>
  )
}

export default OfferHome
const styles = StyleSheet.create({
  container: {
    padding: 15,
    width: '100%',
    height: '100%'
  },
  offer: {
    color: '#223263',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cupon: {
    marginTop: 15,
    width: '100%',
    height: 80,
    backgroundColor: '#00A9FF',
    borderRadius: 6,
    justifyContent: 'center',
    paddingLeft: 20,
  },
  textcupon: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    width: 200,
  },
  backgroundimg: {
    marginTop: 20,
    width: '100%',
    height: 210,
    borderRadius: 6,
    overflow: 'hidden',
  },
  textbackgroundimg: {
    marginTop: 40,
    marginLeft: 30,
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    color: '#FFFFFF',
    width: 200,
  },
})