import { View, Text, Image } from '@tarojs/components'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSofaStore } from '@/stores/sofa.store'
import { bleService } from '@/services/ble.service'
import { AudioMode, VibratorMode, LightMode } from '@/services/protocol'
import SliderControl from '@/components/slider-control'
import RGBPicker from '@/components/rgb-picker'
import { AUDIO_MODES, LIGHT_MODES } from '@/utils/constants'
import './index.less'

export default function MediaPage() {
  const { t } = useTranslation()
  const [subTab, setSubTab] = useState<'audio' | 'light'>('audio')
  const audio = useSofaStore((s) => s.audio)
  const vibrator = useSofaStore((s) => s.vibrator)
  const light = useSofaStore((s) => s.light)

  const handleVolume = async (v: number) => {
    await bleService.setVolume(v)
  }

  const handleTreble = async (v: number) => {
    await bleService.setTreble(v)
  }

  const handleBass = async (v: number) => {
    await bleService.setBass(v)
  }

  const handleAudioMode = async (mode: number) => {
    await bleService.setAudioMode(mode)
  }

  const handleVibratorToggle = async () => {
    await bleService.setVibratorMode(vibrator.enabled ? VibratorMode.OFF : VibratorMode.MUSIC)
  }

  const handleVibratorIntensity = async (level: number) => {
    await bleService.setVibratorIntensity(level)
  }

  const handleLightMode = async (mode: number) => {
    await bleService.setLightMode(mode)
  }

  const handleLightColor = async (r: number, g: number, b: number) => {
    await bleService.setLightColor(r, g, b)
  }

  return (
    <View className='media-page'>
      {/* 子Tab */}
      <View className='media-subtabs'>
        <View
          className={`media-subtab ${subTab === 'audio' ? 'media-subtab-active' : ''}`}
          onClick={() => setSubTab('audio')}
        >
          <Text>{t('audio')}</Text>
        </View>
        <View
          className={`media-subtab ${subTab === 'light' ? 'media-subtab-active' : ''}`}
          onClick={() => setSubTab('light')}
        >
          <Text>{t('light')}</Text>
        </View>
      </View>

      {subTab === 'audio' && (
        <View className='audio-section'>
          {/* 播放器UI */}
          <View className='player-card'>
            <View className='player-info'>
              <Text className='player-title'>Cyber Resonance</Text>
              <Text className='player-subtitle'>Vector Velocity • Atmos Mix</Text>
            </View>
            <View className='player-progress'>
              <View className='progress-bar'>
                <View className='progress-fill' style={{ width: '65%' }} />
              </View>
              <View className='progress-time'>
                <Text>02:45</Text>
                <Text>04:12</Text>
              </View>
            </View>
            <View className='player-controls'>
              <Text className='player-btn'>⏮</Text>
              <Text className='player-btn player-btn-play'>⏸</Text>
              <Text className='player-btn'>⏭</Text>
              <Text className='player-btn'>🔁</Text>
            </View>
          </View>

          {/* 振子 */}
          <View className='vibrator-card'>
            <View className='vibrator-header'>
              <Text className='vibrator-icon'>🎵</Text>
              <Text>{t('syncSensing')}</Text>
              <View
                className={`vibrator-toggle ${vibrator.enabled ? 'vibrator-toggle-on' : ''}`}
                onClick={handleVibratorToggle}
              >
                <View className='vibrator-knob' />
              </View>
            </View>
            {vibrator.enabled && (
              <View className='vibrator-intensity'>
                {[1, 2, 3].map((level) => (
                  <View
                    key={level}
                    className={`vib-level ${vibrator.intensity === level ? 'vib-level-active' : ''}`}
                    onClick={() => handleVibratorIntensity(level)}
                  >
                    <Text>{level}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* 音效 */}
          <View className='audio-profile'>
            <Text className='section-title'>🎚️ {t('audioProfile')}</Text>
            <SliderControl label={t('volume')} value={audio.volume} onChange={handleVolume} />
            <SliderControl label={t('treble')} value={audio.treble} onChange={handleTreble} />
            <SliderControl label={t('bass')} value={audio.bass} onChange={handleBass} />
          </View>

          {/* 音效模式 */}
          <View className='audio-modes'>
            {AUDIO_MODES.map((mode) => (
              <View
                key={mode.value}
                className={`audio-mode ${audio.mode === mode.value ? 'audio-mode-active' : ''}`}
                onClick={() => handleAudioMode(mode.value)}
              >
                <Text>{t(mode.key)}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {subTab === 'light' && (
        <View className='light-section'>
          <RGBPicker color={light.color} onChange={handleLightColor} />
          <View className='light-modes'>
            {LIGHT_MODES.map((mode) => (
              <View
                key={mode.value}
                className={`light-mode ${light.mode === mode.value ? 'light-mode-active' : ''}`}
                onClick={() => handleLightMode(mode.value)}
              >
                <Text>{t(mode.key)}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  )
}
