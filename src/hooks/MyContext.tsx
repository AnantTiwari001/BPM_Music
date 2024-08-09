import {createContext} from 'react';
import {initialAppState} from '../constants';

export const AppContext = createContext({
  state: initialAppState,
  setState: function (newState: typeof initialAppState) {
    console.log('initializing', newState);
  },
});
