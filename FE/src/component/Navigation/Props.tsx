import { StackNavigationProp, createStackNavigator } from "@react-navigation/stack"
import { RootStackParamListHome, RootStackScreenEnumHome } from "../Root/RootStackHome";
import { RootStackParamListExplore, RootStackScreenEnumExplore } from "../Root/RootStackExplore";
import { RootStackParamListAccount, RootStackScreenEnumAccount } from "../Root/RootStackAccount";
import { RootStackParamListOffer, RootStackScreenEnumOffer } from "../Root/RootStackOffer";
import { RootStackParamListCart, RootStackScreenEnumCart } from "../Root/RootStackCart";
import { fromLeft } from "react-navigation-transitions";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export type PropsHome = {
    navigation?: StackNavigationProp<RootStackParamListHome, RootStackScreenEnumHome>
}
export type PropsExplore = {
    navigation?: StackNavigationProp<RootStackParamListExplore, RootStackScreenEnumExplore>
}
export type PropsCart = {
    navigation?: StackNavigationProp<RootStackParamListCart, RootStackScreenEnumCart>
}
export type PropsOffer = {
    navigation?: StackNavigationProp<RootStackParamListOffer, RootStackScreenEnumOffer>
}
export type PropsAccount = {
    navigation?: StackNavigationProp<RootStackParamListAccount, RootStackScreenEnumAccount>
}


export const Stack = createNativeStackNavigator();
