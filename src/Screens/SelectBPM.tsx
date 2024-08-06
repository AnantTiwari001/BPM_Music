/* eslint-disable react-native/no-inline-styles */
// This is the main page where one can select the songs of the particular BPM
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useRef, useState} from 'react';
import {
  Button,
  Image,
  Linking,
  Modal,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import {LocalStorageKeys} from '../constants';
import {TrackObject} from '../Types';
import {addItemsToPlaylist, createPlaylist} from '../helpers/SpotifyApiCalls';

const bpmBuffer = 30; // bpm +/- the target value is accepted

export default function SelectBPM() {
  const [bpm, setBpm] = useState('');
  const [highestAvailbleBpm, setHighestAvailbleBpm] = useState(0);
  const [lowestAvailbleBpm, setLowestAvailbleBpm] = useState(0);
  const storedTrackArr = useRef<TrackObject[]>([]);
  const [tracks, setTracks] = useState<TrackObject[]>([]);
  const [createdPlaylist, setCreatedPlaylist] = useState<
    {id: string; uri: string} | undefined
  >(undefined);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleBPmSearch = () => {
    console.log('filtering the item with not desired bpm');
    setTracks(
      storedTrackArr.current.filter(
        item => Math.abs(item.bpm - parseInt(bpm)) < bpmBuffer,
      ),
    );
    // for (let index = 0; index < storedTrackArr.current.length; index++) {
    //   const trackItem = storedTrackArr.current[index];
    //   if(Math.abs(trackItem.bpm - parseInt(bpm))< bpmBuffer){

    //   }
    // }
  };
  const getSavedTracks = async () => {
    const tracksString = await AsyncStorage.getItem(LocalStorageKeys.tracks);
    if (!tracksString) {
      console.error('no Saved Tracks present');
      return;
    }
    const savedTracksObj = uniqueTrackArr(await JSON.parse(tracksString));
    getHighLowBpmValue(savedTracksObj);
    storedTrackArr.current = savedTracksObj;
    setTracks(savedTracksObj);
  };

  const getHighLowBpmValue = (trackArr: TrackObject[]) => {
    const tempTracks = [...trackArr];
    tempTracks.sort((a, b) => a.bpm - b.bpm);
    // console.log('sorted: ', tempTracks);
    setLowestAvailbleBpm(tempTracks[0].bpm);
    setHighestAvailbleBpm(tempTracks[tempTracks.length - 1].bpm);
  };

  const uniqueTrackArr = (trackArr: TrackObject[]) => {
    for (let index = 0; index < trackArr.length; index++) {
      const element = trackArr[index];
      for (let i = index + 1; i < trackArr.length; i++) {
        if (element.id === trackArr[i].id) {
          console.log('they both matches: ', element);
          trackArr.splice(index, 1);
        }
      }
    }
    return trackArr;
  };

  const handleCreatePlaylist = async () => {
    setCreatedPlaylist(undefined);
    console.log('Trying to create playlist');
    const accessToken = await AsyncStorage.getItem(
      LocalStorageKeys.spotifyAcessToken,
    );
    const userId = await AsyncStorage.getItem(LocalStorageKeys.userId);
    if (!accessToken || !userId) {
      console.error('spotify accessToken or userId is missing');
      return undefined;
    }
    const playlistResponse = await createPlaylist(accessToken, userId);
    console.log(playlistResponse);
    if (!playlistResponse || !playlistResponse.id) {
      console.error('something went wrong creating the playlist');
      return undefined;
    }
    console.log('playlist created: ', playlistResponse);
    const trackIds: string[] = tracks.map(item => `spotify:track:${item.id}`);
    const addedItem = await addItemsToPlaylist(
      accessToken,
      playlistResponse?.id,
      trackIds,
    );
    console.log('added Items to playlist: ', addedItem);
    setCreatedPlaylist({id: playlistResponse.id, uri: playlistResponse.uri});
  };

  useEffect(() => {
    getSavedTracks();
  }, []);
  return (
    <View>
      <Modal
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
        animationType="slide"
        transparent={true}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(255,255,255,0.2)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              padding: 20,
              backgroundColor: 'white',
              borderWidth: 1,
              borderRadius: 20,
              borderColor: 'gray',
              width: '80%',
            }}>
            {/* <Text>Hello World</Text> */}
            <View>
              <Text>{createdPlaylist ? 'Playlist Created' : 'Creating'}</Text>
              {createdPlaylist && (
                <Button
                  title="Open Spotify"
                  onPress={() => {
                    Linking.openURL(createdPlaylist.uri);
                  }}
                />
              )}
            </View>
          </View>
        </View>
      </Modal>
      <ScrollView>
        <Text>Select Songs of particular BPM</Text>
        <TextInput
          inputMode="decimal"
          value={bpm.toString()}
          onChangeText={text => {
            setBpm(text);
            if (text.length === 0) {
              setBpm('');
            }
          }}
        />
        <Text>Highest Available Value: {highestAvailbleBpm}</Text>
        <Text>Lowest Available Value: {lowestAvailbleBpm}</Text>
        <Button title="Search" onPress={handleBPmSearch} />
        {storedTrackArr.current.length > tracks.length && (
          <Button
            title="Create Playlist"
            onPress={async () => {
              setIsModalVisible(true);
              console.log('here! cmon!!');
              handleCreatePlaylist();
            }}
          />
        )}
        <Button
          title="rough"
          onPress={() => setIsModalVisible(!isModalVisible)}
        />
        <View>
          <Text>all Track Items</Text>
          {tracks.map(item => (
            <View key={item.id} style={{flexDirection: 'row'}}>
              <Image
                source={{uri: item.thumbnail}}
                style={{width: 100, aspectRatio: 1}}
              />
              <View style={{flexDirection: 'column'}}>
                <Text>{item.name}</Text>
                <Text>{item.artistNames}</Text>
                <Text>{item.bpm}</Text>
              </View>
            </View>
          ))}
          <View style={{height: 100, width: 30, backgroundColor: 'blue'}} />
        </View>
      </ScrollView>
    </View>
  );
}
