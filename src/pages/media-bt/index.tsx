import { View, Text } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import './index.less'

export default function MediaBtPage() {
  const [activeTab, setActiveTab] = useState('BLE')

  const confirm = () => {
    Taro.showToast({ title: 'Bluetooth connected', icon: 'none' })
    Taro.navigateBack()
  }

  const cancel = () => {
    Taro.navigateBack()
  }

  return (
    <View className='media-bt-page' onClick={cancel}>
      <View className='bt-modal' onClick={(e) => e.stopPropagation()}>
        <Text className='bt-title'>Connect Bluetooth</Text>

        <View className='bt-row'>
          <Text className='bt-row-label'>Audio</Text>
          <View className='bt-tabs'>
            {['BLE', 'TV'].map((t) => (
              <View
                key={t}
                className={`bt-tab ${activeTab === t ? 'bt-tab-active' : ''}`}
                onClick={() => setActiveTab(t)}
              >
                <Text className={`bt-tab-text ${activeTab === t ? 'bt-tab-text-active' : ''}`}>{t}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className='bt-row'>
          <Text className='bt-row-label'>Ad Hoc Network</Text>
          <View className='bt-tabs'>
            <View className='bt-tab'>
              <Text className='bt-tab-text'>Search</Text>
            </View>
          </View>
        </View>

        <View className='bt-btn-confirm' onClick={confirm}>
          <Text className='bt-btn-confirm-text'>Confirm</Text>
        </View>
        <View className='bt-btn-cancel' onClick={cancel}>
          <Text className='bt-btn-cancel-text'>Cancel</Text>
        </View>
      </View>
    </View>
  )
}
