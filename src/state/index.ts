import { combineReducers } from 'redux'
import counter from './counter'
import user from './user'
import navigation from './navigation'

export default combineReducers({
  counter,
  user,
  navigation
})
