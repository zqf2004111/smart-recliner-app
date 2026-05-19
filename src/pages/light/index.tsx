import { View, Text, Image } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import BottomNav from '@/components/bottom-nav'
import { bleService } from '@/services/ble.service'
import { LightMode } from '@/services/protocol'
import './index.less'

export default function LightPage() {
  const [powerOn, setPowerOn] = useState(false)
  const [activeEffect, setActiveEffect] = useState('Steady')

  const effects = [
    { name: 'Steady', icon: require('@/assets/images/Container21.png'), mode: LightMode.STEADY },
    { name: 'Color Cycle', icon: require('@/assets/images/Container22.png'), mode: LightMode.COLOR_CYCLE },
    { name: 'Rhythmic', icon: require('@/assets/images/Container23.png'), mode: LightMode.RHYTHMIC },
    { name: 'Breath', icon: require('@/assets/images/Container24.png'), mode: LightMode.BREATH },
  ]

  const togglePower = async () => {
    const next = !powerOn
    setPowerOn(next)
    try {
      await bleService.setLightMode(next ? LightMode.STEADY : LightMode.OFF)
    } catch (e) {
      Taro.showToast({ title: 'Not connected', icon: 'none' })
    }
  }

  const selectEffect = async (name: string, mode: number) => {
    setActiveEffect(name)
    try {
      await bleService.setLightMode(mode)
    } catch (e) {
      Taro.showToast({ title: 'Not connected', icon: 'none' })
    }
  }

  return (
    <View className='light-page'>
      <View style={{ paddingTop: '88rpx' }} />
      <View className='rgb-section'>
        <View className='rgb-ring'>
          <View className='rgb-inner'>
            <View className='power-btn' onClick={togglePower}>
              <Image className='power-icon' src={require('@/assets/images/Union.png')} />
            </View>
          </View>
        </View>
      </View>

      <View className='effects-card'>
        <View className='effects-header'>
          <Image className='effects-icon' src={require('@/assets/images/brightness_auto.png')} />
          <Text className='effects-title'>Ambient Effects</Text>
        </View>
        <Text className='effects-desc'>Synchronize your sofa's lighting with your mood or media playback.</Text>
        <View className='effects-grid'>
          {effects.map((e) => (
            <View
              key={e.name}
              className={`effect-item ${activeEffect === e.name ? 'effect-item-active' : ''}`}
              onClick={() => selectEffect(e.name, e.mode)}
            >
              <Image className='effect-icon' src={e.icon} />
              <Text className={`effect-text ${activeEffect === e.name ? 'effect-text-active' : ''}`}>{e.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <BottomNav active='home' />
    </View>
  )
}
