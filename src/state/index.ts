import { combineReducers } from 'redux'
import user from './common'
import navigation from './navigation'
import message from './message'
import home from './home'

export default combineReducers({
  user,
  navigation,
  message,
  home,
})
