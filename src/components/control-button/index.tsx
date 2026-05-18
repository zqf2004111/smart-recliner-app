import { View, Text } from '@tarojs/components'
import './index.less'

interface ControlButtonProps {
  label: string
  direction: 'up' | 'down'
  onPress: () => void
  onRelease: () => void
}

export default function ControlButton({ label, direction, onPress, onRelease }: ControlButtonProps) {
  return (
    <View className='control-button'>
      <View
        className='control-btn control-btn-up'
        onTouchStart={onPress}
        onTouchEnd={onRelease}
        onTouchCancel={onRelease}
      >
        <Text className='control-btn-arrow'>▲</Text>
      </View>
      <Text className='control-btn-label'>{label}</Text>
      <View
        className='control-btn control-btn-down'
        onTouchStart={onRelease}
        onTouchEnd={onPress}
        onTouchCancel={onPress}
      >
        <Text className='control-btn-arrow'>▼</Text>
      </View>
    </View>
  )
}
