import { View, Text, Slider } from '@tarojs/components'
import './index.less'

interface SliderControlProps {
  label: string
  value: number
  min?: number
  max?: number
  unit?: string
  onChange: (val: number) => void
}

export default function SliderControl({ label, value, min = 0, max = 100, unit = '%', onChange }: SliderControlProps) {
  return (
    <View className='slider-control'>
      <View className='slider-header'>
        <Text className='slider-label'>{label}</Text>
        <Text className='slider-value'>{value}{unit}</Text>
      </View>
      <Slider
        className='slider-bar'
        value={value}
        min={min}
        max={max}
        activeColor='#0066CC'
        backgroundColor='#E8E8E8'
        blockColor='#0066CC'
        onChange={(e) => onChange(e.detail.value)}
        onAfterChange={(e) => onChange(e.detail.value)}
      />
    </View>
  )
}
