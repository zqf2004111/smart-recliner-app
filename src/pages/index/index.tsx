import { View, Text, Image } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import BottomNav from '@/components/bottom-nav'
import ArrowIcon from '@/components/arrow-icon'
import { useSofaStore } from '@/stores/sofa.store'
import { useBle } from '@/hooks/useBle'
import { bleService } from '@/services/ble.service'
import { CMD, MotorDirection, PresetPosition } from '@/services/protocol'
import './index.less'

type TabKey = 'posture' | 'massage' | 'heating' | 'ventilation'

export default function IndexPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('posture')
  const store = useSofaStore()
  useBle()

  const capability = store.capability

  return (
    <View className='index-page'>
      <TopBar />
      <SofaImage activeTab={activeTab} />
      <ModeTabs active={activeTab} onChange={setActiveTab} />

      {activeTab === 'posture' && <PostureContent />}
      {activeTab === 'massage' && <MassageContent />}
      {activeTab === 'heating' && <HeatingContent />}
      {activeTab === 'ventilation' && <VentilationContent />}

      <BottomNav active='home' />
    </View>
  )
}

function TopBar() {
  const store = useSofaStore()

  return (
    <>
      <View className='top-bar'>
        <View className='device-selector'>
          <Text className='device-name'>{store.currentDevice?.name || 'Recliner Plus'}</Text>
          <Image className='device-arrow' src={require('@/assets/images/Bace3Iconchevrondown.png')} />
        </View>
        <View className='add-btn' onClick={() => Taro.navigateTo({ url: '/pages/device-scan/index' })}>
          <Image src={require('@/assets/images/IconsPlus.png')} style={{ width: 48, height: 48 }} />
        </View>
      </View>
      <View className='back-title-row'>
        <Image className='back-icon' src={require('@/assets/images/Bace3Iconchevronleft.png')} />
        <Text className='page-title'>Smart Recliner Pro</Text>
      </View>
    </>
  )
}

function SofaImage({ activeTab }: { activeTab: TabKey }) {
  const iconMap: Record<TabKey, string> = {
    posture: require('@/assets/images/Ellipse_94_39.png'),
    massage: require('@/assets/images/Ellipse_94_663.png'),
    heating: require('@/assets/images/Ellipse_94_675.png'),
    ventilation: require('@/assets/images/Ellipse_94_671.png'),
  }

  return (
    <View className='sofa-image-wrap'>
      <Image className='sofa-image' src={require('@/assets/images/sofa Animation.png')} />
      <Image
        src={iconMap[activeTab]}
        style={{ position: 'absolute', width: 80, height: 80, top: 160, left: 200 }}
      />
    </View>
  )
}

function ModeTabs({ active, onChange }: { active: TabKey; onChange: (t: TabKey) => void }) {
  const tabs: { key: TabKey; label: string; icon: string; iconActive: string }[] = [
    { key: 'posture', label: 'Posture', icon: require('@/assets/images/Vector_94_133.png'), iconActive: require('@/assets/images/Vector_99_96.png') },
    { key: 'massage', label: 'Massage', icon: require('@/assets/images/Vector_99_181.png'), iconActive: require('@/assets/images/Vector_99_281.png') },
    { key: 'heating', label: 'Heating', icon: require('@/assets/images/Vector_99_381.png'), iconActive: require('@/assets/images/Vector_99_791.png') },
    { key: 'ventilation', label: 'Ventilation', icon: require('@/assets/images/Vector_99_828.png'), iconActive: require('@/assets/images/Vector_99_839.png') },
  ]

  return (
    <View className='mode-tabs'>
      {tabs.map((t) => (
        <View
          key={t.key}
          className={`mode-tab ${active === t.key ? 'mode-tab-active' : ''}`}
          onClick={() => onChange(t.key)}
        >
          <Image className='mode-tab-icon' src={active === t.key ? t.iconActive : t.icon} />
          <Text className={`mode-tab-text ${active === t.key ? 'mode-tab-text-active' : ''}`}>{t.label}</Text>
        </View>
      ))}
    </View>
  )
}

/* ========== Posture Tab ========== */
function PostureContent() {
  const store = useSofaStore()

  const presets = [
    { key: 'home', label: 'Home', icon: require('@/assets/images/_2926248937264.png'), iconActive: require('@/assets/images/_29262489372640.png') },
    { key: 'tv', label: 'TV', icon: require('@/assets/images/tvmusicnotem.png'), iconActive: require('@/assets/images/tvmusicnotem0.png') },
    { key: 'zg', label: 'ZG', icon: require('@/assets/images/heartline.png'), iconActive: require('@/assets/images/heartline0.png') },
    { key: 'memory', label: 'Memory', icon: require('@/assets/images/call_merge.png'), iconActive: require('@/assets/images/call_merge.png') },
  ]

  const [activePreset, setActivePreset] = useState('')

  const handleMotor = async (motor: string, dir: 'up' | 'down' | 'stop') => {
    const cmdMap: Record<string, number[]> = {
      seat: CMD.MOTOR_SEAT,
      head: CMD.MOTOR_HEAD,
    }
    const cmd = cmdMap[motor]
    if (!cmd) return
    const direction = dir === 'up' ? MotorDirection.UP : dir === 'down' ? MotorDirection.DOWN : MotorDirection.STOP
    try {
      await bleService.controlMotor(cmd, direction)
    } catch (e) {
      Taro.showToast({ title: 'Not connected', icon: 'none' })
    }
  }

  const runPreset = async (preset: string) => {
    const presetMap: Record<string, number> = {
      home: PresetPosition.HOME,
      tv: PresetPosition.TV,
      zg: PresetPosition.ZERO_G,
      memory: PresetPosition.RECLINE,
    }
    try {
      await bleService.runPresetPosition(presetMap[preset] ?? 0)
    } catch (e) {
      Taro.showToast({ title: 'Not connected', icon: 'none' })
    }
  }

  return (
    <View className='content-card'>
      <View className='preset-grid'>
        {presets.map((p) => (
          <View key={p.key} className='preset-btn' onClick={() => { setActivePreset(p.key); runPreset(p.key) }}>
            <View className={`preset-icon-wrap ${activePreset === p.key ? 'preset-icon-wrap-active' : ''}`}>
              <Image className='preset-icon' src={activePreset === p.key ? p.iconActive : p.icon} />
            </View>
            <Text className='preset-text'>{p.label}</Text>
          </View>
        ))}
      </View>
      <View className='motor-controls'>
        <View className='motor-col'>
          <View className='motor-btn' onTouchStart={() => handleMotor('seat', 'up')} onTouchEnd={() => handleMotor('seat', 'stop')}>
            <ArrowIcon direction='up' size={32} color='#333' />
          </View>
          <Text className='motor-label'>seat</Text>
          <View className='motor-btn' onTouchStart={() => handleMotor('seat', 'down')} onTouchEnd={() => handleMotor('seat', 'stop')}>
            <ArrowIcon direction='down' size={32} color='#333' />
          </View>
        </View>
        <View className='motor-col'>
          <View className='motor-btn' onTouchStart={() => handleMotor('head', 'up')} onTouchEnd={() => handleMotor('head', 'stop')}>
            <ArrowIcon direction='up' size={32} color='#333' />
          </View>
          <Text className='motor-label'>head</Text>
          <View className='motor-btn' onTouchStart={() => handleMotor('head', 'down')} onTouchEnd={() => handleMotor('head', 'stop')}>
            <ArrowIcon direction='down' size={32} color='#333' />
          </View>
        </View>
      </View>
    </View>
  )
}

/* ========== Massage Tab ========== */
function MassageContent() {
  const modes = [
    { name: 'Wave', icon: require('@/assets/images/Container12.png'), cmd: 0x11 },
    { name: 'catwalk', icon: require('@/assets/images/Container13.png'), cmd: 0x12 },
    { name: 'butterfly', icon: require('@/assets/images/Container14.png'), cmd: 0x13 },
    { name: 'pat', icon: require('@/assets/images/Container15.png'), cmd: 0x15 },
    { name: 'acupressure', icon: require('@/assets/images/Container16.png'), cmd: 0x14 },
  ]

  const [activeMode, setActiveMode] = useState('Wave')

  const selectMode = async (name: string, cmd: number) => {
    setActiveMode(name)
    try {
      await bleService.setMassageMode(cmd)
    } catch (e) {
      Taro.showToast({ title: 'Not connected', icon: 'none' })
    }
  }

  return (
    <View className='content-card'>
      <View className='massage-grid'>
        {modes.map((m) => (
          <View key={m.name} className='massage-item' onClick={() => selectMode(m.name, m.cmd)}>
            <View className={`massage-icon-wrap ${activeMode === m.name ? 'massage-icon-wrap-active' : ''}`}>
              <Image className='massage-icon' src={m.icon} />
            </View>
            <Text className={`massage-text ${activeMode === m.name ? 'massage-text-active' : ''}`}>{m.name}</Text>
          </View>
        ))}
      </View>
      <TimerPanel type='massage' />
    </View>
  )
}

/* ========== Heating Tab ========== */
function HeatingContent() {
  const [mode, setMode] = useState<'gentle' | 'rapid'>('gentle')

  const selectMode = async (m: 'gentle' | 'rapid') => {
    setMode(m)
    try {
      await bleService.setHeatMode(m === 'gentle' ? 0x02 : 0x01)
    } catch (e) {
      Taro.showToast({ title: 'Not connected', icon: 'none' })
    }
  }

  return (
    <View className='content-card'>
      <View className='intensity-row'>
        <View className='intensity-btn' onClick={() => selectMode('gentle')}>
          <View className={`intensity-icon-wrap ${mode === 'gentle' ? 'intensity-icon-wrap-active' : ''}`}>
            <Image className='intensity-icon' src={require('@/assets/images/Container17.png')} />
          </View>
          <Text className={`intensity-text ${mode === 'gentle' ? 'intensity-text-active' : ''}`}>gentle</Text>
        </View>
        <View className='intensity-btn' onClick={() => selectMode('rapid')}>
          <View className={`intensity-icon-wrap ${mode === 'rapid' ? 'intensity-icon-wrap-active' : ''}`}>
            <Image className='intensity-icon' src={require('@/assets/images/Container18.png')} />
          </View>
          <Text className={`intensity-text ${mode === 'rapid' ? 'intensity-text-active' : ''}`}>rapid</Text>
        </View>
      </View>
      <TimerPanel type='heating' />
    </View>
  )
}

/* ========== Ventilation Tab ========== */
function VentilationContent() {
  const [mode, setMode] = useState<'gentle' | 'rapid'>('gentle')

  const selectMode = async (m: 'gentle' | 'rapid') => {
    setMode(m)
    try {
      await bleService.setVentMode(m === 'gentle' ? 0x02 : 0x01)
    } catch (e) {
      Taro.showToast({ title: 'Not connected', icon: 'none' })
    }
  }

  return (
    <View className='content-card'>
      <View className='intensity-row'>
        <View className='intensity-btn' onClick={() => selectMode('gentle')}>
          <View className={`intensity-icon-wrap ${mode === 'gentle' ? 'intensity-icon-wrap-active' : ''}`}>
            <Image className='intensity-icon' src={require('@/assets/images/Container19.png')} />
          </View>
          <Text className={`intensity-text ${mode === 'gentle' ? 'intensity-text-active' : ''}`}>gentle</Text>
        </View>
        <View className='intensity-btn' onClick={() => selectMode('rapid')}>
          <View className={`intensity-icon-wrap ${mode === 'rapid' ? 'intensity-icon-wrap-active' : ''}`}>
            <Image className='intensity-icon' src={require('@/assets/images/Container20.png')} />
          </View>
          <Text className={`intensity-text ${mode === 'rapid' ? 'intensity-text-active' : ''}`}>rapid</Text>
        </View>
      </View>
      <TimerPanel type='ventilation' />
    </View>
  )
}

/* ========== Timer Panel ========== */
function TimerPanel({ type }: { type: 'massage' | 'heating' | 'ventilation' }) {
  const [enabled, setEnabled] = useState(false)
  const [scheduledMin, setScheduledMin] = useState(5)

  const toggleTimer = async () => {
    const next = !enabled
    setEnabled(next)
    try {
      if (type === 'massage') {
        await bleService.setMassageTimer(next ? scheduledMin : 0)
      } else if (type === 'heating') {
        await bleService.setHeatTimer(next ? scheduledMin : 0)
      } else {
        await bleService.setVentTimer(next ? scheduledMin : 0)
      }
    } catch (e) {
      Taro.showToast({ title: 'Not connected', icon: 'none' })
    }
  }

  const openTimer = () => {
    Taro.navigateTo({ url: '/pages/timer/index?type=' + type })
  }

  return (
    <View className='timer-panel'>
      <View onClick={openTimer}>
        <Text className='timer-label'>Timer</Text>
        <Text className='timer-sub'>Scheduled Time {scheduledMin}min</Text>
      </View>
      <View className='timer-right'>
        {enabled && <Text className='timer-countdown'>00:45</Text>}
        <View className={`switch-track ${enabled ? 'switch-track-on' : ''}`} onClick={toggleTimer}>
          <View className={`switch-thumb ${enabled ? 'switch-thumb-on' : ''}`} />
        </View>
      </View>
    </View>
  )
}
