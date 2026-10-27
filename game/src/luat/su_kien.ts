// 01 mục 5.3, 7; HS06 I.2: Bộ chạy sự kiện và giải quyết quyết định người chơi.
import type { DuLieu, HieuUng, KiemDinh, SuKien } from '../du_lieu/luoc_do'
import { docChiSo } from './chi_so'
import { capKhinhCong, pKyNgo } from './cong_thuc'
import { danhGia } from './dieu_kien'
import { HANG_DOI_THU_MAC_DINH } from './hang_so'
import { apHieuUng } from './hieu_ung'
import { moTranTuSuKien } from './tam_hiep/mo_tran'
import { lanRoll, pRoll, pRollNhieu } from './kiem_dinh'
import type { DongBienNien, LichHen, TrangThaiGame } from './kieu'
import { chonTheoTrongSo, type Rng } from './rng'
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
      // Chuyển sang Tam Hiệp; nhánh thành công / thất bại áp khi trận xong (tam_hiep/hau_qua.ts)
      const cheDo = lc.kiem_dinh.thang_khi === 'tru_vung' ? 'tru_vung' : lc.kiem_dinh.che_do
      d.cho = {
        loai: 'tam_hiep',
        tran: moTranTuSuKien(
          d,
          rng,
          dl,
          {
            su_kien: ma,
            lua_chon: lc.ma,
            doi_thu: lc.kiem_dinh.doi_thu,
            hang: HANG_DOI_THU_MAC_DINH,
            bien,
          },
          cheDo,
        ),
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

      if (ketQua) dongMoi.push(...apKetQua(sk, ketQua, d, rng, dl, bien))
    } else {
      // Các loại Roll: tính xác suất p thật
      const xacSuat = tinhXacSuatKiemDinh(lc.kiem_dinh, d, dl, bien)
      const p = xacSuat?.p ?? 0.5
      const win = lanRoll(rng, p)
      const ketQua = win ? lc.thanh_cong : lc.that_bai

      if (ketQua) dongMoi.push(...apKetQua(sk, ketQua, d, rng, dl, bien))
    }
  } else if (lc.ket_qua) {
    dongMoi.push(...apKetQua(sk, lc.ket_qua, d, rng, dl, bien))
  }

  hoanTatSuKien(d, rng, dl, ma)
  return { dongMoi, loi: null }
}

/** Áp một kết quả lựa chọn: dòng văn bản, hiệu ứng, rồi dòng tóm tắt thay đổi. */
export function apKetQua(
  sk: SuKien,
  ketQua: { van_ban: string; hieu_ung: HieuUng[] },
  d: TrangThaiGame,
  rng: Rng,
  dl: DuLieu,
  bien: Record<string, string>,
): DongBienNien[] {
  const dongMoi: DongBienNien[] = [
    {
      tuoi: d.nhan_vat.tuoi,
      van_ban: dienMau(ketQua.van_ban, d, dl, bien),
      loai_hien_thi: sk.loai_hien_thi ?? 'thuong',
    },
  ]
  for (const hu of ketQua.hieu_ung) {
    dongMoi.push(...apHieuUng(hu, d, rng, dl, bien))
  }
  const tomTat = tomTatThayDoi(ketQua.hieu_ung, dl)
  if (tomTat) dongMoi.push({ tuoi: d.nhan_vat.tuoi, van_ban: tomTat, loai_hien_thi: 'thuong' })
  return dongMoi
}

/** Sau khi một sự kiện có kết quả: ghi nhận đã gặp rồi mở sự kiện kế trong hàng đợi (hoặc hết chờ). */
export function hoanTatSuKien(d: TrangThaiGame, rng: Rng, dl: DuLieu, ma: string): void {
  d.nhan_vat.su_kien_da_gap[ma] = (d.nhan_vat.su_kien_da_gap[ma] ?? 0) + 1

  // Nếu hiệu ứng `tiep` đã mở sự kiện mới (d.cho có ma khác), giữ nguyên
  const coTiep = d.cho?.loai === 'su_kien' && d.cho.ma !== ma
  if (!coTiep && d.ket_thuc === null) {
    if (d.hang_doi_su_kien.length > 0) {
      moSuKien(d, rng, dl, d.hang_doi_su_kien.shift()!)
    } else {
      d.cho = null
    }
  }
}

/**
 * 01 mục 5.6: Kiểm tra sự kiện có đủ điều kiện để xuất hiện:
 * - Không phải sự kiện nối tiếp (noi_tiep).
 * - Khớp khoảng tuổi [tuoi_min, tuoi_max].
 * - Khớp vùng đất (nếu có khai báo vung).
 * - Đạt điều kiện riêng (dieu_kien / Cổng ẩn cấp sự kiện).
 * - Thỏa mãn quy tắc lặp lại (lap_lai: mot_lan, toi_da, cach_nam).
 */
export function duDieuKien(sk: SuKien, d: TrangThaiGame, dl: DuLieu): boolean {
  // 1. Không phải sự kiện nối tiếp
  if (sk.loai === 'noi_tiep') {
    return false
  }

  // 2. Tuổi nhân vật
  if (d.nhan_vat.tuoi < sk.tuoi[0] || d.nhan_vat.tuoi > sk.tuoi[1]) {
    return false
  }

  // 3. Vùng đất
  if (sk.vung && sk.vung.length > 0) {
    if (!sk.vung.includes(d.nhan_vat.vung)) {
      return false
    }
  }

  // 4. Điều kiện (Cổng ẩn cấp sự kiện)
  if (sk.dieu_kien && !danhGia(sk.dieu_kien, d, dl)) {
    return false
  }

  // 5. Quy tắc lặp lại
  const soLanDaGap = d.nhan_vat.su_kien_da_gap[sk.ma] ?? 0
  if (sk.lap_lai === 'mot_lan') {
    if (soLanDaGap >= 1) return false
  } else if (typeof sk.lap_lai === 'object' && 'toi_da' in sk.lap_lai) {
    if (soLanDaGap >= sk.lap_lai.toi_da) return false
  } else if (typeof sk.lap_lai === 'object' && 'cach_nam' in sk.lap_lai) {
    const namCuoi = d.nhan_vat.co_su_kien[`_nam_${sk.ma}`]
    if (typeof namCuoi === 'number' && d.nhan_vat.tuoi - namCuoi < sk.lap_lai.cach_nam) {
      return false
    }
  }

  return true
}

/**
 * 01 mục 5.6, HS06 I.3, G04: Chọn sự kiện năm mới cho người chơi:
 * 1. Sự kiện cố định đến tuổi và sự kiện hẹn (lich_hen) đến hạn -> luôn vào hàng đợi.
 * 2. Hồi Đại sự kiện năm nay (M2: tạm để trống).
 * 3. Quay R < P_KyNgo -> chọn 1 kỳ ngộ đủ điều kiện theo trọng số.
 * 4. Nếu chưa có sự kiện cá nhân nào: chọn 1 sự kiện thường đủ điều kiện theo trọng số.
 * 5. Sự kiện cá nhân thứ 2: nếu không có cố định/hẹn, có thêm 25% cơ hội; tối đa 2 sự kiện cá nhân/năm.
 * 6. Không có gì: 1 dòng năm bình lặng.
 */
export function chonSuKienNam(
  d: TrangThaiGame,
  rng: Rng,
  dl: DuLieu,
): DongBienNien[] {
  // Tuổi 0: không có sự kiện ngẫu nhiên trong năm (HS01 IV, G04)
  if (d.nhan_vat.tuoi === 0) {
    return []
  }

  const suKienCaNhan: string[] = []

  // ======================================================================
  // 1. Sự kiện hẹn (lich_hen) & Sự kiện cố định (loai: 'co_dinh')
  // ======================================================================
  const lichHenConLai: LichHen[] = []
  for (const lh of d.lich_hen) {
    if (d.nhan_vat.tuoi >= lh.nam_mo && d.nhan_vat.tuoi <= lh.han_nam) {
      suKienCaNhan.push(lh.su_kien)
    } else if (d.nhan_vat.tuoi > lh.han_nam) {
      // Quá hạn: xóa bỏ khỏi lịch hẹn
    } else {
      lichHenConLai.push(lh)
    }
  }
  d.lich_hen = lichHenConLai

  // Sự kiện cố định đến tuổi
  if (dl.su_kien) {
    for (const sk of Object.values(dl.su_kien)) {
      if (sk.loai === 'co_dinh' && duDieuKien(sk, d, dl)) {
        if (!suKienCaNhan.includes(sk.ma)) {
          suKienCaNhan.push(sk.ma)
        }
      }
    }
  }

  // ======================================================================
  // 2. Đại sự kiện năm nay (M2: tạm để trống)
  // ======================================================================

  // ======================================================================
  // 3. Quay xúc xắc Kỳ Ngộ: R < P_KyNgo (HS06 I.3)
  // ======================================================================
  const p = pKyNgo(d.nhan_vat, dl)
  const trungKyNgo = rng.trung(p)
  delete d.nhan_vat.co_su_kien['tuyet_canh'] // Tuyệt Cảnh chỉ cộng cho một lượt chọn

  if (trungKyNgo && dl.su_kien) {
    const dsKyNgo = Object.values(dl.su_kien).filter(
      (sk) => sk.loai === 'ky_ngo' && duDieuKien(sk, d, dl) && !suKienCaNhan.includes(sk.ma),
    )
    if (dsKyNgo.length > 0) {
      const chon = chonTheoTrongSo(
        rng,
        dsKyNgo.map((sk) => ({ gia_tri: sk.ma, trong_so: sk.trong_so ?? 1 })),
      )
      if (chon) {
        suKienCaNhan.push(chon)
      }
    }
  }

  // ======================================================================
  // 4. Nếu chưa có sự kiện cá nhân nào: chọn 1 sự kiện thường
  // ======================================================================
  if (suKienCaNhan.length === 0 && dl.su_kien) {
    const dsThuong = Object.values(dl.su_kien).filter(
      (sk) => sk.loai === 'thuong' && duDieuKien(sk, d, dl),
    )
    if (dsThuong.length > 0) {
      const chon = chonTheoTrongSo(
        rng,
        dsThuong.map((sk) => ({ gia_tri: sk.ma, trong_so: sk.trong_so ?? 1 })),
      )
      if (chon) {
        suKienCaNhan.push(chon)
      }
    }
  }

  // ======================================================================
  // 5. Sự kiện cá nhân thứ 2 trong năm (G04): 25% nếu không có cố định/hẹn
  // ======================================================================
  const coCoDinhHoacHen = suKienCaNhan.some((ma) => {
    const sk = dl.su_kien?.[ma]
    return sk?.loai === 'co_dinh'
  })

  if (!coCoDinhHoacHen && suKienCaNhan.length === 1 && dl.su_kien) {
    if (rng.trung(0.25)) {
      const dsThem = Object.values(dl.su_kien).filter(
        (sk) =>
          sk.loai === 'thuong' &&
          duDieuKien(sk, d, dl) &&
          !suKienCaNhan.includes(sk.ma),
      )
      if (dsThem.length > 0) {
        const chonThem = chonTheoTrongSo(
          rng,
          dsThem.map((sk) => ({ gia_tri: sk.ma, trong_so: sk.trong_so ?? 1 })),
        )
        if (chonThem) {
          suKienCaNhan.push(chonThem)
        }
      }
    }
  }

  // Giới hạn cứng: tối đa 2 sự kiện cá nhân mỗi năm
  const ketQuaSuKien = suKienCaNhan.slice(0, 2)

  // ======================================================================
  // 6. Năm bình lặng (nếu không có sự kiện nào)
  // ======================================================================
  const cacDong: DongBienNien[] = []
  if (ketQuaSuKien.length === 0) {
    cacDong.push({
      tuoi: d.nhan_vat.tuoi,
      van_ban: 'Năm nay giang hồ sóng yên biển lặng, bạn bình an trải qua một năm.',
      loai_hien_thi: 'thuong',
    })
  } else {
    // Đưa vào hàng đợi sự kiện
    d.hang_doi_su_kien.push(...ketQuaSuKien)

    // Mở sự kiện đầu tiên nếu chưa có quyết định chờ
    if (d.cho === null && d.hang_doi_su_kien.length > 0) {
      const maDau = d.hang_doi_su_kien.shift()!
      moSuKien(d, rng, dl, maDau)
    }
  }

  return cacDong
}
