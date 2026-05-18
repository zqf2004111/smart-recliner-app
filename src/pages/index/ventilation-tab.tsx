import { View } from '@tarojs/components'
import { useSofaStore } from '@/stores/sofa.store'
import { bleService } from '@/services/ble.service'
import { VENT_MODES } from '@/utils/constants'
import ModeGrid from '@/components/mode-grid'
import TimerPanel from '@/components/timer-panel'
import { useTimer } from '@/hooks/useTimer'

export default function VentilationTab() {
  const ventilation = useSofaStore((s) => s.ventilation)
  const timer = useTimer(ventilation.remainingTime)

  const handleMode = async (mode: number) => {
    await bleService.setVentMode(mode)
    await bleService.setVentilation(mode === 0 ? 0 : 2)
  }

  const handleTimerToggle = async (enabled: boolean) => {
    if (enabled) {
      timer.start()
      await bleService.setVentTimer(5)
    } else {
      timer.stop()
      await bleService.setVentTimer(0)
    }
  }

  const handleTimerSet = async (min: number) => {
    timer.reset(min)
    await bleService.setVentTimer(min)
  }

  return (
    <View className='ventilation-tab'>
      <ModeGrid
        modes={VENT_MODES}
        active={ventilation.mode}
        onSelect={handleMode}
      />
      <TimerPanel
        enabled={ventilation.enabled}
        minutes={5}
        remainingTime={timer.formatTime()}
        onToggle={handleTimerToggle}
        onSetTime={handleTimerSet}
      />
    </View>
  )
}
