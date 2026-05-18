import { View, Text } from '@tarojs/components'
import { useTranslation } from 'react-i18next'
import { useSofaStore } from '@/stores/sofa.store'
import { bleService, PresetPosition, MotorDirection } from '@/services/ble.service'
import { useLongPress } from '@/hooks/useLongPress'
import './posture-tab.less'

const PRESETS = [
  { key: 'homePosition', value: PresetPosition.HOME, icon: '🏠' },
  { key: 'tvPosition', value: PresetPosition.TV, icon: '📺' },
  { key: 'zgPosition', value: PresetPosition.ZERO_G, icon: '🌙' },
  { key: 'memoryPosition', value: -1, icon: '💾' },
]

const MOTORS = [
  { key: 'seat', label: 'seat', cmd: [0x00, 0x01] },
  { key: 'head', label: 'head', cmd: [0x00, 0x02] },
]

export default function PostureTab() {
  const { t } = useTranslation()
  const childLock = useSofaStore((s) => s.childLock)

  const handlePreset = async (value: number) => {
    if (childLock) return
    if (value === -1) {
      // 记忆位 - 短按执行，长按保存
      await bleService.runMemoryPosition(1)
    } else {
      await bleService.runPresetPosition(value)
    }
  }

  const handleMotor = async (cmd: number[], dir: number) => {
    if (childLock) return
    await bleService.controlMotor(cmd, dir)
  }

  const memoryLongPress = useLongPress({
    onLongPress: async () => {
      if (childLock) return
      await bleService.setMemoryPosition(1)
    },
    onPress: async () => {
      if (childLock) return
      await bleService.runMemoryPosition(1)
    },
  })

  return (
    <View className='posture-tab'>
      {/* 预设位置 */}
      <View className='preset-row'>
        {PRESETS.map((preset) => (
          <View
            key={preset.key}
            className='preset-item'
            onClick={() => handlePreset(preset.value)}
            {...(preset.key === 'memoryPosition' ? memoryLongPress : {})}
          >
            <Text className='preset-icon'>{preset.icon}</Text>
            <Text className='preset-label'>{t(preset.key)}</Text>
          </View>
        ))}
      </View>

      {/* 推杆控制 */}
      <View className='motor-grid'>
        {MOTORS.map((motor) => (
          <View key={motor.key} className='motor-control'>
            <View
              className='motor-btn'
              onTouchStart={() => handleMotor(motor.cmd, MotorDirection.UP)}
              onTouchEnd={() => handleMotor(motor.cmd, MotorDirection.STOP)}
              onTouchCancel={() => handleMotor(motor.cmd, MotorDirection.STOP)}
            >
              <Text className='motor-arrow'>▲</Text>
            </View>
            <Text className='motor-label'>{t(motor.label)}</Text>
            <View
              className='motor-btn'
              onTouchStart={() => handleMotor(motor.cmd, MotorDirection.DOWN)}
              onTouchEnd={() => handleMotor(motor.cmd, MotorDirection.STOP)}
              onTouchCancel={() => handleMotor(motor.cmd, MotorDirection.STOP)}
            >
              <Text className='motor-arrow'>▼</Text>
            </View>
          </View>
        ))}
      </View>

      {childLock && (
        <View className='child-lock-banner'>
          <Text>🔒 {t('childLock')} - {t('on')}</Text>
        </View>
      )}
    </View>
  )
}
