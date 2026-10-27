import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { taoNhanVatRong } from '../src/luat/chi_so'
import type { TrangThaiGame } from '../src/luat/kieu'
import { rngTuSeed } from '../src/luat/rng'
import { giaoChienNhanh } from '../src/luat/giao_chien_nhanh'
import { trongSoHiep1 } from '../src/luat/tam_hiep/ai'
import { satThuong, tuChiSo, tuMauNpc } from '../src/luat/tam_hiep/toan'
import { quyetDauTuDong } from '../src/luat/tam_hiep/tu_dong'

interface DauVao {
  can_cot: number
  ngo_tinh: number
  tier: number
  cap_vo: number
  canh_gioi: number
  tuoi: number
}
interface DongTiLe {
  dau_vao_a: DauVao
  dau_vao_b: DauVao
  ti_le_thang: number
  hp_yeu_h2: number
  ko_som: number
}

const vector = JSON.parse(
  readFileSync(join(fileURLToPath(new URL('./vector', import.meta.url)), 'tam_hiep_ti_le.json'), 'utf8'),
) as { so_tran: number; muc_suc_manh: DongTiLe[]; chenh_lech_trung: DongTiLe[] }

function thongKe(dong: DongTiLe, n: number, seed: number) {
  const rng = rngTuSeed(seed)
  const a = tuChiSo(dong.dau_vao_a)
  const b = tuChiSo(dong.dau_vao_b)
  let thang = 0
  let hpYeu = 0
  let koSom = 0
  for (let i = 0; i < n; i++) {
    const kq = quyetDauTuDong(a, b, rng)
    if (kq.thang) thang++
    if (kq.ko_som) koSom++
    hpYeu += kq.hp_yeu_h2
  }
  return { thang: thang / n, hpYeu: hpYeu / n, koSom: koSom / n }
}

describe('Tam Hiệp: sát thương (HS06 I.4)', () => {
  const a = tuChiSo({ can_cot: 60, ngo_tinh: 60, canh_gioi: 5, tuoi: 30, tier: 2, cap_vo: 5, he: 'duong' })
  const b = tuChiSo({ can_cot: 60, ngo_tinh: 60, canh_gioi: 5, tuoi: 30, tier: 2, cap_vo: 5, he: 'am', khinh_cong: 2 })

  it('bốn lớp: gốc, M, khắc chế, giảm trừ', () => {
    // gốc = 250 x 2 + 800 x 0,08 = 564; giảm = 0,003 x 60 + 0,02 x 2 = 0,22; Dương khắc Âm: x 1,05
    expect(satThuong(a, b, 800, 1)).toBeCloseTo(564 * 1.05 * 0.78, 9)
    expect(satThuong(a, b, 800, 1.1)).toBeCloseTo(564 * 1.1 * 1.05 * 0.78, 9)
  })

  it('giảm trừ kẹp 50%', () => {
    const giap = { ...b, can_cot: 1000, khinh_cong: 10 }
    expect(satThuong(a, giap, 0, 1)).toBeCloseTo(250 * 2 * 1.05 * 0.5, 9)
  })
})

describe('Tam Hiệp: AI Hiệp 1 (HS02 V.1)', () => {
  const co = tuChiSo({ can_cot: 50, ngo_tinh: 50, canh_gioi: 0, tuoi: 20, tier: 1, cap_vo: 1 })

  it('trọng số theo bản mệnh, tổng 100', () => {
    const w = trongSoHiep1({ ...co, ban_menh: 'ta_ac' }, co, [])
    expect(w).toEqual({ T: 50, Q: 20, D: 30 })
  })

  it('Khinh công hơn 3 cấp: chuyển 15% từ Tiên Hạ Thủ sang Thân Pháp', () => {
    const w = trongSoHiep1({ ...co, ban_menh: 'ta_ac', khinh_cong: 3 }, co, [])
    expect(w).toEqual({ T: 35, Q: 20, D: 45 })
  })

  it('Ngộ tính hơn 20: +20% cho hướng khắc chế hướng hay dùng, giữ sàn 10%', () => {
    // người chơi hay dùng T; Thân Pháp (D) khắc T
    const w = trongSoHiep1({ ...co, ban_menh: 'nguy_quan_tu', ngo_tinh: 70 }, co, ['T', 'T', 'Q'])
    expect(w).toEqual({ T: 10, Q: 40, D: 50 })
    expect(w.T + w.Q + w.D).toBe(100)
  })

  it('không hướng nào dưới 10% và tổng luôn 100', () => {
    for (const bm of ['chinh_truc', 'nguy_quan_tu', 'ta_ac', 'ngong_cuong', 'si_tinh'] as const) {
      for (const h of ['T', 'Q', 'D'] as const) {
        const w = trongSoHiep1({ ...co, ban_menh: bm, khinh_cong: 9, ngo_tinh: 99 }, co, [h, h, h, h, h])
        expect(Math.min(w.T, w.Q, w.D)).toBeGreaterThanOrEqual(10)
        expect(w.T + w.Q + w.D).toBeCloseTo(100, 9)
      }
    }
  })
})

describe('Tam Hiệp: trận tự động', () => {
  it('cùng seed cho cùng kết quả', () => {
    const a = tuChiSo({ can_cot: 50, ngo_tinh: 50, canh_gioi: 2, tuoi: 18, tier: 1, cap_vo: 3 })
    const x = quyetDauTuDong(a, a, rngTuSeed(7))
    expect(quyetDauTuDong(a, a, rngTuSeed(7))).toEqual(x)
    expect(x.hoa).toBe(false)
    expect(x.thang).not.toBe(x.thua)
  })

  it('tuMauNpc: đầy HP / Nội tức, dao động Căn cốt trong ±10%', () => {
    const rng = rngTuSeed(3)
    for (let i = 0; i < 50; i++) {
      const n = tuMauNpc(
        { can_cot: 60, ngo_tinh: 60, canh_gioi: 5, tuoi: 30, tier: 2, cap_vo: 5, he: 'hoa' },
        rng,
      )
      expect(n.can_cot).toBeGreaterThanOrEqual(54)
      expect(n.can_cot).toBeLessThanOrEqual(66)
      expect(n.hp).toBe(n.hp_max)
      expect(n.noi_tuc).toBe(n.mp_max)
    }
  })

  const N = 20000
  it('16 cặp mức sức mạnh: tỷ lệ thắng chênh Python <= 2 điểm %', () => {
    expect(vector.so_tran).toBe(N)
    vector.muc_suc_manh.forEach((dong, i) => {
      const kq = thongKe(dong, N, 100 + i)
      expect(Math.abs(kq.thang - dong.ti_le_thang), `cặp ${i}`).toBeLessThanOrEqual(0.02)
      expect(Math.abs(kq.hpYeu - dong.hp_yeu_h2), `hp yếu cặp ${i}`).toBeLessThanOrEqual(0.02)
    })
  }, 60000)

  it('9 chênh lệch quanh mức Trung: tỷ lệ thắng chênh Python <= 2 điểm %', () => {
    vector.chenh_lech_trung.forEach((dong, i) => {
      const kq = thongKe(dong, N, 500 + i)
      expect(Math.abs(kq.thang - dong.ti_le_thang), `chênh ${i}`).toBeLessThanOrEqual(0.02)
    })
  }, 60000)

  it('mục tiêu cân bằng HS06 I.4: ngang sức, bên yếu còn 20 - 31% HP sau Hiệp 2', () => {
    const ngang = vector.muc_suc_manh.filter(
      (d) => JSON.stringify(d.dau_vao_a) === JSON.stringify(d.dau_vao_b),
    )
    expect(ngang.length).toBe(4)
    ngang.forEach((dong, i) => {
      const kq = thongKe(dong, 5000, 900 + i)
      // Mức Đỉnh ngang sức kết thúc sớm bằng KO nên hp_yeu_h2 chỉ đo trên trận chưa KO; chỉ kiểm mức Sơ nhập.
      if (dong.dau_vao_a.tier === 1) {
        expect(kq.hpYeu).toBeGreaterThanOrEqual(0.2)
        expect(kq.hpYeu).toBeLessThanOrEqual(0.31)
      }
    })
  }, 60000)
})

describe('Giao chiến nhanh', () => {
  it('Roll Võ Lực vs N, kẹp 5% - 95%', () => {
    const d = { nhan_vat: { ...taoNhanVatRong(), can_cot: 60, phuc_duyen: 50 } } as unknown as TrangThaiGame
    const rng = rngTuSeed(11)
    const dem = (n: number): number => {
      let t = 0
      for (let i = 0; i < 10000; i++) if (giaoChienNhanh(d, rng, n)) t++
      return t / 10000
    }
    // Võ Lực = 30 (không môn): N = 30 -> 50%
    expect(dem(30)).toBeGreaterThan(0.47)
    expect(dem(30)).toBeLessThan(0.53)
    expect(dem(0)).toBeLessThan(0.97)
    expect(dem(1000)).toBeGreaterThan(0.03)
  })
})
