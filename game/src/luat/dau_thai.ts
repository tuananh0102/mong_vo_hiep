// HS01 II.0, III; HS06 II.4; HS05 IV.1; G01, G05, G06: Cơ chế Đầu thai (Tạo kiếp) & Thiên phú đầu đời.
import type { DuLieu } from '../du_lieu/luoc_do'
import { hpMax, noiTucMax } from './cong_thuc'
import { apHieuUng } from './hieu_ung'
import type { DongBienNien, MaGoiLuanHoi, MaThienPhu, TrangThaiGame } from './kieu'
import type { Rng } from './rng'

export interface LenhTaoKiep {
  seed: number
  gioi_tinh: 'nam' | 'nu'
  ten: string
  uu_dai: MaGoiLuanHoi[]
}

/**
 * HS01 II.0: Sinh tên ngẫu nhiên cho nhân vật nếu người chơi không nhập tên.
 */
export function sinhTenNgauNhien(rng: Rng, dl: DuLieu, gioiTinh: 'nam' | 'nu'): string {
  if (!dl.ten_npc || dl.ten_npc.ho.length === 0) return 'Vô Danh'
  const idxHo = rng.nguyen(0, dl.ten_npc.ho.length - 1)
  const ho = dl.ten_npc.ho[idxHo] ?? 'Vô'
  const dsTen = gioiTinh === 'nu' ? dl.ten_npc.ten_nu : dl.ten_npc.ten_nam
  if (dsTen.length === 0) return `${ho} Danh`
  const idxTen = rng.nguyen(0, dsTen.length - 1)
  const ten = dsTen[idxTen] ?? 'Danh'
  return `${ho} ${ten}`
}

/**
 * HS01 III.1: Quay Gia cảnh theo tỷ lệ phần trăm (Hàn Vi 35%, Bình Dân 35%, Phú Thương 20%, Võ Lâm Thế Gia 10%).
 */
export function quayGiaCanh(rng: Rng, dl: DuLieu): string {
  const dsGiaCanh = Object.values(dl.gia_canh ?? {})
  if (dsGiaCanh.length === 0) return 'binh_dan'

  const tongTiLe = dsGiaCanh.reduce((sum, gc) => sum + gc.ti_le, 0)
  const roll = rng.so() * tongTiLe
  let tichLuy = 0

  for (const gc of dsGiaCanh) {
    tichLuy += gc.ti_le
    if (roll < tichLuy) {
      return gc.ma
    }
  }

  return dsGiaCanh[0]?.ma ?? 'binh_dan'
}

/**
 * G05: Rút 3 Thiên phú khác nhau theo độ hiếm (Trắng 60, Lam 28, Tím 10, Đỏ 2).
 */
export function rut3ThienPhu(rng: Rng, dl: DuLieu): [MaThienPhu, MaThienPhu, MaThienPhu] {
  const ds = Object.values(dl.thien_phu)
  const demTheoBac: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 }
  for (const tp of ds) {
    demTheoBac[tp.do_hiem] = (demTheoBac[tp.do_hiem] ?? 0) + 1
  }

  const trongSoBac: Record<number, number> = { 1: 60, 2: 28, 3: 10, 4: 2 }

  const dsChon = ds.map((tp) => {
    const dem = demTheoBac[tp.do_hiem] || 1
    const ts = (trongSoBac[tp.do_hiem] ?? 1) / dem
    return { ma: tp.ma, trongSo: ts }
  })

  const ketQua: string[] = []
  while (ketQua.length < 3 && dsChon.length > 0) {
    const tongTs = dsChon.reduce((s, item) => s + item.trongSo, 0)
    const r = rng.so() * tongTs
    let tichLuy = 0
    let indexChon = 0

    for (let i = 0; i < dsChon.length; i++) {
      tichLuy += dsChon[i]!.trongSo
      if (r < tichLuy) {
        indexChon = i
        break
      }
    }

    ketQua.push(dsChon[indexChon]!.ma)
    dsChon.splice(indexChon, 1) // Rút không hoàn lại để không trùng nhau
  }

  return [ketQua[0]!, ketQua[1]!, ketQua[2]!]
}

/**
 * M1-06: Áp ưu đãi Luân Hồi cho kiếp mới (M1: danh sách rỗng, để sẵn điểm mở rộng).
 */
export function apUuDaiLuanHoi(d: TrangThaiGame, uuDai: MaGoiLuanHoi[]): void {
  void d
  void uuDai
}

/**
 * M1-06: Khởi tạo kiếp sống mới từ lệnh tao_kiep:
 * - Đặt seed, giới tính, tên (tự động nếu rỗng).
 * - Quay gia cảnh (HS01 III.1).
 * - Sinh 4 chỉ số gốc theo khoảng gia cảnh (G06) và kẹp 5 - 95.
 * - Ngân lượng khởi đầu (HS06 II.4).
 * - Rút 3 Thiên phú khác nhau (G05) và đặt trạng thái chờ.
 */
export function khoiTaoKiep(
  d: TrangThaiGame,
  rng: Rng,
  dl: DuLieu,
  lenh: LenhTaoKiep,
): void {
  d.phien_ban = 1
  d.seed = lenh.seed
  d.nam_the_gioi = 0

  // 1. Giới tính và Tên
  d.nhan_vat.gioi_tinh = lenh.gioi_tinh
  const tenNhap = lenh.ten.trim()
  d.nhan_vat.ten = tenNhap.length > 0 ? tenNhap : sinhTenNgauNhien(rng, dl, lenh.gioi_tinh)

  // 2. Vùng khởi đầu (G01: M1 luôn Trung Nguyên)
  d.nhan_vat.vung = 'trung_nguyen'

  // 3. Quay gia cảnh (HS01 III.1)
  const maGiaCanh = quayGiaCanh(rng, dl)
  d.nhan_vat.gia_canh = maGiaCanh
  const giaCanh = dl.gia_canh?.[maGiaCanh]

  // 4. Sinh 4 chỉ số gốc (G06): mỗi chỉ số nguyen(25, 55) rồi cộng điều chỉnh gia cảnh, kẹp 5 - 95
  const cacChiSoGoc: ReadonlyArray<'can_cot' | 'ngo_tinh' | 'phuc_duyen' | 'mi_luc'> = [
    'can_cot',
    'ngo_tinh',
    'phuc_duyen',
    'mi_luc',
  ]

  for (const cs of cacChiSoGoc) {
    const goc = rng.nguyen(25, 55)
    const dieuChinh = giaCanh?.dieu_chinh_chi_so?.[cs] ?? 0
    d.nhan_vat[cs] = Math.min(95, Math.max(5, goc + dieuChinh))
  }

  // 5. Ngân lượng khởi đầu (HS06 II.4)
  const [minTien, maxTien] = giaCanh?.ngan_luong_khoi_dau ?? [0, 0]
  d.nhan_vat.ngan_luong = minTien === maxTien ? minTien : rng.nguyen(minTien, maxTien)

  // 6. Rút 3 Thiên phú khác nhau (G05)
  const dsThienPhu = rut3ThienPhu(rng, dl)
  d.cho = { loai: 'chon_thien_phu', lua_chon: dsThienPhu }

  // 7. Khởi tạo các trường trạng thái đầu đời
  d.nhan_vat.tuoi = 0
  d.nhan_vat.ap_con_lai = 2 // HS01 IV: 0 - 10 tuổi có 2 AP
  d.nhan_vat.viec_mien_phi_con_lai = 0
  d.nhan_vat.ap_bi_tru_nam_sau = 0
  d.nhan_vat.hp = 0
  d.nhan_vat.noi_tuc = 0
  d.nhan_vat.am_thuong = 0
  d.nhan_vat.no = {}
  d.nhan_vat.hiep_nghia = 0
  d.nhan_vat.thanh_danh = 0
  d.nhan_vat.danh_vong = 0
  d.hang_doi_su_kien = []
  d.lich_hen = []
  d.bien_nien = []
  d.ket_thuc = null
}

/**
 * M1-06: Thực hiện chọn Thiên phú lúc Tuổi 0:
 * - Áp hiệu ứng tuổi 0 của Thiên phú.
 * - Ghi các chỉ số bẩm sinh (*_bam_sinh theo HS05 IV.1).
 * - Đặt Căn cốt đỉnh, hồi đầy HP và Nội tức.
 * - Xử lý đặc quyền / kẻ thù của Võ Lâm Thế Gia.
 * - Sinh dòng Biên Niên Sử chào đời.
 */
export function thucHienChonThienPhu(
  d: TrangThaiGame,
  rng: Rng,
  dl: DuLieu,
  maThienPhu: MaThienPhu,
  uuDai: MaGoiLuanHoi[] = [],
): { dongMoi: DongBienNien[]; loi: string | null } {
  if (d.cho?.loai !== 'chon_thien_phu') {
    return { dongMoi: [], loi: 'khong_phai_luc_chon_thien_phu' }
  }

  if (!d.cho.lua_chon.includes(maThienPhu)) {
    return { dongMoi: [], loi: 'thien_phu_khong_hop_le' }
  }

  // 1. Thêm thiên phú vào nhân vật
  d.nhan_vat.thien_phu.push(maThienPhu)

  // 2. Áp hiệu ứng tuổi 0 của Thiên phú
  const tp = dl.thien_phu[maThienPhu]
  if (tp?.hieu_ung_tuoi_0) {
    for (const hu of tp.hieu_ung_tuoi_0) {
      apHieuUng(hu, d, rng, dl)
    }
  }

  // 3. HS05 IV.1: Ghi chỉ số bẩm sinh (sau khi đã tính Gia cảnh và Thiên phú)
  d.nhan_vat.can_cot_bam_sinh = d.nhan_vat.can_cot
  d.nhan_vat.ngo_tinh_bam_sinh = d.nhan_vat.ngo_tinh
  d.nhan_vat.mi_luc_bam_sinh = d.nhan_vat.mi_luc

  // 4. Đặt Căn cốt đỉnh và hồi đầy HP, Nội tức
  d.nhan_vat.can_cot_dinh = d.nhan_vat.can_cot
  d.nhan_vat.hp = hpMax(d.nhan_vat, dl)
  d.nhan_vat.noi_tuc = noiTucMax(d.nhan_vat, dl)

  // 5. Đặc quyền Võ Lâm Thế Gia: võ công gia truyền năm 5 tuổi và kẻ thù truyền kiếp
  if (d.nhan_vat.gia_canh === 'vo_lam_the_gia') {
    d.lich_hen.push({
      su_kien: 'vo_cong_gia_truyen_5_tuoi',
      nam_mo: 5,
      han_nam: 5,
    })
    d.nhan_vat.co_su_kien['ke_thu_truyen_kiep'] = true
  }

  // 6. Áp ưu đãi Luân Hồi
  apUuDaiLuanHoi(d, uuDai)

  // 7. Sinh dòng Biên Niên Sử chào đời
  const tenGiaCanh = dl.gia_canh?.[d.nhan_vat.gia_canh]?.ten ?? d.nhan_vat.gia_canh
  const tenVung = dl.vung[d.nhan_vat.vung]?.ten ?? d.nhan_vat.vung
  const dongMoDau: DongBienNien = {
    tuoi: 0,
    van_ban: `Năm ${d.nam_the_gioi}, bạn chào đời tại ${tenVung} trong một gia đình ${tenGiaCanh}.`,
    loai_hien_thi: 'thuong',
  }

  d.cho = null
  return { dongMoi: [dongMoDau], loi: null }
}
