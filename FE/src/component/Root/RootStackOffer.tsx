
import { uid } from 'uid';
import OfferScreen from '../../screens/Offer/OfferScreen';
import { FadeOfferScreen } from '../BottomNavigation/AniScreenBottomTab';



export enum RootStackScreenEnumOffer {
    OfferHome = 'OfferHome',
    OfferScreen = 'OfferScreen',

}

export type RootStackParamListOffer = {
    OfferHome: undefined,
    OfferScreen: undefined,
}


export const RootStackScreenOffer = () => {
    const Screen: any = [
        { id: uid(), name: RootStackScreenEnumOffer.OfferHome, component: FadeOfferScreen, options: {} },
        { id: uid(), name: RootStackScreenEnumOffer.OfferScreen, component: OfferScreen, options: {} },


    ]
    return Screen;
}
