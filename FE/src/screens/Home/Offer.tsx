import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../component/Header/Header';
import {PropsHome} from '../../component/Navigation/Props';
import {
  BG_COLOR,
  HEIGHT,
  PADDING_HORIZONTAL,
  PADDING_TOP,
} from '../../utilities/utility';
import {useDispatch, useSelector} from 'react-redux';
import AxiosInstance from '../../Axios/Axios';
import { ObjectId } from 'mongoose';
import { useIsFocused } from '@react-navigation/native';

interface Offer {
  id: number;
  img: any;
  title: string;
  content: string;
  date: string;
  time: string;
}

const renderItem = ({ item }: { item: { _id: ObjectId, eventImage: string, eventName: string ,levelGiamgia : string} }) => {
  return (
    <View style={styles.containerItemPD}>
      <View style={styles.content}>
        <View style={styles.left}>
          <Image source={{ uri: item.eventImage }} />
        </View>
        <View style={styles.right}>
          <Text style={styles.title}>{item.eventName}</Text>
          <Text style={styles.textinsize}>giảm {item.levelGiamgia} %</Text>
        </View>
      </View>
    </View>
  );
};


const OfferNorifiScreen = ({navigation}: PropsHome) => {
  const [event, setEvent] = useState<[]>([]);
  const [refreshingOffer, setRefreshingOffer] = useState<boolean>(false);
  
  const isFocused = useIsFocused();

  const fetchEvent = async () => {
    const response = await AxiosInstance().get(`event/getAllEvent`);
    setEvent(response.data);
  };
  useEffect(() => {
    if (isFocused) {
      fetchEvent();
    }
  }, [isFocused]);

  const onRefreshOffer = React.useCallback(() => {
    setRefreshingOffer(true);
    fetchEvent();
    setTimeout(() => {
      setRefreshingOffer(false);
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <Header title="Offer" navigation={navigation} />
      <FlatList
        style={{marginTop: 20}}
        data={event}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.toString()}
        numColumns={1}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshingOffer} onRefresh={onRefreshOffer} />
        }
      />
    </View>
  );
};

export default OfferNorifiScreen;

const styles = StyleSheet.create({
  time: {
    marginLeft: 15,
    color: 'black',
  },
  date: {
    color: 'black',
  },
  txtcontent: {
    fontSize: 16,
    marginTop: 5,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'black',
    paddingHorizontal: PADDING_HORIZONTAL,
    paddingTop:10,
    paddingBottom:10,
  },
  textinsize: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'black',
    paddingHorizontal: PADDING_HORIZONTAL,
    paddingBottom:10,
  },
  contentRight: {
    flexDirection: 'row',
    marginTop: 7,
  },
  right: {
    width: '90%',
    height: 'auto',
    borderRadius: 15,
  },
  left: {
    width: '30%',
    height: 'auto',
    borderRadius: 15,
  },
  containerItemPD: {
    width: '100%',
    height: 'auto',
    marginTop: 20,
    backgroundColor:'blue',
    borderRadius: 15,
  },
  content: {
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    paddingTop: PADDING_TOP,
    paddingHorizontal: PADDING_HORIZONTAL,
    height: HEIGHT,
    backgroundColor: BG_COLOR,
  },
});

