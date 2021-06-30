import 'react-redux'
import type { HomeStateType } from './home'
import type { UserStateType } from './common'

export interface ApplicationState {
  home: HomeStateType
  user: UserStateType
}
