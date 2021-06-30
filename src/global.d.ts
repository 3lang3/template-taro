import type { ApplicationState } from './state/index.d'

// @hack 覆盖全局DefaultRootState 避免useSelector时state类型丢失
declare module 'react-redux' {
  interface DefaultRootState extends ApplicationState {}
}
