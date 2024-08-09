/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {Linking, Text, View} from 'react-native';
import LoginScreen from './src/Screens/LoginScreen';
import {getCodeFromUri, getSpotifyTokensFromCode} from './src/helpers/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {initialAppState, LocalStorageKeys} from './src/constants';
import SelectBPM from './src/Screens/SelectBPM';
import {getCurrentUserId} from './src/helpers/SpotifyApiCalls';
import FetchUserTracks from './src/Screens/FetchUserTracks';
import {AppContext} from './src/hooks/MyContext';

function App(): React.JSX.Element {
  const [appState, setAppState] = useState(initialAppState);
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
      storeUserId(authObject.access_token);
    }
  });
  const storeUserId = async (authToken: string) => {
    console.log('getting current user info');
    const userId = await getCurrentUserId(authToken);
    if (!userId) {
      console.log('something went wrong getting the userId');
      return undefined;
    }
    console.log('userId: ', userId);
    AsyncStorage.setItem(LocalStorageKeys.userId, userId);
  };
  const getInitialApplicationState = async () => {
    const tempState = {...initialAppState};
    const savedTracksString = await AsyncStorage.getItem(
      LocalStorageKeys.tracks,
    );
    if (
      !savedTracksString ||
      (await JSON.parse(savedTracksString)).length < 1
    ) {
      console.log('There is no track in cache');
      tempState.savedTracks.isInitial = true;
    }

    setAppState(tempState);
  };
  useEffect(() => {
    getInitialApplicationState();
    return () => {
      Linking.removeAllListeners('url');
    };
  }, []);
  return (
    <AppContext.Provider
      value={{state: appState, setState: newState => setAppState(newState)}}>
      <View style={{flex: 1}}>
        <Text>Hello World</Text>
        <LoginScreen />
        <FetchUserTracks />
        <SelectBPM />
      </View>
    </AppContext.Provider>
  );
}

export default App;
