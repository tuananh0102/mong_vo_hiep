// 01 mục 5: Động cơ game - một cửa vào duy nhất apDung.
import type { DuLieu } from '../du_lieu/luoc_do'
import { kiemTraBatBien } from './bat_bien'
import { khoiTaoKiep, thucHienChonThienPhu } from './dau_thai'
import type { DongBienNien, Lenh, TrangThaiGame } from './kieu'
import { rngTuSeed, taoRng } from './rng'
import { xuLyBuocTamHiep } from './tam_hiep/hau_qua'
import { xuLyChon } from './su_kien'
import { dungVatPham, mua } from './kinh_te'
import { quaNam } from './vong_nam'
import { trangBi } from './vo_hoc'
import { thucHienHanhDong } from './hanh_dong'

export interface KetQuaLenh {
  trang_thai: TrangThaiGame
  dong_moi: DongBienNien[]
  loi: string | null
}

function assertKhongConLoai(x: never): never {
  throw new Error(`Loại lệnh không xác định: ${JSON.stringify(x)}`)
}

export function apDung(s: TrangThaiGame, lenh: Lenh, dl: DuLieu): KetQuaLenh {
  // 1. Kiểm tra trạng thái đã kết thúc
  if (s.ket_thuc !== null && lenh.loai !== 'tiep_tuc') {
    return { trang_thai: s, dong_moi: [], loi: 'da_ket_thuc' }
  }

  // 2. Kiểm tra quyết định đang chờ (cho)
  if (s.cho !== null) {
    if (s.cho.loai === 'chon_thien_phu' && lenh.loai !== 'chon_thien_phu') {
      return { trang_thai: s, dong_moi: [], loi: 'cho_chon_thien_phu' }
    }
    if (s.cho.loai === 'su_kien' && lenh.loai !== 'chon') {
      return { trang_thai: s, dong_moi: [], loi: 'cho_su_kien' }
    }
    if (s.cho.loai === 'tam_hiep' && lenh.loai !== 'tam_hiep') {
      return { trang_thai: s, dong_moi: [], loi: 'cho_tam_hiep' }
    }
    if (s.cho.loai === 'chuyen_giai_doan' && lenh.loai !== 'tiep_tuc') {
      return { trang_thai: s, dong_moi: [], loi: 'cho_chuyen_giai_doan' }
    }
  } else {
    // Không có quyết định chờ nhưng lại gửi lệnh trả lời
    if (lenh.loai === 'chon' || lenh.loai === 'tam_hiep') {
      return { trang_thai: s, dong_moi: [], loi: 'khong_co_quyet_dinh_cho' }
    }
  }

  // 3. Nhân bản sâu trạng thái đầu vào, khôi phục RNG
  const d = structuredClone(s)
  const rng = taoRng(d.rng)
  let dongMoi: DongBienNien[] = []

  // 4. Phân luồng thực thi theo loại lệnh
  switch (lenh.loai) {
    case 'qua_nam': {
      dongMoi = quaNam(d, rng, dl)
      break
    }

    case 'tao_kiep': {
      const rngKhoiTao = rngTuSeed(lenh.seed)
      khoiTaoKiep(d, rngKhoiTao, dl, lenh)
      d.rng = rngKhoiTao.layTrangThai()
      dongMoi = []
      break
    }

    case 'chon_thien_phu': {
      if (d.cho?.loai === 'chon_thien_phu') {
        const kq = thucHienChonThienPhu(d, rng, dl, lenh.ma)
        if (kq.loi) {
          return { trang_thai: s, dong_moi: [], loi: kq.loi }
        }
        dongMoi = kq.dongMoi
      }
      break
    }

    case 'chon': {
      if (d.cho?.loai === 'su_kien') {
        const kq = xuLyChon(d, rng, dl, lenh.ma_lua_chon)
        if (kq.loi) {
          return { trang_thai: s, dong_moi: [], loi: kq.loi }
        }
        dongMoi = kq.dongMoi
      }
      break
    }

    case 'tiep_tuc': {
      if (d.ket_thuc !== null) {
        // Sau khi chết, tiếp tục chuyển sang màn tiếp theo (HS07)
        d.cho = { loai: 'chuyen_giai_doan', ma: 'chon_nguoi_ke_thua' }
      } else {
        d.cho = null
      }
      break
    }

    case 'trang_bi': {
      const sinh = trangBi(d, dl, lenh.o, lenh.ma)
      dongMoi.push(...sinh)
      break
    }

    case 'hanh_dong': {
      const kq = thucHienHanhDong(d, rng, dl, lenh.ma, lenh.tham_so)
      if (kq.loi) {
        return { trang_thai: s, dong_moi: [], loi: kq.loi }
      }
      dongMoi.push(...kq.dong_moi)
      break
    }

    case 'tam_hiep': {
      const kq = xuLyBuocTamHiep(d, rng, dl, lenh.buoc)
      if (kq.loi) {
        return { trang_thai: s, dong_moi: [], loi: kq.loi }
      }
      dongMoi.push(...kq.dong_moi)
      break
    }

    case 'dung_vat_pham': {
      const kq = dungVatPham(d, dl, rng, lenh.ma)
      if (kq.loi) return { trang_thai: s, dong_moi: [], loi: kq.loi }
      dongMoi.push(...kq.dong_moi)
      break
    }

    case 'mua': {
      const kq = mua(d, dl, lenh.ma, lenh.so_luong)
      if (kq.loi) return { trang_thai: s, dong_moi: [], loi: kq.loi }
      dongMoi.push(...kq.dong_moi)
      break
    }

    default:
      return assertKhongConLoai(lenh)
  }

  // 5. Cập nhật lại RNG vào trạng thái mới
  d.rng = rng.layTrangThai()

  // 6. Ghi dòng mới vào Biên Niên Sử
  if (dongMoi.length > 0) {
    d.bien_nien.push(...dongMoi)
  }

  // 7. Kiểm tra bất biến trong môi trường test / dev
  const kiemDev =
    (typeof process !== 'undefined' && process.env?.['VITEST'] !== undefined) ||
    (typeof import.meta !== 'undefined' &&
      Boolean((import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV))

  if (kiemDev) {
    const viPham = kiemTraBatBien(d, dl)
    if (viPham.length > 0) {
      throw new Error(`Vi phạm bất biến: ${viPham.join('; ')}`)
    }
  }

  return {
    trang_thai: d,
    dong_moi: dongMoi,
    loi: null,
  }
}
