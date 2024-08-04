import React from 'react';
import {Button, Linking, Text, View} from 'react-native';
import {
  generateSpotifyAuthUri,
  getSpotifyTokensFromCode,
} from '../helpers/auth';

export default function LoginScreen() {
  const handleLogin = () => {
    const spotifyUiUrl = generateSpotifyAuthUri();
    console.log('Opening the login page: ', spotifyUiUrl);
    Linking.openURL(spotifyUiUrl);
  };
  return (
    <View>
      <Text>Login in to Spotify</Text>
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}
