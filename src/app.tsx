import { useLaunch } from '@tarojs/taro'
import './locales'
import './app.less'

function App({ children }) {
  useLaunch(() => {
    console.log('App launched.')
  })

  return children
}

export default App
