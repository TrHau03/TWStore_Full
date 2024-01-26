import React, { useState } from 'react';
import { View, Image, StyleSheet, Pressable, Alert, PermissionsAndroid } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ButtonBottom from '../../component/Button/Button';
import { ImageLibraryOptions, ImagePickerResponse } from 'react-native-image-picker';
import { CameraOptions } from 'react-native-image-picker';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

const ChanceImage = () => {
    const [selectedImage, setSelectedImage] = useState<string>('');
    // const selectedImageFromRedux = useSelector((state: any) => state.SilcesReducer.image || '');
    const selectedImageFromRedux = useSelector((state: any) => state.SilcesReducer ? state.SilcesReducer[0] : null);
    
    const AddImage = async () => {

        Alert.alert(
            'Bạn muốn chọn ảnh từ đâu ?',
            '',
            [
                {
                    text: 'Thư viện',
                    onPress: async () => {
                        const options: ImageLibraryOptions = {
                            mediaType: 'photo',
                            includeBase64: false,
                        };

                        launchImageLibrary(options, (response: any) => {
                            if (!response.didCancel) {
                                const imageUri = response.uri || (response.assets && response.assets[0]?.uri);
                                setSelectedImage(imageUri);
                            }
                        });
                    }
                },
                {
                    text: 'Camera',
                    onPress: async () => {
                        const cameraOptions: CameraOptions = {
                            mediaType: 'photo',
                            includeBase64: false,
                        };

                        try {
                            const granted = await PermissionsAndroid.request(
                                PermissionsAndroid.PERMISSIONS.CAMERA,
                                {
                                    title: "App Camera Permission",
                                    message: "App needs access to your camera",
                                    buttonNeutral: "Ask Me Later",
                                    buttonNegative: "Cancel",
                                    buttonPositive: "OK"
                                }
                            );

                            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                                launchCamera(cameraOptions, (response: any) => {
                                    if (!response.didCancel) {
                                        const imageUri = response.uri || (response.assets && response.assets[0]?.uri);
                                        setSelectedImage(imageUri);
                                    }
                                });
                            } else {
                                console.log("Camera permission denied");
                            }
                        } catch (err) {
                            console.warn(err);
                        }
                    }
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

    const handleImage = (value: string) => {
        if (!value) {
            Alert.alert('Thông báo', 'Vui lòng chọn ảnh trước khi lưu.');
        } else {
            // dispatch(setImage(value));
        }
    }
    

    return (
        <View style={styles.container}>
            <Image style={styles.img} source={{ uri: selectedImage || selectedImageFromRedux.image }} />

            <View style={{ width: '100%', position: 'absolute', bottom: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Pressable style={{ width: '48.5%' }} onPress={() => AddImage()}>
                    <ButtonBottom title='Edit' />
                </Pressable>
                <Pressable style={{ width: '48.5%' }} onPress={() => handleImage(selectedImage)}>
                    <ButtonBottom title='Save' />
                </Pressable>
            </View>
        </View>
    );
}

export default ChanceImage;

const styles = StyleSheet.create({
    container: {
        height: '80%',
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    img: {
        width: '100%',
        height: '87%',
        borderRadius: 10,
    },
});
