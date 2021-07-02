import { combineReducers } from 'redux';
import common from './common';
import navigation from './navigation';
import message from './message';
import album from './album';
import other from './other';

export default combineReducers({
  common,
  navigation,
  message,
  album,
  other,
});
