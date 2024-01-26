/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import SplashSreen from './src/screens/Login/SplashSreen';
import Navigation from './src/component/Navigation/Navigation';
import { NavigationContainer } from '@react-navigation/native';
import { DefaultTheme, PaperProvider } from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';




function App(): JSX.Element {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      secondaryContainer: 'transparent',
      // Use transparent to disable the little highlighting oval
    },
  };
  const [isLoadding, setIsLoadding] = useState<boolean>(true);
  setTimeout(() => {
    setIsLoadding(false);
  }, 2000);
  return (
    (isLoadding) ?
      <SplashSreen />
      :
      <NavigationContainer >
        <PaperProvider theme={theme}>
          <Navigation />
        </PaperProvider>
      </NavigationContainer>
  );
}


export default App;
