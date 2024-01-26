
import { uid } from 'uid';
import ExploreScreen from '../../screens/Explore/Explore';
import Category_Detail_Screen from '../../screens/Explore/Category_Detail';
import FilterScreen from '../../screens/Explore/Filter';
import { FadeExploreScreen } from '../BottomNavigation/AniScreenBottomTab';
import Productdetail from '../../screens/Explore/Productdetail';
import Productreviews from '../../screens/Explore/Productreviews';
import Addcomment from '../../screens/Explore/Addcomment';






export enum RootStackScreenEnumExplore {
    ExploreScreen = 'ExploreScreen',
    Category_Detail_Screen = 'Category_Detail_Screen',
    Productdetail = 'Productdetail',
    Productreviews = 'Productreviews',
    AddComment = 'AddComment',
}

export type RootStackParamListExplore = {
    ExploreScreen: undefined,
    Category_Detail_Screen: undefined,
    Productdetail: any,
    Productreviews: any,
    AddComment: any

}


export const RootStackScreenExplore = () => {
    const Screen: any = [
        { id: uid(), name: RootStackScreenEnumExplore.ExploreScreen, component: FadeExploreScreen, options: {} },
        { id: uid(), name: RootStackScreenEnumExplore.Category_Detail_Screen, component: Category_Detail_Screen, options: {} },
        { id: uid(), name: RootStackScreenEnumExplore.Productdetail, component: Productdetail, options: {} },
        { id: uid(), name: RootStackScreenEnumExplore.Productreviews, component: Productreviews, options: {} },
        { id: uid(), name: RootStackScreenEnumExplore.AddComment, component: Addcomment, options: {} },
    ]
    return Screen;
}
