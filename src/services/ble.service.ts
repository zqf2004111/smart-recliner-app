import Taro from '@tarojs/taro'
import { ProtocolEncoder, CMD, MotorDirection, PresetPosition } from './protocol'

export interface BLEDevice {
  name: string
  deviceId: string
  RSSI: number
}

export type ConnectionCallback = (connected: boolean) => void
export type DataCallback = (data: Uint8Array) => void
export type ErrorCallback = (error: any) => void

const SERVICE_UUID = '0000FF00-0000-1000-8000-00805F9B34FB'
const WRITE_UUID = '0000FF02-0000-1000-8000-00805F9B34FB'
const NOTIFY_UUID = '0000FF01-0000-1000-8000-00805F9B34FB'

class BLESerice {
  private connectedDeviceId: string | null = null
  private connectionCallbacks: ConnectionCallback[] = []
  private dataCallbacks: DataCallback[] = []
  private errorCallbacks: ErrorCallback[] = []
  private scanTimer: any = null

  // ==================== 事件订阅 ====================

  onConnectionChange(cb: ConnectionCallback) {
    this.connectionCallbacks.push(cb)
    return () => {
      this.connectionCallbacks = this.connectionCallbacks.filter((c) => c !== cb)
    }
  }

  onDataReceived(cb: DataCallback) {
    this.dataCallbacks.push(cb)
    return () => {
      this.dataCallbacks = this.dataCallbacks.filter((c) => c !== cb)
    }
  }

  onError(cb: ErrorCallback) {
    this.errorCallbacks.push(cb)
    return () => {
      this.errorCallbacks = this.errorCallbacks.filter((c) => c !== cb)
    }
  }

  private emitConnection(connected: boolean) {
    this.connectionCallbacks.forEach((cb) => cb(connected))
  }

  private emitData(data: Uint8Array) {
    this.dataCallbacks.forEach((cb) => cb(data))
  }

  private emitError(error: any) {
    this.errorCallbacks.forEach((cb) => cb(error))
  }

  // ==================== 蓝牙状态 ====================

  async isBluetoothAvailable(): Promise<boolean> {
    try {
      const res = await Taro.openBluetoothAdapter()
      return true
    } catch (e) {
      return false
    }
  }

  async openAdapter(): Promise<void> {
    await Taro.openBluetoothAdapter()
  }

  async closeAdapter(): Promise<void> {
    await Taro.closeBluetoothAdapter()
  }

  // ==================== 扫描设备 ====================

  async startScan(filterNames?: string[], timeout = 10000): Promise<BLEDevice[]> {
    await this.openAdapter()

    const devices: BLEDevice[] = []
    const deviceSet = new Set<string>()

    return new Promise((resolve, reject) => {
      // 开始扫描
      Taro.startBluetoothDevicesDiscovery({
        allowDuplicatesKey: false,
        success: () => {
          console.log('[BLE] Scan started')
        },
        fail: (err) => {
          reject(err)
        },
      })

      // 监听发现设备
      Taro.onBluetoothDeviceFound((res) => {
        for (const d of res.devices) {
          if (!d.name || !d.deviceId) continue
          if (deviceSet.has(d.deviceId)) continue

          // 过滤沙发设备（名称包含Recliner或Smart等关键字）
          const isSofa =
            /recliner|smart.*sofa|sofa|bed/i.test(d.name) ||
            (filterNames && filterNames.some((f) => d.name.includes(f)))

          if (!isSofa) continue

          deviceSet.add(d.deviceId)
          devices.push({
            name: d.name,
            deviceId: d.deviceId,
            RSSI: d.RSSI || -100,
          })
        }
      })

      // 超时结束
      this.scanTimer = setTimeout(() => {
        Taro.stopBluetoothDevicesDiscovery()
        resolve(devices)
      }, timeout)
    })
  }

  stopScan() {
    if (this.scanTimer) {
      clearTimeout(this.scanTimer)
      this.scanTimer = null
    }
    Taro.stopBluetoothDevicesDiscovery()
  }

  // ==================== 连接/断开 ====================

  async connect(deviceId: string): Promise<void> {
    await this.openAdapter()

    // 连接设备
    await Taro.createBLEConnection({ deviceId })

    // 获取服务
    const services = await Taro.getBLEDeviceServices({ deviceId })
    console.log('[BLE] Services:', services.services)

    // 获取特征值
    const characteristics = await Taro.getBLEDeviceCharacteristics({
      deviceId,
      serviceId: SERVICE_UUID,
    })
    console.log('[BLE] Characteristics:', characteristics.characteristics)

    // 订阅通知
    await Taro.notifyBLECharacteristicValueChange({
      deviceId,
      serviceId: SERVICE_UUID,
      characteristicId: NOTIFY_UUID,
      state: true,
    })

    // 监听数据
    Taro.onBLECharacteristicValueChange((res) => {
      const arr = new Uint8Array(res.value)
      this.emitData(arr)
    })

    // 监听连接断开
    Taro.onBLEConnectionStateChange((res) => {
      console.log('[BLE] Connection state change:', res.connected)
      if (!res.connected) {
        this.connectedDeviceId = null
        this.emitConnection(false)
      }
    })

    this.connectedDeviceId = deviceId
    this.emitConnection(true)
  }

  async disconnect(): Promise<void> {
    if (!this.connectedDeviceId) return
    try {
      await Taro.closeBLEConnection({ deviceId: this.connectedDeviceId })
    } catch (e) {
      console.warn('[BLE] Disconnect error:', e)
    }
    this.connectedDeviceId = null
    this.emitConnection(false)
  }

  isConnected(): boolean {
    return !!this.connectedDeviceId
  }

  getConnectedDeviceId(): string | null {
    return this.connectedDeviceId
  }

  // ==================== 发送指令 ====================

  async sendCommand(commandCode: number[], data: number[]): Promise<void> {
    if (!this.connectedDeviceId) {
      throw new Error('Not connected')
    }

    const packet = ProtocolEncoder.encode(commandCode, data)
    const base64 = this.arrayBufferToBase64(packet)

    await Taro.writeBLECharacteristicValue({
      deviceId: this.connectedDeviceId,
      serviceId: SERVICE_UUID,
      characteristicId: WRITE_UUID,
      value: base64,
    })
  }

  // ==================== 便捷指令方法 ====================

  /** 童锁 */
  async setChildLock(enable: boolean) {
    await this.sendCommand(CMD.CHILD_LOCK_BOTH, [enable ? 0x01 : 0x00])
  }

  /** 推杆控制 */
  async controlMotor(motorCmd: number[], direction: number) {
    await this.sendCommand(motorCmd, [direction])
  }

  /** 设置推杆速度 */
  async setMotorSpeed(speedPercent: number) {
    const val = Math.max(0, Math.min(100, speedPercent))
    await this.sendCommand(CMD.MOTOR_SPEED, [val])
  }

  /** 运行预设位置 */
  async runPresetPosition(pos: number) {
    await this.sendCommand(CMD.POSITION_PRESET, [pos])
  }

  /** 运行记忆位 */
  async runMemoryPosition(slot: number) {
    await this.sendCommand(CMD.POSITION_MEMORY_RUN, [slot])
  }

  /** 设置记忆位 */
  async setMemoryPosition(slot: number) {
    await this.sendCommand(CMD.POSITION_MEMORY_SET, [slot])
  }

  /** 通风控制 */
  async setVentilation(level: number) {
    await this.sendCommand(CMD.VENT_SEAT, [level])
  }

  /** 通风模式 */
  async setVentMode(mode: number) {
    await this.sendCommand(CMD.VENT_MODE, [mode])
  }

  /** 通风定时 */
  async setVentTimer(minutes: number) {
    await this.sendCommand(CMD.VENT_TIMER, [minutes])
  }

  /** 加热控制 */
  async setHeating(level: number) {
    await this.sendCommand(CMD.HEAT_SEAT, [level])
  }

  /** 加热模式 */
  async setHeatMode(mode: number) {
    await this.sendCommand(CMD.HEAT_MODE, [mode])
  }

  /** 加热定时 */
  async setHeatTimer(minutes: number) {
    await this.sendCommand(CMD.HEAT_TIMER, [minutes])
  }

  /** 按摩模式 */
  async setMassageMode(mode: number) {
    await this.sendCommand(CMD.MASSAGE_MODE, [mode])
  }

  /** 按摩力度 */
  async setMassageIntensity(level: number) {
    await this.sendCommand(CMD.MASSAGE_INTENSITY, [level])
  }

  /** 按摩定时 */
  async setMassageTimer(minutes: number) {
    await this.sendCommand(CMD.MASSAGE_TIMER, [minutes])
  }

  /** 追腰 */
  async setWaist(enable: boolean) {
    await this.sendCommand(CMD.WAIST, [enable ? 0x01 : 0x00])
  }

  /** 追腰力度 */
  async setWaistIntensity(level: number) {
    await this.sendCommand(CMD.WAIST_INTENSITY, [level])
  }

  /** 灯光模式 */
  async setLightMode(mode: number) {
    await this.sendCommand(CMD.LIGHT_MODE, [mode])
  }

  /** 灯光颜色 RGB */
  async setLightColor(r: number, g: number, b: number) {
    await this.sendCommand(CMD.LIGHT_COLOR, [r, g, b])
  }

  /** 振子模式 */
  async setVibratorMode(mode: number) {
    await this.sendCommand(CMD.VIBRATOR_MODE, [mode])
  }

  /** 振子强度 */
  async setVibratorIntensity(level: number) {
    await this.sendCommand(CMD.VIBRATOR_INTENSITY, [level])
  }

  /** 音效模式 */
  async setAudioMode(mode: number) {
    await this.sendCommand(CMD.AUDIO_MODE, [mode])
  }

  /** 高音增益 */
  async setTreble(gain: number) {
    await this.sendCommand(CMD.AUDIO_TREBLE, [gain])
  }

  /** 低音增益 */
  async setBass(gain: number) {
    await this.sendCommand(CMD.AUDIO_BASS, [gain])
  }

  /** 音量 */
  async setVolume(vol: number) {
    await this.sendCommand(CMD.AUDIO_VOLUME, [vol])
  }

  /** 蓝牙配对 */
  async setBlePairing(enable: boolean) {
    await this.sendCommand(CMD.PAIR_BLE, [enable ? 0x01 : 0x00])
  }

  /** 2.4G配对 */
  async setTVPairing(enable: boolean) {
    await this.sendCommand(CMD.PAIR_TV, [enable ? 0x01 : 0x00])
  }

  /** 组网配对 */
  async setNetworkPairing(enable: boolean) {
    await this.sendCommand(CMD.PAIR_NETWORK, [enable ? 0x01 : 0x00])
  }

  /** 语言切换 */
  async setLanguage(lang: number) {
    await this.sendCommand(CMD.LANGUAGE, [lang])
  }

  /** 获取版本信息 */
  async getVersion() {
    await this.sendCommand(CMD.VERSION, [0, 0, 0, 0, 0])
  }

  // ==================== 工具方法 ====================

  private arrayBufferToBase64(buffer: Uint8Array): string {
    const bytes = Array.from(buffer)
    const binary = bytes.map((b) => String.fromCharCode(b)).join('')
    return btoa(binary)
  }
}

export const bleService = new BLESerice()
export { MotorDirection, PresetPosition }
