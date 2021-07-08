import type { MessageStateType } from './message.d';
import type { CommonStateType } from './common';
import type { AlbumStateType } from './album';
import type { OtherStateType } from './other';
import type { HotBoardStateType } from './hot-board';

export interface ApplicationState {
  common: CommonStateType;
  message: MessageStateType;
  album: AlbumStateType;
  other: OtherStateType;
  hotBoard: HotBoardStateType;
}
