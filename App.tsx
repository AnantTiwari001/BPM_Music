/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {Linking, Text, View} from 'react-native';
import LoginScreen from './src/Screens/LoginScreen';
import {getCodeFromUri, getSpotifyTokensFromCode} from './src/helpers/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LocalStorageKeys} from './src/constants';

function App(): React.JSX.Element {
  // DeepLinking / app opened with link
  Linking.addEventListener('url', async event => {
    console.log('app callback !!!');
    console.log(event.url);
    const spotifyCode = getCodeFromUri(event.url);
    console.log('code: ', spotifyCode);
    if (spotifyCode?.code) {
      const authObject = await getSpotifyTokensFromCode(spotifyCode.code);
      console.log(authObject);
      if (authObject.access_token && authObject.refresh_token) {
        console.log('exists!!');
        AsyncStorage.setItem(
          LocalStorageKeys.spotifyRefreshToken,
          authObject.refresh_token,
        );
        AsyncStorage.setItem(
          LocalStorageKeys.spotifyAcessToken,
          authObject.access_token,
        );
      }
    }
  });
  useEffect(() => {
    return () => {
      Linking.removeAllListeners('url');
    };
  }, []);
  return (
    <View>
      <Text>Hello World</Text>
      <LoginScreen />
    </View>
  );
}

export default App;
