import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { Animated } from "react-native";
import HomeScreen from "../../screens/Home/HomeScreen";
import AccountScreen from "../../screens/Account/Account";
import OfferScreen from "../../screens/Offer/OfferScreen";
import CartScreen from "../../screens/Cart/CartScreen";
import ExploreScreen from "../../screens/Explore/Explore";
import OfferHome from "../../screens/Offer/OfferHome";

const FadeInView = (props: { children: any; }) => {
    const fadeAnim = React.useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

    useFocusEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
        return () => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }).start();
        };
    });

    return (
        <Animated.View // Special animatable View
            style={{
                flex: 1,
                opacity: fadeAnim, // Bind opacity to animated value
            }}>
            {props.children}
        </Animated.View>
    );
};
export const FadeHomeScreen = (props: JSX.IntrinsicAttributes) => (
    <FadeInView>
        <HomeScreen {...props} />
    </FadeInView>
);
export const FadeExploreScreen = (props: JSX.IntrinsicAttributes) => (
    <FadeInView>
        <ExploreScreen {...props} />
    </FadeInView>
);
export const FadeCartScreen = (props: JSX.IntrinsicAttributes) => (
    <FadeInView>
        <CartScreen {...props} />
    </FadeInView>
);
export const FadeOfferScreen = (props: JSX.IntrinsicAttributes) => (
    <FadeInView>
        <OfferHome {...props} />
    </FadeInView>
);
export const FadeAccountScreen = (props: JSX.IntrinsicAttributes) => (
    <FadeInView>
        <AccountScreen {...props} />
    </FadeInView>
);