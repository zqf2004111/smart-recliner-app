import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.less'

interface Props {
  active: 'home' | 'media' | 'you'
}

export default function BottomNav({ active }: Props) {
  const navTo = (url: string) => {
    Taro.navigateTo({ url })
  }

  return (
    <View className='bottom-nav'>
      <View
        className={`nav-item ${active === 'home' ? 'nav-bg-active' : ''}`}
        onClick={() => navTo('/pages/index/index')}
      >
        <Image
          className='nav-icon'
          src={active === 'home'
            ? require('@/assets/images/Container9.png')
            : require('@/assets/images/Container10.png')
          }
        />
        <Text className={`nav-text ${active === 'home' ? 'nav-text-active' : ''}`}>HOME</Text>
      </View>
      <View
        className={`nav-item ${active === 'media' ? 'nav-bg-active' : ''}`}
        onClick={() => navTo('/pages/media/index')}
      >
        <Image
          className='nav-icon'
          src={active === 'media'
            ? require('@/assets/images/tvmusicnotem5.png')
            : require('@/assets/images/tvmusicnotem6.png')
          }
        />
        <Text className={`nav-text ${active === 'media' ? 'nav-text-active' : ''}`}>MEDIA</Text>
      </View>
      <View
        className={`nav-item ${active === 'you' ? 'nav-bg-active' : ''}`}
        onClick={() => navTo('/pages/settings/index')}
      >
        <Image
          className='nav-icon'
          src={active === 'you'
            ? require('@/assets/images/usercircle5.png')
            : require('@/assets/images/usercircle6.png')
          }
        />
        <Text className={`nav-text ${active === 'you' ? 'nav-text-active' : ''}`}>YOU</Text>
      </View>
    </View>
  )
}
