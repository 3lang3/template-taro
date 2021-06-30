import type { ApplicationState } from './src/state/index.d'

declare module '*.png'
declare module '*.gif'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.svg'
declare module '*.css'
declare module '*.less'
declare module '*.scss'
declare module '*.sass'
declare module '*.styl'

// @ts-ignore
declare const process: {
  env: {
    TARO_ENV: 'weapp' | 'swan' | 'alipay' | 'h5' | 'rn' | 'tt' | 'quickapp' | 'qq' | 'jd'
    [key: string]: any
  }
}

interface Window {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any
}

// @hack 覆盖全局DefaultRootState 避免useSelector时state类型丢失
declare module 'react-redux' {
  interface DefaultRootState extends ApplicationState {}
}
