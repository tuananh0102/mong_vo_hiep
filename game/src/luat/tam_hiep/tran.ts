// Quyết Đấu Tam Hiệp dạng máy trạng thái (HS02 V, HS06 I.4). Hàm thuần: nhận TranDau và RNG, trả TranDau mới.
// Dùng chung hàm toán `satThuong` của toan.ts; trận tự động (tu_dong.ts) chạy cùng bộ máy này.
// Đối chiếu Python: quyet_dau.

import { tinhVoLuc } from '../cong_thuc'
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
import type { BuocTamHiep, HuongTamHiep, LuaChonPhanDinh } from '../kieu'
import type { Rng } from '../rng'
import { aiChonHiep1, type Huong } from './ai'
import { satThuong, type VoGiaTran } from './toan'

export type Phe = 'a' | 'b'
export type CheDoTran = 'ty_thi' | 'sinh_tu' | 'tru_vung'
export type BuocTran = 'chon_huong' | 'giua_hiep' | 'chon_chieu' | 'phan_dinh' | 'xong'

/** Một chiêu chọn ở Hiệp 2. M1 chỉ khác nhau ở tier và cấp (uy lực); cơ chế riêng ở M3-05, M3-06. */
export interface ChieuHiep2 {
  ma: string
  ten: string
  tier: number
  cap_vo: number
}

export interface BenTranDau {
  vg: VoGiaTran
  hp: number
  mp: number
  m1: number
  m2: number
  bk: number
  truoc: boolean
  chieu: ChieuHiep2[]
  chieu_dang: string
}

export type DongNhatKy =
  | { loai: 'huong'; ben: Phe; huong: Huong }
  | { loai: 'quan_sat'; ben: Phe; thanh_cong: boolean }
  | { loai: 'don'; hiep: number; ben: Phe; sat_thuong: number; bao_kich: boolean }
  | { loai: 'vat_pham'; ma: string; hoi: number }
  | { loai: 'phan_dinh'; ma: LuaChonPhanDinh | 'ha_guc'; ben: Phe | null }

export interface KetQuaTran {
  /** Bên thắng; null khi hòa. */
  nguoi_thang: Phe | null
  lua_chon: LuaChonPhanDinh | 'ha_guc'
  /** Đối thủ bị hạ gục (HP về 0) trước Hiệp 3. */
  ko: boolean
  /** Chỉ có khi lua_chon là 'bo_chay': kết quả Roll bỏ chạy. */
  thoat?: boolean
}

/** Bên a là người chơi, bên b là đối thủ. */
export interface TranDau {
  che_do: CheDoTran
  hiep: 1 | 2 | 3
  buoc: BuocTran
  a: BenTranDau
  b: BenTranDau
  /** Hướng Hiệp 1 người chơi dùng trong 5 trận gần nhất (AI NPC đọc vị). */
  lich_su_huong: Huong[]
  nhat_ky: DongNhatKy[]
  cuu_mang_da_dung: boolean
  kim_sang_duoc: number
  da_dung_vat_pham: string[]
  bat_phan: boolean
  /** Bên Áp đảo sau Hiệp 2; null là Bất phân thắng bại. */
  ben_ap_dao: Phe | null
  ko_h1: boolean
  ko_som: boolean
  hp_yeu_h2: number
  ket_qua: KetQuaTran | null
}

export interface ThamSoTranDau {
  a: VoGiaTran
  b: VoGiaTran
  che_do: CheDoTran
  lich_su_huong?: Huong[]
  kim_sang_duoc?: number
  chieu_a?: ChieuHiep2[]
}

const khac = (p: Phe): Phe => (p === 'a' ? 'b' : 'a')

const HUONG_MA: Record<HuongTamHiep, Huong> = { tien_ha_thu: 'T', an_binh: 'Q', than_phap: 'D' }

function taoBen(vg: VoGiaTran, chieu?: ChieuHiep2[]): BenTranDau {
  const ds = chieu?.length ? chieu : [{ ma: 'chinh', ten: 'Chiêu chính', tier: vg.tier, cap_vo: vg.cap_vo }]
  return {
    vg,
    hp: vg.hp,
    mp: vg.noi_tuc,
    m1: HE_SO_THAM_DO,
    m2: 1,
    bk: BAO_KICH_CO_BAN,
    truoc: false,
    chieu: ds,
    chieu_dang: ds[0]!.ma,
  }
}

export function taoTranDau(ts: ThamSoTranDau): TranDau {
  return {
    che_do: ts.che_do,
    hiep: 1,
    buoc: 'chon_huong',
    a: taoBen(ts.a, ts.chieu_a),
    b: taoBen(ts.b),
    lich_su_huong: ts.lich_su_huong ?? [],
    nhat_ky: [],
    cuu_mang_da_dung: false,
    kim_sang_duoc: ts.kim_sang_duoc ?? 0,
    da_dung_vat_pham: [],
    bat_phan: false,
    ben_ap_dao: null,
    ko_h1: false,
    ko_som: false,
    hp_yeu_h2: 0,
    ket_qua: null,
  }
}

export const phanTramHp = (t: TranDau, p: Phe): number => t[p].hp / t[p].vg.hp_max

/** Ảnh chụp tấn công: tier và cấp lấy theo chiêu đang dùng. */
function nguoiDanh(t: TranDau, p: Phe): VoGiaTran {
  const ben = t[p]
  const c = ben.chieu.find((x) => x.ma === ben.chieu_dang) ?? ben.chieu[0]!
  return { ...ben.vg, tier: c.tier, cap_vo: c.cap_vo }
}

function danh(t: TranDau, x: Phe, y: Phe, m: number, baoKich: boolean, hiep: number, rng: Rng): void {
  let d = satThuong(nguoiDanh(t, x), t[y].vg, Math.max(0, t[x].mp), m)
  d *= 1 - BIEN_THIEN_SAT_THUONG + 2 * BIEN_THIEN_SAT_THUONG * rng.so()
  let bk = false
  if (baoKich && rng.so() < t[x].bk) {
    d *= BAO_KICH_HE_SO
    bk = true
  }
  t[y].hp -= d
  t.nhat_ky.push({ loai: 'don', hiep, ben: x, sat_thuong: Math.round(d), bao_kich: bk })
}

function ketThucKo(t: TranDau, thang: Phe, soM: 'h1' | 'h2'): void {
  t.buoc = 'xong'
  t.ko_som = true
  if (soM === 'h1') t.ko_h1 = true
  t.ket_qua = { nguoi_thang: thang, lua_chon: 'ha_guc', ko: true }
  t.nhat_ky.push({ loai: 'phan_dinh', ma: 'ha_guc', ben: thang })
}

function quanSat(t: TranDau, x: Phe, y: Phe, cong: number, rng: Rng): void {
  const p = pRoll(t[x].vg.ngo_tinh + cong, t[y].vg.ngo_tinh, t[x].vg.phuc_duyen)
  const ok = rng.so() < p
  t.nhat_ky.push({ loai: 'quan_sat', ben: x, thanh_cong: ok })
  if (ok) {
    t[x].bk += 0.3
    t[y].m2 *= H1_AN_BINH_GIAM_DICH
  } else {
    // HS02 V.1: quan sát thất bại, địch ra đòn trước và +10% sát thương Hiệp 2
    t[y].truoc = true
    t[y].m2 *= 1.1
  }
}

/** Hiệp 1: giải ma trận hướng tiếp cận (HS02 V.1) rồi hai bên ra đòn đồng thời. */
export function chayHiep1(t: TranDau, ca: Huong, cb: Huong, rng: Rng): void {
  t.nhat_ky.push({ loai: 'huong', ben: 'a', huong: ca }, { loai: 'huong', ben: 'b', huong: cb })
  if (ca === cb) {
    if (ca === 'T') {
      t.a.m1 = t.b.m1 = H1_TIEN_HA_THU
    } else if (ca === 'Q') {
      t.a.m1 = t.b.m1 = 0
      const w: Phe = rng.so() < pRoll(t.a.vg.ngo_tinh, t.b.vg.ngo_tinh, t.a.vg.phuc_duyen) ? 'a' : 'b'
      t[w].bk += 0.3
      t[w].truoc = true
    } else {
      t.a.m1 = t.b.m1 = 0
      for (const k of ['a', 'b'] as const) t[k].mp -= 0.1 * t[k].vg.mp_max
    }
  } else {
    const w: Phe = KHAC_H1[ca] === cb ? 'a' : 'b'
    const l = khac(w)
    const cw = w === 'a' ? ca : cb
    if (cw === 'T') t[w].m1 = H1_TIEN_HA_THU
    else if (cw === 'Q') quanSat(t, w, l, 20, rng)
    else {
      t[l].m1 = H1_THUA_M1
      t[l].m2 = H1_THUA_M2
    }
  }

  danh(t, 'a', 'b', t.a.m1, false, 1, rng)
  danh(t, 'b', 'a', t.b.m1, false, 1, rng)
  if (t.a.hp <= 0 || t.b.hp <= 0) {
    const aThang = (t.b.hp <= 0 && t.a.hp > 0) || (t.a.hp <= 0 && t.b.hp <= 0 && t.a.hp > t.b.hp)
    ketThucKo(t, aThang ? 'a' : 'b', 'h1')
    return
  }
  t.hiep = 2
  t.buoc = t.kim_sang_duoc > 0 ? 'giua_hiep' : 'chon_chieu'
}

/** Hiệp 2: thứ tự ra đòn theo HS02 V.2. Trả bên hạ gục đối thủ, hoặc null. */
function hiep2(t: TranDau, rng: Rng): Phe | null {
  let thuTu: Phe[]
  if (t.a.truoc !== t.b.truoc) thuTu = t.a.truoc ? ['a', 'b'] : ['b', 'a']
  else if (t.a.vg.khinh_cong !== t.b.vg.khinh_cong) {
    const p = pRoll(t.a.vg.khinh_cong * 10, t.b.vg.khinh_cong * 10, t.a.vg.phuc_duyen)
    thuTu = rng.so() < p ? ['a', 'b'] : ['b', 'a']
  } else thuTu = rng.so() < 0.5 ? ['a', 'b'] : ['b', 'a']
  for (const x of thuTu) {
    const y = khac(x)
    danh(t, x, y, t[x].m2, true, 2, rng)
    t[x].mp = Math.max(0, t[x].mp - TIEU_HAO_MP_HIEP2 * t[x].vg.mp_max)
    if (t[y].hp <= 0) return x
  }
  return null
}

/** Áp đảo: đối phương HP < 25% hoặc hết Nội tức (HS02 V.3). */
function apDao(t: TranDau): Phe[] {
  return (['a', 'b'] as const).filter((k) => {
    const o = khac(k)
    return t[o].hp < 0.25 * t[o].vg.hp_max || t[o].mp <= 0
  })
}

/** Phân định bên Áp đảo: một bên đủ điều kiện thì bên đó, còn lại so % HP (bằng nhau thì tung đồng xu). */
function chonBenApDao(t: TranDau, ad: Phe[], rng: Rng): Phe {
  if (ad.length === 1) return ad[0]!
  const pa = phanTramHp(t, 'a')
  const pb = phanTramHp(t, 'b')
  return pa > pb || (pa === pb && rng.so() < 0.5) ? 'a' : 'b'
}

function sangHiep3(t: TranDau, rng: Rng, choPhepBatPhan: boolean): void {
  const ad = apDao(t)
  t.hiep = 3
  t.buoc = 'phan_dinh'
  t.ben_ap_dao = ad.length === 0 && choPhepBatPhan ? null : chonBenApDao(t, ad, rng)
}

export function luaChonPhanDinh(t: TranDau): LuaChonPhanDinh[] {
  if (t.buoc !== 'phan_dinh') return []
  const tyThi = t.che_do === 'ty_thi'
  if (t.ben_ap_dao === null) return ['hoa', 'lieu_mang']
  if (t.ben_ap_dao === 'a') return tyThi ? ['thu_kiem'] : ['tuyet_sat', 'phe_vo_cong', 'thu_kiem']
  return tyThi ? ['dau_hang'] : ['bo_chay', 'dau_hang', 'nhay_vuc']
}

/** Xác suất Roll bỏ chạy: `[Roll: Võ Lực vs Võ Lực địch]` (HS02 V.3). */
export function pBoChay(t: TranDau): number {
  const vl = (v: VoGiaTran): number => tinhVoLuc(v.can_cot, v.cap_vo)
  return pRoll(vl(t.a.vg), vl(t.b.vg), t.a.vg.phuc_duyen)
}

export interface KetQuaBuoc {
  tran: TranDau
  loi: string | null
}

/** Áp một bước người chơi. Sai bước hoặc lựa chọn không hợp lệ trả `loi` và giữ nguyên trận. */
export function apDungBuoc(t0: TranDau, buoc: BuocTamHiep, rng: Rng): KetQuaBuoc {
  const t = structuredClone(t0)
  const loi = apDungBuocTai(t, buoc, rng)
  return loi ? { tran: t0, loi } : { tran: t, loi: null }
}

/** Như apDungBuoc nhưng sửa thẳng `t` (trận tự động chạy hàng chục nghìn trận). Có lỗi thì `t` chưa bị đổi. */
export function apDungBuocTai(t: TranDau, buoc: BuocTamHiep, rng: Rng): string | null {
  if (t.buoc === 'xong') return 'tran_da_xong'

  switch (t.buoc) {
    case 'chon_huong': {
      if (buoc.loai !== 'huong') return 'sai_buoc'
      const cb = aiChonHiep1(t.b.vg, t.a.vg, t.lich_su_huong, rng)
      chayHiep1(t, HUONG_MA[buoc.huong], cb, rng)
      return null
    }
    case 'giua_hiep': {
      if (buoc.loai === 'bo_qua') {
        t.buoc = 'chon_chieu'
        return null
      }
      if (buoc.loai !== 'vat_pham') return 'sai_buoc'
      // HS06 III, G12: Kim Sáng Dược hồi 30% HP, không mất lượt, tối đa 1 vật phẩm giữa Hiệp 1 và 2
      const hoi = Math.min(0.3 * t.a.vg.hp_max, t.a.vg.hp_max - t.a.hp)
      t.a.hp += hoi
      t.kim_sang_duoc -= 1
      t.da_dung_vat_pham.push(buoc.ma)
      t.nhat_ky.push({ loai: 'vat_pham', ma: buoc.ma, hoi: Math.round(hoi) })
      t.buoc = 'chon_chieu'
      return null
    }
    case 'chon_chieu': {
      if (buoc.loai !== 'chieu') return 'sai_buoc'
      if (!t.a.chieu.some((c) => c.ma === buoc.ma)) return 'chieu_khong_hop_le'
      t.a.chieu_dang = buoc.ma
      const ko = hiep2(t, rng)
      if (ko) {
        ketThucKo(t, ko, 'h2')
        return null
      }
      t.hp_yeu_h2 = Math.min(phanTramHp(t, 'a'), phanTramHp(t, 'b'))
      sangHiep3(t, rng, true)
      return null
    }
    case 'phan_dinh': {
      if (buoc.loai !== 'phan_dinh') return 'sai_buoc'
      if (!luaChonPhanDinh(t).includes(buoc.ma)) return 'lua_chon_khong_hop_le'
      if (buoc.ma === 'lieu_mang') {
        // Đấu lại Hiệp 2 một lần, rồi bắt buộc phân định theo % HP (HS02 V.3)
        t.bat_phan = true
        const ko = hiep2(t, rng)
        if (ko) ketThucKo(t, ko, 'h2')
        else sangHiep3(t, rng, false)
        return null
      }
      chotPhanDinh(t, buoc.ma, rng)
      return null
    }
    default:
      return 'sai_buoc'
  }
}

function chotPhanDinh(t: TranDau, ma: LuaChonPhanDinh, rng: Rng): void {
  let nguoiThang: Phe | null = 'a'
  let thoat: boolean | undefined
  if (ma === 'hoa') nguoiThang = null
  else if (ma === 'dau_hang' || ma === 'nhay_vuc') nguoiThang = 'b'
  else if (ma === 'bo_chay') {
    thoat = rng.so() < pBoChay(t)
    // Bỏ chạy thất bại: người chơi vẫn Thất thế, bên Áp đảo định đoạt (M1-11c)
    nguoiThang = thoat ? null : 'b'
  }
  t.buoc = 'xong'
  t.ket_qua = { nguoi_thang: nguoiThang, lua_chon: ma, ko: false, ...(thoat === undefined ? {} : { thoat }) }
  t.nhat_ky.push({ loai: 'phan_dinh', ma, ben: nguoiThang })
}
