import { View, Text } from '@tarojs/components'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import './index.less'

interface RGBPickerProps {
  color: [number, number, number]
  onChange: (r: number, g: number, b: number) => void
}

const PRESET_COLORS = [
  [255, 255, 255],
  [255, 0, 0],
  [255, 165, 0],
  [255, 255, 0],
  [0, 255, 0],
  [0, 255, 255],
  [0, 0, 255],
  [128, 0, 128],
  [255, 192, 203],
]

export default function RGBPicker({ color, onChange }: RGBPickerProps) {
  const { t } = useTranslation()
  const [r, setR] = useState(color[0])
  const [g, setG] = useState(color[1])
  const [b, setB] = useState(color[2])

  const handlePreset = (c: number[]) => {
    setR(c[0])
    setG(c[1])
    setB(c[2])
    onChange(c[0], c[1], c[2])
  }

  return (
    <View className='rgb-picker'>
      <View
        className='rgb-preview'
        style={{ backgroundColor: `rgb(${r},${g},${b})` }}
      >
        <Text className='rgb-preview-icon'>⏻</Text>
      </View>
      <View className='rgb-sliders'>
        <View className='rgb-slider-row'>
          <Text className='rgb-label'>R</Text>
          <input
            type='range'
            min={0}
            max={255}
            value={r}
            className='rgb-range rgb-range-r'
            onInput={(e: any) => { setR(Number(e.detail.value)); onChange(Number(e.detail.value), g, b) }}
          />
          <Text className='rgb-value'>{r}</Text>
        </View>
        <View className='rgb-slider-row'>
          <Text className='rgb-label'>G</Text>
          <input
            type='range'
            min={0}
            max={255}
            value={g}
            className='rgb-range rgb-range-g'
            onInput={(e: any) => { setG(Number(e.detail.value)); onChange(r, Number(e.detail.value), b) }}
          />
          <Text className='rgb-value'>{g}</Text>
        </View>
        <View className='rgb-slider-row'>
          <Text className='rgb-label'>B</Text>
          <input
            type='range'
            min={0}
            max={255}
            value={b}
            className='rgb-range rgb-range-b'
            onInput={(e: any) => { setB(Number(e.detail.value)); onChange(r, g, Number(e.detail.value)) }}
          />
          <Text className='rgb-value'>{b}</Text>
        </View>
      </View>
      <View className='rgb-presets'>
        {PRESET_COLORS.map((c, i) => (
          <View
            key={i}
            className='rgb-preset'
            style={{ backgroundColor: `rgb(${c[0]},${c[1]},${c[2]})` }}
            onClick={() => handlePreset(c)}
          />
        ))}
      </View>
    </View>
  )
}
