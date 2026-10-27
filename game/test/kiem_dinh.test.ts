import { describe, expect, it } from 'vitest'
import { kepXacSuat, lanRoll, nhanDoKho, pRoll, pRollNhieu } from '../src/luat/kiem_dinh'
import { rngTuSeed } from '../src/luat/rng'

describe('kiem_dinh', () => {
  it('pRoll các mốc', () => {
    expect(pRoll(25, 25, 50)).toBe(0.5)
    expect(pRoll(0, 100, 50)).toBe(0.05)
    expect(pRoll(100, 0, 50)).toBe(0.95)
  })

  it('phúc duyên cộng 0,3% mỗi điểm', () => {
    expect(pRoll(25, 25, 60)).toBeCloseTo(0.53, 10)
    expect(pRoll(25, 25, 40)).toBeCloseTo(0.47, 10)
  })

  it('roll ngược đảo chiều', () => {
    expect(pRoll(10, 30, 50, true)).toBeCloseTo(pRoll(30, 10, 50), 10)
    expect(pRoll(10, 30, 50, true)).toBeGreaterThan(0.5)
  })

  it('va dùng hiệu thấp nhất, hoac dùng hiệu cao nhất', () => {
    const ds = [{ chiSo: 60, nguong: 50 }, { chiSo: 40, nguong: 50 }] // hiệu +10, -10
    expect(pRollNhieu(ds, 'va', 50)).toBeCloseTo(pRoll(40, 50, 50), 10)
    expect(pRollNhieu(ds, 'hoac', 50)).toBeCloseTo(pRoll(60, 50, 50), 10)
    expect(() => pRollNhieu([], 'va', 50)).toThrow()
  })

  it('kẹp 5% - 95%', () => {
    expect(kepXacSuat(-1)).toBe(0.05)
    expect(kepXacSuat(2)).toBe(0.95)
    expect(pRollNhieu([{ chiSo: 0, nguong: 150 }], 'va', 0)).toBe(0.05)
  })

  it('nhãn độ khó đúng ranh giới', () => {
    expect(nhanDoKho(0.2499)).toBe('hiem')
    expect(nhanDoKho(0.25)).toBe('kho')
    expect(nhanDoKho(0.4999)).toBe('kho')
    expect(nhanDoKho(0.5)).toBe('kha')
    expect(nhanDoKho(0.7499)).toBe('kha')
    expect(nhanDoKho(0.75)).toBe('de')
  })

  it('lanRoll theo tỷ lệ', () => {
    const rng = rngTuSeed(1)
    let thang = 0
    for (let i = 0; i < 20000; i++) if (lanRoll(rng, 0.3)) thang++
    expect(thang / 20000).toBeGreaterThan(0.28)
    expect(thang / 20000).toBeLessThan(0.32)
  })
})
