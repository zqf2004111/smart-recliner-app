import { create } from 'zustand'

export interface MotorState {
  type: string
  speed: number
  position: number
  positionType: number
  totalStroke: number
}

export interface MassageState {
  enabled: boolean
  mode: number
  intensity: number
  remainingTime: number
}

export interface HeatingState {
  enabled: boolean
  mode: number
  seatLevel: number
  backLevel: number
  shoulderLevel: number
  legLevel: number
  armLevel: number
  remainingTime: number
}

export interface VentilationState {
  enabled: boolean
  mode: number
  seatLevel: number
  backLevel: number
  remainingTime: number
}

export interface LightState {
  enabled: boolean
  mode: number
  color: [number, number, number]
}

export interface WaistState {
  enabled: boolean
  intensity: number
}

export interface VibratorState {
  enabled: boolean
  mode: number
  intensity: number
}

export interface AudioState {
  mode: number
  treble: number
  bass: number
  volume: number
}

export interface PairingState {
  bleCountdown: number
  tvCountdown: number
  networkCountdown: number
}

export interface DeviceInfo {
  id: string
  name: string
  model: string
  sn: string
  hwVersion: string
  fwVersion: string
}

/** 广播数据解析后的设备能力配置 */
export interface DeviceCapability {
  sofaType: number // 0x01单人 0x02双人 0x03三人
  seatMotor: number // 0无 1常规有刷 2霍尔有刷 3无刷
  headMotor: number
  lumbarMotor: number
  backMotor: number
  liftMotor: number
  heating: {
    armrest: boolean
    back: boolean
    shoulder: boolean
    waist: boolean
    leg: boolean
    seat: boolean
  }
  ventilation: {
    back: boolean
    seat: boolean
  }
  massageType: number // 0无 1条形气囊(a) 2八点气囊(b) 3揉捏气囊(c)
  hasWaist: boolean
  hasLight: boolean
  hasVibrator: boolean
  hasAudio: boolean
  customerLevel: number
  version: string
}

export interface SofaState {
  // Connection
  connected: boolean
  connecting: boolean
  currentDevice: DeviceInfo | null
  deviceList: DeviceInfo[]

  // Device capability from broadcast
  capability: DeviceCapability | null

  // Motors
  motors: MotorState[]

  // Features
  massage: MassageState
  heating: HeatingState
  ventilation: VentilationState
  light: LightState
  waist: WaistState
  vibrator: VibratorState
  audio: AudioState
  pairing: PairingState

  // Global
  language: number
  childLock: boolean

  // Actions
  setConnected: (v: boolean) => void
  setConnecting: (v: boolean) => void
  setCurrentDevice: (d: DeviceInfo | null) => void
  setDeviceList: (list: DeviceInfo[]) => void
  setCapability: (c: DeviceCapability | null) => void
  updateMotors: (motors: MotorState[]) => void
  updateMassage: (m: Partial<MassageState>) => void
  updateHeating: (h: Partial<HeatingState>) => void
  updateVentilation: (v: Partial<VentilationState>) => void
  updateLight: (l: Partial<LightState>) => void
  updateWaist: (w: Partial<WaistState>) => void
  updateVibrator: (v: Partial<VibratorState>) => void
  updateAudio: (a: Partial<AudioState>) => void
  updatePairing: (p: Partial<PairingState>) => void
  setLanguage: (lang: number) => void
  setChildLock: (v: boolean) => void
  resetState: () => void
}

const initialMassage: MassageState = {
  enabled: false,
  mode: 0,
  intensity: 1,
  remainingTime: 0,
}

const initialHeating: HeatingState = {
  enabled: false,
  mode: 1,
  seatLevel: 0,
  backLevel: 0,
  shoulderLevel: 0,
  legLevel: 0,
  armLevel: 0,
  remainingTime: 0,
}

const initialVentilation: VentilationState = {
  enabled: false,
  mode: 1,
  seatLevel: 0,
  backLevel: 0,
  remainingTime: 0,
}

const initialLight: LightState = {
  enabled: false,
  mode: 1,
  color: [255, 255, 255],
}

const initialWaist: WaistState = {
  enabled: false,
  intensity: 1,
}

const initialVibrator: VibratorState = {
  enabled: false,
  mode: 1,
  intensity: 1,
}

const initialAudio: AudioState = {
  mode: 0,
  treble: 50,
  bass: 50,
  volume: 50,
}

const initialPairing: PairingState = {
  bleCountdown: 0,
  tvCountdown: 0,
  networkCountdown: 0,
}

const initialCapability: DeviceCapability = {
  sofaType: 1,
  seatMotor: 1,
  headMotor: 1,
  lumbarMotor: 0,
  backMotor: 0,
  liftMotor: 0,
  heating: { armrest: false, back: false, shoulder: false, waist: false, leg: false, seat: true },
  ventilation: { back: false, seat: true },
  massageType: 2,
  hasWaist: false,
  hasLight: true,
  hasVibrator: true,
  hasAudio: true,
  customerLevel: 0,
  version: '1.0.0',
}

export const useSofaStore = create<SofaState>((set) => ({
  connected: false,
  connecting: false,
  currentDevice: null,
  deviceList: [],
  capability: { ...initialCapability },
  motors: [],
  massage: { ...initialMassage },
  heating: { ...initialHeating },
  ventilation: { ...initialVentilation },
  light: { ...initialLight },
  waist: { ...initialWaist },
  vibrator: { ...initialVibrator },
  audio: { ...initialAudio },
  pairing: { ...initialPairing },
  language: 0,
  childLock: false,

  setConnected: (v) => set({ connected: v }),
  setConnecting: (v) => set({ connecting: v }),
  setCurrentDevice: (d) => set({ currentDevice: d }),
  setDeviceList: (list) => set({ deviceList: list }),
  setCapability: (c) => set({ capability: c }),
  updateMotors: (motors) => set({ motors }),
  updateMassage: (m) => set((s) => ({ massage: { ...s.massage, ...m } })),
  updateHeating: (h) => set((s) => ({ heating: { ...s.heating, ...h } })),
  updateVentilation: (v) => set((s) => ({ ventilation: { ...s.ventilation, ...v } })),
  updateLight: (l) => set((s) => ({ light: { ...s.light, ...l } })),
  updateWaist: (w) => set((s) => ({ waist: { ...s.waist, ...w } })),
  updateVibrator: (v) => set((s) => ({ vibrator: { ...s.vibrator, ...v } })),
  updateAudio: (a) => set((s) => ({ audio: { ...s.audio, ...a } })),
  updatePairing: (p) => set((s) => ({ pairing: { ...s.pairing, ...p } })),
  setLanguage: (lang) => set({ language: lang }),
  setChildLock: (v) => set({ childLock: v }),
  resetState: () => set({
    connected: false,
    connecting: false,
    currentDevice: null,
    deviceList: [],
    capability: null,
    motors: [],
    massage: { ...initialMassage },
    heating: { ...initialHeating },
    ventilation: { ...initialVentilation },
    light: { ...initialLight },
    waist: { ...initialWaist },
    vibrator: { ...initialVibrator },
    audio: { ...initialAudio },
    pairing: { ...initialPairing },
    childLock: false,
  }),
}))
