/* eslint-disable react-native/no-inline-styles */
// This is the main page where one can select the songs of the particular BPM
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useRef, useState} from 'react';
import {Button, Image, ScrollView, Text, TextInput, View} from 'react-native';
import {LocalStorageKeys} from '../constants';
import {TrackObject} from '../Types';

const bpmBuffer = 30; // bpm +/- the target value is accepted

export default function SelectBPM() {
  const [bpm, setBpm] = useState('');
  const [highestAvailbleBpm, setHighestAvailbleBpm] = useState(0);
  const [lowestAvailbleBpm, setLowestAvailbleBpm] = useState(0);
  const storedTrackArr = useRef<TrackObject[]>([]);
  const [tracks, setTracks] = useState<TrackObject[]>([]);
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
    const savedTracksObj = await JSON.parse(tracksString);
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

  useEffect(() => {
    getSavedTracks();
  }, []);
  return (
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
  );
}
