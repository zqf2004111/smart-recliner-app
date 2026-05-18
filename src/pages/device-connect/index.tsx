import { View, Text } from '@tarojs/components'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Taro from '@tarojs/taro'
import { useBle } from '@/hooks/useBle'
import { useSofaStore } from '@/stores/sofa.store'
import './index.less'

export default function DeviceConnectPage() {
  const { t } = useTranslation()
  const { scanDevices, connect, connected } = useBle()
  const [scanning, setScanning] = useState(false)
  const [devices, setDevices] = useState<any[]>([])
  const deviceList = useSofaStore((s) => s.deviceList)

  useEffect(() => {
    handleScan()
  }, [])

  const handleScan = async () => {
    setScanning(true)
    try {
      const found = await scanDevices()
      setDevices(found)
    } catch (e) {
      console.error('Scan error:', e)
    } finally {
      setScanning(false)
    }
  }

  const handleConnect = async (deviceId: string) => {
    try {
      await connect(deviceId)
      Taro.showToast({ title: t('deviceConnected'), icon: 'success' })
      setTimeout(() => {
        Taro.switchTab({ url: '/pages/index/index' })
      }, 1000)
    } catch (e) {
      Taro.showToast({ title: t('deviceDisconnected'), icon: 'none' })
    }
  }

  return (
    <View className='device-connect-page'>
      <View className='connect-header'>
        <Text className='connect-cancel' onClick={() => Taro.navigateBack()}>{t('cancel')}</Text>
        <Text className='connect-title'>{t('addDevice')}</Text>
        <Text className='connect-done'>{t('done')}</Text>
      </View>

      <View className='scan-indicator'>
        <View className={`scan-circle ${scanning ? 'scanning' : ''}`} />
        <Text className='scan-text'>{t('scanning')}</Text>
      </View>

      {deviceList.length > 0 && (
        <View className='device-section'>
          <Text className='device-section-title'>{t('nearbyDevices')}</Text>
          {deviceList.map((d) => (
            <View key={d.id} className='device-item device-item-paired' onClick={() => handleConnect(d.id)}>
              <View className='device-icon'>🛋️</View>
              <View className='device-info'>
                <Text className='device-name'>{d.name}</Text>
                <Text className='device-model'>{d.model}</Text>
              </View>
              <Text className='device-check'>✓</Text>
            </View>
          ))}
        </View>
      )}

      {devices.length > 0 && (
        <View className='device-section'>
          <Text className='device-section-title'>{t('nearbyDevices')}</Text>
          {devices.map((d) => (
            <View key={d.deviceId} className='device-item' onClick={() => handleConnect(d.deviceId)}>
              <View className='device-icon'>🛋️</View>
              <View className='device-info'>
                <Text className='device-name'>{d.name}</Text>
                <Text className='device-status'>{t('readyToPair')}</Text>
              </View>
              <Text className='device-add-btn'>+</Text>
            </View>
          ))}
        </View>
      )}

      <View className='connect-actions'>
        <View className='connect-action-btn connect-action-primary' onClick={handleScan}>
          <Text>{t('scanQRCode')}</Text>
        </View>
        <View className='connect-action-btn' onClick={handleScan}>
          <Text>📡 {t('addViaBluetooth')}</Text>
        </View>
      </View>

      <View className='connect-help'>
        <Text>{t('cantFindDevice')} </Text>
        <Text className='connect-help-link'>{t('troubleshoot')}</Text>
      </View>
    </View>
  )
}
