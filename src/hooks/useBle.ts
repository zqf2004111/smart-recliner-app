import { useEffect, useCallback } from 'react'
import { bleService } from '@/services/ble.service'
import { ProtocolEncoder } from '@/services/protocol'
import { useSofaStore } from '@/stores/sofa.store'

export function useBle() {
  const store = useSofaStore()

  useEffect(() => {
    const unsubConnection = bleService.onConnectionChange((connected) => {
      store.setConnected(connected)
    })

    const unsubData = bleService.onDataReceived((data) => {
      const decoded = ProtocolEncoder.decode(data)
      if (decoded) {
        console.log('[BLE] Received:', decoded)
        // 解析状态并更新store
        try {
          const state = ProtocolEncoder.parseState(decoded.data)
          if (state.motors) store.updateMotors(state.motors)
          if (state.massage) store.updateMassage(state.massage)
          if (state.heating) store.updateHeating(state.heating)
          if (state.ventilation) store.updateVentilation(state.ventilation)
          if (state.light) store.updateLight(state.light)
          if (state.waist) store.updateWaist(state.waist)
          if (state.vibrator) store.updateVibrator(state.vibrator)
          if (state.audio) store.updateAudio(state.audio)
          if (state.pairing) store.updatePairing(state.pairing)
          if (state.language !== undefined) store.setLanguage(state.language)
        } catch (e) {
          console.warn('[BLE] Parse state error:', e)
        }
      }
    })

    const unsubError = bleService.onError((err) => {
      console.error('[BLE] Error:', err)
    })

    return () => {
      unsubConnection()
      unsubData()
      unsubError()
    }
  }, [])

  const scanDevices = useCallback(async (filterNames?: string[]) => {
    return bleService.startScan(filterNames, 10000)
  }, [])

  const connect = useCallback(async (deviceId: string) => {
    store.setConnecting(true)
    try {
      await bleService.connect(deviceId)
    } finally {
      store.setConnecting(false)
    }
  }, [])

  const disconnect = useCallback(async () => {
    await bleService.disconnect()
  }, [])

  return {
    connected: store.connected,
    connecting: store.connecting,
    scanDevices,
    connect,
    disconnect,
    bleService,
  }
}
