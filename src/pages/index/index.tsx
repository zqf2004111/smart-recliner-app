import { View } from '@tarojs/components'
import { useState } from 'react'
import TopBar from '@/components/top-bar'
import ModeTabs from '@/components/mode-tabs'
import SofaModel from '@/components/sofa-model'
import PostureTab from './posture-tab'
import MassageTab from './massage-tab'
import HeatingTab from './heating-tab'
import VentilationTab from './ventilation-tab'
import { useBle } from '@/hooks/useBle'
import './index.less'

type TabKey = 'posture' | 'massage' | 'heating' | 'ventilation'

export default function IndexPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('posture')
  useBle()

  const renderTab = () => {
    switch (activeTab) {
      case 'posture': return <PostureTab />
      case 'massage': return <MassageTab />
      case 'heating': return <HeatingTab />
      case 'ventilation': return <VentilationTab />
      default: return <PostureTab />
    }
  }

  return (
    <View className='index-page'>
      <TopBar />
      <SofaModel />
      <ModeTabs active={activeTab} onChange={(v) => setActiveTab(v as TabKey)} />
      <View className='tab-content'>
        {renderTab()}
      </View>
    </View>
  )
}
