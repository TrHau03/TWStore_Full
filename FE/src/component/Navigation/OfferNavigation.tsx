
import { configStack } from '../Root/RootStack';
import { RootStackScreenOffer } from '../Root/RootStackOffer';
import { Stack } from './Props';




const OfferNavigation = () => {

    return <Stack.Navigator initialRouteName='OfferHome' screenOptions={({ route }) => configStack(route)}>
        {RootStackScreenOffer().map((item: any) => {
            return (
                <Stack.Screen key={item.id} name={item.name} component={item.component} options={item.options} />
                
            )
        })}
    </Stack.Navigator>
}


export default OfferNavigation
