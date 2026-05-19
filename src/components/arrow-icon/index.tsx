import { View } from '@tarojs/components'
import './index.less'

interface Props {
  direction: 'up' | 'down' | 'left' | 'right'
  size?: number
  color?: string
}

export default function ArrowIcon({ direction, size = 40, color = '#333' }: Props) {
  const rotateMap = {
    up: -45,
    right: -45,
    down: 135,
    left: -135,
  }
  return (
    <View
      className='arrow-icon'
      style={{
        width: `${size}rpx`,
        height: `${size}rpx`,
        borderLeft: `6rpx solid ${color}`,
        borderBottom: `6rpx solid ${color}`,
        transform: `rotate(${rotateMap[direction]}deg)`,
      }}
    />
  )
}
