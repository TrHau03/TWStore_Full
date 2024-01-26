
import { uid } from 'uid';
import CartScreen from '../../screens/Cart/CartScreen';
import { FadeCartScreen } from '../BottomNavigation/AniScreenBottomTab';
import CartDetail from '../../screens/Cart/CartDetail';



export enum RootStackScreenEnumCart {
    CartScreen = 'CartScreen',
    CartDetail = 'CartDetail',
}

export type RootStackParamListCart = {
    CartScreen: undefined,
    CartDetail : undefined,
}


export const RootStackScreenCart = () => {
    const Screen: any = [
        { id: uid(), name: RootStackScreenEnumCart.CartScreen, component: FadeCartScreen, options: {} },
        { id: uid(), name: RootStackScreenEnumCart.CartDetail, component: CartDetail, options: {} },
    ]
    return Screen;
}
