// Toán Quyết Đấu Tam Hiệp: ảnh chụp một bên và sát thương (HS06 I.4, HS02 V).
// Đối chiếu Python: VoGia, sat_thuong, npc_ngang ở mo_phong/mo_phong.py.

import type { DuLieu } from '../../du_lieu/luoc_do'
import {
  capKhinhCong,
  heNoiLuc,
  hpMax,
  khacChe,
  laySatThuongThanBinh,
  noiTucMax,
  tinhHpMax,
  tinhNoiTucMax,
  timMonNgoaiCongTotNhat,
} from '../cong_thuc'
import {
  AI_H1,
  GIAM_TRU_MOI_CAN_COT,
  GIAM_TRU_MOI_KHINH_CONG,
  GIAM_TRU_TOI_DA,
  HE_SO_NOI_TUC,
  UY_LUC,
} from '../hang_so'
import type { NhanVat } from '../kieu'
import type { Rng } from '../rng'

export type MaBanMenh = 'chinh_truc' | 'nguy_quan_tu' | 'ta_ac' | 'ngong_cuong' | 'si_tinh'
export type HeNoiLuc = 'duong' | 'am' | 'hoa' | 'ngoai'

/** Ảnh chụp một bên lúc vào trận. HP và Nội tức là giá trị lúc vào trận. */
export interface VoGiaTran {
  hp: number
  hp_max: number
  noi_tuc: number
  mp_max: number
  tier: number
  cap_vo: number
  he: HeNoiLuc
  can_cot: number
  ngo_tinh: number
  khinh_cong: number
  than_binh: number
  phuc_duyen: number
  ban_menh: MaBanMenh
  /** Cờ võ học đặc thù (vd 'doc_co_cuu_kiem'); M1 chưa dùng. */
  co: string[]
}

/** Mẫu NPC vào trận. GIẢ ĐỊNH: chưa có schema NPC (HS05 I.1 vào ở M2-01), nên chỉ nhận chỉ số trực tiếp. */
export interface MauNpcTran {
  can_cot: number
  ngo_tinh: number
  canh_gioi: number
  tuoi: number
  tier: number
  cap_vo: number
  he: HeNoiLuc
  khinh_cong?: number
  than_binh?: number
  phuc_duyen?: number
  ban_menh?: MaBanMenh
  /** Hệ số sức mạnh (Python npc_ngang `suc`); mặc định 1. */
  suc?: number
}

/**
 * HS06 I.1 + HS06 I.4: chụp nhân vật người chơi.
 * GIẢ ĐỊNH: NhanVat chưa có bản mệnh nên dùng 'chinh_truc' (như mặc định của mo_phong.py).
 */
export function tuNhanVat(nv: NhanVat, dl?: DuLieu): VoGiaTran {
  const mon = timMonNgoaiCongTotNhat(nv, dl)
  return {
    hp: nv.hp,
    hp_max: hpMax(nv, dl),
    noi_tuc: nv.noi_tuc,
    mp_max: noiTucMax(nv, dl),
    tier: mon.tier,
    cap_vo: mon.capVo,
    he: heNoiLuc(nv, dl),
    can_cot: nv.can_cot,
    ngo_tinh: nv.ngo_tinh,
    khinh_cong: capKhinhCong(nv),
    than_binh: laySatThuongThanBinh(nv, dl),
    phuc_duyen: nv.phuc_duyen,
    ban_menh: 'chinh_truc',
    co: [],
  }
}

/**
 * Dựng NPC vào trận từ mẫu. Căn cốt và Ngộ tính nhân `suc` rồi dao động U(0,9; 1,1) (Python npc_ngang).
 * NPC vào trận đầy HP và Nội tức. Bản mệnh không cho thì gieo đều.
 */
export function tuMauNpc(mau: MauNpcTran, rng: Rng): VoGiaTran {
  const suc = mau.suc ?? 1
  const dao = (): number => 0.9 + 0.2 * rng.so()
  const canCot = mau.can_cot * suc * dao()
  const ngoTinh = mau.ngo_tinh * suc * dao()
  const banMenhs = Object.keys(AI_H1) as MaBanMenh[]
  const banMenh = mau.ban_menh ?? banMenhs[rng.nguyen(0, banMenhs.length - 1)]!
  const hpM = tinhHpMax(canCot, mau.canh_gioi, mau.tuoi)
  const mpM = tinhNoiTucMax(canCot, mau.canh_gioi)
  return {
    hp: hpM,
    hp_max: hpM,
    noi_tuc: mpM,
    mp_max: mpM,
    tier: mau.tier,
    cap_vo: mau.cap_vo,
    he: mau.he,
    can_cot: canCot,
    ngo_tinh: ngoTinh,
    khinh_cong: mau.khinh_cong ?? 0,
    than_binh: mau.than_binh ?? 0,
    phuc_duyen: mau.phuc_duyen ?? 50,
    ban_menh: banMenh,
    co: [],
  }
}

/** Dựng bên tham chiến từ chỉ số thô, đầy HP và Nội tức (dùng cho test và mô phỏng). */
export function tuChiSo(
  c: Pick<MauNpcTran, 'can_cot' | 'ngo_tinh' | 'canh_gioi' | 'tuoi' | 'tier' | 'cap_vo'> &
    Partial<Pick<MauNpcTran, 'he' | 'khinh_cong' | 'than_binh' | 'phuc_duyen' | 'ban_menh'>>,
): VoGiaTran {
  const hpM = tinhHpMax(c.can_cot, c.canh_gioi, c.tuoi)
  const mpM = tinhNoiTucMax(c.can_cot, c.canh_gioi)
  return {
    hp: hpM,
    hp_max: hpM,
    noi_tuc: mpM,
    mp_max: mpM,
    tier: c.tier,
    cap_vo: c.cap_vo,
    he: c.he ?? 'ngoai',
    can_cot: c.can_cot,
    ngo_tinh: c.ngo_tinh,
    khinh_cong: c.khinh_cong ?? 0,
    than_binh: c.than_binh ?? 0,
    phuc_duyen: c.phuc_duyen ?? 50,
    ban_menh: c.ban_menh ?? 'chinh_truc',
    co: [],
  }
}

/**
 * HS06 I.4: Sát thương một đòn, bốn lớp:
 * gốc = Uy lực x (1 + cấp / 5) + Nội tức hiện tại x 0,08 + Thần binh;
 * rồi x M chiến thuật x khắc chế hệ x (1 - giảm trừ phòng ngự).
 * Đối chiếu Python: sat_thuong.
 */
export function satThuong(att: VoGiaTran, de: VoGiaTran, mpHienTai: number, m: number): number {
  const goc = (UY_LUC[att.tier] ?? UY_LUC[1]!) * (1 + att.cap_vo / 5) + mpHienTai * HE_SO_NOI_TUC + att.than_binh
  const giam = Math.min(
    GIAM_TRU_TOI_DA,
    GIAM_TRU_MOI_CAN_COT * de.can_cot + GIAM_TRU_MOI_KHINH_CONG * de.khinh_cong,
  )
  return goc * m * khacChe(att.he, de.he) * (1 - giam)
}
