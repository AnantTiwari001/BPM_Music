/* eslint-disable react-native/no-inline-styles */
// This is the main page where one can select the songs of the particular BPM
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useRef, useState} from 'react';
import {
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
import UIButton from '../components/Buttton';
import Loading from '../components/Loading';
import Slider from '@react-native-community/slider';

const minimulBuffer = 5;
const maximumBuffer = 35;
const defaultBuffer = 20;
export default function SelectBPM() {
  const [bpmBuffer, setBpmBuffer] = useState(defaultBuffer); // bpm +/- the target value is accepted
  const [bpm, setBpm] = useState<number>();
  const [highestAvailbleBpm, setHighestAvailbleBpm] = useState(0);
  const [lowestAvailbleBpm, setLowestAvailbleBpm] = useState(0);
  const storedTrackArr = useRef<TrackObject[]>([]);
  const [tracks, setTracks] = useState<TrackObject[]>([]);
  const [createdPlaylist, setCreatedPlaylist] = useState<
    {id: string; uri: string} | undefined
  >(undefined);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isOpeningSpotify, setIsOpeningSpotify] = useState(false);
  const handleBPmSearch = () => {
    console.log('filtering the item with not desired bpm');
    setTracks(
      storedTrackArr.current.filter(
        item => Math.abs(item.bpm - parseInt(bpm)) < bpmBuffer,
      ),
    );
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
    setBpm(tempTracks[0].bpm);
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
    <View style={{flex: 1}}>
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
              {!createdPlaylist && <Loading size={30} />}
              {createdPlaylist && (
                <UIButton
                  title="Open Spotify"
                  onPress={async () => {
                    setIsOpeningSpotify(true);
                    await Linking.openURL(createdPlaylist.uri);
                    setIsOpeningSpotify(false);
                  }}
                  isLoading={{size: 25, visible: isOpeningSpotify}}
                />
              )}
            </View>
          </View>
        </View>
      </Modal>
      <ScrollView>
        <Text>Select Songs of particular BPM</Text>
        <View style={{margin: 5}}>
          <Text>Buffer: </Text>
          <Text style={{color: 'gray', fontSize: 12}}>
            Higher the value more track for a bpm
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text>{minimulBuffer}</Text>
            <Slider
              onValueChange={value => {
                setBpmBuffer(value);
              }}
              value={bpmBuffer}
              style={{width: 100, height: 40}}
              minimumValue={minimulBuffer}
              maximumValue={maximumBuffer}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#000000"
            />
            <Text>{maximumBuffer}</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 20,
          }}>
          <Text>{lowestAvailbleBpm}</Text>
          <View style={{alignItems: 'center'}}>
            {bpm && <Text>{bpm}</Text>}
            <Slider
              style={{width: 200, height: 40}}
              onValueChange={value => {
                console.log(value);
                setBpm(value);
              }}
              minimumValue={Math.floor(lowestAvailbleBpm)}
              maximumValue={Math.floor(highestAvailbleBpm)}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#000000"
            />
          </View>
          <Text>{highestAvailbleBpm}</Text>
        </View>
        <Text>Highest Available Value: {highestAvailbleBpm}</Text>
        <Text>Lowest Available Value: {lowestAvailbleBpm}</Text>
        <UIButton title="Search" onPress={handleBPmSearch} />
        {storedTrackArr.current.length > tracks.length && (
          <UIButton
            title="Create Playlist"
            onPress={async () => {
              setIsModalVisible(true);
              console.log('here! cmon!!');
              handleCreatePlaylist();
            }}
          />
        )}
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
        </View>
      </ScrollView>
    </View>
  );
}
