import React from 'react';
import {Linking, Text, View} from 'react-native';
import {generateSpotifyAuthUri} from '../helpers/auth';
import UIButton from '../components/Buttton';

export default function LoginScreen() {
  const handleLogin = () => {
    const spotifyUiUrl = generateSpotifyAuthUri();
    console.log('Opening the login page: ', spotifyUiUrl);
    Linking.openURL(spotifyUiUrl);
  };
  return (
    <View>
      <Text>Login in to Spotify</Text>
      <UIButton title="Login" onPress={handleLogin} />
    </View>
  );
}
