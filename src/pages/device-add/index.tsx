import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useTranslation } from 'react-i18next'
import './index.less'

const MODELS = [
  { name: 'reclinerPlus', image: 'sofa Animation.png' },
  { name: 'reclinerPro', image: 'sofa Animation.png' },
  { name: 'powerRecliner', image: 'sofa Animation.png' },
  { name: 'loveseatRecliner', image: 'sofa Animation.png' },
  { name: 'smartRecliner', image: 'sofa Animation.png' },
  { name: 'smartRecliner', image: 'sofa Animation.png' },
]

export default function DeviceAddPage() {
  const { t } = useTranslation()

  const handleSelect = () => {
    Taro.navigateTo({ url: '/pages/device-connect/index' })
  }

  return (
    <View className='device-add-page'>
      <View className='add-grid'>
        {MODELS.map((model, i) => (
          <View key={i} className='add-model-card' onClick={handleSelect}>
            <Image
              className='add-model-img'
              src={require('@/assets/images/sofa Animation.png')}
              mode='aspectFit'
            />
            <Text className='add-model-name'>{t(model.name)}</Text>
          </View>
        ))}
      </View>
      <View className='add-action-btn' onClick={handleSelect}>
        <Text>{t('addDevice')}</Text>
      </View>
    </View>
  )
}
