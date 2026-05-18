/**
 * 蓝牙通讯协议编解码
 * 帧格式：帧头(5B) + 命令码(2B) + 数据长度(2B) + 数据包(nB) + 校验和(1B)
 */

// 请求帧头 APP -> 设备
const REQUEST_HEADER = [0xAA, 0x21, 0x01, 0x31, 0x01]
// 应答帧头 设备 -> APP
const RESPONSE_HEADER = [0xBB, 0x31, 0x01, 0x21, 0x01]

export class ProtocolEncoder {
  /**
   * 构造请求帧
   * @param commandCode 命令码 [high, low]
   * @param data 数据包（最多5字节）
   */
  static encode(commandCode: number[], data: number[]): Uint8Array {
    const packet = new Array(5).fill(0)
    for (let i = 0; i < Math.min(data.length, 5); i++) {
      packet[i] = data[i] & 0xFF
    }

    const dataLen = packet.length
    const frame = [
      ...REQUEST_HEADER,
      commandCode[0] & 0xFF,
      commandCode[1] & 0xFF,
      (dataLen >> 8) & 0xFF,
      dataLen & 0xFF,
      ...packet,
    ]

    // 校验和：帧头至数据包的算术累加和
    let checksum = 0
    for (const byte of frame) {
      checksum = (checksum + byte) & 0xFF
    }

    return new Uint8Array([...frame, checksum])
  }

  /**
   * 解析应答帧
   * @param buffer 完整应答帧
   */
  static decode(buffer: Uint8Array): { commandCode: number[]; data: number[]; statusCode: number[] } | null {
    if (buffer.length < 10) return null

    // 验证帧头
    for (let i = 0; i < 5; i++) {
      if (buffer[i] !== RESPONSE_HEADER[i]) return null
    }

    const commandCode = [buffer[5], buffer[6]]
    const dataLen = (buffer[7] << 8) | buffer[8]

    if (buffer.length < 9 + dataLen + 1) return null

    // 验证校验和
    let checksum = 0
    for (let i = 0; i < 9 + dataLen; i++) {
      checksum = (checksum + buffer[i]) & 0xFF
    }
    if (checksum !== buffer[9 + dataLen]) return null

    const data = Array.from(buffer.slice(9, 9 + dataLen))
    const statusCode = data.length >= 2 ? [data[0], data[1]] : [0, 0]
    const payload = data.length > 2 ? data.slice(2) : []

    return { commandCode, data: payload, statusCode }
  }

  /**
   * 解析完整状态包
   */
  static parseState(data: number[]) {
    const state: any = {}
    let idx = 0

    // --- 电机状态 ---
    const motorCount = data[idx++]
    state.motors = []
    for (let i = 0; i < motorCount; i++) {
      state.motors.push({
        speed: (data[idx] << 8) | data[idx + 1],
        position: (data[idx + 2] << 8) | data[idx + 3],
        positionType: data[idx + 4],
        totalStroke: (data[idx + 5] << 8) | data[idx + 6],
      })
      idx += 7
    }

    // --- 按摩状态 ---
    const massageCount = data[idx++]
    if (massageCount > 0) {
      state.massage = {
        mode: data[idx],
        intensity: data[idx + 1],
        remainingTime: (data[idx + 2] << 8) | data[idx + 3],
      }
      idx += 4
    }

    // --- 加热状态 ---
    const heatingCount = data[idx++]
    if (heatingCount > 0) {
      state.heating = {
        mode: data[idx],
        levels: [],
      }
      idx += 1
      for (let i = 0; i < heatingCount; i++) {
        state.heating.levels.push({
          level: data[idx],
          remainingTime: (data[idx + 1] << 8) | data[idx + 2],
        })
        idx += 3
      }
    }

    // --- 通风状态 ---
    const ventCount = data[idx++]
    if (ventCount > 0) {
      state.ventilation = {
        mode: data[idx],
        levels: [],
      }
      idx += 1
      for (let i = 0; i < ventCount; i++) {
        state.ventilation.levels.push({
          level: data[idx],
          remainingTime: (data[idx + 1] << 8) | data[idx + 2],
        })
        idx += 3
      }
    }

    // --- 灯带状态 ---
    const lightCount = data[idx++]
    if (lightCount > 0) {
      state.light = {
        mode: data[idx],
        color: [data[idx + 1], data[idx + 2], data[idx + 3]],
      }
      idx += 4
    }

    // --- 追腰状态 ---
    const waistCount = data[idx++]
    if (waistCount > 0) {
      state.waist = {
        enabled: data[idx] !== 0,
        intensity: data[idx + 1],
      }
      idx += 2
    }

    // --- 振子状态 ---
    const vibCount = data[idx++]
    if (vibCount > 0) {
      state.vibrator = {
        mode: data[idx],
        intensity: data[idx + 1],
      }
      idx += 2
    }

    // --- 音效状态 ---
    const audioCount = data[idx++]
    if (audioCount > 0) {
      state.audio = {
        mode: data[idx],
        treble: data[idx + 1],
        bass: data[idx + 2],
        volume: data[idx + 3],
      }
      idx += 4
    }

    // --- 配对状态 ---
    const pairCount = data[idx++]
    if (pairCount > 0) {
      state.pairing = {
        bleCountdown: (data[idx] << 8) | data[idx + 1],
        tvCountdown: (data[idx + 2] << 8) | data[idx + 3],
        networkCountdown: (data[idx + 4] << 8) | data[idx + 5],
      }
      idx += 6
    }

    // --- 语言 ---
    const langCount = data[idx++]
    if (langCount > 0) {
      state.language = data[idx]
      idx += 1
    }

    return state
  }
}

// ===================== 命令码常量 =====================

export const CMD = {
  // 童锁
  CHILD_LOCK_LEFT: [0x01, 0x08],
  CHILD_LOCK_RIGHT: [0x01, 0x0A],
  CHILD_LOCK_BOTH: [0x01, 0x0C],

  // 沙发控制
  MOTOR_SEAT: [0x00, 0x01],
  MOTOR_HEAD: [0x00, 0x02],
  MOTOR_LUMBAR: [0x00, 0x03],
  MOTOR_FOOT: [0x00, 0x04],
  MOTOR_BACK: [0x00, 0x05],
  MOTOR_SPEED: [0x00, 0x06],

  // 记忆位
  POSITION_PRESET: [0x00, 0x10],
  POSITION_MEMORY_RUN: [0x00, 0x11],
  POSITION_MEMORY_SET: [0x00, 0x12],

  // 通风
  VENT_SEAT: [0x00, 0x20],
  VENT_BACK: [0x00, 0x21],
  VENT_MODE: [0x00, 0x22],
  VENT_TIMER: [0x00, 0x23],

  // 加热
  HEAT_SEAT: [0x00, 0x30],
  HEAT_BACK: [0x00, 0x31],
  HEAT_SHOULDER: [0x00, 0x32],
  HEAT_LEG: [0x00, 0x33],
  HEAT_ARM: [0x00, 0x34],
  HEAT_MODE: [0x00, 0x35],
  HEAT_TIMER: [0x00, 0x36],

  // 按摩
  MASSAGE_MODE: [0x00, 0x40],
  MASSAGE_INTENSITY: [0x00, 0x41],
  MASSAGE_TIMER: [0x00, 0x42],

  // 追腰
  WAIST: [0x00, 0x50],
  WAIST_INTENSITY: [0x00, 0x51],

  // 灯光
  LIGHT_MODE: [0x00, 0x60],
  LIGHT_COLOR: [0x00, 0x61],

  // 振子
  VIBRATOR_MODE: [0x00, 0x70],
  VIBRATOR_INTENSITY: [0x00, 0x71],

  // 音效
  AUDIO_MODE: [0x00, 0x80],
  AUDIO_TREBLE: [0x00, 0x81],
  AUDIO_BASS: [0x00, 0x82],
  AUDIO_VOLUME: [0x00, 0x83],

  // 配对
  PAIR_BLE: [0x00, 0x90],
  PAIR_TV: [0x00, 0x91],
  PAIR_NETWORK: [0x00, 0x92],

  // 语言
  LANGUAGE: [0x00, 0xA0],

  // 版本
  VERSION: [0x01, 0x20],
} as const

// 枚举值
export const MotorDirection = {
  STOP: 0x00,
  UP: 0x01,
  DOWN: 0x02,
} as const

export const PresetPosition = {
  HOME: 0x00,
  TV: 0x01,
  RECLINE: 0x02,
  ZERO_G: 0x03,
  HIGH_LEG: 0x04,
} as const

export const MassageMode = {
  OFF: 0x00,
  SINGLE_WAVE: 0x01,
  PAT: 0x02,
  DOUBLE_WAVE: 0x03,
  WAVE: 0x11,
  CATWALK: 0x12,
  BUTTERFLY: 0x13,
  ACUPRESSURE: 0x14,
  PAT_SINGLE: 0x15,
  KNEAD: 0x21,
  ACUPRESSURE_CORE: 0x22,
  PAT_CORE: 0x23,
} as const

export const HeatMode = {
  OFF: 0x00,
  RAPID: 0x01,
  GENTLE: 0x02,
  SHOULDER_THERAPY: 0x03,
  LUMBAR_THERAPY: 0x04,
} as const

export const VentMode = {
  OFF: 0x00,
  RAPID: 0x01,
  GENTLE: 0x02,
} as const

export const LightMode = {
  OFF: 0x00,
  STEADY: 0x01,
  BREATH: 0x02,
  COLOR_CYCLE: 0x03,
  RHYTHMIC: 0x04,
} as const

export const VibratorMode = {
  OFF: 0x00,
  MUSIC: 0x01,
  MASSAGE_1: 0x02,
  MASSAGE_2: 0x03,
} as const

export const AudioMode = {
  GENERAL: 0x00,
  ROCK: 0x01,
  POP: 0x02,
  CLASSIC: 0x03,
  JAZZ: 0x04,
} as const
