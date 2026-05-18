import { View, Text } from '@tarojs/components'
import { useTranslation } from 'react-i18next'
import './index.less'

export default function SettingsPage() {
  const { t } = useTranslation()

  return (
    <View className='settings-page'>
      <Text>{t('settings')}</Text>
    </View>
  )
}
