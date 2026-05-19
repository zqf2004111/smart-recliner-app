import { View, Text } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import './index.less'

const MINUTES = [5, 10, 15, 20, 25, 30, 45, 60]

export default function TimerPage() {
  const [selected, setSelected] = useState(5)

  const confirm = () => {
    Taro.showToast({ title: `Timer set: ${selected}min`, icon: 'none' })
    Taro.navigateBack()
  }

  const cancel = () => {
    Taro.navigateBack()
  }

  return (
    <View className='timer-page' onClick={cancel}>
      <View className='timer-modal' onClick={(e) => e.stopPropagation()}>
        <Text className='timer-title'>Timer</Text>
        <View className='timer-wheel'>
          {MINUTES.map((m, i) => {
            const offset = (i - MINUTES.indexOf(selected)) * 80
            const isCenter = m === selected
            return (
              <Text
                key={m}
                className='timer-wheel-item'
                style={{
                  transform: `translateY(${offset}rpx)`,
                  fontSize: isCenter ? '80rpx' : '48rpx',
                  color: isCenter ? '#1a1a1a' : '#ccc',
                  fontWeight: isCenter ? 700 : 400,
                  opacity: Math.abs(offset) > 200 ? 0 : 1,
                }}
                onClick={() => setSelected(m)}
              >
                {m < 10 ? `0${m}` : m}
              </Text>
            )
          })}
        </View>
        <View className='timer-btn-confirm' onClick={confirm}>
          <Text className='timer-btn-confirm-text'>Confirm</Text>
        </View>
        <View className='timer-btn-cancel' onClick={cancel}>
          <Text className='timer-btn-cancel-text'>Cancel</Text>
        </View>
      </View>
    </View>
  )
}
