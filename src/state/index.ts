import { combineReducers } from 'redux';
import common from './common';
import navigation from './navigation';
import message from './message';
import album from './album';
import other from './other';
import hotBoard from './hot-board';
import mySong from './my-song';

export default combineReducers({
  common,
  navigation,
  message,
  album,
  other,
  hotBoard,
  mySong,
});
