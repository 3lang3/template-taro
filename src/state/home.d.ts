import type { HomeStateType } from './home'
import type { UserStateType } from './common'

export type BaseState = HomeStateType & UserStateType
