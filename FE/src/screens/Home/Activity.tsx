import {
  Button,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Header from '../../component/Header/Header';
import { PropsHome } from '../../component/Navigation/Props';
import { BG_COLOR, HEIGHT, PADDING_HORIZONTAL, PADDING_TOP } from '../../utilities/utility';
import { useDispatch, useSelector } from 'react-redux';
import { listProductRecommend } from '../../redux/silces/HomeSelector';
import { useIsFocused } from '@react-navigation/native';
import { fetchInitialListProductRecommend } from '../../redux/silces/Silces';

interface Product_Notifi {
  id: number;
  img: any;
  title: string;
  content: string;
  date: string;
  time: string;
}


const ActivityScreen = ({ navigation }: PropsHome) => {
  const [checkProduct, setcheckProduct] = useState<boolean>(false);
  const [checkActivity, setcheckActivity] = useState<boolean>(false);
  const listProduct = useSelector(listProductRecommend);
  const [reversedListProduct, setReversedListProduct] = useState<Product_Notifi[]>([]);
  const isFocused = useIsFocused();
  const dispatch = useDispatch();


  const flatListRefProduct = useRef<FlatList>(null);
  const flatListRefActivity = useRef<FlatList>(null);


  //Hàm đưa trỏ chuột lên đầu danh sách
  const scrollToTopProduct = () => {
    flatListRefProduct.current?.scrollToOffset({ offset: 0 });
  };

  //Hàm đưa trỏ chuột lên đầu danh sách
  const scrollToTopActivity = () => {
    flatListRefActivity.current?.scrollToOffset({ offset: 0 });
  };

  useEffect(() => {
    if (isFocused) {
      dispatch(fetchInitialListProductRecommend());
    }
  }, [isFocused]);
  useEffect(() => {
    const reversedList = [...listProduct].reverse();
    setReversedListProduct(reversedList);
  }, [listProduct]);



  const renderItem = ({ item }: any) => {
    return (
      <Pressable>
        <View style={styles.containerItemPD}>
          <View style={styles.contentPD}>
            <View style={styles.left}>
              {item.image && item.image.length > 0 && (
                <Image source={{ uri: item.image[0] }} style={styles.imgProduct} />
              )}
            </View>
            <View style={styles.right}>
              <Text style={styles.title}>New Product</Text>
              <Text style={styles.txtcontent}>{item.productName}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Header title='Activity' navigation={navigation} />
      <View style={styles.content}>
        {!checkActivity ?
          <View >
            <View style={styles.groupText}>
              <Text style={styles.txtProduct}>Product</Text>
              <TouchableOpacity
                style={styles.btnSeeMore}
                onPress={() => {
                  setcheckProduct(!checkProduct), checkProduct ? scrollToTopProduct() : null;
                }}>
                {checkProduct ? (
                  <Text style={styles.txtSeeMore}>Ẩn</Text>
                ) : (
                  <Text style={styles.txtSeeMore}>See More</Text>
                )}
              </TouchableOpacity>
            </View>

            <FlatList
              style={
                checkProduct
                  ? [styles.groupProduct, { height: 'auto', marginBottom: 80 }]
                  : [styles.groupProduct, { height: '40%' }]
              }
              ref={flatListRefProduct}
              scrollEnabled={checkProduct}
              data={reversedListProduct}
              renderItem={renderItem}
              keyExtractor={item => item._id}
              numColumns={1}
              showsVerticalScrollIndicator={false}
            />
          </View> : <></>}


        {!checkProduct ?
          <View>
            <View style={styles.groupText}>
              <Text style={styles.txtProduct}>Activity</Text>
              <TouchableOpacity
                style={styles.btnSeeMore}
                onPress={() => {
                  setcheckActivity(!checkActivity), checkActivity ? scrollToTopActivity() : null;
                }}>
                {checkActivity ? (
                  <Text style={styles.txtSeeMore}>Ẩn</Text>
                ) : (
                  <Text style={styles.txtSeeMore}>See More</Text>
                )}
              </TouchableOpacity>
            </View>

            <FlatList
              style={
                checkActivity
                  ? [styles.groupActivity, { height: 'auto', marginBottom: 80 }]
                  : [styles.groupActivity, { height: '40%' }]
              }
              ref={flatListRefActivity}
              scrollEnabled={checkActivity}
              data={DataActivity_Notifi}
              renderItem={renderItem}
              keyExtractor={item => item.id.toString()}
              numColumns={1}
              showsVerticalScrollIndicator={false}
            />
          </View> : <></>}
      </View>
    </View>
  );
};

export default ActivityScreen;

const styles = StyleSheet.create({
  groupActivity: {
  },

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
    marginBottom: 5,
  },
  contentRight: {
    flexDirection: 'row',
    marginTop: 7,
  },
  right: {
    width: '80%',
    height: 'auto',
  },
  left: {
    width: '20%',
    height: 'auto',
    marginRight: 20,
  },
  imgProduct: {
    width: '100%',
    height: HEIGHT * 0.1,
    borderRadius: 10,
  },

  contentPD: {
    flexDirection: 'row',
  },
  containerItemPD: {
    width: '100%',
    height: 'auto',
    margin: 10,
  },

  groupProduct: {
    width: '100%',
  },
  txtSeeMore: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 16,
  },
  btnSeeMore: {
    width: '50%',
    alignItems: 'flex-end',
  },
  txtProduct: {
    width: '50%',
    fontWeight: 'bold',
    color: 'black',
    fontSize: 18,
  },
  groupText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15
  },
  content: {
    height: '100%',
    width: '100%',
  },
  container: {
    flex: 1,
    paddingTop: PADDING_TOP,
    paddingHorizontal: PADDING_HORIZONTAL,
    backgroundColor: BG_COLOR
  },
});

const DataProduct_Notifi: Product_Notifi[] = [
  {
    id: 1,
    img: require('../../asset/image/productnotifi_1.png'),
    title: 'New Product',
    content: 'Nike Air Zoom Pegasus 36 Miami - Special For your Activity',
    date: '21/07/2002',
    time: '9:00 PM',
  },
  {
    id: 2,
    img: require('../../asset/image/productnotifi_2.png'),
    title: 'New Product',
    content: 'Nike Air Zoom Pegasus 36 Miami - Special For your Activity',
    date: '21/07/2002',
    time: '9:00 PM',
  },
  {
    id: 3,
    img: require('../../asset/image/productnotifi_2.png'),
    title: 'New Product',
    content: 'Nike Air Zoom Pegasus 36 Miami - Special For your Activity',
    date: '21/07/2002',
    time: '9:00 PM',
  },
  {
    id: 4,
    img: require('../../asset/image/productnotifi_2.png'),
    title: 'New Product',
    content: 'Nike Air Zoom Pegasus 36 Miami - Special For your Activity',
    date: '21/07/2002',
    time: '9:00 PM',
  },
  {
    id: 5,
    img: require('../../asset/image/productnotifi_1.png'),
    title: 'New Product',
    content: 'Nike Air Zoom Pegasus 36 Miami - Special For your Activity',
    date: '21/07/2002',
    time: '9:00 PM',
  },
  {
    id: 6,
    img: require('../../asset/image/productnotifi_2.png'),
    title: 'New Product',
    content: 'Nike Air Zoom Pegasus 36 Miami - Special For your Activity',
    date: '21/07/2002',
    time: '9:00 PM',
  },
  {
    id: 7,
    img: require('../../asset/image/productnotifi_1.png'),
    title: 'New Product',
    content: 'Nike Air Zoom Pegasus 36 Miami - Special For your Activity',
    date: '21/07/2002',
    time: '9:00 PM',
  },
];

const DataActivity_Notifi: Product_Notifi[] = [
  {
    id: 1,
    img: require('../../asset/image/Transaction.png'),
    title: 'Transaction Nike Air Zoom Product',
    content:
      'Culpa cillum consectetur labore nulla nulla magna irure. Id veniam culpa officia aute dolor amet deserunt ex proident commodo',
    date: '21/07/2002',
    time: '9:00 PM',
  },
  {
    id: 2,
    img: require('../../asset/image/Transaction.png'),
    title: 'Transaction Nike Air Max',
    content: 'Nike Air Zoom Pegasus 36 Miami - Special For your Activity',
    date: '21/07/2002',
    time: '9:00 PM',
  },
  {
    id: 3,
    img: require('../../asset/image/Transaction.png'),
    title: 'Transaction Nike Air Zoom Product',
    content:
      'Culpa cillum consectetur labore nulla nulla magna irure. Id veniam culpa officia aute dolor amet deserunt ex proident commodo',
    date: '21/07/2002',
    time: '9:00 PM',
  },
  {
    id: 4,
    img: require('../../asset/image/Transaction.png'),
    title: 'Transaction Nike Air Max',
    content: 'Nike Air Zoom Pegasus 36 Miami - Special For your Activity',
    date: '21/07/2002',
    time: '9:00 PM',
  },
  {
    id: 5,
    img: require('../../asset/image/Transaction.png'),
    title: 'Transaction Nike Air Zoom Product',
    content:
      'Culpa cillum consectetur labore nulla nulla magna irure. Id veniam culpa officia aute dolor amet deserunt ex proident commodo',
    date: '21/07/2002',
    time: '9:00 PM',
  },
  {
    id: 6,
    img: require('../../asset/image/Transaction.png'),
    title: 'Transaction Nike Air Max',
    content: 'Nike Air Zoom Pegasus 36 Miami - Special For your Activity',
    date: '21/07/2002',
    time: '9:00 PM',
  },
  {
    id: 7,
    img: require('../../asset/image/Transaction.png'),
    title: 'Transaction Nike Air Zoom Product',
    content:
      'Culpa cillum consectetur labore nulla nulla magna irure. Id veniam culpa officia aute dolor amet deserunt ex proident commodo',
    date: '21/07/2002',
    time: '9:00 PM',
  },
];

