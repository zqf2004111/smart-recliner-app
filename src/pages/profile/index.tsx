import { View, Text } from '@tarojs/components'
import { useTranslation } from 'react-i18next'
import { useSofaStore } from '@/stores/sofa.store'
import { LANGUAGE_OPTIONS, LANGUAGE_COMMAND_MAP } from '@/locales'
import i18n from '@/locales'
import { bleService } from '@/services/ble.service'
import './index.less'

export default function ProfilePage() {
  const { t } = useTranslation()
  const device = useSofaStore((s) => s.currentDevice)
  const connected = useSofaStore((s) => s.connected)
  const language = useSofaStore((s) => s.language)

  const handleLanguageChange = async (lang: string) => {
    i18n.changeLanguage(lang)
    const cmdValue = LANGUAGE_COMMAND_MAP[lang]
    if (cmdValue !== undefined) {
      await bleService.setLanguage(cmdValue)
    }
  }

  const handleDisconnect = async () => {
    await bleService.disconnect()
  }

  return (
    <View className='profile-page'>
      {/* 设备信息卡片 */}
      <View className='profile-card'>
        <View className='profile-device-row'>
          <Text className='profile-device-name'>
            {device?.name || 'Smart Recliner Pro'}
          </Text>
          <View className={`profile-status ${connected ? 'profile-status-connected' : ''}`}>
            <Text>{connected ? t('connected') : t('disconnected')}</Text>
          </View>
        </View>
        {device && (
          <View className='profile-info-list'>
            <View className='profile-info-item'>
              <Text className='profile-info-label'>{t('sn')}</Text>
              <Text className='profile-info-value'>{device.sn || '--'}</Text>
            </View>
            <View className='profile-info-item'>
              <Text className='profile-info-label'>{t('hardwareVersion')}</Text>
              <Text className='profile-info-value'>{device.hwVersion || '--'}</Text>
            </View>
            <View className='profile-info-item'>
              <Text className='profile-info-label'>{t('firmwareVersion')}</Text>
              <Text className='profile-info-value'>{device.fwVersion || '--'}</Text>
            </View>
          </View>
        )}
        {connected && (
          <View className='profile-disconnect-btn' onClick={handleDisconnect}>
            <Text>{t('disconnect')}</Text>
          </View>
        )}
      </View>

      {/* 语言设置 */}
      <View className='profile-card'>
        <Text className='profile-section-title'>{t('language')}</Text>
        <View className='profile-language-list'>
          {LANGUAGE_OPTIONS.map((opt) => (
            <View
              key={opt.value}
              className={`profile-language-item ${i18n.language === opt.value ? 'profile-language-active' : ''}`}
              onClick={() => handleLanguageChange(opt.value)}
            >
              <Text>{opt.label}</Text>
              {i18n.language === opt.value && <Text className='profile-check'>✓</Text>}
            </View>
          ))}
        </View>
      </View>

      {/* 关于 */}
      <View className='profile-card'>
        <Text className='profile-section-title'>{t('about')}</Text>
        <View className='profile-info-item'>
          <Text className='profile-info-label'>{t('version')}</Text>
          <Text className='profile-info-value'>1.0.0</Text>
        </View>
      </View>
    </View>
  )
}
