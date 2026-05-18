import { View, Text, Switch } from '@tarojs/components'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TIMER_OPTIONS } from '@/utils/constants'
import './index.less'

interface TimerPanelProps {
  enabled: boolean
  minutes: number
  remainingTime: string
  onToggle: (v: boolean) => void
  onSetTime: (min: number) => void
}

export default function TimerPanel({ enabled, minutes, remainingTime, onToggle, onSetTime }: TimerPanelProps) {
  const { t } = useTranslation()
  const [showPicker, setShowPicker] = useState(false)

  return (
    <View className='timer-panel'>
      <View className='timer-header'>
        <Text className='timer-title'>{t('timer')}</Text>
        <View className='timer-right'>
          {enabled && <Text className='timer-remaining'>{remainingTime}</Text>}
          <Switch checked={enabled} onChange={(e) => onToggle(e.detail.value)} color='#0066CC' />
        </View>
      </View>
      <View className='timer-subtitle' onClick={() => setShowPicker(!showPicker)}>
        <Text>{t('scheduledTime')} {minutes}{t('minutes')}</Text>
        <Text className='timer-arrow'>›</Text>
      </View>

      {showPicker && (
        <View className='timer-options'>
          {TIMER_OPTIONS.map((opt) => (
            <View
              key={opt}
              className={`timer-option ${minutes === opt ? 'timer-option-active' : ''}`}
              onClick={() => {
                onSetTime(opt)
                setShowPicker(false)
              }}
            >
              <Text>{opt}{t('minutes')}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}
