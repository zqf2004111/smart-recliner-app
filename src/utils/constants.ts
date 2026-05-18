import { MassageMode, HeatMode, VentMode, LightMode, VibratorMode, AudioMode } from '@/services/protocol'

export const MASSAGE_MODES = [
  { key: 'wave', value: MassageMode.WAVE, icon: 'wave' },
  { key: 'catwalk', value: MassageMode.CATWALK, icon: 'catwalk' },
  { key: 'butterfly', value: MassageMode.BUTTERFLY, icon: 'butterfly' },
  { key: 'acupressure', value: MassageMode.ACUPRESSURE, icon: 'acupressure' },
  { key: 'pat', value: MassageMode.PAT_SINGLE, icon: 'pat' },
]

export const HEAT_MODES = [
  { key: 'gentle', value: HeatMode.GENTLE },
  { key: 'rapid', value: HeatMode.RAPID },
]

export const VENT_MODES = [
  { key: 'gentle', value: VentMode.GENTLE },
  { key: 'rapid', value: VentMode.RAPID },
]

export const LIGHT_MODES = [
  { key: 'steady', value: LightMode.STEADY },
  { key: 'colorCycle', value: LightMode.COLOR_CYCLE },
  { key: 'rhythmic', value: LightMode.RHYTHMIC },
  { key: 'breath', value: LightMode.BREATH },
]

export const AUDIO_MODES = [
  { key: 'general', value: AudioMode.GENERAL },
  { key: 'rock', value: AudioMode.ROCK },
  { key: 'pop', value: AudioMode.POP },
  { key: 'classic', value: AudioMode.CLASSIC },
  { key: 'jazz', value: AudioMode.JAZZ },
]

export const PRESET_POSITIONS = [
  { key: 'homePosition', value: 0x00 },
  { key: 'tvPosition', value: 0x01 },
  { key: 'zgPosition', value: 0x03 },
  { key: 'memoryPosition', value: 0xFF }, // 特殊处理
]

export const MOTORS = [
  { key: 'seat', cmd: [0x00, 0x01] },
  { key: 'head', cmd: [0x00, 0x02] },
  { key: 'lumbar', cmd: [0x00, 0x03] },
  { key: 'foot', cmd: [0x00, 0x04] },
  { key: 'back', cmd: [0x00, 0x05] },
]

export const TIMER_OPTIONS = [5, 10, 15, 20, 25, 30]
