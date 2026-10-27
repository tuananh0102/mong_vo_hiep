// 01 mục 5.1: Chuẩn bị dữ liệu hiển thị cho giao diện từ trạng thái game thuần.
import type { DuLieu } from '../du_lieu/luoc_do'
import { danhGia, moTaThieu } from './dieu_kien'
import type { NhanDoKho } from './kiem_dinh'
import { nhanDoKho, pRoll } from './kiem_dinh'
import type { Cho, DongBienNien, KetThuc, TrangThaiGame } from './kieu'
import { tinhXacSuatKiemDinh } from './su_kien'
import { dienMau } from './van_ban'

export interface LuaChonHienThi {
  ma: string
  nhan: string
  bi_khoa: boolean
  ly_do: string | null
  chi_so_hien?: string
  do_kho?: NhanDoKho
  la_tam_hiep?: boolean
  nguy?: boolean
  chi_phi?: { ap?: number; ngan_luong?: number }
}

export interface SuKienHienThi {
  ma: string
  tieu_de: string
  mo_ta: string
  loai_hien_thi: 'thuong' | 'giao-chien' | 'tinh-duyen' | 'ky-ngo' | 'dao-gia'
  lua_chon: LuaChonHienThi[]
}

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
  su_kien?: SuKienHienThi | null
}

/**
 * 01 mục 5.3, HS06 I.2: Trích xuất thông tin hiển thị sự kiện đang chờ người chơi:
 * - Điền mẫu văn bản tiêu đề và mô tả.
 * - Cổng ẩn chưa đạt: không hiển thị trong danh sách.
 * - Cổng hoặc chi phí chưa đạt: bị khóa kèm lý do.
 * - Kiểm định: cung cấp tên chỉ số và nhãn độ khó (Hiểm, Khó, Khá, Dễ); không lộ % chính xác.
 */
export function xemSuKien(d: TrangThaiGame, dl: DuLieu): SuKienHienThi | null {
  if (d.cho?.loai !== 'su_kien') return null

  const { ma, bien } = d.cho
  const sk = dl.su_kien?.[ma]
  if (!sk) return null

  const tieuDe = dienMau(sk.ten, d, dl, bien)
  const moTa = dienMau(sk.mo_ta, d, dl, bien)
  const loaiHienThi = sk.loai_hien_thi ?? 'thuong'
  const dsLuaChon: LuaChonHienThi[] = []

  for (const lc of sk.lua_chon) {
    // 1. Cổng ẩn không đạt: bỏ qua khỏi danh sách
    if (lc.cong_an && !danhGia(lc.cong_an, d, dl, bien)) {
      continue
    }

    // 2. Cổng cứng và chi phí: xét trạng thái khóa
    let biKhoa = false
    let lyDo: string | null = null

    if (lc.cong && !danhGia(lc.cong, d, dl, bien)) {
      biKhoa = true
      lyDo = moTaThieu(lc.cong, d, dl)
    } else if (lc.chi_phi) {
      if (lc.chi_phi.ap && d.nhan_vat.ap_con_lai < lc.chi_phi.ap) {
        biKhoa = true
        lyDo = `Cần ${lc.chi_phi.ap} AP`
      } else if (lc.chi_phi.ngan_luong && d.nhan_vat.ngan_luong < lc.chi_phi.ngan_luong) {
        biKhoa = true
        lyDo = `Cần Ngân lượng ${lc.chi_phi.ngan_luong}`
      }
    }

    // 3. Kiểm định
    let chiSoHien: string | undefined
    let doKho: NhanDoKho | undefined
    let laTamHiep = false

    if (lc.kiem_dinh) {
      if (lc.kiem_dinh.loai === 'tam_hiep') {
        laTamHiep = true
      } else if (lc.kiem_dinh.loai !== 'ngau_nhien') {
        const kqXs = tinhXacSuatKiemDinh(lc.kiem_dinh, d, dl, bien)
        if (kqXs) {
          chiSoHien = kqXs.chiSoHien
          doKho = nhanDoKho(kqXs.p)
        }
      }
    }

    dsLuaChon.push({
      ma: lc.ma,
      nhan: dienMau(lc.nhan, d, dl, bien),
      bi_khoa: biKhoa,
      ly_do: lyDo,
      chi_so_hien: chiSoHien,
      do_kho: doKho,
      la_tam_hiep: laTamHiep,
      nguy: Boolean(lc.nguy),
      chi_phi: lc.chi_phi,
    })
  }

  return {
    ma,
    tieu_de: tieuDe,
    mo_ta: moTa,
    loai_hien_thi: loaiHienThi,
    lua_chon: dsLuaChon,
  }
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
    su_kien: d.cho?.loai === 'su_kien' ? xemSuKien(d, dl) : null,
  }
}

export interface HanhDongHienThi {
  ma: string
  ten: string
  ap: number
  nhom_tab: string
  bi_khoa: boolean
  ly_do: string | null
  do_kho?: NhanDoKho
  mo_ta: string
}

/**
 * HS01 IV, HS06 I.2: Danh sách hành động nhóm theo Tab.
 * Mỗi dòng có tên, chi phí AP, bi_khoa + lý do, và nếu có Roll thì nhãn độ khó.
 */
export function xemHanhDong(
  d: TrangThaiGame,
  dl: DuLieu,
): Record<string, HanhDongHienThi[]> {
  const ketQua: Record<string, HanhDongHienThi[]> = {}

  if (!dl.hanh_dong) return ketQua

  for (const [ma, hd] of Object.entries(dl.hanh_dong)) {
    let biKhoa = false
    let lyDo: string | null = null

    // 1. Kiểm tra tuổi
    if (d.nhan_vat.tuoi < hd.tuoi[0]) {
      biKhoa = true
      lyDo = `Chưa đủ tuổi (cần ${hd.tuoi[0]} tuổi)`
    } else if (d.nhan_vat.tuoi > hd.tuoi[1]) {
      biKhoa = true
      lyDo = `Đã quá tuổi (chỉ từ ${hd.tuoi[0]} đến ${hd.tuoi[1]} tuổi)`
    } else if (hd.dieu_kien && !danhGia(hd.dieu_kien, d, dl)) {
      // 2. Kiểm tra điều kiện
      biKhoa = true
      lyDo = moTaThieu(hd.dieu_kien, d, dl) ?? 'Không đủ điều kiện'
    } else if (hd.ap > 0 && d.nhan_vat.ap_con_lai < hd.ap) {
      // 3. Kiểm tra AP
      biKhoa = true
      lyDo = 'Hết AP'
    } else if (
      hd.ap === 0 &&
      hd.mien_phi &&
      !hd.khong_tinh_gioi_han &&
      d.nhan_vat.viec_mien_phi_con_lai < 1
    ) {
      biKhoa = true
      lyDo = 'Hết lượt miễn phí năm nay'
    }

    // 4. Kiểm định Roll (nếu có, ví dụ tiểu thương)
    let doKho: NhanDoKho | undefined
    if (hd.xu_ly === 'tieu_thuong') {
      const p = pRoll(d.nhan_vat.ngo_tinh, 50, d.nhan_vat.phuc_duyen)
      doKho = nhanDoKho(p)
    }

    const item: HanhDongHienThi = {
      ma,
      ten: hd.ten,
      ap: hd.ap,
      nhom_tab: hd.nhom_tab,
      bi_khoa: biKhoa,
      ly_do: lyDo,
      do_kho: doKho,
      mo_ta: hd.mo_ta,
    }

    if (!ketQua[hd.nhom_tab]) {
      ketQua[hd.nhom_tab] = []
    }
    ketQua[hd.nhom_tab]!.push(item)
  }

  return ketQua
}
