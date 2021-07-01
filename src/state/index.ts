import { combineReducers } from 'redux';
import common from './common';
import navigation from './navigation';
import message from './message';
import home from './home';
import album from './album';

export default combineReducers({
  common,
  navigation,
  message,
  home,
  album,
});
