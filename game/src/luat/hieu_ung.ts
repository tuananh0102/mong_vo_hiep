// 01 mục 7.3: Thực thi hiệu ứng (HieuUng).
import type { DuLieu, HieuUng } from '../du_lieu/luoc_do'
import { congChiSo } from './chi_so'
import { hpMax, noiTucMax } from './cong_thuc'
import type { DongBienNien, TrangThaiGame } from './kieu'
import { chi, thu } from './kinh_te'
import { ketThucKiep } from './ket_cuc'
import type { Rng } from './rng'
import { datBac, datMonPhai, roiPhai } from './mon_phai'
import { hocVoHoc } from './vo_hoc'

function apCong(hu: { cong: Record<string, number>; no_neu_thieu?: string }, d: TrangThaiGame, dl: DuLieu): void {
  for (const [ma, delta] of Object.entries(hu.cong)) {
    if (ma === 'hiep_nghia' || ma === 'thanh_danh') {
      throw new Error(`cong không được dùng trên ${ma}; phải dùng khóa riêng (HS01 II.2)`)
    }

    if (ma === 'ngan_luong') {
      if (delta > 0) {
        thu(d, delta, 'Thu nhập') // HS06 II.3: mọi khoản thu đi qua `thu`
        continue
      }
      if (d.nhan_vat.ngan_luong + delta < 0 && !hu.no_neu_thieu) {
        throw new Error('không đủ ngân lượng và không có no_neu_thieu (dữ liệu sai: lựa chọn phải có Cổng tiền)')
      }
      if (hu.no_neu_thieu) {
        chi(d, -delta, hu.no_neu_thieu)
        continue
      }
    }

    congChiSo(dl, d.nhan_vat, ma, delta)
  }
}

function apCongPhanTram(hu: { cong_phan_tram: Record<string, number> }, d: TrangThaiGame, dl: DuLieu): void {
  for (const [ma, pt] of Object.entries(hu.cong_phan_tram)) {
    if (ma === 'hp') {
      const delta = Math.round((hpMax(d.nhan_vat, dl) * pt) / 100)
      congChiSo(dl, d.nhan_vat, 'hp', delta)
    } else if (ma === 'noi_tuc') {
      const delta = Math.round((noiTucMax(d.nhan_vat, dl) * pt) / 100)
      congChiSo(dl, d.nhan_vat, 'noi_tuc', delta)
    }
  }
}

function apHiepNghia(
  hu: { hiep_nghia: number; am?: 'vat' | 'lon'; nan_nhan?: string },
  d: TrangThaiGame,
  dl: DuLieu,
): void {
  if (hu.am) {
    throw new Error('chưa hỗ trợ: M2-06')
  }
  // HS01 II.2: công khai thì cộng cả Hiệp nghĩa và Thanh danh
  congChiSo(dl, d.nhan_vat, 'hiep_nghia', hu.hiep_nghia)
  congChiSo(dl, d.nhan_vat, 'thanh_danh', hu.hiep_nghia)
}

function apThanhDanh(hu: { thanh_danh: number }, d: TrangThaiGame, dl: DuLieu): void {
  congChiSo(dl, d.nhan_vat, 'thanh_danh', hu.thanh_danh)
}

function apDanhVong(hu: { danh_vong: number }, d: TrangThaiGame, dl: DuLieu): void {
  congChiSo(dl, d.nhan_vat, 'danh_vong', hu.danh_vong)
}

function apDatCo(hu: { dat_co: string | Record<string, boolean | number | string> }, d: TrangThaiGame): void {
  if (typeof hu.dat_co === 'string') {
    d.nhan_vat.co_su_kien[hu.dat_co] = true
  } else {
    Object.assign(d.nhan_vat.co_su_kien, hu.dat_co)
  }
}

function apXoaCo(hu: { xoa_co: string }, d: TrangThaiGame): void {
  delete d.nhan_vat.co_su_kien[hu.xoa_co]
}

function apThemTrangThai(hu: { them_trang_thai: string; so_nam?: number }, d: TrangThaiGame): void {
  d.nhan_vat.trang_thai[hu.them_trang_thai] = {
    tu_tuoi: d.nhan_vat.tuoi,
    den_tuoi: hu.so_nam ? d.nhan_vat.tuoi + hu.so_nam : undefined,
  }
}

function apXoaTrangThai(hu: { xoa_trang_thai: string }, d: TrangThaiGame): void {
  delete d.nhan_vat.trang_thai[hu.xoa_trang_thai]
}

function apThemNhan(hu: { them_nhan: string }, d: TrangThaiGame): void {
  if (!d.nhan_vat.nhan.includes(hu.them_nhan)) {
    d.nhan_vat.nhan.push(hu.them_nhan)
  }
}

function apHocVoHoc(hu: { hoc_vo_hoc: string; cap?: number; hoan_thien?: number }, d: TrangThaiGame, dl: DuLieu): DongBienNien[] {
  return hocVoHoc(d, dl, hu.hoc_vo_hoc, hu.cap ?? 1, hu.hoan_thien ?? 100)
}

function apNhanVatPham(hu: { nhan_vat_pham: string; so_luong?: number }, d: TrangThaiGame): void {
  const sl = hu.so_luong ?? 1
  d.nhan_vat.hanh_trang[hu.nhan_vat_pham] = (d.nhan_vat.hanh_trang[hu.nhan_vat_pham] ?? 0) + sl
}

function apMatVatPham(hu: { mat_vat_pham: string; so_luong?: number }, d: TrangThaiGame): void {
  const sl = hu.so_luong ?? 1
  const hienTai = d.nhan_vat.hanh_trang[hu.mat_vat_pham] ?? 0
  const con = Math.max(0, hienTai - sl)
  if (con === 0) {
    delete d.nhan_vat.hanh_trang[hu.mat_vat_pham]
  } else {
    d.nhan_vat.hanh_trang[hu.mat_vat_pham] = con
  }
}

function apGiaNhapMonPhai(hu: { gia_nhap_mon_phai: string; bac?: number }, d: TrangThaiGame, dl: DuLieu): DongBienNien[] {
  return datMonPhai(d, dl, hu.gia_nhap_mon_phai, hu.bac ?? 1)
}

function apRoiMonPhai(hu: { roi_mon_phai: 'tu_roi' | 'truc_xuat' | 'phan_mon' }, d: TrangThaiGame): void {
  roiPhai(d, hu.roi_mon_phai)
}

function apCongHien(hu: { cong_hien: number }, d: TrangThaiGame): void {
  if (d.nhan_vat.mon_phai) {
    d.nhan_vat.mon_phai.cong_hien = Math.max(0, d.nhan_vat.mon_phai.cong_hien + hu.cong_hien)
  }
}

function apThangBac(hu: { thang_bac: number }, d: TrangThaiGame, dl: DuLieu): DongBienNien[] {
  return datBac(d, dl, hu.thang_bac)
}

function apDoiGiaCanh(hu: { doi_gia_canh: string }, d: TrangThaiGame): void {
  d.nhan_vat.gia_canh = hu.doi_gia_canh
}

function apTrongThuong(hu: { trong_thuong: boolean }, d: TrangThaiGame): void {
  d.nhan_vat.trong_thuong = hu.trong_thuong
}

function apMatApNamSau(hu: { mat_ap_nam_sau: number }, d: TrangThaiGame): void {
  d.nhan_vat.ap_bi_tru_nam_sau += hu.mat_ap_nam_sau
}

function apLenLich(hu: { len_lich: { su_kien: string; sau_nam: number; han_nam: number } }, d: TrangThaiGame): void {
  d.lich_hen.push({
    su_kien: hu.len_lich.su_kien,
    nam_mo: d.nhan_vat.tuoi + hu.len_lich.sau_nam,
    han_nam: d.nhan_vat.tuoi + hu.len_lich.sau_nam + hu.len_lich.han_nam,
  })
}

function apTiep(hu: { tiep: string }, d: TrangThaiGame, bien?: Record<string, string>): void {
  d.cho = { loai: 'su_kien', ma: hu.tiep, bien: bien ?? {} }
}

function apGhiKeThu(hu: { ghi_ke_thu: string }, d: TrangThaiGame): void {
  d.nhan_vat.co_su_kien[`ke_thu_${hu.ghi_ke_thu}`] = true
}

function apChet(hu: { chet: string }, d: TrangThaiGame, rng: Rng, dl: DuLieu): void {
  ketThucKiep(d, rng, dl, hu.chet)
}

/** Áp dụng một hiệu ứng lên trạng thái game. Trả về các dòng Biên Niên Sử mới sinh ra (nếu có). */
export function apHieuUng(
  hu: HieuUng,
  d: TrangThaiGame,
  rng: Rng,
  dl: DuLieu,
  bien?: Record<string, string>,
): DongBienNien[] {
  if ('cong' in hu) {
    apCong(hu, d, dl)
    return []
  }
  if ('cong_phan_tram' in hu) {
    apCongPhanTram(hu, d, dl)
    return []
  }
  if ('hiep_nghia' in hu) {
    apHiepNghia(hu, d, dl)
    return []
  }
  if ('thanh_danh' in hu) {
    apThanhDanh(hu, d, dl)
    return []
  }
  if ('danh_vong' in hu) {
    apDanhVong(hu, d, dl)
    return []
  }
  if ('dat_co' in hu) {
    apDatCo(hu, d)
    return []
  }
  if ('xoa_co' in hu) {
    apXoaCo(hu, d)
    return []
  }
  if ('them_trang_thai' in hu) {
    apThemTrangThai(hu, d)
    return []
  }
  if ('xoa_trang_thai' in hu) {
    apXoaTrangThai(hu, d)
    return []
  }
  if ('them_nhan' in hu) {
    apThemNhan(hu, d)
    return []
  }
  if ('hoc_vo_hoc' in hu) {
    return apHocVoHoc(hu, d, dl)
  }
  if ('nhan_vat_pham' in hu) {
    apNhanVatPham(hu, d)
    return []
  }
  if ('mat_vat_pham' in hu) {
    apMatVatPham(hu, d)
    return []
  }
  if ('gia_nhap_mon_phai' in hu) {
    return apGiaNhapMonPhai(hu, d, dl)
  }
  if ('roi_mon_phai' in hu) {
    apRoiMonPhai(hu, d)
    return []
  }
  if ('cong_hien' in hu) {
    apCongHien(hu, d)
    return []
  }
  if ('thang_bac' in hu) {
    return apThangBac(hu, d, dl)
  }
  if ('doi_gia_canh' in hu) {
    apDoiGiaCanh(hu, d)
    return []
  }
  if ('trong_thuong' in hu) {
    apTrongThuong(hu, d)
    return []
  }
  if ('mat_ap_nam_sau' in hu) {
    apMatApNamSau(hu, d)
    return []
  }
  if ('len_lich' in hu) {
    apLenLich(hu, d)
    return []
  }
  if ('tiep' in hu) {
    apTiep(hu, d, bien)
    return []
  }
  if ('hao_cam' in hu) {
    throw new Error('chưa hỗ trợ: M2-06')
  }
  if ('cuu_gia' in hu) {
    throw new Error('chưa hỗ trợ: M2-06')
  }
  if ('ghi_ke_thu' in hu) {
    apGhiKeThu(hu, d)
    return []
  }
  if ('chet' in hu) {
    apChet(hu, d, rng, dl)
    return []
  }
  if ('dong' in hu) {
    return [
      {
        tuoi: d.nhan_vat.tuoi,
        van_ban: hu.dong.van_ban,
        loai_hien_thi: hu.dong.loai_hien_thi ?? 'thuong',
      },
    ]
  }

  return []
}
