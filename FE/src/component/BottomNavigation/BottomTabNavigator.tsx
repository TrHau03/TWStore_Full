import React from 'react';
import { RootBottomTab, RootTabParamList, RootTabScreenENum, configTab } from './RootTab/RootTab';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { RootStackScreenEnumHome } from '../Root/RootStackHome';
import { COLORS } from '../../utilities';
import { MD3LightTheme } from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';
const Tab = createMaterialBottomTabNavigator<RootTabParamList>();

const BottomTab = () => {
  return (
    <Tab.Navigator initialRouteName='StackHome' barStyle={{ backgroundColor: COLORS.transparent, height: 75 }} theme={{ colors: { background: 'red' } }} shifting activeColor={COLORS.dark} inactiveColor={COLORS.gray} screenOptions={({ route }: any) => configTab(route)}>
      {
        RootBottomTab().map((item, index) => <Tab.Screen key={item.id} name={item.name} component={item.component} options={item.option} />)
      }
    </Tab.Navigator>


  );
};

export default BottomTab;


