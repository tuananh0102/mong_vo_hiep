import { describe, expect, it } from 'vitest'
import { chonTheoTrongSo, rngTuSeed, taoRng } from '../src/luat/rng'

const lay = (r: ReturnType<typeof rngTuSeed>, n: number) => Array.from({ length: n }, () => r.so())

describe('rng', () => {
  it('cùng seed cho cùng dãy 1.000 số', () => {
    expect(lay(rngTuSeed(42), 1000)).toEqual(lay(rngTuSeed(42), 1000))
    expect(lay(rngTuSeed(42), 10)).not.toEqual(lay(rngTuSeed(43), 10))
  })

  it('layTrangThai rồi taoRng tiếp tục đúng dãy', () => {
    const goc = rngTuSeed(7)
    lay(goc, 10)
    const tiep = taoRng(goc.layTrangThai())
    expect(lay(tiep, 10)).toEqual(lay(goc, 10))
  })

  it('so() trong [0, 1); nguyen(1, 6) đủ 1-6', () => {
    const r = rngTuSeed(1)
    const dem = new Set<number>()
    for (let i = 0; i < 100_000; i++) {
      const x = r.so()
      expect(x >= 0 && x < 1).toBe(true)
      dem.add(r.nguyen(1, 6))
    }
    expect([...dem].sort()).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('trung(p) đúng tỷ lệ', () => {
    const r = rngTuSeed(3)
    let t = 0
    for (let i = 0; i < 100_000; i++) if (r.trung(0.3)) t++
    expect(Math.abs(t / 100_000 - 0.3)).toBeLessThan(0.01)
  })

  it('chonTheoTrongSo 1:3 cho 25% ± 1%', () => {
    const r = rngTuSeed(5)
    const ds = [{ gia_tri: 'a', trong_so: 1 }, { gia_tri: 'b', trong_so: 3 }]
    let a = 0
    for (let i = 0; i < 100_000; i++) if (chonTheoTrongSo(r, ds) === 'a') a++
    expect(Math.abs(a / 100_000 - 0.25)).toBeLessThan(0.01)
  })

  it('chonTheoTrongSo trả null khi tổng trọng số bằng 0', () => {
    expect(chonTheoTrongSo(rngTuSeed(1), [{ gia_tri: 1, trong_so: 0 }])).toBeNull()
    expect(chonTheoTrongSo(rngTuSeed(1), [])).toBeNull()
  })
})
