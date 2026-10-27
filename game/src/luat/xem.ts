// 01 mục 5.1: Chuẩn bị dữ liệu hiển thị cho giao diện từ trạng thái game thuần.
import type { DuLieu } from '../du_lieu/luoc_do'
import type { Cho, DongBienNien, KetThuc, TrangThaiGame } from './kieu'

export interface DuLieuManHinh {
  ten: string
  tuoi: number
  gioi_tinh: 'nam' | 'nu'
  vung: string
  ap: number
  hp: number
  noi_tuc: number
  ngan_luong: number
  bien_nien: DongBienNien[]
  cho: Cho | null
  ket_thuc: KetThuc | null
}

/** Trích xuất dữ liệu cần thiết cho giao diện từ trạng thái game. */
export function xemManHinh(d: TrangThaiGame, dl: DuLieu): DuLieuManHinh {
  return {
    ten: d.nhan_vat.ten,
    tuoi: d.nhan_vat.tuoi,
    gioi_tinh: d.nhan_vat.gioi_tinh,
    vung: dl.vung[d.nhan_vat.vung]?.ten ?? d.nhan_vat.vung,
    ap: d.nhan_vat.ap_con_lai,
    hp: d.nhan_vat.hp,
    noi_tuc: d.nhan_vat.noi_tuc,
    ngan_luong: d.nhan_vat.ngan_luong,
    bien_nien: d.bien_nien,
    cho: d.cho,
    ket_thuc: d.ket_thuc,
  }
}
