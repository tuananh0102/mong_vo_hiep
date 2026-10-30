// 01 mục 5.5, HS07 II, IV: Cái chết, xét Kết cục, Văn bia.
import type { DuLieu, KetCucDuLieu } from '../du_lieu/luoc_do'
import type { TrangThaiGame } from './kieu'
import { diemLuanHoi } from './luan_hoi'
import { CO_TAP_DICH } from './mon_phai'
import type { Rng } from './rng'
import { dienMau } from './van_ban'

export type HamKetCuc = (d: TrangThaiGame, dl: DuLieu) => boolean

const LY_DO_THO_CHUNG = 'tho_chung'
const LY_DO_DAY_VUC = 'khong_coc_day_vuc'

// GIẢ ĐỊNH (REVIEW "Còn mở"): võ học của kết cục #13 chỉ có Dịch Cân Kinh (Tiên Thiên Công chưa có trong dữ liệu).
const VO_HOC_TAP_DICH = 'dich_can_kinh'
const NAM_TAP_DICH = 60

/** G09: kiếp không đạt kết cục nào. Dùng khi `ket_cuc.json` chưa nạp (test dữ liệu rút gọn). */
const KET_CUC_MAC_DINH: KetCucDuLieu = {
  ma: 'kc_mac_dinh',
  thu_tu: 99,
  nhom: 0,
  tier: 'khong',
  diem: 0,
  dieu_kien: 'luon',
  ten: 'Giang Hồ Khách Qua Đường',
  mo_ta: '',
}

const lyDoChet = (d: TrangThaiGame): string => d.ket_thuc?.nguyen_nhan ?? ''
const chuaCo = (): boolean => false

/** #13: Đệ tử Tạp dịch suốt 60 năm, luyện Dịch Cân Kinh cấp 10/10. */
function kcTaoDich(d: TrangThaiGame): boolean {
  const nv = d.nhan_vat
  const mp = nv.mon_phai
  if (mp === null || mp.bac !== 1 || nv.co_su_kien[CO_TAP_DICH] !== true) return false
  return nv.tuoi - mp.tu_tuoi >= NAM_TAP_DICH && (nv.vo_hoc[VO_HOC_TAP_DICH]?.cap ?? 0) >= 10
}

/** #15: chết trước 25 tuổi khi có Thiên phú Đỏ hoặc Thần công. 0 - 10 tuổi thuộc #18, nhảy vực thuộc #17. */
function kcDoanMenh(d: TrangThaiGame, dl: DuLieu): boolean {
  const nv = d.nhan_vat
  const ly = lyDoChet(d)
  if (nv.tuoi <= 10 || nv.tuoi >= 25 || ly === LY_DO_THO_CHUNG || ly === LY_DO_DAY_VUC) return false
  const coThienPhuDo = nv.thien_phu.some((ma) => dl.thien_phu[ma]?.do_hiem === 4)
  const coThanCong = Object.keys(nv.vo_hoc).some((ma) => dl.vo_hoc?.[ma]?.tier === 4)
  return coThienPhuDo || coThanCong
}

/** #17: nhảy vực khi Phúc duyên < 30 (hau_qua.ts chỉ đặt lý do này ở đúng nhánh đó). */
function kcDayVuc(d: TrangThaiGame): boolean {
  return lyDoChet(d) === LY_DO_DAY_VUC
}

/** #18: qua đời ở 0 - 10 tuổi. */
function kcChetYeu(d: TrangThaiGame): boolean {
  return d.nhan_vat.tuoi <= 10
}

/**
 * Mã `dieu_kien` của `ket_cuc.json` → hàm xét lúc chết (`d.ket_thuc` đã đặt).
 * Kết cục chưa làm trả `false` kèm task phụ trách.
 */
export const KIEM_TRA: Record<string, HamKetCuc> = {
  luon: () => true, // G09
  chi_ton_thien_ha: chuaCo, // M2-16: Hoa Sơn Luận Kiếm, Thập Đại Cao Thủ
  khai_tong_lap_to: chuaCo, // M3-12: Kết cục Dòng tộc
  vi_quoc_vi_dan: chuaCo, // M2-16: Sơn Hà Phá Toái
  nhat_xuat_dong_phuong: chuaCo, // M2-16: Ma Giáo Đông Chinh
  tieu_dao_giang_ho: chuaCo, // M2-16: Kim Bồn Tẩy Thủ
  dien_nhan: chuaCo, // M2-16: Kinh Mạch Nghịch Hành (G22)
  than_y_doc_vuong: chuaCo, // M2-16: NPC có tên tuổi được cứu / khống chế
  phu_kha_dich_quoc: chuaCo, // M2-16: Hắc Thị Đấu Giá Hội
  doc_co_cau_bai: chuaCo, // M2-16: bảng Thập Đại Cao Thủ
  nguy_quan_tu: chuaCo, // M2-07: Đại Vạch Trần
  tinh_truong_da_doan: chuaCo, // M2-12: Hảo cảm nhiều Hồng nhan
  phuc_quoc_dai_mong: chuaCo, // M2-16: Sơn Hà Phá Toái
  tao_dich: kcTaoDich,
  binh_pham: chuaCo, // M2: cần hôn nhân và con cái
  doan_menh: kcDoanMenh,
  phan_do: chuaCo, // M2-10: đếm phản môn qua lich_su_mon_phai
  day_vuc: kcDayVuc,
  chet_yeu: kcChetYeu,
}

/** HS07 IV: duyệt theo `thu_tu`; kết cục đầu tiên đạt là chính, các kết cục khác đạt là danh hiệu phụ (G24). */
export function xetKetCuc(d: TrangThaiGame, dl: DuLieu): { chinh: KetCucDuLieu; phu: KetCucDuLieu[] } {
  const ds = Object.values(dl.ket_cuc ?? {}).sort((a, b) => a.thu_tu - b.thu_tu)
  const dat = ds.filter((kc) => kc.dieu_kien !== 'luon' && KIEM_TRA[kc.dieu_kien]?.(d, dl) === true)
  const macDinh = ds.find((kc) => kc.dieu_kien === 'luon') ?? KET_CUC_MAC_DINH
  return { chinh: dat[0] ?? macDinh, phu: dat.slice(1) }
}

/**
 * 01 mục 5.5: mọi nguồn gây chết gọi hàm này.
 * Đặt `ket_thuc`, xét Kết cục, tính Điểm Luân Hồi, chuyển sang màn Văn bia.
 */
export function ketThucKiep(d: TrangThaiGame, _rng: Rng, dl: DuLieu, lyDo: string): void {
  d.ket_thuc = { nguyen_nhan: lyDo, tuoi: d.nhan_vat.tuoi, ket_cuc: '', diem_luan_hoi: 0, danh_hieu_phu: [] }
  const { chinh, phu } = xetKetCuc(d, dl)
  d.ket_thuc.ket_cuc = chinh.ma
  d.ket_thuc.danh_hieu_phu = phu.map((kc) => kc.ma)
  d.ket_thuc.diem_luan_hoi = diemLuanHoi(d, chinh)
  d.cho = { loai: 'chuyen_giai_doan', ma: 'van_bia' }
}

/** G20: Giáp Tý là năm chia 60 dư 4. */
export function canChi(nam: number, dl: DuLieu): string {
  const vb = dl.van_bia
  if (!vb) return String(nam)
  const mod = (x: number, n: number): number => ((x % n) + n) % n
  return `${vb.can[mod(nam - 4, 10)]} ${vb.chi[mod(nam - 4, 12)]}`
}

/** HS07 II Trình Tạo Văn Bia: 4 đoạn (xuất thân, võ học, ân oán, vẫn lạc) ghép từ `van_bia.json`. */
export function vanBia(d: TrangThaiGame, dl: DuLieu): string[] {
  const vb = dl.van_bia
  if (!vb || d.ket_thuc === null) return []
  const nv = d.nhan_vat
  const tk = nv.thong_ke
  const ghep = (mau: string, bien: Record<string, string>): string => dienMau(mau, d, dl, bien)

  // Đoạn 1: xuất thân và thiếu thời
  const kyNgo = d.bien_nien.find((x) => x.loai_hien_thi === 'ky-ngo')
  const doan1 = [
    ghep(vb.doan_1.sinh, {
      nam_sinh: canChi(d.nam_the_gioi - d.ket_thuc.tuoi, dl),
      gia_canh: dl.gia_canh?.[nv.gia_canh]?.ten ?? nv.gia_canh,
    }),
    ...(kyNgo ? [ghep(vb.doan_1.ky_ngo, { tuoi_ky_ngo: String(kyNgo.tuoi) })] : []),
  ]

  // Đoạn 2: thành tựu võ học và môn phái
  const mon = Object.entries(nv.vo_hoc)
    .map(([ma, v]) => ({ ma, cap: v.cap, tier: dl.vo_hoc?.[ma]?.tier ?? 0, tien_do: v.tien_do }))
    .sort((a, b) => b.tier - a.tier || b.cap - a.cap || b.tien_do - a.tien_do)[0]
  const mp = nv.mon_phai
  const doan2 = [
    mon
      ? ghep(vb.doan_2.vo_hoc, { cap: String(mon.cap), vo_hoc: dl.vo_hoc?.[mon.ma]?.ten ?? mon.ma })
      : vb.doan_2.khong_vo_hoc,
    mp ? ghep(vb.doan_2.mon_phai, { tuoi_gia_nhap: String(mp.tu_tuoi), bac: String(mp.bac) }) : vb.doan_2.vo_mon_phai,
  ]

  // Đoạn 3: ân oán
  const soGiet = tk['npc_da_giet'] ?? 0
  const soThang = tk['tran_thang'] ?? 0
  const soThua = tk['tran_thua'] ?? 0
  const bienTran = { so_giet: String(soGiet), so_thang: String(soThang), so_thua: String(soThua) }
  const doan3 = soGiet > 0 ? vb.doan_3.giet : soThang + soThua > 0 ? vb.doan_3.thang : vb.doan_3.yen

  // Đoạn 4: vẫn lạc và di sản (M1: mọi kiếp tuyệt tự, HS05 IV.2 trường hợp 2)
  const chet = vb.doan_4.chet[d.ket_thuc.nguyen_nhan] ?? vb.doan_4.chet_mac_dinh

  return [
    doan1.join(' '),
    doan2.join(' '),
    ghep(doan3, bienTran),
    `${ghep(chet, { tuoi: String(d.ket_thuc.tuoi) })} ${vb.doan_4.di_san}`,
  ]
}
