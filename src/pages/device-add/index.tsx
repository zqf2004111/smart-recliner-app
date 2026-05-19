import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.less'

const sofaTypes = [
  { name: 'Recliner Plus', img: require('@/assets/images/0c01d0e3ca55908bee122972b66e2be26f5ad9c9.png') },
  { name: 'Recliner Pro', img: require('@/assets/images/0f3f13a3b90294833558d0863cd71e2d621c5b7c.png') },
  { name: 'Power Recliner', img: require('@/assets/images/1954bc3698324e008df1185e8e902cb6f064a74b.png') },
  { name: 'loveseat Recliner', img: require('@/assets/images/4217b95aa78c96313a0be016592737ba2d3da936.png') },
  { name: 'Smart Recliner', img: require('@/assets/images/4379b9f6d22a17424422f732f8ce64ec9dc4f28f.png') },
  { name: 'Smart Recliner', img: require('@/assets/images/4a7b51838fa2b70cd629dc9fbbb6f9046c395915.png') },
]

export default function DeviceAddPage() {
  const addDevice = () => {
    Taro.navigateTo({ url: '/pages/device-scan/index' })
  }

  return (
    <View className='add-page'>
      <View className='add-header'>
        <View className='add-close' onClick={() => Taro.navigateBack()}>
          <Image style={{ width: 48, height: 48 }} src={require('@/assets/images/IconsPlus.png')} />
        </View>
      </View>

      <View className='add-card'>
        <View className='sofa-grid'>
          {sofaTypes.map((s, i) => (
            <View key={i} className='sofa-item'>
              <Image className='sofa-img' src={s.img} />
              <Text className='sofa-name'>{s.name}</Text>
            </View>
          ))}
        </View>
        <View className='add-device-btn' onClick={addDevice}>
          <Text className='add-device-text'>Add Device</Text>
        </View>
      </View>
    </View>
  )
}
