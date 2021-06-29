import { combineReducers } from 'redux'
import user from './user'
import navigation from './navigation'
import home from './home'

export default combineReducers({
  user,
  navigation,
  home
})
