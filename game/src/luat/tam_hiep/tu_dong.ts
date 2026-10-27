// Quyết Đấu Tam Hiệp chạy tự động với AI hai bên (HS02 V, HS06 I.4).
// Đối chiếu Python: quyet_dau. Cùng luật, không cùng dòng số ngẫu nhiên: so khớp theo tỷ lệ.

import {
  BAO_KICH_CO_BAN,
  BAO_KICH_HE_SO,
  BIEN_THIEN_SAT_THUONG,
  H1_AN_BINH_GIAM_DICH,
  H1_THUA_M1,
  H1_THUA_M2,
  H1_TIEN_HA_THU,
  HE_SO_THAM_DO,
  KHAC_H1,
  TIEU_HAO_MP_HIEP2,
} from '../hang_so'
import { pRoll } from '../kiem_dinh'
import type { Rng } from '../rng'
import { aiChonHiep1, type Huong } from './ai'
import { satThuong, type VoGiaTran } from './toan'

export interface KetQuaQuyetDau {
  thang: boolean
  hoa: boolean
  thua: boolean
  /** Phần trăm HP còn lại của bên thắng (0 - 1), góc nhìn bên thắng. */
  hp_con: number
  ko_h1: boolean
  ko_som: boolean
  bat_phan: boolean
  hp_yeu_h2: number
}

type Phe = 'a' | 'b'

interface BenTran {
  vg: VoGiaTran
  hp: number
  mp: number
  m1: number
  m2: number
  bk: number
  truoc: boolean
}

const khac = (p: Phe): Phe => (p === 'a' ? 'b' : 'a')

/** Một trận Tam Hiệp, góc nhìn bên a. `chonA` / `chonB` ép hướng Hiệp 1 (không thì AI chọn). */
export function quyetDauTuDong(
  a: VoGiaTran,
  b: VoGiaTran,
  rng: Rng,
  chonA?: Huong,
  chonB?: Huong,
): KetQuaQuyetDau {
  const ca = chonA ?? aiChonHiep1(a, b, [], rng)
  const cb = chonB ?? aiChonHiep1(b, a, [], rng)
  const tao = (vg: VoGiaTran): BenTran => ({
    vg,
    hp: vg.hp,
    mp: vg.noi_tuc,
    m1: HE_SO_THAM_DO,
    m2: 1,
    bk: BAO_KICH_CO_BAN,
    truoc: false,
  })
  const s: Record<Phe, BenTran> = { a: tao(a), b: tao(b) }

  const quanSat = (x: Phe, y: Phe, cong = 0): void => {
    const p = pRoll(s[x].vg.ngo_tinh + cong, s[y].vg.ngo_tinh, s[x].vg.phuc_duyen)
    if (rng.so() < p) {
      s[x].bk += 0.3
      s[y].m2 *= H1_AN_BINH_GIAM_DICH
    } else {
      // HS02 V.1: quan sát thất bại, địch ra đòn trước và +10% sát thương Hiệp 2
      s[y].truoc = true
      s[y].m2 *= 1.1
    }
  }

  // --- Ma trận Hiệp 1 (HS02 V.1) ---
  if (ca === cb) {
    if (ca === 'T') {
      s.a.m1 = s.b.m1 = H1_TIEN_HA_THU
    } else if (ca === 'Q') {
      s.a.m1 = s.b.m1 = 0
      const w: Phe = rng.so() < pRoll(a.ngo_tinh, b.ngo_tinh, a.phuc_duyen) ? 'a' : 'b'
      s[w].bk += 0.3
      s[w].truoc = true
    } else {
      s.a.m1 = s.b.m1 = 0
      for (const k of ['a', 'b'] as const) s[k].mp -= 0.1 * s[k].vg.mp_max
    }
  } else {
    const w: Phe = KHAC_H1[ca] === cb ? 'a' : 'b'
    const l = khac(w)
    const cw = w === 'a' ? ca : cb
    if (cw === 'T') s[w].m1 = H1_TIEN_HA_THU
    else if (cw === 'Q') quanSat(w, l, 20)
    else {
      s[l].m1 = H1_THUA_M1
      s[l].m2 = H1_THUA_M2
    }
  }

  const danh = (x: Phe, y: Phe, m: number, baoKich = false): void => {
    let d = satThuong(s[x].vg, s[y].vg, Math.max(0, s[x].mp), m)
    d *= 1 - BIEN_THIEN_SAT_THUONG + 2 * BIEN_THIEN_SAT_THUONG * rng.so()
    if (baoKich && rng.so() < s[x].bk) d *= BAO_KICH_HE_SO
    s[y].hp -= d
  }
  const phanTram = (p: Phe): number => s[p].hp / s[p].vg.hp_max
  const ketQua = (thang: boolean, p: Phe, extra: Partial<KetQuaQuyetDau>): KetQuaQuyetDau => ({
    thang,
    hoa: false,
    thua: !thang,
    hp_con: Math.max(0, phanTram(p)),
    ko_h1: false,
    ko_som: false,
    bat_phan: false,
    hp_yeu_h2: 0,
    ...extra,
  })

  // --- Hiệp 1: hai bên ra đòn đồng thời ---
  danh('a', 'b', s.a.m1)
  danh('b', 'a', s.b.m1)
  if (s.a.hp <= 0 || s.b.hp <= 0) {
    const aThang = (s.b.hp <= 0 && s.a.hp > 0) || (s.a.hp <= 0 && s.b.hp <= 0 && s.a.hp > s.b.hp)
    const p: Phe = aThang ? 'a' : 'b'
    return ketQua(aThang, p, { ko_h1: true, ko_som: true })
  }

  // --- Hiệp 2: thứ tự ra đòn theo HS02 V.2 ---
  const hiep2 = (): Phe | null => {
    let thuTu: Phe[]
    if (s.a.truoc !== s.b.truoc) thuTu = s.a.truoc ? ['a', 'b'] : ['b', 'a']
    else if (a.khinh_cong !== b.khinh_cong) {
      const p = pRoll(a.khinh_cong * 10, b.khinh_cong * 10, a.phuc_duyen)
      thuTu = rng.so() < p ? ['a', 'b'] : ['b', 'a']
    } else thuTu = rng.so() < 0.5 ? ['a', 'b'] : ['b', 'a']
    for (const x of thuTu) {
      const y = khac(x)
      danh(x, y, s[x].m2, true)
      s[x].mp = Math.max(0, s[x].mp - TIEU_HAO_MP_HIEP2 * s[x].vg.mp_max)
      if (s[y].hp <= 0) return x
    }
    return null
  }

  // Áp đảo: đối phương HP < 25% hoặc hết Nội tức (HS02 V.3)
  const apDao = (): Phe[] =>
    (['a', 'b'] as const).filter((k) => {
      const o = khac(k)
      return s[o].hp < 0.25 * s[o].vg.hp_max || s[o].mp <= 0
    })

  let ko = hiep2()
  const hpYeu = ko ? 0 : Math.min(phanTram('a'), phanTram('b'))
  if (ko) return ketQua(ko === 'a', ko, { ko_som: true })
  let batPhan = false
  if (apDao().length === 0) {
    // Bất phân thắng bại: Liều mạng đánh tiếp 1 lần
    batPhan = true
    ko = hiep2()
    if (ko) return ketQua(ko === 'a', ko, { ko_som: true, bat_phan: true, hp_yeu_h2: hpYeu })
  }
  const ad = apDao()
  let thang: Phe
  if (ad.length === 1) thang = ad[0]!
  else {
    // cả hai hoặc không ai: so % HP còn lại, bằng nhau thì tung đồng xu
    const pa = phanTram('a')
    const pb = phanTram('b')
    thang = pa > pb || (pa === pb && rng.so() < 0.5) ? 'a' : 'b'
  }
  return ketQua(thang === 'a', thang, { bat_phan: batPhan, hp_yeu_h2: hpYeu })
}
