import { DeviceCapability } from '@/stores/sofa.store'

/**
 * 解析蓝牙广播数据中的16字节厂商自定义数据
 * @param manufacturerData 16字节Uint8Array
 */
export function parseBroadcastData(manufacturerData: Uint8Array): DeviceCapability | null {
  if (manufacturerData.length < 16) return null

  const d = manufacturerData

  // D0: 沙发款式
  const sofaType = d[0]

  // D1: 座位推杆
  const seatMotor = d[1] & 0x07
  const seatMotorRight = (d[1] >> 3) & 0x07

  // D2~D5: 头枕/腰托/靠背/助起推杆
  const headMotor = d[2] & 0x07
  const lumbarMotor = d[3] & 0x07
  const backMotor = d[4] & 0x07
  const liftMotor = d[5] & 0x07

  // D6: 加热(左/单人沙发)
  const heatingLeft = {
    armrest: !!(d[6] & 0x20),
    back: !!(d[6] & 0x10),
    shoulder: !!(d[6] & 0x08),
    waist: !!(d[6] & 0x04),
    leg: !!(d[6] & 0x02),
    seat: !!(d[6] & 0x01),
  }

  // D7: 加热(右沙发) - 单人位时D7可能为0或表示其他
  const heatingRight = {
    armrest: !!(d[7] & 0x20),
    back: !!(d[7] & 0x10),
    shoulder: !!(d[7] & 0x08),
    waist: !!(d[7] & 0x04),
    leg: !!(d[7] & 0x02),
    seat: !!(d[7] & 0x01),
  }

  // 合并加热配置（单人位用left，双人/三人用left+right）
  const heating = sofaType === 1 ? heatingLeft : {
    armrest: heatingLeft.armrest || heatingRight.armrest,
    back: heatingLeft.back || heatingRight.back,
    shoulder: heatingLeft.shoulder || heatingRight.shoulder,
    waist: heatingLeft.waist || heatingRight.waist,
    leg: heatingLeft.leg || heatingRight.leg,
    seat: heatingLeft.seat || heatingRight.seat,
  }

  // D8: 通风
  const ventilation = {
    back: !!(d[8] & 0x08) || !!(d[8] & 0x02),
    seat: !!(d[8] & 0x04) || !!(d[8] & 0x01),
  }

  // D9: 按摩
  const massageLeft = d[9] & 0x07
  const massageRight = (d[9] >> 3) & 0x07
  const massageType = sofaType === 1 ? massageLeft : (massageLeft || massageRight)

  // D10: 追腰
  const hasWaist = !!(d[10] & 0x01) || !!(d[10] & 0x02)

  // D11: 多媒体音律
  const hasLight = !!(d[11] & 0x04)
  const hasVibrator = !!(d[11] & 0x02)
  const hasAudio = !!(d[11] & 0x01)

  // D12: 客户等级
  const customerLevel = d[12]

  // D13~D15: 版本号
  const version = `V${d[13]}.${d[14]}.${d[15]}`

  return {
    sofaType,
    seatMotor,
    headMotor,
    lumbarMotor,
    backMotor,
    liftMotor,
    heating,
    ventilation,
    massageType,
    hasWaist,
    hasLight,
    hasVibrator,
    hasAudio,
    customerLevel,
    version,
  }
}

/** 根据能力配置返回可用的按摩模式列表 */
export function getMassageModesByType(massageType: number) {
  switch (massageType) {
    case 1: // 条形气囊(a组)
      return [
        { name: 'Single Wave', value: 0x01 },
        { name: 'Pat', value: 0x02 },
        { name: 'Double Wave', value: 0x03 },
      ]
    case 2: // 8点气囊(b组)
      return [
        { name: 'Wave', value: 0x11 },
        { name: 'Catwalk', value: 0x12 },
        { name: 'Butterfly', value: 0x13 },
        { name: 'Acupressure', value: 0x14 },
        { name: 'Pat', value: 0x15 },
      ]
    case 3: // 揉捏气囊(c组)
      return [
        { name: 'Knead', value: 0x21 },
        { name: 'Acupressure', value: 0x22 },
        { name: 'Pat', value: 0x23 },
      ]
    default:
      return []
  }
}
