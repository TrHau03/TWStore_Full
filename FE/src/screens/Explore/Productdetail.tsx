import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Alert,
  FlatList,
  SectionList,
  RefreshControl
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import AxiosInstance from '../../Axios/Axios';
import { RootStackScreenEnumExplore } from '../../component/Root/RootStackExplore';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, isLoading } from '../../redux/silces/Silces';
import { HEIGHT, WIDTH } from '../../utilities/utility';
import { uid } from 'uid';
import { NumericFormat } from 'react-number-format';
import { RootStackScreenEnumAccount } from '../../component/Root/RootStackAccount';
import Loading from '../../component/Loading/Loading';



const windowWidth = Dimensions.get('window').width;

type CustomRatingBarProps = {
  numberOfRatings: number;
};

interface AverageStarsResult {
  averageStars: number;
  starCounts: { [key: number]: number };
}

interface Product {
  _id: string;
  brand: any;
  categoryID: any;
  colorID: any;
  image: [];
  offer: number;
  price: number;
  productName: string;
  quantity: number;
  size: [];
  description: string;
}

interface Comment {
  iduser: string;
  content: string;
  image: [];
  star: number;
}


const Productdetail = (props: NativeStackHeaderProps) => {
  const { id } = props?.route.params as { id: string | undefined };
  const { navigation } = props
  const [product, setProduct] = useState<Product>();
  const [listProductByBrand, setListProductByBrand] = useState<[]>();
  const [listComment, setListComment] = useState<Comment[]>([]);
  const [commentCount, setCommentCount] = useState<number>(0);
  const [totalStars, setTotalStars] = useState<number>(0);
  const [handleAdd, setHandleAdd] = useState<boolean>(false);
  const dispatch = useDispatch();

  const scrollRef = useRef<any>();

  const onRefreshProductLike = (id: string) => {
    fetchProductByID(id);
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  }

  const data = useSelector((state: any) => {
    return state.SlicesReducer.user.cartItem;
  });

  const user = useSelector((state: any) => {
    return state.SlicesReducer.user;
  });
  const isUser = useSelector((state: any) => state.SlicesReducer.user._idUser);


  const isFocus = useIsFocused();

  //đánh giá sản phẩm
  const [maxRating] = useState([1, 2, 3, 4, 5]);
  const starImgFilled = 'https://raw.githubusercontent.com/tranhonghan/images/main/star_filled.png';
  const starImgCorner = 'https://raw.githubusercontent.com/tranhonghan/images/main/star_corner.png';

  //chọn màu chọn size
  const [selectedColor, setSelectedColor] = useState<{ _id: string, code: string, name: string }>();
  const [selectedSize, setSelectedSize] = useState<{ _id: string, name: string }>();

  const sortedSizes = product?.size.slice().sort((a, b) => a - b);

  const calculateAverageStars = (comments: Comment[]): AverageStarsResult => {
    if (!comments || comments.length === 0) {
      return { averageStars: 0, starCounts: {} };
    }

    let totalStars = 0;
    const starCounts: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    comments.forEach((comment) => {
      const stars = comment.star;
      totalStars += stars;
      starCounts[stars]++;
    });

    const averageStars = totalStars / comments.length;

    // Làm tròn số trung bình lên hoặc xuống
    const roundedAverageStars = Math.round(averageStars);

    // Đảm bảo roundedAverageStars là số từ 1 đến 5
    const finalAverageStars = Math.min(5, Math.max(1, roundedAverageStars));

    return {
      averageStars: finalAverageStars,
      starCounts,
    };
  };
  const fetchProductByID = async (id: string | undefined) => {
    dispatch(isLoading(true));
    const response = await AxiosInstance().get(`product/getProductById/${id}`);
    setProduct(response.data);
    response && fetchProductByBrand(response.data.brand._id);
  }
  const fetchProductByBrand = async (id: string) => {
    const response = await AxiosInstance().get(`product/getProductByIdBrand/${id}`);
    setListProductByBrand(response.data);
    dispatch(isLoading(false));
  }
  const fetchCommentbyIdProduct = async () => {
    try {
      const response = await AxiosInstance().get(`comment/getCommentbyIdProduct/${id}`);
      if (response.data && Array.isArray(response.data)) {
        const { averageStars, starCounts } = calculateAverageStars(response.data);
        setListComment(response.data);
        setTotalStars(averageStars);
        setCommentCount(response.data.length);
      } else {
        console.error('Invalid data format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      if (isFocus) {
        fetchProductByID(id);
        fetchCommentbyIdProduct();
      }
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
        setSelectedColor(undefined);
        setSelectedSize(undefined);
      };
    }, [isFocus]))


  const topTwoComments = listComment
    .sort((a, b) => b.star - a.star) // Sắp xếp giảm dần theo số sao
    .slice(0, 2);

  const CustomRatingBar: React.FC<CustomRatingBarProps> = ({ numberOfRatings }) => (
    <View style={styles.customRatingBarStyle}>
      {maxRating.map((item, key) => (
        <View key={item}>
          <Image
            style={styles.starImaStyle}
            source={item <= totalStars ? { uri: starImgFilled } : { uri: starImgCorner }}
          />
        </View>
      ))}
      <Text style={styles.ratingCountText}>{totalStars}</Text>
      <Text style={styles.ratingCountText}>({numberOfRatings} Đánh giá)</Text>

    </View>
  );
  const [currentPage, setCurrentPage] = useState(0);
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const currentIndex = Math.round(contentOffset.x / windowWidth);
    setCurrentPage(currentIndex);
  };

  const handle = ({ productID, sizeProduct, colorProduct }: any) => {
    const checkAddProductSize = data.map((item: any) => {
      return item.sizeProduct._id;
    }
    )
    const checkAddProductColor = data.map((item: any) => {
      return item.colorProduct._id;
    })
    if (sizeProduct == undefined || colorProduct == undefined) {
      Alert.alert('Thông báo', 'Sản phẩm chưa được thêm vào!', [
        { text: 'OK' }
      ]);
    } else {
      if (checkAddProductSize.includes(sizeProduct._id) && checkAddProductColor.includes(colorProduct._id)) {
        Alert.alert('Thông báo', 'Sản phẩm đã có trong giỏ hàng!', [
          { text: 'OK' }
        ]);
      } else {
        dispatch(addItem({ key: uid(3), productID: productID, sizeProduct: sizeProduct, colorProduct: colorProduct, quantity: 1 }));
        setHandleAdd(true);
      }

    }
  }


  const handleAddTocart = async () => {
    const cart: { key: any, productID: any; sizeProduct: any; colorProduct: any; quantity: number }[] = [];
    data.map((item: any) =>
      cart.push({ key: item.key, productID: item.productID._id, sizeProduct: item.sizeProduct._id, colorProduct: item.colorProduct._id, quantity: 1 })
    )
    await AxiosInstance().post('/users/updateInfoUser', { _id: user._idUser, cartItem: cart })
  };

  const createTwoButtonAlert = () =>
    Alert.alert('Thông báo', 'Thêm vào giỏ hàng thành công!', [
      { text: 'OK', onPress: () => handleAddTocart() }
    ]);

  if (handleAdd) {
    createTwoButtonAlert();
    setHandleAdd(false);
  }
  console.log('render');

  const RenderItem = ({ item }: { item: any }) => {
    return (
      <View style={styles.reviewContainer}>
        <Loading />
        <View style={styles.reviewHeader}>
          <Image
            source={{ uri: item.avatar ? item.avatar : 'https://cdn.sforum.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg' }}
            style={styles.userImage}
          />
          <View style={styles.userInfo}>
            {item.userID.name ? (
              <Text style={styles.userName}>{item.userID.name}</Text>
            ) : (
              <Text style={styles.userName}>{item.userID.username}</Text>
            )}

            <View style={styles.starRating}>
              {Array.from({ length: item.star }, (_, index) => (
                <Image
                  key={index}
                  source={{ uri: 'https://raw.githubusercontent.com/tranhonghan/images/main/star_filled.png' }}
                  style={styles.starImaStyle}
                />
              ))}
            </View>
          </View>
        </View>
        {item.content && <Text style={styles.reviewComment}>{item.content}</Text>}
        {item.image && Array.isArray(item.image) && item.image.filter((imageURL: string) => imageURL !== "").length > 0 && (
          <View style={styles.commentImagesContainer}>
            {item.image.map((imageURL: string, index: number) => {
              if (imageURL !== "") {
                return (
                  <Image
                    key={index}
                    source={{ uri: imageURL }}
                    style={styles.CommentImage}
                  />
                );
              }
              return null;
            })}
          </View>
        )}

        <View style={styles.reviewFooter}>
          <Text style={styles.reviewDateTime}>{item.createAt}</Text>
        </View>
      </View>
    );
  }

  const [refreshingProductDetail, setRefreshingProductDetail] = useState<boolean>(false);

  const onRefreshProductDetail = React.useCallback(() => {
    setRefreshingProductDetail(true);
    fetchProductByID(id);
    fetchCommentbyIdProduct();
    setTimeout(() => {
      setRefreshingProductDetail(false);
    }, 2000);
  }, []);
  return (
    <View style={{ height: '100%' }}>
      <ScrollView ref={scrollRef}
        refreshControl={
          <RefreshControl refreshing={refreshingProductDetail} onRefresh={onRefreshProductDetail} />
        }>
        <View style={styles.header}>
          <Pressable style={{ position: 'absolute', left: 10 }} onPress={() => navigation.navigate(RootStackScreenEnumExplore.ExploreScreen)}>
            <Icon name='chevron-back-outline' size={26} />
          </Pressable>
          <Text style={styles.name}>{product?.brand?.name}</Text>
        </View>
        <View>
          <View style={styles.slideshowcontainer}>
            <ScrollView
              horizontal
              pagingEnabled
              contentContainerStyle={styles.contentContainer}
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
            >
              {product?.image.map((product: any, index: any) => (
                <View key={index} style={styles.slide}>
                  <Image source={{ uri: product }} style={styles.image} />
                </View>
              ))}
            </ScrollView>
            <View style={styles.pagination}>
              {product?.image.map((_: any, index: React.Key | null | undefined) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    index === currentPage && styles.activeDot, // Apply activeDot style for the current page
                  ]}
                />
              ))}
            </View>
          </View>
          <View style={styles.nameproduct}>
            <Text style={styles.product}>{product?.productName}</Text>
          </View>
          <View style={styles.marginlefft}>
            <View>
              <CustomRatingBar numberOfRatings={commentCount} />
            </View>
            <NumericFormat displayType={'text'} value={Number(product && product.price - (product.price * (product.offer / 100)))} allowLeadingZeros thousandSeparator="," renderText={(formattedValue: any) => <Text style={styles.price}>{formattedValue + 'đ'} </Text>} />
            <Text style={styles.textsize}>Chọn kích cỡ</Text>
            <View style={styles.sizeContainer}>
              <ScrollView
                horizontal
                contentContainerStyle={styles.sizeScrollViewContent}
                showsHorizontalScrollIndicator={false}
              >
                {sortedSizes?.map((size: any, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.sizeCircle,
                      { borderColor: selectedSize?._id === size?._id ? '#1C1C1C' : '#EBF0FF' },
                    ]}
                    onPress={() => setSelectedSize(size)}
                  >
                    <Text
                      style={[
                        styles.sizeText,
                        { color: selectedSize?._id === size._id ? '#223263' : '#223263' },
                      ]}
                    >
                      {size.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <Text style={styles.textsize}>Chọn màu</Text>
            <View style={styles.colorContainer}>
              <ScrollView
                horizontal
                contentContainerStyle={styles.colorScrollViewContent}
                showsHorizontalScrollIndicator={false}
              >
                {product?.colorID.map((color: any, index: React.Key | null | undefined) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.colorCircle,
                      { backgroundColor: color.code },
                    ]}
                    onPress={() => setSelectedColor(color)}
                  >
                    {selectedColor?._id === color._id && <View style={styles.selectedColorDot}></View>}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <Text style={styles.textsize}>Mô tả</Text>
            <Text style={styles.comment2}>{product?.description}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={styles.textsize}>Đánh giá sản phẩm</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Productreviews', { id: id })}>
                <Text style={styles.textsize2}>Xem thêm</Text>
              </TouchableOpacity>
            </View>
            <CustomRatingBar numberOfRatings={commentCount} />
            <View style={{ height: 'auto', alignItems: 'center' }}>
              {listComment && listComment.length > 0 ? (
                <View>
                  {topTwoComments.map((comment, index) => (
                    <RenderItem key={index} item={comment} />
                  ))}
                </View>
              ) : (
                <Text style={{ fontSize: 20 }}>Chưa có đánh giá</Text>
              )}

            </View>

            <View>
              <Text style={styles.textsize}>Bạn cũng có thể thích</Text>
              <View style={styles.productList}>
                <ScrollView
                  horizontal
                  contentContainerStyle={styles.sizeScrollViewContent}
                  showsHorizontalScrollIndicator={false}
                >
                  {listProductByBrand?.map((product: any) => (
                    <TouchableOpacity onPress={() => { onRefreshProductLike(product._id) }} key={product._id} style={styles.productItem}>
                      <Image source={{ uri: product.image[0] }} style={styles.productImage} />
                      <Text style={styles.productName}>{product.productName}</Text>
                      <View style={styles.sale}>
                        <NumericFormat displayType={'text'} value={Number(product.price - product.price * (product.offer / 100))} allowLeadingZeros thousandSeparator="," renderText={(formattedValue: any) => <Text style={styles.productPrice}>{formattedValue + 'đ'} </Text>} />
                        <View style={{ flexDirection: 'row' }}>
                          <NumericFormat displayType={'text'} value={Number(product.price)} allowLeadingZeros thousandSeparator="," renderText={(formattedValue: any) => <Text style={styles.productOldPrice}>{formattedValue + 'đ'} </Text>} />
                          <Text style={styles.textsale}> Giảm {product.offer}%</Text>
                        </View>
                      </View>
                    </TouchableOpacity>

                  ))}
                </ScrollView>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.addtocartButtonContainer}>
        {isUser == '' ?
          <TouchableOpacity
            style={styles.addtocartButton}
            onPress={() => navigation.navigate('Account', { screen: RootStackScreenEnumAccount.AccountScreen })}
          >
            <LinearGradient colors={['#46CAF3', '#68B1D9']} style={{ borderRadius: 10 }}>
              <Text style={styles.addtocartButtonText}>Vui lòng đăng nhập!</Text>
            </LinearGradient>
          </TouchableOpacity> :
          <TouchableOpacity
            style={styles.addtocartButton}
            onPress={() => { handle({ productID: product, sizeProduct: selectedSize, colorProduct: selectedColor }); }}
          >
            <LinearGradient colors={['#46CAF3', '#68B1D9']} style={{ borderRadius: 10 }}>
              <Text style={styles.addtocartButtonText}>Thêm Vào Giỏ Hàng</Text>
            </LinearGradient>
          </TouchableOpacity>}
      </View>
    </View >

  );
}
export default Productdetail;
const styles = StyleSheet.create({
  CommentImage: {
    width: '20%',
    height: 80,
    resizeMode: 'cover',
    borderRadius: 20,
    marginBottom: 20,
    margin: 10,
  },
  commentImagesContainer: {
    flexDirection: 'row',
  },
  reviewStars: {
    fontSize: 15,
  },
  reviewContainer: {
    marginLeft: -20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    width: WIDTH * 0.9,
    height: 'auto',
    backgroundColor: 'white',
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    marginTop: 10,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
    marginTop: 5,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'poppins',
    color: '#223263',
    lineHeight: 21,
  },
  starRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  reviewContent: {
    marginBottom: 5,
  },
  reviewComment: {
    marginTop: 10,
    marginBottom: 15,
    fontStyle: 'italic',
    textAlign: 'justify',
    fontSize: 17,
    margin: 5,
  },
  reviewFooter: {
    marginBottom: 10,
  },
  reviewDateTime: {
    marginLeft: 10,
    color: '#888',
  },

  addtocartButtonContainer: {
    position: 'absolute',
    bottom: 5,
    alignSelf: 'center',
    width: windowWidth - 20,
  },
  addtocartButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  addtocartButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    fontFamily: "poppins",
    fontWeight: '800',
    height: 60,
    lineHeight: 60,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    height: 80,
    backgroundColor: 'white',
  },
  icon: {
    width: 24,
    height: 24,
    marginTop: 30,
  },
  name: {
    fontSize: 22,
    lineHeight: 24,
    fontFamily: 'poppins',
    fontWeight: "700",
    color: '#223263',
    letterSpacing: 0.5,
  },

  nameproduct: {
    flexDirection: 'row',
    width: windowWidth - 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  product: {
    fontSize: 27,
    lineHeight: 30,
    fontFamily: 'poppins',
    fontWeight: '700',
    color: '#223263',
    padding: 20,
    marginLeft: 20,
  },
  customRatingBarStyle: {
    flexDirection: 'row',
    marginBottom: 20,
    marginTop: 10,
  },
  starImaStyle: {
    width: 25,
    height: 25,
    resizeMode: 'cover'
  },
  price: {
    fontSize: 23,
    lineHeight: 30,
    fontFamily: 'poppins',
    fontWeight: '700',
    color: 'black',
  },
  textsize: {
    fontSize: 17,
    lineHeight: 30,
    fontFamily: 'poppins',
    fontWeight: '700',
    color: '#223263',
    marginTop: 20,
  },
  textsize2: {
    fontSize: 17,
    lineHeight: 30,
    fontFamily: 'poppins',
    fontWeight: '700',
    color: '#141414',
    marginTop: 20,
    marginRight: 20,
  },

  size: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  sizeCircle: {
    width: 45,
    height: 45,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    marginRight: 16,
  },
  sizeText: {
    fontSize: 18,
    fontWeight: '700',
  },
  sizeContainer: {
    marginTop: 20,
    flexDirection: 'row',
    overflow: 'hidden',

  },
  sizeScrollViewContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorContainer: {
    marginTop: 20,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  colorScrollViewContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  selectedColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'white',
  },
  comment: {
    marginTop: 20,
    fontSize: 15,
    lineHeight: 21.6,
    fontFamily: 'poppins',
    fontWeight: "400",
    color: '#223263',
    letterSpacing: 0.5,
  },
  comment2: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 21.6,
    fontFamily: 'poppins',
    fontWeight: "400",
    color: '#223263',
    letterSpacing: 0.5,
  },
  marginlefft: {
    marginLeft: 20,
  },
  ratingCountText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#223263',
    marginLeft: 10,
    marginTop: 2,
  },
  productList: {
    marginBottom: 60,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: -10, // Adjust as needed
  },
  productItem: {
    width: 160,
    height: 250,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    margin: 10,
  },
  productImage: {
    width: 130,
    height: 120,
    borderRadius: 20,
    padding: 8,
  },
  productName: {
    fontSize: 16,
    marginTop: 10,
    color: '#223263',
    marginBottom: 8,
    fontWeight: "700",
    textAlign: 'center'
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: 'black',
    marginBottom: 8,
    alignSelf: 'center',
  },
  productOldPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    color: '#999999',
  },
  stickyContainer: {
    alignSelf: 'center',
  },
  bottomButton: {
    borderRadius: 20,
    width: windowWidth - 40,
    height: 65,
    marginBottom: 20,
  },
  bottomButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    padding: 20,
    alignItems: 'center',
  },
  sale: {
    position: 'absolute',
    bottom: 5,
    paddingHorizontal: 10
  },
  textsale: {
    fontSize: 14,
    fontWeight: "700",
    color: '#FB7181',
  },
  slideshowcontainer: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
  },
  slide: {
    width: windowWidth,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: windowWidth,
    height: 300,
  },
  imageText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#d2d2d2',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: 'black',
  },

});
