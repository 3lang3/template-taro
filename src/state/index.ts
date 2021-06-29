import { combineReducers } from 'redux'
import counter from './counter'
import user from './user'
import navigation from './navigation'
import message from './message'

export default combineReducers({
  counter,
  user,
  navigation,
  message
})
