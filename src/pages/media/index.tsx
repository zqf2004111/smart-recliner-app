import { View, Text, Image } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import BottomNav from '@/components/bottom-nav'
import { bleService } from '@/services/ble.service'
import { AudioMode } from '@/services/protocol'
import './index.less'

export default function MediaPage() {
  const [playing, setPlaying] = useState(false)
  const [syncLevel, setSyncLevel] = useState(0) // 0=off, 1-3=levels
  const [volume, setVolume] = useState(82)
  const [treble, setTreble] = useState(70)
  const [bass, setBass] = useState(90)
  const [eqMode, setEqMode] = useState('Pop')

  const eqModes = [
    { name: 'Classic', mode: AudioMode.CLASSIC },
    { name: 'Pop', mode: AudioMode.POP },
    { name: 'Jazz', mode: AudioMode.JAZZ },
    { name: 'Symphony', mode: AudioMode.GENERAL },
  ]

  const toggleSync = async () => {
    const next = syncLevel >= 3 ? 0 : syncLevel + 1
    setSyncLevel(next)
    try {
      await bleService.setVibratorMode(next > 0 ? 0x01 : 0x00)
      await bleService.setVibratorIntensity(next)
    } catch (e) {
      Taro.showToast({ title: 'Not connected', icon: 'none' })
    }
  }

  const selectEq = async (name: string, mode: number) => {
    setEqMode(name)
    try {
      await bleService.setAudioMode(mode)
    } catch (e) {
      Taro.showToast({ title: 'Not connected', icon: 'none' })
    }
  }

  const sendVolume = async (v: number) => {
    setVolume(v)
    try { await bleService.setVolume(v) } catch (e) {}
  }
  const sendTreble = async (v: number) => {
    setTreble(v)
    try { await bleService.setTreble(v) } catch (e) {}
  }
  const sendBass = async (v: number) => {
    setBass(v)
    try { await bleService.setBass(v) } catch (e) {}
  }

  const openBtSettings = () => {
    Taro.navigateTo({ url: '/pages/media-bt/index' })
  }

  return (
    <View className='media-page'>
      <View className='media-top-bar'>
        <View className='media-device-selector'>
          <Text className='media-device-name'>Recliner Plus</Text>
          <Image style={{ width: 32, height: 32 }} src={require('@/assets/images/Bace3Iconchevrondown.png')} />
        </View>
        <View className='media-bt-btn' onClick={openBtSettings}>
          <Image style={{ width: 48, height: 48 }} src={require('@/assets/images/bluetooth_connected.png')} />
        </View>
      </View>

      <View className='player-section'>
        <Text className='song-title'>Cyber Resonance</Text>
        <Text className='song-artist'>Vector Velocity • Atmos Mix</Text>

        <View className='progress-wrap'>
          <View className='progress-bar'>
            <View className='progress-fill' style={{ width: '60%' }} />
            <View className='progress-thumb' style={{ left: '60%' }} />
          </View>
        </View>
        <View className='time-row'>
          <Text className='time-text'>02:45</Text>
          <Text className='time-text'>04:12</Text>
        </View>

        <View className='controls-row'>
          <View className='ctrl-btn'>
            <Image className='ctrl-icon' src={require('@/assets/images/Container25.png')} />
          </View>
          <View className='ctrl-btn-lg' onClick={() => setPlaying(!playing)}>
            <Image className='ctrl-icon-lg' src={playing ? require('@/assets/images/Container26.png') : require('@/assets/images/Container27.png')} />
          </View>
          <View className='ctrl-btn'>
            <Image className='ctrl-icon' src={require('@/assets/images/Container28.png')} />
          </View>
          <View className='ctrl-btn'>
            <Image className='ctrl-icon' src={require('@/assets/images/Container29.png')} />
          </View>
        </View>
      </View>

      <View className='sync-section'>
        <View className='sync-btn' onClick={toggleSync}>
          <Image className='sync-icon' src={require('@/assets/images/dotradiowavesleftandrightm.png')} />
        </View>
        <Text className='sync-text'>Sync sensing</Text>
        <View className='sync-dots'>
          {[1, 2, 3].map((i) => (
            <View key={i} className={`sync-dot ${i <= syncLevel ? 'sync-dot-active' : ''}`} />
          ))}
        </View>
      </View>

      <View className='audio-card'>
        <View className='audio-header'>
          <Image className='audio-header-icon' src={require('@/assets/images/Container30.png')} />
          <Text className='audio-header-title'>Audio Profile</Text>
        </View>

        <SliderRow label='Volume' value={volume} onChange={sendVolume} />
        <SliderRow label='Treble' value={treble} onChange={sendTreble} />
        <SliderRow label='Bass' value={bass} onChange={sendBass} />

        <View className='eq-buttons'>
          {eqModes.map((m) => (
            <View
              key={m.name}
              className={`eq-btn ${eqMode === m.name ? 'eq-btn-active' : ''}`}
              onClick={() => selectEq(m.name, m.mode)}
            >
              <Text className={`eq-btn-text ${eqMode === m.name ? 'eq-btn-text-active' : ''}`}>{m.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <BottomNav active='media' />
    </View>
  )
}

function SliderRow({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <View className='slider-row'>
      <View className='slider-label-row'>
        <Text className='slider-label'>{label}</Text>
        <Text className='slider-value'>{value}%</Text>
      </View>
      <View className='slider-track'>
        <View className='slider-fill' style={{ width: `${value}%` }} />
      </View>
    </View>
  )
}
