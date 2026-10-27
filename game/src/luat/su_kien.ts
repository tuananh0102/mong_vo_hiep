// 01 mục 5.3, 7; HS06 I.2: Bộ chạy sự kiện và giải quyết quyết định người chơi.
import type { DuLieu, HieuUng, KiemDinh } from '../du_lieu/luoc_do'
import { docChiSo } from './chi_so'
import { capKhinhCong } from './cong_thuc'
import { danhGia } from './dieu_kien'
import { apHieuUng } from './hieu_ung'
import { lanRoll, pRoll, pRollNhieu } from './kiem_dinh'
import type { DongBienNien, TrangThaiGame } from './kieu'
import type { Rng } from './rng'
import { dienMau } from './van_ban'

/**
 * 01 mục 5.3: Mở một sự kiện cho người chơi, gắn vai NPC (nếu có) và đặt trạng thái chờ.
 */
export function moSuKien(d: TrangThaiGame, rng: Rng, dl: DuLieu, ma: string): void {
  void rng
  const sk = dl.su_kien?.[ma]
  if (!sk) {
    throw new Error(`Sự kiện không tồn tại: ${ma}`)
  }

  const bien: Record<string, string> = {}

  // M1: Nếu sự kiện có định nghĩa vai NPC, tạo NPC tạm và ghi nhớ vào biến
  if (sk.vai) {
    const theGioi = d.the_gioi as unknown as { npc_tam?: Record<string, unknown> }
    if (!theGioi.npc_tam) {
      theGioi.npc_tam = {}
    }

    for (const [tenVai, mau] of Object.entries(sk.vai)) {
      const mauObj = mau as Record<string, unknown>
      const tenNpc = typeof mauObj['ten'] === 'string' ? mauObj['ten'] : tenVai
      theGioi.npc_tam[tenVai] = mauObj
      bien[tenVai] = tenNpc
      if (typeof mauObj['gioi_tinh'] === 'string') {
        bien[`gt_${tenVai}`] = mauObj['gioi_tinh']
      }
    }
  }

  d.cho = { loai: 'su_kien', ma, bien }
}

/**
 * HS06 I.2: Tính xác suất thực p (kẹp 5% - 95%) và tên chỉ số hiển thị cho kiểm định.
 */
export function tinhXacSuatKiemDinh(
  kd: KiemDinh,
  d: TrangThaiGame,
  dl: DuLieu,
  bien?: Record<string, string>,
): { p: number; chiSoHien: string } | null {
  void bien
  const phucDuyen = d.nhan_vat.phuc_duyen

  const layGiaTri = (cs: string): { giaTri: number; ten: string } => {
    let val: number
    if (cs === 'cap_khinh_cong') {
      // HS01 II.4: Cấp Khinh công trong Roll tự nhân 10 để đưa vào thang 0 - 100
      val = capKhinhCong(d.nhan_vat) * 10
    } else {
      try {
        val = docChiSo(dl, d.nhan_vat, cs)
      } catch {
        const fallback = (d.nhan_vat as unknown as Record<string, number>)[cs]
        val = typeof fallback === 'number' ? fallback : 0
      }
    }
    const ten = dl.chi_so[cs]?.ten ?? cs
    return { giaTri: val, ten }
  }

  if (kd.loai === 'roll' || kd.loai === 'roll_nguoc') {
    const nguoc = kd.loai === 'roll_nguoc'
    if (kd.va && kd.va.length > 0) {
      const ds = kd.va.map((m) => {
        const { giaTri } = layGiaTri(m.chi_so)
        return { chiSo: giaTri, nguong: m.nguong }
      })
      const p = pRollNhieu(ds, 'va', phucDuyen, nguoc)
      const chiSoHien = kd.va.map((m) => dl.chi_so[m.chi_so]?.ten ?? m.chi_so).join(' & ')
      return { p, chiSoHien }
    }

    if (kd.hoac && kd.hoac.length > 0) {
      const ds = kd.hoac.map((m) => {
        const { giaTri } = layGiaTri(m.chi_so)
        return { chiSo: giaTri, nguong: m.nguong }
      })
      const p = pRollNhieu(ds, 'hoac', phucDuyen, nguoc)
      const chiSoHien = kd.hoac.map((m) => dl.chi_so[m.chi_so]?.ten ?? m.chi_so).join(' hoặc ')
      return { p, chiSoHien }
    }

    if (kd.chi_so !== undefined && kd.nguong !== undefined) {
      const { giaTri, ten } = layGiaTri(kd.chi_so)
      const p = pRoll(giaTri, kd.nguong, phucDuyen, nguoc)
      return { p, chiSoHien: ten }
    }
  }

  if (kd.loai === 'giao_chien_nhanh') {
    // HS06 I.2: Viết tắt của [Roll: Võ Lực vs N]
    const { giaTri, ten } = layGiaTri('vo_luc')
    const p = pRoll(giaTri, kd.nguong, phucDuyen, false)
    return { p, chiSoHien: ten }
  }

  if (kd.loai === 'roll_doi_khang') {
    const { giaTri, ten } = layGiaTri(kd.chi_so)
    const theGioi = d.the_gioi as unknown as { npc_tam?: Record<string, Record<string, number>> }
    const doiThuNpc = theGioi.npc_tam?.[kd.doi_thu]
    const nguong = doiThuNpc?.[kd.chi_so] ?? 50
    const p = pRoll(giaTri, nguong, phucDuyen, false)
    return { p, chiSoHien: ten }
  }

  return null
}

/**
 * Tạo chuỗi tóm tắt thay đổi chỉ số từ danh sách hiệu ứng (ví dụ: "Căn cốt +5, Hiệp nghĩa +10").
 */
export function tomTatThayDoi(dsHieuUng: HieuUng[], dl: DuLieu): string | null {
  const cacMuc: string[] = []

  for (const hu of dsHieuUng) {
    if ('cong' in hu) {
      for (const [ma, delta] of Object.entries(hu.cong)) {
        const ten = dl.chi_so[ma]?.ten ?? ma
        const dau = delta > 0 ? `+${delta}` : `${delta}`
        cacMuc.push(`${ten} ${dau}`)
      }
    } else if ('cong_phan_tram' in hu) {
      for (const [ma, pt] of Object.entries(hu.cong_phan_tram)) {
        const ten = dl.chi_so[ma]?.ten ?? (ma === 'hp' ? 'Sinh Mệnh' : ma === 'noi_tuc' ? 'Nội Tức' : ma)
        const dau = pt > 0 ? `+${pt}%` : `${pt}%`
        cacMuc.push(`${ten} ${dau}`)
      }
    } else if ('hiep_nghia' in hu) {
      const dau = hu.hiep_nghia > 0 ? `+${hu.hiep_nghia}` : `${hu.hiep_nghia}`
      if (hu.am) {
        cacMuc.push(`Hiệp nghĩa ${dau} [Ám]`)
      } else {
        cacMuc.push(`Hiệp nghĩa ${dau}`, `Thanh danh ${dau}`)
      }
    } else if ('thanh_danh' in hu) {
      const dau = hu.thanh_danh > 0 ? `+${hu.thanh_danh}` : `${hu.thanh_danh}`
      cacMuc.push(`Thanh danh ${dau}`)
    } else if ('danh_vong' in hu) {
      const dau = hu.danh_vong > 0 ? `+${hu.danh_vong}` : `${hu.danh_vong}`
      cacMuc.push(`Danh vọng ${dau}`)
    } else if ('nhan_vat_pham' in hu) {
      const ten = dl.vat_pham?.[hu.nhan_vat_pham]?.ten ?? hu.nhan_vat_pham
      const sl = hu.so_luong && hu.so_luong > 1 ? ` (x${hu.so_luong})` : ''
      cacMuc.push(`Nhận ${ten}${sl}`)
    } else if ('mat_vat_pham' in hu) {
      const ten = dl.vat_pham?.[hu.mat_vat_pham]?.ten ?? hu.mat_vat_pham
      cacMuc.push(`Mất ${ten}`)
    } else if ('hoc_vo_hoc' in hu) {
      const ten = dl.vo_hoc?.[hu.hoc_vo_hoc]?.ten ?? hu.hoc_vo_hoc
      cacMuc.push(`Học ${ten}`)
    } else if ('them_trang_thai' in hu) {
      const ten = dl.trang_thai?.[hu.them_trang_thai]?.ten ?? hu.them_trang_thai
      cacMuc.push(`Trạng thái [${ten}]`)
    } else if ('xoa_trang_thai' in hu) {
      const ten = dl.trang_thai?.[hu.xoa_trang_thai]?.ten ?? hu.xoa_trang_thai
      cacMuc.push(`Xóa trạng thái [${ten}]`)
    } else if ('trong_thuong' in hu && hu.trong_thuong) {
      cacMuc.push('Trọng thương')
    } else if ('mat_ap_nam_sau' in hu) {
      cacMuc.push(`Mất ${hu.mat_ap_nam_sau} AP năm sau`)
    }
  }

  if (cacMuc.length === 0) return null
  return cacMuc.join(', ')
}

/**
 * Xử lý lệnh `chon`: kiểm tra lựa chọn, trừ chi phí, chạy kiểm định, áp hiệu ứng,
 * ghi lịch sử Biên Niên Sử và chuyển tiếp sự kiện.
 */
export function xuLyChon(
  d: TrangThaiGame,
  rng: Rng,
  dl: DuLieu,
  maLuaChon: string,
): { dongMoi: DongBienNien[]; loi: string | null } {
  if (d.cho?.loai !== 'su_kien') {
    return { dongMoi: [], loi: 'khong_co_su_kien_cho' }
  }

  const { ma, bien } = d.cho
  const sk = dl.su_kien?.[ma]
  if (!sk) {
    d.cho = null
    return { dongMoi: [], loi: 'su_kien_khong_ton_tai' }
  }

  const lc = sk.lua_chon.find((c) => c.ma === maLuaChon)
  if (!lc) {
    return { dongMoi: [], loi: 'lua_chon_khong_hop_le' }
  }

  // 1. Kiểm tra Cổng ẩn: không đạt coi như lựa chọn không tồn tại
  if (lc.cong_an && !danhGia(lc.cong_an, d, dl, bien)) {
    return { dongMoi: [], loi: 'lua_chon_khong_hop_le' }
  }

  // 2. Kiểm tra Cổng cứng
  if (lc.cong && !danhGia(lc.cong, d, dl, bien)) {
    return { dongMoi: [], loi: 'lua_chon_bi_khoa' }
  }

  // 3. Kiểm tra chi phí AP và Ngân lượng
  if (lc.chi_phi) {
    if (lc.chi_phi.ap && d.nhan_vat.ap_con_lai < lc.chi_phi.ap) {
      return { dongMoi: [], loi: 'khong_du_ap' }
    }
    if (lc.chi_phi.ngan_luong && d.nhan_vat.ngan_luong < lc.chi_phi.ngan_luong) {
      return { dongMoi: [], loi: 'khong_du_ngan_luong' }
    }
    if (lc.chi_phi.ap) d.nhan_vat.ap_con_lai -= lc.chi_phi.ap
    if (lc.chi_phi.ngan_luong) d.nhan_vat.ngan_luong -= lc.chi_phi.ngan_luong
  }

  // 4. Chạy kiểm định hoặc lấy kết quả
  const dongMoi: DongBienNien[] = []

  if (lc.kiem_dinh) {
    if (lc.kiem_dinh.loai === 'tam_hiep') {
      // Chuyển sang trạng thái Tam Hiệp; lưu nhánh thắng / thua để xử lý khi kết thúc trận
      d.cho = {
        loai: 'tam_hiep',
        tran: {
          doi_thu: lc.kiem_dinh.doi_thu,
          che_do: lc.kiem_dinh.che_do,
          thang: lc.thanh_cong,
          thua: lc.that_bai,
          bien,
        },
      }
      return { dongMoi: [], loi: null }
    }

    if (lc.kiem_dinh.loai === 'ngau_nhien') {
      const roll = rng.so() * 100
      let tichLuy = 0
      let ketQua = lc.kiem_dinh.nhanh[0]?.ket_qua
      for (const nh of lc.kiem_dinh.nhanh) {
        tichLuy += nh.ti_le
        if (roll <= tichLuy) {
          ketQua = nh.ket_qua
          break
        }
      }

      if (ketQua) {
        dongMoi.push({
          tuoi: d.nhan_vat.tuoi,
          van_ban: dienMau(ketQua.van_ban, d, dl, bien),
          loai_hien_thi: sk.loai_hien_thi ?? 'thuong',
        })
        for (const hu of ketQua.hieu_ung) {
          const dongSinh = apHieuUng(hu, d, rng, dl, bien)
          if (dongSinh.length > 0) dongMoi.push(...dongSinh)
        }
        const tomTat = tomTatThayDoi(ketQua.hieu_ung, dl)
        if (tomTat) {
          dongMoi.push({
            tuoi: d.nhan_vat.tuoi,
            van_ban: tomTat,
            loai_hien_thi: 'thuong',
          })
        }
      }
    } else {
      // Các loại Roll: tính xác suất p thật
      const xacSuat = tinhXacSuatKiemDinh(lc.kiem_dinh, d, dl, bien)
      const p = xacSuat?.p ?? 0.5
      const win = lanRoll(rng, p)
      const ketQua = win ? lc.thanh_cong : lc.that_bai

      if (ketQua) {
        dongMoi.push({
          tuoi: d.nhan_vat.tuoi,
          van_ban: dienMau(ketQua.van_ban, d, dl, bien),
          loai_hien_thi: sk.loai_hien_thi ?? 'thuong',
        })
        for (const hu of ketQua.hieu_ung) {
          const dongSinh = apHieuUng(hu, d, rng, dl, bien)
          if (dongSinh.length > 0) dongMoi.push(...dongSinh)
        }
        const tomTat = tomTatThayDoi(ketQua.hieu_ung, dl)
        if (tomTat) {
          dongMoi.push({
            tuoi: d.nhan_vat.tuoi,
            van_ban: tomTat,
            loai_hien_thi: 'thuong',
          })
        }
      }
    }
  } else if (lc.ket_qua) {
    dongMoi.push({
      tuoi: d.nhan_vat.tuoi,
      van_ban: dienMau(lc.ket_qua.van_ban, d, dl, bien),
      loai_hien_thi: sk.loai_hien_thi ?? 'thuong',
    })
    for (const hu of lc.ket_qua.hieu_ung) {
      const dongSinh = apHieuUng(hu, d, rng, dl, bien)
      if (dongSinh.length > 0) dongMoi.push(...dongSinh)
    }
    const tomTat = tomTatThayDoi(lc.ket_qua.hieu_ung, dl)
    if (tomTat) {
      dongMoi.push({
        tuoi: d.nhan_vat.tuoi,
        van_ban: tomTat,
        loai_hien_thi: 'thuong',
      })
    }
  }

  // 5. Ghi nhận số lần đã gặp sự kiện
  d.nhan_vat.su_kien_da_gap[ma] = (d.nhan_vat.su_kien_da_gap[ma] ?? 0) + 1

  // 6. Xử lý mở sự kiện tiếp theo
  // Nếu hiệu ứng `tiep` đã mở sự kiện mới (d.cho có ma khác), giữ nguyên
  const coTiep = d.cho?.loai === 'su_kien' && d.cho.ma !== ma
  if (!coTiep && d.ket_thuc === null) {
    if (d.hang_doi_su_kien.length > 0) {
      const maKe = d.hang_doi_su_kien.shift()!
      moSuKien(d, rng, dl, maKe)
    } else {
      d.cho = null
    }
  }

  return { dongMoi, loi: null }
}
