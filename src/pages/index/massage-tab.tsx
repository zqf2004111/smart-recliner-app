import { View, Text } from '@tarojs/components'
import { useTranslation } from 'react-i18next'
import { useSofaStore } from '@/stores/sofa.store'
import { bleService } from '@/services/ble.service'
import { MASSAGE_MODES } from '@/utils/constants'
import ModeGrid from '@/components/mode-grid'
import TimerPanel from '@/components/timer-panel'
import { useTimer } from '@/hooks/useTimer'
import './massage-tab.less'

export default function MassageTab() {
  const { t } = useTranslation()
  const massage = useSofaStore((s) => s.massage)
  const timer = useTimer(massage.remainingTime)

  const handleMode = async (mode: number) => {
    await bleService.setMassageMode(mode)
  }

  const handleIntensity = async (level: number) => {
    await bleService.setMassageIntensity(level)
  }

  const handleTimerToggle = async (enabled: boolean) => {
    if (enabled) {
      timer.start()
      await bleService.setMassageTimer(5)
    } else {
      timer.stop()
      await bleService.setMassageTimer(0)
    }
  }

  const handleTimerSet = async (min: number) => {
    timer.reset(min)
    await bleService.setMassageTimer(min)
  }

  return (
    <View className='massage-tab'>
      <ModeGrid
        modes={MASSAGE_MODES}
        active={massage.mode}
        onSelect={handleMode}
      />

      {/* 力度 */}
      <View className='intensity-row'>
        <Text className='intensity-label'>{t('intensity')}</Text>
        {[1, 2, 3].map((level) => (
          <View
            key={level}
            className={`intensity-btn ${massage.intensity === level ? 'intensity-btn-active' : ''}`}
            onClick={() => handleIntensity(level)}
          >
            <Text>{level}</Text>
          </View>
        ))}
      </View>

      <TimerPanel
        enabled={massage.enabled}
        minutes={5}
        remainingTime={timer.formatTime()}
        onToggle={handleTimerToggle}
        onSetTime={handleTimerSet}
      />
    </View>
  )
}
