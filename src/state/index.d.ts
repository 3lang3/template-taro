import 'react-redux';
import type { HomeStateType } from './home';
import type { MessageStateType } from './message.d';
import type { UserStateType } from './common';
import type { AlbumStateType } from './album';

export interface ApplicationState {
  home: HomeStateType;
  user: UserStateType;
  message: MessageStateType;
  album: AlbumStateType;
}
