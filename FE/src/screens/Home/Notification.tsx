import { StyleSheet, Text, TouchableOpacity, View, Image, FlatList, Pressable, RefreshControl, ScrollView } from 'react-native'
import * as React from 'react';
import Header from '../../component/Header/Header';
import { PropsHome } from '../../component/Navigation/Props';
import { BG_COLOR, HEIGHT, PADDING_HORIZONTAL, PADDING_TOP, WIDTH } from '../../utilities/utility';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { useCallback, useEffect, useState } from 'react';
import AxiosInstance from '../../Axios/Axios';
import Clipboard from '@react-native-clipboard/clipboard';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';

const Notification = () => {
  const user = useSelector((state: any) => state.SlicesReducer.user);
  const [refreshingNotifications, setRefreshingNotifications] = useState<boolean>(false);
  const [notificaticon, setNotificaticon] = useState<Array<{ title: string; content: string }>>([]);
  const isFocused = useIsFocused();


  const fetchNotifi = async () => {
    const userId = user._id
    const response = await AxiosInstance().get(`notifications/getAllNotification/${userId}`);
    setNotificaticon(response.data);
  };

  useEffect(() => {
    if (isFocused) {
      fetchNotifi();
    }
  }, [isFocused]);

  const onRefreshNotifications = React.useCallback(() => {
    setRefreshingNotifications(true);
    fetchNotifi();
    setTimeout(() => {
      setRefreshingNotifications(false);
    }, 2000);
  }, []);


  return (
    <ScrollView
      style={{ marginTop: 20 }}
      refreshControl={
        <RefreshControl refreshing={refreshingNotifications} onRefresh={onRefreshNotifications} />
      }
    >
      {notificaticon.map((item, index) => (
        <TouchableOpacity key={index} style={styles.containerItem}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.content}>{item.content}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

};



const Voucher = () => {
  const [refreshingVoucher, setRefreshingVoucher] = useState<boolean>(false);
  const [voucher, setVoucher] = useState<Array<{ titleVoucher: string; contentVoucher: string; discountCode: string; discountLevel: number; startDay: string; endDay: string }>>([]);
  const isFocused = useIsFocused();


  const fetchVoucher = async () => {
    const response = await AxiosInstance().get(`promotion/getAllPromotion`);
    
    setVoucher(response.data);
  };
  useEffect(() => {
    if (isFocused) {
      fetchVoucher();
    }
  }, [isFocused]);

  const onRefreshVoucher = React.useCallback(() => {
    setRefreshingVoucher(true);
    fetchVoucher();
    setTimeout(() => {
      setRefreshingVoucher(false);
    }, 2000);
  }, []);
  return (
    <ScrollView
      style={{ marginTop: 20 }}
      refreshControl={
        <RefreshControl refreshing={refreshingVoucher} onRefresh={onRefreshVoucher} />
      }
    >
      {voucher.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.containerItem}
          onPress={() => copyVoucher(item.discountCode)}
        >
          <Text style={styles.title}>{item.titleVoucher}</Text>
          <Text style={styles.content}>{item.contentVoucher}</Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.textbottom}>Giảm lên đến {item.discountLevel}%</Text>
            <Text style={styles.textbottom}>Mã giảm giá : {item.discountCode}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

};

const copyVoucher = (discountCode: string) => {
  Clipboard.setString(discountCode);

};

const renderScene = SceneMap({
  first: Notification,
  second: Voucher,
});

const renderTabBar = (props: any) => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: 'black' }}
    style={{ backgroundColor: 'white' }}
    labelStyle={{ color: '#223263' }}
  />
);

const NotificationScreen = ({ navigation }: PropsHome) => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Thông báo' },
    { key: 'second', title: 'Phiếu giảm giá' },
  ]);

  return (
    <View style={styles.container}>
      <View style={{ paddingHorizontal: PADDING_HORIZONTAL, }}>
        <Header title='Thông báo' navigation={navigation} />
      </View>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: WIDTH }}
        renderTabBar={renderTabBar}
      />
    </View>
  );
};

export default NotificationScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: PADDING_TOP,
    backgroundColor: BG_COLOR,
  },
  title: {
    fontSize: 19,
    fontWeight: 'bold',
    color: 'black',
    paddingHorizontal: PADDING_HORIZONTAL,
    paddingTop: 5,
    paddingBottom: 5,
  },
  content: {
    margin: 5,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#686361',
  },
  textbottom: {
    margin: 5,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#3E3C3B',
  },
  containerItem: {
    margin: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    borderColor: '#ADD8E6',
    borderWidth: 1
  },


})