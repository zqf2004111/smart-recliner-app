import { View } from '@tarojs/components'
import { useSofaStore } from '@/stores/sofa.store'
import { bleService } from '@/services/ble.service'
import { HEAT_MODES } from '@/utils/constants'
import ModeGrid from '@/components/mode-grid'
import TimerPanel from '@/components/timer-panel'
import { useTimer } from '@/hooks/useTimer'

export default function HeatingTab() {
  const heating = useSofaStore((s) => s.heating)
  const timer = useTimer(heating.remainingTime)

  const handleMode = async (mode: number) => {
    await bleService.setHeatMode(mode)
    await bleService.setHeating(mode === 0 ? 0 : 2)
  }

  const handleTimerToggle = async (enabled: boolean) => {
    if (enabled) {
      timer.start()
      await bleService.setHeatTimer(5)
    } else {
      timer.stop()
      await bleService.setHeatTimer(0)
    }
  }

  const handleTimerSet = async (min: number) => {
    timer.reset(min)
    await bleService.setHeatTimer(min)
  }

  return (
    <View className='heating-tab'>
      <ModeGrid
        modes={HEAT_MODES}
        active={heating.mode}
        onSelect={handleMode}
      />
      <TimerPanel
        enabled={heating.enabled}
        minutes={5}
        remainingTime={timer.formatTime()}
        onToggle={handleTimerToggle}
        onSetTime={handleTimerSet}
      />
    </View>
  )
}
