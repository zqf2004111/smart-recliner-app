import { View, Text } from '@tarojs/components'
import { useTranslation } from 'react-i18next'
import './index.less'

const MODES = [
  { key: 'posture', icon: '📈' },
  { key: 'massage', icon: '〰️' },
  { key: 'heating', icon: '🌡️' },
  { key: 'ventilation', icon: '💨' },
]

interface ModeTabsProps {
  active: string
  onChange: (mode: string) => void
}

export default function ModeTabs({ active, onChange }: ModeTabsProps) {
  const { t } = useTranslation()

  return (
    <View className='mode-tabs'>
      {MODES.map((mode) => (
        <View
          key={mode.key}
          className={`mode-tab ${active === mode.key ? 'mode-tab-active' : ''}`}
          onClick={() => onChange(mode.key)}
        >
          <Text className='mode-tab-icon'>{mode.icon}</Text>
          <Text className='mode-tab-label'>{t(mode.key)}</Text>
        </View>
      ))}
    </View>
  )
}
