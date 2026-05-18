import { View, Text } from '@tarojs/components'
import { useTranslation } from 'react-i18next'
import './index.less'

interface ModeItem {
  key: string
  value: number
  icon?: string
}

interface ModeGridProps {
  modes: ModeItem[]
  active: number
  onSelect: (value: number) => void
}

export default function ModeGrid({ modes, active, onSelect }: ModeGridProps) {
  const { t } = useTranslation()

  return (
    <View className='mode-grid'>
      {modes.map((mode) => (
        <View
          key={mode.value}
          className={`mode-item ${active === mode.value ? 'mode-item-active' : ''}`}
          onClick={() => onSelect(mode.value)}
        >
          <View className='mode-item-icon'>
            <Text>{mode.icon || '●'}</Text>
          </View>
          <Text className='mode-item-label'>{t(mode.key)}</Text>
        </View>
      ))}
    </View>
  )
}
