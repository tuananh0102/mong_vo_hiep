// Hook kết nối React với động cơ apDung và lưu tự động vào localStorage.
import { useReducer } from 'react'
import { DU_LIEU } from '../du_lieu/nap_vite'
import { taoTrangThaiRong } from '../luat/chi_so'
import { apDung } from '../luat/dong_co'
import type { Lenh, TrangThaiGame } from '../luat/kieu'
import { docBanLuu, PHIEN_BAN, tuanTuHoa, type BanLuu } from '../luat/luu'
import { xemManHinh, type DuLieuManHinh } from '../luat/xem'

export const KHOA_LUU = 'vkgh.kiep'

export interface BoNho {
  trang_thai_dau: TrangThaiGame
  lenh: Lenh[]
  hien_tai: TrangThaiGame
  loi: string | null
}

export function taoTrangThaiMacDinh(seed = Date.now()): TrangThaiGame {
  const s = taoTrangThaiRong(seed)
  s.nhan_vat.ten = 'Lý Tiêu Dao'
  s.nhan_vat.gioi_tinh = 'nam'
  s.nhan_vat.vung = 'trung_nguyen'
  s.nhan_vat.tuoi = 0
  s.nhan_vat.hp = 100
  s.nhan_vat.noi_tuc = 50
  s.nhan_vat.ngan_luong = 10
  s.nhan_vat.ap_con_lai = 2
  s.bien_nien = [
    {
      tuoi: 0,
      van_ban: 'Lý Tiêu Dao cất tiếng khóc chào đời tại Trung Nguyên.',
      loai_hien_thi: 'thuong',
    },
  ]
  return s
}

export function khoiTaoTroChoi(): BoNho {
  if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    try {
      const chuoi = window.localStorage.getItem(KHOA_LUU)
      if (chuoi) {
        const bl = docBanLuu(chuoi)
        return {
          trang_thai_dau: bl.trang_thai_dau,
          lenh: bl.lenh,
          hien_tai: bl.trang_thai,
          loi: null,
        }
      }
    } catch {
      // Bỏ qua lỗi đọc localStorage và tạo trạng thái mới bên dưới
    }
  }

  const s = taoTrangThaiMacDinh()
  return {
    trang_thai_dau: s,
    lenh: [],
    hien_tai: s,
    loi: null,
  }
}

export function reducer(state: BoNho, lenh: Lenh): BoNho {
  const res = apDung(state.hien_tai, lenh, DU_LIEU)
  if (res.loi !== null) {
    return {
      ...state,
      loi: res.loi,
    }
  }

  const newState: BoNho = {
    trang_thai_dau: state.trang_thai_dau,
    lenh: [...state.lenh, lenh],
    hien_tai: res.trang_thai,
    loi: null,
  }

  if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    try {
      const banLuu: BanLuu = {
        phien_ban: PHIEN_BAN,
        trang_thai_dau: newState.trang_thai_dau,
        lenh: newState.lenh,
        trang_thai: newState.hien_tai,
      }
      window.localStorage.setItem(KHOA_LUU, tuanTuHoa(banLuu))
    } catch {
      // Bỏ qua lỗi ghi localStorage
    }
  }

  return newState
}

export function useTroChoi() {
  const [boNho, phat] = useReducer(reducer, undefined, khoiTaoTroChoi)
  const duLieuManHinh: DuLieuManHinh = xemManHinh(boNho.hien_tai, DU_LIEU)

  return {
    duLieuManHinh,
    trangThai: boNho.hien_tai,
    loi: boNho.loi,
    phat,
  }
}
