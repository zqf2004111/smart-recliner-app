import { View, Text, Image } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { bleService } from '@/services/ble.service'
import { useSofaStore } from '@/stores/sofa.store'
import { parseBroadcastData } from '@/utils/broadcast'
import './index.less'

export default function DeviceScanPage() {
  const [devices, setDevices] = useState<Array<{ name: string; deviceId: string; model: string; active: boolean }>>([])
  const [scanning, setScanning] = useState(true)
  const [selected, setSelected] = useState('')
  const store = useSofaStore()

  useEffect(() => {
    startScan()
    return () => { bleService.stopScan() }
  }, [])

  const startScan = async () => {
    setScanning(true)
    setDevices([])
    try {
      const found = await bleService.startScan(['KD-SOF', 'KD-BED', 'Recliner', 'Smart'], 15000)
      const mapped = found.map((d) => {
        const cap = d.manufacturerData ? parseBroadcastData(d.manufacturerData) : null
        return {
          name: d.name,
          deviceId: d.deviceId,
          model: cap ? `Model: CS-204-X` : 'Ready to pair',
          active: false,
        }
      })
      setDevices(mapped)
      if (mapped.length > 0) setSelected(mapped[0].deviceId)
    } catch (e) {
      Taro.showToast({ title: 'Scan failed', icon: 'none' })
    } finally {
      setScanning(false)
    }
  }

  const done = async () => {
    const device = devices.find((d) => d.deviceId === selected)
    if (!device) return
    try {
      await bleService.connect(device.deviceId)
      store.setCurrentDevice({
        id: device.deviceId,
        name: device.name,
        model: device.model,
        sn: '',
        hwVersion: '',
        fwVersion: '',
      })
      Taro.showToast({ title: `Connected: ${device.name}`, icon: 'success' })
      Taro.navigateTo({ url: '/pages/index/index' })
    } catch (e) {
      Taro.showToast({ title: 'Connection failed', icon: 'none' })
    }
  }

  const cancel = () => {
    bleService.stopScan()
    Taro.navigateBack()
  }

  return (
    <View className='scan-page'>
      <View className='scan-modal'>
        <View className='scan-header'>
          <Text className='scan-header-text' onClick={cancel}>Cancel</Text>
          <Text className='scan-header-title'>Add Device</Text>
          <Text className='scan-header-text' onClick={done}>Done</Text>
        </View>

        <View className='scan-anim'>
          <View className='scan-circle' style={{ opacity: scanning ? 1 : 0.5 }} />
          <Text className='scan-status'>
            {scanning ? 'Scanning for local devices...' : devices.length > 0 ? 'Found ' + devices.length + ' device(s)' : 'No devices found'}
          </Text>
        </View>

        <Text className='scan-section-title'>Nearby Devices</Text>
        {devices.map((d) => (
          <View
            key={d.deviceId}
            className={`device-item ${selected === d.deviceId ? 'device-item-active' : ''}`}
            onClick={() => setSelected(d.deviceId)}
          >
            <Image className='device-icon' src={require('@/assets/images/Container34.png')} />
            <View className='device-info'>
              <Text className='device-name'>{d.name}</Text>
              <Text className='device-model'>{d.model}</Text>
            </View>
            {selected === d.deviceId ? (
              <Image style={{ width: 40, height: 40 }} src={require('@/assets/images/Container35.png')} />
            ) : (
              <View className='device-add-btn'>
                <Image style={{ width: 40, height: 40 }} src={require('@/assets/images/IconsPlus0.png')} />
              </View>
            )}
          </View>
        ))}

        <View className='scan-action-btn' onClick={startScan}>
          <Text className='scan-action-text'>{scanning ? 'Scanning...' : 'Scan Again'}</Text>
        </View>
        <View className='scan-action-secondary' onClick={cancel}>
          <Text className='scan-action-secondary-text'>Add via Bluetooth</Text>
        </View>

        <View className='scan-footer'>
          <Text>Can't find your device? </Text>
          <Text className='scan-footer-link'>Troubleshoot</Text>
        </View>
      </View>
    </View>
  )
}
