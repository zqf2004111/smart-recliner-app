import { View, Text } from '@tarojs/components'
import { useSofaStore } from '@/stores/sofa.store'
import './index.less'

export default function TopBar() {
  const currentDevice = useSofaStore((s) => s.currentDevice)

  return (
    <View className='top-bar'>
      <View className='top-bar-left'>
        <Text className='top-bar-device'>
          {currentDevice?.name || 'Recliner Plus'}
        </Text>
        <Text className='top-bar-arrow'>▼</Text>
      </View>
      <View className='top-bar-right'>
        <Text className='top-bar-add'>+</Text>
      </View>
    </View>
  )
}
