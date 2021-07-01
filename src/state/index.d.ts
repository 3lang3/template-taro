import 'react-redux';
import type { HomeStateType } from './home';
import type { MessageStateType } from './message.d';
import type { CommonStateType } from './common';
import type { AlbumStateType } from './album';

export interface ApplicationState {
  home: HomeStateType;
  common: CommonStateType;
  message: MessageStateType;
  album: AlbumStateType;
}
