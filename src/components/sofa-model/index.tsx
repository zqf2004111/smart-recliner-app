import { View, Image } from '@tarojs/components'
import { useSofaStore } from '@/stores/sofa.store'
import './index.less'

export default function SofaModel() {
  const massage = useSofaStore((s) => s.massage)
  const heating = useSofaStore((s) => s.heating)
  const ventilation = useSofaStore((s) => s.ventilation)

  return (
    <View className='sofa-model'>
      <Image
        className='sofa-model-img'
        src={require('@/assets/images/sofa Animation.png')}
        mode='aspectFit'
      />
      <View className='sofa-model-indicators'>
        {massage.enabled && (
          <View className='indicator indicator-massage'>💆</View>
        )}
        {heating.seatLevel > 0 && (
          <View className='indicator indicator-heat'>🔥</View>
        )}
        {ventilation.seatLevel > 0 && (
          <View className='indicator indicator-vent'>💨</View>
        )}
      </View>
    </View>
  )
}
