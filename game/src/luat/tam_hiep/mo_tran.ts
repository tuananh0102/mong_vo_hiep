// Mở trận Tam Hiệp từ một sự kiện (kiem_dinh loai 'tam_hiep').

import type { DuLieu } from '../../du_lieu/luoc_do'
import { canhGioiNoiCong } from '../cong_thuc'
import type { TrangThaiGame } from '../kieu'
import type { Rng } from '../rng'
import type { Huong } from './ai'
import { tuMauNpc, tuNhanVat, type HeNoiLuc } from './toan'
import { taoTranDau, type CheDoTran, type NguCanhTran, type TranDau } from './tran'

const HE: HeNoiLuc[] = ['duong', 'am', 'hoa', 'ngoai']

/** Khóa cờ lưu hướng Hiệp 1 của 5 trận gần nhất, dạng chuỗi "TQD" (AI NPC đọc vị, HS02 V.1). */
export const KHOA_LICH_SU_HUONG = 'lich_su_huong_tam_hiep'

export function docLichSuHuong(d: TrangThaiGame): Huong[] {
  const v = d.nhan_vat.co_su_kien[KHOA_LICH_SU_HUONG]
  return typeof v === 'string' ? ([...v].filter((c) => 'TQD'.includes(c)) as Huong[]) : []
}

/**
 * GIẢ ĐỊNH (M1-11c): chưa có dữ liệu NPC (vào ở M2-01), nên đối thủ là NPC ngang sức người chơi
 * (Python `npc_ngang`): Căn cốt và Ngộ tính dao động ±10%, hệ và bản mệnh gieo ngẫu nhiên.
 */
export function moTranTuSuKien(
  d: TrangThaiGame,
  rng: Rng,
  dl: DuLieu,
  ngu_canh: NguCanhTran,
  cheDo: CheDoTran,
): TranDau {
  const nv = d.nhan_vat
  const a = tuNhanVat(nv, dl)
  const b = tuMauNpc(
    {
      can_cot: a.can_cot,
      ngo_tinh: a.ngo_tinh,
      canh_gioi: canhGioiNoiCong(nv),
      tuoi: nv.tuoi,
      tier: a.tier,
      cap_vo: a.cap_vo,
      he: HE[rng.nguyen(0, HE.length - 1)]!,
      khinh_cong: a.khinh_cong,
      than_binh: a.than_binh,
      phuc_duyen: a.phuc_duyen,
    },
    rng,
  )
  return taoTranDau({
    a,
    b,
    che_do: cheDo,
    ngu_canh,
    lich_su_huong: docLichSuHuong(d),
    kim_sang_duoc: nv.hanh_trang['kim_sang_duoc'] ?? 0,
  })
}
