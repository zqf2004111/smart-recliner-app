import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import BottomNav from '@/components/bottom-nav'
import './index.less'

export default function SettingsPage() {
  const settingsItems = [
    { label: 'Notifications', icon: require('@/assets/images/Container31.png'), arrow: true },
    { label: 'Language', icon: require('@/assets/images/Container32.png'), arrow: true },
    { label: 'About', icon: require('@/assets/images/Container33.png'), arrow: true },
  ]

  return (
    <View className='settings-page'>
      <View style={{ paddingTop: '88rpx' }} />
      <Text className='settings-title'>APP SETTINGS</Text>

      <View className='settings-card'>
        {settingsItems.map((item, idx) => (
          <View
            key={item.label}
            className={`settings-row ${idx < settingsItems.length - 1 ? 'settings-row-border' : ''}`}
          >
            <Image className='settings-icon' src={item.icon} />
            <Text className='settings-label'>{item.label}</Text>
            {item.arrow && (
              <Image className='settings-arrow' src={require('@/assets/images/Bace3Iconchevronright.png')} />
            )}
          </View>
        ))}
      </View>

      <BottomNav active='you' />
    </View>
  )
}
