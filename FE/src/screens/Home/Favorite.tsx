import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useRef } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { AirbnbRating } from 'react-native-ratings';
import Header from '../../component/Header/Header';
import { PropsHome } from '../../component/Navigation/Props';
import { SafeAreaView } from 'react-native-safe-area-context';


//redux




const renderItem = ({ item }: any): React.JSX.Element => {
  const { id, image, name, price, strikeThrough, saleOff } = item;


  return (
    <TouchableOpacity style={styles.containerItemPD} >
      <View style={styles.content}>
        <View style={styles.ImgContainerPD}>
          <Image style={{ width: '100%', height: '100%' }} source={image} />
        </View>
        <View style={styles.in4PD}>
          <View style={styles.in4Text}>
            <Text style={styles.NamePD}>{name}</Text>
            <View style={styles.star}>
              <AirbnbRating count={5} size={15} showRating={false} />
            </View>
            <Text style={styles.PricePD}>{price}</Text>
          </View>
          <View style={styles.sale}>
            <Text style={styles.txtOldPrice}>${strikeThrough}</Text>
            <Text style={styles.txtSale}>{saleOff}% Off</Text>
            <TouchableOpacity >
              <Icon name="trash-outline" size={25} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
const { height: HEIGHT, width: WIDTH } = Dimensions.get('window');

const FavoriteScreen = ({ navigation }: PropsHome) => {

  //redux

  const animatedHeader = useRef(new Animated.Value(0)).current;
  useEffect(() => {
  }, [animatedHeader])
  const animationHeader = [{
    opacity: animatedHeader.interpolate({
      inputRange: [0, 50],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    }),
    transform: [
      {
        translateX: animatedHeader.interpolate({
          inputRange: [0, 50],
          outputRange: [0, -250],
          extrapolate: 'clamp'
        })
      }
    ]
  }]
  const animationSearh = [{
    opacity: animatedHeader.interpolate({
      inputRange: [0, 50],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    }),
    transform: [
      {
        translateX: animatedHeader.interpolate({
          inputRange: [0, 50],
          outputRange: [2520, -50],
          extrapolate: 'clamp'
        })
      }
    ]
  }]
  let currentOffset = 0;
  let direction: string;

  return (
    <SafeAreaView>
      <View style={styles.container} >
        <View style={{ flexDirection: 'row' }}>
          <Animated.View style={[animationHeader, styles.header]}>
            <Header title='Favorite' navigation={navigation} />
          </Animated.View>
          <Animated.View
            style={[animationSearh, { borderColor: 'black', borderWidth: 0.5, width: '70%', flexDirection: 'row', alignItems: 'center', paddingVertical: 2, paddingHorizontal: 5, borderRadius: 5 }]}
          >
            <Icon name='search' size={20} />
            <TextInput style={{ paddingVertical: 0, width: '70%' }} />
          </Animated.View>
        </View>
        <FlatList
          onScroll={e => {
            animatedHeader.setValue(e.nativeEvent.contentOffset.y);
            direction = e.nativeEvent.contentOffset.y > currentOffset ? 'down' : 'up';
            currentOffset = e.nativeEvent.contentOffset.y;
            if (direction == 'down' && currentOffset > 0) {
              navigation?.getParent()?.setOptions({ tabBarStyle: { display: 'none' } })
            } else {
              navigation?.getParent()?.setOptions({ tabBarStyle: { display: 'flex' } })
            }
          }
          }

          scrollEventThrottle={16}
          nestedScrollEnabled={true}
          style={{ marginTop: 20, marginBottom: 70 }}
          data={null}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default FavoriteScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    paddingHorizontal: 10,
    paddingTop: 20
  },
  imgIc: {
    width: '20%',
    marginLeft: 10,
    justifyContent: 'center',
  },
  txtSale: {
    color: 'red',
    fontSize: 17,
    marginLeft: 20,
    fontWeight: 'bold',
  },
  txtOldPrice: {
    textDecorationLine: 'line-through', // Gạch ngang văn bản
    fontSize: 16,
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
  },
  sale: {
    width: '80%',
    flexDirection: 'row',
  },
  star: {
    width: '65%',
    marginTop: 5,
  },

  content: {
    padding: 15
  },
  NamePD: {
    fontSize: 16,
    fontWeight: '700',
    fontStyle: 'normal',
    fontFamily: 'Helvetica Neue',
    color: 'black',
    margin: 1,
  },
  PricePD: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: '700',
    fontStyle: 'normal',
    fontFamily: 'Helvetica Neue',
    lineHeight: 24,
    color: '#4464C4',
  },
  in4Text: {
    marginTop: 5,
    width: '100%',
  },
  ImgContainerPD: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    height: '50%',
    borderRadius: 20,
  },

  in4PD: {
    justifyContent: 'space-between',
    width: '100%',
    height: '50%',
    borderRadius: 5,
  },
  containerItemPD: {
    borderWidth: 0.5,
    width: '48%',
    height: 300,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    shadowColor: '#C4C4C4',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginLeft: 5,
    marginBottom: 5
  },
});