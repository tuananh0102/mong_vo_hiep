// 01 mục 5: Động cơ game - một cửa vào duy nhất apDung.
import type { DuLieu } from '../du_lieu/luoc_do'
import { kiemTraBatBien } from './bat_bien'
import { danhGia } from './dieu_kien'
import { apHieuUng } from './hieu_ung'
import type { DongBienNien, Lenh, TrangThaiGame } from './kieu'
import { lanRoll, pRoll } from './kiem_dinh'
import { rngTuSeed, taoRng } from './rng'
import { quaNam } from './vong_nam'

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
      d.phien_ban = 1
      d.seed = lenh.seed
      d.rng = rngKhoiTao.layTrangThai()
      d.nam_the_gioi = 0
      d.nhan_vat.ten = lenh.ten
      d.nhan_vat.gioi_tinh = lenh.gioi_tinh
      d.nhan_vat.tuoi = 0
      d.ket_thuc = null
      d.cho = null
      d.hang_doi_su_kien = []
      d.lich_hen = []
      d.bien_nien = [
        {
          tuoi: 0,
          van_ban: `${lenh.ten} cất tiếng khóc chào đời.`,
          loai_hien_thi: 'thuong',
        },
      ]
      dongMoi = [...d.bien_nien]
      break
    }

    case 'chon_thien_phu': {
      if (d.cho?.loai === 'chon_thien_phu') {
        d.nhan_vat.thien_phu.push(lenh.ma)
        d.cho = null
      }
      break
    }

    case 'chon': {
      if (d.cho?.loai === 'su_kien') {
        const maSk = d.cho.ma
        const bien = d.cho.bien
        const sk = dl.su_kien?.[maSk]
        if (!sk) {
          d.cho = null
          break
        }

        const lc = sk.lua_chon.find((c) => c.ma === lenh.ma_lua_chon)
        if (!lc) {
          return { trang_thai: s, dong_moi: [], loi: 'lua_chon_khong_hop_le' }
        }

        // Kiểm tra Cổng
        if (lc.cong && !danhGia(lc.cong, d, dl, bien)) {
          return { trang_thai: s, dong_moi: [], loi: 'dieu_kien_khong_dat' }
        }

        // Chi phí AP và Ngân lượng
        if (lc.chi_phi) {
          if (lc.chi_phi.ap && d.nhan_vat.ap_con_lai < lc.chi_phi.ap) {
            return { trang_thai: s, dong_moi: [], loi: 'khong_du_ap' }
          }
          if (lc.chi_phi.ngan_luong && d.nhan_vat.ngan_luong < lc.chi_phi.ngan_luong) {
            return { trang_thai: s, dong_moi: [], loi: 'khong_du_ngan_luong' }
          }
          if (lc.chi_phi.ap) d.nhan_vat.ap_con_lai -= lc.chi_phi.ap
          if (lc.chi_phi.ngan_luong) d.nhan_vat.ngan_luong -= lc.chi_phi.ngan_luong
        }

        // Xử lý kiểm định nếu có
        if (lc.kiem_dinh) {
          if (lc.kiem_dinh.loai === 'roll' || lc.kiem_dinh.loai === 'roll_nguoc') {
            const nguoc = lc.kiem_dinh.loai === 'roll_nguoc'
            const chiSo = lc.kiem_dinh.chi_so ?? 'can_cot'
            const nguong = lc.kiem_dinh.nguong ?? 50
            const csVal = (d.nhan_vat as unknown as Record<string, number>)[chiSo] ?? 50
            const p = pRoll(csVal, nguong, d.nhan_vat.phuc_duyen, nguoc)
            const win = lanRoll(rng, p)
            const kq = win ? lc.thanh_cong : lc.that_bai
            if (kq) {
              dongMoi.push({
                tuoi: d.nhan_vat.tuoi,
                van_ban: kq.van_ban,
                loai_hien_thi: sk.loai_hien_thi ?? 'thuong',
              })
              for (const hu of kq.hieu_ung) {
                const dongSinh = apHieuUng(hu, d, rng, dl, bien)
                if (dongSinh.length > 0) dongMoi.push(...dongSinh)
              }
            }
          } else if (lc.kiem_dinh.loai === 'ngau_nhien') {
            const roll = rng.so() * 100
            let tichLuy = 0
            for (const nh of lc.kiem_dinh.nhanh) {
              tichLuy += nh.ti_le
              if (roll <= tichLuy) {
                dongMoi.push({
                  tuoi: d.nhan_vat.tuoi,
                  van_ban: nh.ket_qua.van_ban,
                  loai_hien_thi: sk.loai_hien_thi ?? 'thuong',
                })
                for (const hu of nh.ket_qua.hieu_ung) {
                  const dongSinh = apHieuUng(hu, d, rng, dl, bien)
                  if (dongSinh.length > 0) dongMoi.push(...dongSinh)
                }
                break
              }
            }
          }
        } else if (lc.ket_qua) {
          dongMoi.push({
            tuoi: d.nhan_vat.tuoi,
            van_ban: lc.ket_qua.van_ban,
            loai_hien_thi: sk.loai_hien_thi ?? 'thuong',
          })
          for (const hu of lc.ket_qua.hieu_ung) {
            const dongSinh = apHieuUng(hu, d, rng, dl, bien)
            if (dongSinh.length > 0) dongMoi.push(...dongSinh)
          }
        }

        d.cho = null

        // Mở sự kiện tiếp theo trong hàng đợi nếu có
        if (d.hang_doi_su_kien.length > 0) {
          const tiep = d.hang_doi_su_kien.shift()!
          d.cho = { loai: 'su_kien', ma: tiep, bien: {} }
        }
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

    case 'hanh_dong':
    case 'tam_hiep':
    case 'trang_bi':
    case 'dung_vat_pham':
    case 'mua': {
      return { trang_thai: s, dong_moi: [], loi: 'chua_ho_tro' }
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
