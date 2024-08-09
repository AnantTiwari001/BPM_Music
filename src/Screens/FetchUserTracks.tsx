//The page here is basically a loading page which shows a loading icon while fetching
// user's favorited and playlisted tracks along with the bpm for each of them
import React, {useContext, useState} from 'react';
import {Button, Text, View} from 'react-native';
import {
  GetSpotifyFavoriteSongs,
  GetSpotifyPlaylistsIds,
  getSpotifyPlaylistTrackIds,
  getSpotifyTrackInfo,
  getTrackBPM,
} from '../helpers/SpotifyApiCalls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LocalStorageKeys} from '../constants';
import {TrackObject} from '../Types';
import UIButton from '../components/Buttton';
import Loading from '../components/Loading';
import {AppContext} from '../hooks/MyContext';

export default function FetchUserTracks() {
  const {state, setState} = useContext(AppContext);
  const isInitialTrackFetch = state.savedTracks.isInitial;
  const [isFetching, setIsFetching] = useState(false);
  const TrackPromiseArr: Promise<TrackObject>[] = [];
  const tracksArr: TrackObject[] = [];
  async function getSpotifyTrackWithbpm() {
    setIsFetching(true);
    const spotifyAcessToken = await AsyncStorage.getItem(
      LocalStorageKeys.spotifyAcessToken,
    );
    if (!spotifyAcessToken) {
      return undefined;
    }
    console.log('function to get tracks with bpm ');

    Promise.all([
      GetSpotifyFavoriteSongs(spotifyAcessToken, 50).then(result => {
        if (!result) {
          console.error('error fetching liked songs');
          setLoginStateOnFail();
          return undefined;
        }
        for (let index = 0; index < result.items.length; index++) {
          const trackItem = result.items[index];
          // console.log(trackItem.track.name, trackItem.track.id);
          TrackPromiseArr.push(
            handleTrack(trackItem.track.id, spotifyAcessToken),
          );
        }
      }),
      GetSpotifyPlaylistsIds(spotifyAcessToken, 50).then(async result => {
        // console.log(result);
        if (!result) {
          console.error('error fetching playlists');
          setLoginStateOnFail();
          return undefined;
        }
        for (let index = 0; index < result.length; index++) {
          const element = result[index];
          await getSpotifyPlaylistTrackIds(spotifyAcessToken, element).then(
            trackIdsResult => {
              // console.log('playlist Obj', trackIdsResult);
              trackIdsResult.forEach((trackId: string) => {
                TrackPromiseArr.push(handleTrack(trackId, spotifyAcessToken));
              });
            },
          );
        }
      }),
    ]).then(() => {
      console.log(TrackPromiseArr);
      Promise.all(TrackPromiseArr).then(() => {
        console.info('done all! Saving the Tracks to Store');
        if (tracksArr.length > 0) {
          setTracksToStore(tracksArr);
        }
        setIsFetching(false);
      });
    });
  }

  async function handleTrack(trackId: string, spotifyAcessToken: string) {
    const trackInfoResponse = await getSpotifyTrackInfo(
      trackId,
      spotifyAcessToken,
    );
    const bpmResponse = await getTrackBPM(spotifyAcessToken, trackId);
    const trackObj = {
      id: trackInfoResponse?.id,
      name: trackInfoResponse?.name,
      thumbnail: trackInfoResponse?.thumbnail,
      artistNames: trackInfoResponse?.artistNames,
      bpm: bpmResponse,
    } as TrackObject;
    console.log('trackObj: ', trackObj);
    tracksArr.push(trackObj);

    return trackObj;
  }
  const setTracksToStore = async (newtracksArr: TrackObject[]) => {
    const stringifiedTrackArr = JSON.stringify(newtracksArr);
    await AsyncStorage.setItem(LocalStorageKeys.tracks, stringifiedTrackArr);
  };
  const setLoginStateOnFail = () => {
    const tempAppState = {...state};
    tempAppState.isLoggedIn = false;
    setState(tempAppState);
  };
  const updateAppStateForTracks = () => {
    const tempAppState = {...state};
    tempAppState.savedTracks.isInitial = false;
    setState(tempAppState);
  };
  return (
    <View>
      <Text>pulling all favorite and playlisted track from spotify</Text>
      <UIButton
        title={
          isInitialTrackFetch ? 'Get all Saved Tracks' : 'Refresh Saved Tracks'
        }
        onPress={() => {
          console.log('here!!');
          getSpotifyTrackWithbpm();
        }}
      />
      {isFetching && <Loading size={45} />}
    </View>
  );
}
