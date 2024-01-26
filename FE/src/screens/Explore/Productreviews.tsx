import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {HEIGHT, WIDTH} from '../../utilities/utility';
import routes from '../../component/constants/routes';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackScreenEnumExplore} from '../../component/Root/RootStackExplore';
import AxiosInstance from '../../Axios/Axios';
import {PropsExplore} from '../../component/Navigation/Props';
import {NativeStackHeaderProps} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';

// Định nghĩa kiểu dữ liệu cho đánh giá (Review)
interface Comment {
  iduser: string;
  content: string;
  image: [];
  star: number;
}
const windowWidth = Dimensions.get('window').width;

export default function ProductReviews(props: NativeStackHeaderProps) {
  const {navigation} = props;
  const user = useSelector((state: any) => state.SlicesReducer.user);
  const route = useRoute();
  const [listComment, setlistComment] = useState<Comment[]>([]);
  const [commentCount, setCommentCount] = useState<number>(0);
  const {id} = route.params as {id: any};
  const [selectedStar, setSelectedStar] = useState<number | null>(null);
  const [filteredComments, setFilteredComments] = useState<Comment[]>([]);
  const [isComment, setIsComment] = useState<boolean>(false);
  const handleStarFilter = (star: number | null) => {
    setSelectedStar(star);
  };
  const starFilterButtons = [
    {label: 'Tất cả đánh giá', star: null},
    {label: ' 5', star: 5},
    {label: ' 4', star: 4},
    {label: ' 3', star: 3},
    {label: ' 2', star: 2},
    {label: ' 1', star: 1},
  ];

  useEffect(() => {
    const fetchCommentbyIdProduct = async (id: string) => {
      const response = await AxiosInstance().get(
        `comment/getCommentbyIdProduct/${id}`,
      );
      setlistComment(response.data);
      setCommentCount(response.data.length);
      setFilteredComments(response.data);
    };
    fetchCommentbyIdProduct(id);
  }, [id]);

  useEffect(() => {
    const filtered =
      selectedStar !== null
        ? listComment.filter(comment => comment.star === selectedStar)
        : listComment;
    setFilteredComments(filtered);
    setCommentCount(filtered.length);
  }, [selectedStar, listComment]);
  useEffect(() => {
    checkProductidInUser(user._id);
  });
  const fetchCommentbyIdProduct = async (id: string) => {
    const response = await AxiosInstance().get(
      `comment/getCommentbyIdProduct/${id}`,
    );
    setlistComment(response.data);
  };
  const checkProductidInUser = async (_id: string) => {
    const listOrder = await AxiosInstance().get(
      `order/getOrderByIdUser/${_id}`,
    );
    const listIDProductOrder: any = [];
    listOrder.data.map((item: any) => {
      item.listProduct.map((product: any) => {
        listIDProductOrder.push(product.productID._id);
      });
    });
    setIsComment(listIDProductOrder.includes(id) ? true : false);
    return;
  };
  const RenderItem = ({item}: {item: any}) => {
    return (
      <View style={styles.reviewContainer}>
        <View style={styles.reviewHeader}>
          <Image
            source={{
              uri: item.avatar
                ? item.avatar
                : 'https://cdn.sforum.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg',
            }}
            style={styles.userImage}
          />
          <View style={styles.userInfo}>
            {item.userID.name ? (
              <Text style={styles.userName}>{item.userID.name}</Text>
            ) : (
              <Text style={styles.userName}>{item.userID.username}</Text>
            )}

            <View style={styles.starRating}>
              {Array.from({length: item.star}, (_, index) => (
                <Image
                  key={index}
                  source={{
                    uri: 'https://raw.githubusercontent.com/tranhonghan/images/main/star_filled.png',
                  }}
                  style={styles.starImaStyle}
                />
              ))}
            </View>
          </View>
        </View>
        {item.content && (
          <Text style={styles.reviewComment}>{item.content}</Text>
        )}
        {item.image && (
          <View style={styles.commentImagesContainer}>
            {Array.isArray(item.image) &&
              item.image.map((imageURL: string, index: any) => (
                <Image
                  key={index}
                  source={{uri: imageURL}}
                  style={styles.CommentImage}
                />
              ))}
          </View>
        )}
        <View style={styles.reviewFooter}>
          <Text style={styles.reviewDateTime}>{item.createAt}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{height: '100%'}}>
      <View style={{}}>
        <View>
          <View style={styles.header}>
            <Text style={styles.name}>{commentCount} Đánh giá</Text>
          </View>

          <ScrollView
            style={{height: '20%'}}
            horizontal
            contentContainerStyle={styles.starfilter}
            showsHorizontalScrollIndicator={false}>
            {starFilterButtons.map(button => (
              <TouchableOpacity
                key={button.label}
                style={[
                  styles.starButton,
                  selectedStar === button.star && styles.selectedStarButton,
                ]}
                onPress={() => handleStarFilter(button.star)}>
                <Image
                  source={{uri: starImages[button.star || 0]}}
                  style={styles.starImage}
                />
                <Text style={styles.starButtonText}>{button.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={{height: '80%', alignItems: 'center'}}>
            {listComment && listComment.length > 0 ? (
              <FlatList
                style={{height: 'auto', marginBottom: HEIGHT * 0.3}}
                showsVerticalScrollIndicator={false}
                renderItem={object => <RenderItem item={object.item} />}
                data={filteredComments}
                keyExtractor={(item: any) => item?._id.toString()}
                initialNumToRender={5}
                maxToRenderPerBatch={5}
              />
            ) : (
              <Text style={{fontSize: 20}}>Chưa có đánh giá</Text>
            )}
          </View>
        </View>
      </View>

      <View style={styles.addCommentButtonContainer}>
        {isComment && (
          <TouchableOpacity
            style={styles.addCommentButton}
            onPress={() => {
              navigation.navigate('AddComment', {id: id});
            }}>
            <LinearGradient
              colors={['#46CAF3', '#68B1D9']}
              style={{borderRadius: 10}}>
              <Text style={styles.addCommentButtonText}>Viết Đánh Giá</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  starImaStyle: {
    width: 25,
    height: 25,
    resizeMode: 'cover',
  },
  addCommentButtonContainer: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    width: windowWidth - 20,
    borderRadius: 10,
  },
  addCommentButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addCommentButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'poppins',
    fontWeight: '800',
    height: 60,
    lineHeight: 60,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 80,
    backgroundColor: 'white',
  },
  icon: {
    width: 24,
    height: 24,
  },
  reviewContainer: {
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
  name: {
    fontSize: 22,
    lineHeight: 24,
    fontFamily: 'poppins',
    fontWeight: '700',
    color: '#223263',
    marginLeft: 20,
  },
  starfilter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starButton: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 8,
    margin: 10,
    borderColor: '#EBF0FF',
    borderWidth: 2,
    alignItems: 'center',
  },
  selectedStarButton: {
    backgroundColor: '#9098B1',
  },
  starButtonText: {
    color: '#1C1C1C',
    fontWeight: '700',
    fontSize: 15,
    lineHeight: 18,
  },
  ReviewContainer: {
    margin: 10,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  reviewStars: {
    fontSize: 15,
  },
  ReviewContent: {
    marginTop: 5,
  },
  starImage: {
    width: 24,
    height: 24,
    marginRight: 5,
  },
  commentImagesContainer: {
    flexDirection: 'row',
  },
  CommentImage: {
    width: '20%',
    height: 80,
    resizeMode: 'cover',
    borderRadius: 20,
    marginBottom: 20,
    margin: 10,
  },
});

const starImages = [
  'https://raw.githubusercontent.com/tranhonghan/images/main/star_corner.png', // 0 Stars
  'https://raw.githubusercontent.com/tranhonghan/images/main/star_filled.png', // 1 Star
  'https://raw.githubusercontent.com/tranhonghan/images/main/star_filled.png', // 2 Stars
  'https://raw.githubusercontent.com/tranhonghan/images/main/star_filled.png', // 3 Stars
  'https://raw.githubusercontent.com/tranhonghan/images/main/star_filled.png', // 4 Stars
  'https://raw.githubusercontent.com/tranhonghan/images/main/star_filled.png', // 5 Stars
];
