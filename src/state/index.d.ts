import 'react-redux'
import type { HomeStateType } from './home'
import type { MessageStateType } from './message.d'
import type { UserStateType } from './common'

export interface ApplicationState {
  home: HomeStateType
  user: UserStateType
  message: MessageStateType
}
