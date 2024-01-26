import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    PermissionsAndroid,
    FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AxiosInstance from '../../Axios/Axios';
import { useSelector } from 'react-redux';
import storage from '@react-native-firebase/storage';
import uuid from 'react-native-uuid';
import Header from '../../component/Header/Header'
import { PropsExplore } from '../../component/Navigation/Props';

const windowWidth = Dimensions.get('window').width;
let image: any = [];
let imageURL: any = [];
const Addcomment = ({navigation, route} : any) => {
    const user = useSelector((state: any) => state.SlicesReducer.user);
    const { id } = route.params as { id: string | undefined };
    const [content, setContent] = useState<string>('');
    const [star, setStar] = useState<number>(5)

    const [maxRating] = useState([1, 2, 3, 4, 5]);
    const [addImage, setAddImage] = useState<boolean>(false);
    const renderItem = ({ item }: any) => {
        return (
            <View style={{ paddingVertical: 10 }}>
                <Image style={{ height: 100, width: 100 }} source={{ uri: item.img }} />
            </View>
        )
    }

    const starImgFilled =
        'https://raw.githubusercontent.com/tranhonghan/images/main/star_filled.png';
    const starImgCorner =
        'https://raw.githubusercontent.com/tranhonghan/images/main/star_corner.png';
    console.log(star);

    const CustomRatingbar = () => {
        return (
            <View style={styles.customRatingbarStyle}>
                {maxRating.map((item, key) => {

                    return (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            key={item}
                            onPress={() => setStar(item)}
                        >
                            <Image
                                style={styles.starImgStyle}
                                source={
                                    item <= star
                                        ? { uri: starImgFilled }
                                        : { uri: starImgCorner }
                                }
                            />
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };
    const requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                const result: any = await launchCamera({
                    mediaType: 'photo',
                    cameraType: 'front',
                });
                const object = { id: image.length + 1, img: result.assets[0].uri };
                image.push(object);
                setAddImage(!addImage);
            } else {
                console.log('Từ chối');
            }
        } catch (error) {
            console.log(error);
        }
    };
    //Camera

    const requestCameraPermissionPhoto = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
            );
            console.log('Camera permission granted:', granted);

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                const result: any = await launchImageLibrary({ mediaType: 'photo' });

                if (result) {
                    console.log('Selected image URI:', result.assets[0].uri);

                    image.push({ id: image.length + 1, img: result.assets[0].uri });
                    console.log("Image url", image);

                    setAddImage(!addImage);
                } else {
                    console.log('No image selected');
                }
            } else {
                console.log('Permission denied');
            }
        } catch (error) {
            console.log('Error in requestCameraPermissionPhoto:', error);
        }
    };
    const AddImage = async () => {
        Alert.alert(
            'Bạn muốn chọn ảnh từ đâu ?',
            '',
            [
                {
                    text: 'Thư viện',
                    onPress: async () => requestCameraPermissionPhoto()


                },
                {
                    text: 'Camera              ',
                    onPress: async () => requestCameraPermission()
                },
                {
                    text: 'Hủy',
                    onPress: () => {
                        console.log('Hủy');
                    }
                }
            ]
        );
    };

    const handleAddComment = async () => {
        try {
            const uploadImages = async () => {
                await Promise.all(image.map(async (element: any) => {
                    const uniqueFileName = `${uuid.v4()}.jpg`;
                    const reference = storage().ref(`comments/${uniqueFileName}`);
                    await reference.putFile(element.img);
                    const url = await reference.getDownloadURL();
                    imageURL.push(url);
                }));
            };
            await uploadImages();
            console.log(user._id, id, content, imageURL, star);
            const result = await AxiosInstance().post('/comment/addComment', { userID: user._id, productID: id, content: content, image: imageURL, star: star });
            imageURL = [];
            image = [];
            setAddImage(!addImage);
            //navigation.goBack();
            console.log(result.data);

        } catch (error) {
            console.log('Error: ', error);
        }
    };

    return (
        <View style={{marginTop: 20, paddingHorizontal: 20}}>
            <Header title='Viết Đánh Giá' navigation={navigation} />
            <View style={styles.line}></View>
            <ScrollView style={{ height: '100%' }}>
                <View style={styles.bodycontainer}>
                    <Text style={styles.textstyles}>
                        Xin cho chúng tôi biết về mức độ hài lòng của bạn với dịch vụ và sản phẩm của chúng tôi.
                    </Text>
                    <View style={{ flexDirection: 'row', marginTop: 20, marginBottom: 10 }}>
                        <CustomRatingbar />
                    </View>

                    <Text style={[styles.textstyles, { marginTop: 20 }]}>Viết đánh giá của bạn</Text>

                    <TextInput
                        style={styles.input}
                        onChangeText={setContent}
                        value={content}
                        placeholder="Hãy cho chúng tôi biết suy nghĩ của bạn về sản phẩm của chúng tôi"
                        multiline
                    />
                    
                    <ScrollView
                        horizontal
                        contentContainerStyle={styles.selectedImagesContainer}
                        showsHorizontalScrollIndicator={false}
                    >
                        {image.map((item: any) => (
                            <View key={item?.id}>
                                {item && item.img && <Image source={{ uri: item.img }} style={styles.selectedImage} />}
                            </View>
                        ))}

                        {image.length < 6 && (
                            <View style={styles.addimgButton}>
                                <TouchableOpacity onPress={AddImage}>
                                    <LinearGradient
                                        colors={['#46CAF3', '#68B1D9']}
                                        style={{ borderRadius: 10 }}
                                    >
                                        <Text style={styles.textimgstyle}>+</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        )}
                    </ScrollView>


                    <View style={styles.addCommentButtonContainer}>
                        <TouchableOpacity
                            style={styles.addCommentButton}
                            onPress={() => handleAddComment()}
                        >
                            <LinearGradient
                                colors={['#46CAF3', '#68B1D9']}
                                style={{ borderRadius: 10 }}
                            >
                                <Text style={styles.addCommentButtonText}>Đăng Bài</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default Addcomment;


const styles = StyleSheet.create({
    line: {
        height: 0.5,
        backgroundColor: '#ADA8A8',
        width: '120%',
        marginTop: 10,
        position: 'relative',
        right: 20
    },

    imgnew: {
        width: 100,
        height: 100,
        borderRadius: 10,
        margin: 10,
        marginLeft: 1,
    },
    sizeScrollViewContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addimgButton: {
        width: 100,
        height: 100,
        borderRadius: 10,
        margin: 10,
        borderColor: '#9098B1',
        borderWidth: 1,
        marginLeft: 1,
    },
    addPhotoButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: '#68B1D9',
        alignSelf: 'center',
        marginTop: 10,
    },
    addPhotoButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    selectedImagesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 10,
    },
    selectedImage: {
        width: 100,
        height: 100,
        margin: 5,
        borderRadius: 8,
    },
    textimgstyle: {
        textAlign: 'center',
        lineHeight: 100,
        fontSize: 90,
        color: 'white',
    },
    addCommentButtonContainer: {
        alignSelf: 'center',
        width: windowWidth - 15,
        borderRadius: 20,
    },
    addCommentButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
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
    customRatingbarStyle: {
        flexDirection: 'row',
    },
    starImgStyle: {
        width: 40,
        height: 40,
        resizeMode: 'cover',
    },
    input: {
        marginTop: 10,
        borderWidth: 1,
        padding: 16,
        fontSize: 16,
        textAlignVertical: 'top',
        borderRadius: 10,
        height: 150,
    },

    textstyles: {
        fontWeight: '700',
        fontSize: 18,
        color: '#223263',
        textAlign: 'justify',
        lineHeight: 20,
    },
    bodycontainer: {
        marginVertical: 15,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 50,
        backgroundColor: 'white',
    },
    icon: {
        width: 24,
        height: 24,
    },
    name: {
        fontSize: 22,
        lineHeight: 24,
        fontFamily: 'poppins',
        fontWeight: '700',
        color: '#223263',
        marginLeft: 20,
    },
});

