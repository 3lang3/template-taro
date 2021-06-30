import { combineReducers } from 'redux';
import user from './common';
import navigation from './navigation';
import message from './message';
import home from './home';
import album from './album';

export default combineReducers({
  user,
  navigation,
  message,
  home,
  album,
});
