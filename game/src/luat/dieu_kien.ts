// 01 mục 7.2: Đánh giá điều kiện (DieuKien) và mô tả điều kiện còn thiếu cho nút xám.
import type { DieuKien, DuLieu } from '../du_lieu/luoc_do'
import { docChiSo } from './chi_so'
import type { TrangThaiGame } from './kieu'

function soSanh(a: number, op: '>=' | '<=' | '>' | '<' | '==' | '!=', b: number): boolean {
  switch (op) {
    case '>=':
      return a >= b
    case '<=':
      return a <= b
    case '>':
      return a > b
    case '<':
      return a < b
    case '==':
      return a === b
    case '!=':
      return a !== b
  }
}

function layGiaTriSo(ma: string, d: TrangThaiGame, dl: DuLieu): number {
  switch (ma) {
    case 'bac_mon_phai':
      return d.nhan_vat.mon_phai?.bac ?? 0
    case 'cong_hien':
      return d.nhan_vat.mon_phai?.cong_hien ?? 0
    case 'cap_khinh_cong': {
      const maKhinh = d.nhan_vat.trang_bi.khinh_cong
      return maKhinh ? (d.nhan_vat.vo_hoc[maKhinh]?.cap ?? 0) : 0
    }
    case 'canh_gioi_noi_cong': {
      const maNoi = d.nhan_vat.trang_bi.noi_cong
      return maNoi ? (d.nhan_vat.vo_hoc[maNoi]?.cap ?? 0) : 0
    }
    default:
      try {
        return docChiSo(dl, d.nhan_vat, ma)
      } catch {
        // Fallback an toàn cho thuộc tính trong NhanVat nếu là phái sinh
        const val = (d.nhan_vat as unknown as Record<string, unknown>)[ma]
        return typeof val === 'number' ? val : 0
      }
  }
}

function layTruongLietKe(truong: string, d: TrangThaiGame): string {
  switch (truong) {
    case 'gioi_tinh':
      return d.nhan_vat.gioi_tinh
    case 'gia_canh':
      return d.nhan_vat.gia_canh
    case 'vung':
      return d.nhan_vat.vung
    case 'mon_phai':
      return d.nhan_vat.mon_phai?.ma ?? ''
    default:
      return (d.nhan_vat as unknown as Record<string, string>)[truong] ?? ''
  }
}

/** Đánh giá một điều kiện là đúng hay sai trên trạng thái hiện tại. */
export function danhGia(
  dk: DieuKien,
  d: TrangThaiGame,
  dl: DuLieu,
  bien?: Record<string, string>,
): boolean {
  if ('so' in dk) {
    const val = layGiaTriSo(dk.so, d, dl)
    return soSanh(val, dk.op, dk.gt)
  }
  if ('la' in dk) {
    const val = layTruongLietKe(dk.la, d)
    return dk.trong.includes(val)
  }
  if ('co' in dk) {
    return Boolean(d.nhan_vat.co_su_kien[dk.co])
  }
  if ('thien_phu' in dk) {
    return d.nhan_vat.thien_phu.includes(dk.thien_phu)
  }
  if ('trang_thai' in dk) {
    return dk.trang_thai in d.nhan_vat.trang_thai
  }
  if ('nhan' in dk) {
    return d.nhan_vat.nhan.includes(dk.nhan)
  }
  if ('vo_hoc' in dk) {
    const vh = d.nhan_vat.vo_hoc[dk.vo_hoc]
    return vh !== undefined && vh.cap >= (dk.cap_toi_thieu ?? 1)
  }
  if ('vat_pham' in dk) {
    const sl = d.nhan_vat.hanh_trang[dk.vat_pham] ?? 0
    return sl >= (dk.so_luong ?? 1)
  }
  if ('va' in dk) {
    return dk.va.every((c) => danhGia(c, d, dl, bien))
  }
  if ('hoac' in dk) {
    return dk.hoac.some((c) => danhGia(c, d, dl, bien))
  }
  if ('khong' in dk) {
    return !danhGia(dk.khong, d, dl, bien)
  }
  return false
}

/**
 * Trả về chuỗi mô tả điều kiện còn thiếu cho nút xám (ví dụ: "Cần Ngân lượng 50").
 * Trả về null nếu điều kiện đã thỏa mãn.
 */
export function moTaThieu(dk: DieuKien, d: TrangThaiGame, dl: DuLieu): string | null {
  if (danhGia(dk, d, dl)) return null

  if ('so' in dk) {
    const ten = dl.chi_so[dk.so]?.ten ?? dk.so
    switch (dk.op) {
      case '>=':
        return `Cần ${ten} ${dk.gt}`
      case '<=':
        return `Cần ${ten} tối đa ${dk.gt}`
      case '>':
        return `Cần ${ten} lớn hơn ${dk.gt}`
      case '<':
        return `Cần ${ten} nhỏ hơn ${dk.gt}`
      case '==':
        return `Cần ${ten} bằng ${dk.gt}`
      case '!=':
        return `Cần ${ten} khác ${dk.gt}`
    }
  }

  if ('la' in dk) {
    return `Cần ${dk.la} thuộc ${dk.trong.join(', ')}`
  }

  if ('co' in dk) {
    return `Cần cờ ${dk.co}`
  }

  if ('thien_phu' in dk) {
    const ten = dl.thien_phu[dk.thien_phu]?.ten ?? dk.thien_phu
    return `Cần Thiên phú ${ten}`
  }

  if ('trang_thai' in dk) {
    return `Cần Trạng thái ${dk.trang_thai}`
  }

  if ('nhan' in dk) {
    return `Cần Nhãn ${dk.nhan}`
  }

  if ('vo_hoc' in dk) {
    return `Cần võ học ${dk.vo_hoc} cấp ${dk.cap_toi_thieu ?? 1}`
  }

  if ('vat_pham' in dk) {
    const sl = dk.so_luong ?? 1
    return sl > 1 ? `Cần vật phẩm ${dk.vat_pham} (x${sl})` : `Cần vật phẩm ${dk.vat_pham}`
  }

  if ('va' in dk) {
    for (const c of dk.va) {
      const thieu = moTaThieu(c, d, dl)
      if (thieu) return thieu
    }
  }

  if ('hoac' in dk) {
    const ds = dk.hoac.map((c) => moTaThieu(c, d, dl)).filter((x): x is string => x !== null)
    return ds.join(' hoặc ')
  }

  if ('khong' in dk) {
    return 'Không được thỏa mãn điều kiện'
  }

  return 'Điều kiện không thỏa mãn'
}
