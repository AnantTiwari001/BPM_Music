import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import {LocalStorageKeys} from '../constants';
import {useEffect, useState} from 'react';
import {TrackObject} from '../Types';

export default function useTrackStorage() {
  const {getItem, setItem} = useAsyncStorage(LocalStorageKeys.tracks);
  const [tracks, setTracks] = useState<TrackObject[]>([]);

  const getAllTracks = async () => {
    console.log('getting the thigns');
    const tracksString = await getItem();
    setTracks(JSON.parse(tracksString ?? '[]'));
  };
  const addTrack = async (item: TrackObject) => {
    console.log('trying to add track to list');
    const finalTrackArr = [...tracks, item];
    await setItem(JSON.stringify(finalTrackArr));
    setTracks(finalTrackArr);
  };

  useEffect(() => {
    getAllTracks();
  });

  return [tracks, addTrack];
}
