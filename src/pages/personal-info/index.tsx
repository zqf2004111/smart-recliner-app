import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import BottomNav from '@/components/bottom-nav'

export default function PersonalInfoPage() {
  return (
    <View style={{ minHeight: '100vh', background: '#F7F9FB', paddingBottom: '180rpx' }}>
      <View style={{ paddingTop: '88rpx', padding: '32rpx' }}>
        <Text style={{ fontSize: '32rpx', fontWeight: 700 }}>Personal Info</Text>
      </View>
      <BottomNav active='you' />
    </View>
  )
}
