// Hậu quả của trận Tam Hiệp (HS02 V.3, V.4; HS06 I.3; HS01 II.2) và nối trận vào động cơ.

import type { DuLieu } from '../../du_lieu/luoc_do'
import { congChiSo } from '../chi_so'
import {
  DANH_VONG_THANG_TRAN,
  TUYET_CANH_AM_THUONG,
  TUYET_CANH_NGUONG_ROLL,
  TUYET_CANH_PHUC_DUYEN_CAO,
  TUYET_CANH_PHUC_DUYEN_THAP,
  TRUY_NA,
  TRUY_NA_HIEP_NGHIA,
  TUYET_CANH_SONG_TRAN,
} from '../hang_so'
import { pRoll } from '../kiem_dinh'
import { thu } from '../kinh_te'
import type { BuocTamHiep, DongBienNien, TrangThaiGame } from '../kieu'
import type { Rng } from '../rng'
import { apKetQua, hoanTatSuKien } from '../su_kien'
import { kichHoatCuuMang, type HieuUngCuuMang } from './cuu_mang'
import { docLichSuHuong, KHOA_LICH_SU_HUONG } from './mo_tran'
import { apDungBuoc, type TranDau } from './tran'
import { taoMauTamHiep } from './xem_tran'

type KetCuc = 'thang' | 'thua' | 'hoa'

export interface KetQuaBuocTamHiep {
  dong_moi: DongBienNien[]
  loi: string | null
}

/** Xử lý lệnh `tam_hiep`: áp bước vào trận; trận xong thì áp hậu quả. */
export function xuLyBuocTamHiep(
  d: TrangThaiGame,
  rng: Rng,
  dl: DuLieu,
  buoc: BuocTamHiep,
  cuuMang?: readonly HieuUngCuuMang[],
): KetQuaBuocTamHiep {
  if (d.cho?.loai !== 'tam_hiep') return { dong_moi: [], loi: 'khong_co_tran_cho' }
  const kq = apDungBuoc(d.cho.tran, buoc, rng)
  if (kq.loi) return { dong_moi: [], loi: kq.loi }
  d.cho.tran = kq.tran
  if (kq.tran.buoc !== 'xong') return { dong_moi: [], loi: null }
  return { dong_moi: ketThucTran(d, rng, dl, cuuMang), loi: null }
}

/** Nhảy vực (HS06 I.3). Trả true nếu sống; đặt cờ Tuyệt Cảnh / Ám thương theo Phúc duyên. */
function nhayVuc(d: TrangThaiGame, rng: Rng): { song: boolean; muc: 'cao' | 'vua' | 'thap' } {
  const pd = d.nhan_vat.phuc_duyen
  if (pd >= TUYET_CANH_PHUC_DUYEN_CAO) {
    const song = rng.so() < TUYET_CANH_SONG_TRAN
    if (song) d.nhan_vat.co_su_kien['tuyet_canh'] = true // +50% P_KyNgo ở lượt chọn sự kiện kế tiếp
    return { song, muc: 'cao' }
  }
  if (pd >= TUYET_CANH_PHUC_DUYEN_THAP) {
    // GIẢ ĐỊNH: "kiểm định sinh tồn ngưỡng 45" là [Roll: Phúc duyên vs 45]
    const song = rng.so() < pRoll(pd, TUYET_CANH_NGUONG_ROLL, pd)
    if (song) {
      d.nhan_vat.am_thuong += TUYET_CANH_AM_THUONG
      d.nhan_vat.trong_thuong = true
    }
    return { song, muc: 'vua' }
  }
  return { song: false, muc: 'thap' }
}

/**
 * Áp hậu quả khi `tran.buoc === 'xong'`: Danh vọng, thống kê, HP / Nội tức, Trọng thương, tử vong
 * (qua Quy tắc Cứu Mạng), Biên Niên Sử, rồi nhánh `thanh_cong` / `that_bai` của sự kiện đã mở trận.
 */
export function ketThucTran(
  d: TrangThaiGame,
  rng: Rng,
  dl: DuLieu,
  cuuMang?: readonly HieuUngCuuMang[],
): DongBienNien[] {
  if (d.cho?.loai !== 'tam_hiep') return []
  const tran: TranDau = d.cho.tran
  const kq = tran.ket_qua
  if (!kq) return []
  const nv = d.nhan_vat
  const nc = tran.ngu_canh
  const mau = taoMauTamHiep(dl, nc?.bien[nc.doi_thu] ?? 'đối thủ')
  const sinhTu = tran.che_do === 'sinh_tu'
  const dong: DongBienNien[] = []
  const ghi = (van_ban: string): void => {
    dong.push({ tuoi: nv.tuoi, van_ban, loai_hien_thi: 'giao-chien' })
  }

  let ketCuc: KetCuc = 'thua'
  let giet = false
  let trongThuong = false
  let luaHau = ''
  let lyDoChet: string | null = null
  let daCuuMang = false

  /** HP người chơi về 0: thử Cứu Mạng, không được thì chết với `lyDo`. */
  const tuVong = (lyDo: string): void => {
    const cm = kichHoatCuuMang(tran, d, dl, rng, cuuMang)
    if (cm.ma) {
      dong.push(...cm.dong_moi)
      daCuuMang = true
      trongThuong = true
    } else {
      lyDoChet = lyDo
    }
  }
  /** NPC áp đảo định đoạt số phận người chơi: Tuyệt sát hoặc tha mạng (HS02 V.3). */
  const npcDinhDoat = (): void => {
    if (!sinhTu) return
    if (tran.npc_tuyet_sat) tuVong('tu_tran')
    else {
      trongThuong = true
      luaHau = 'tha_mang'
    }
  }

  switch (kq.lua_chon) {
    case 'ha_guc':
      if (kq.nguoi_thang === 'a') {
        ketCuc = 'thang'
        giet = sinhTu
        luaHau = 'ha_guc'
      } else if (sinhTu) tuVong('tu_tran')
      break
    case 'tuyet_sat':
      ketCuc = 'thang'
      giet = true
      luaHau = 'tuyet_sat'
      break
    case 'phe_vo_cong':
    case 'thu_kiem':
      ketCuc = 'thang'
      luaHau = kq.lua_chon
      break
    case 'hoa':
    case 'lieu_mang':
      ketCuc = 'hoa'
      break
    case 'dau_hang':
      npcDinhDoat()
      break
    case 'bo_chay':
      if (kq.thoat) luaHau = 'thoat'
      else npcDinhDoat()
      break
    case 'nhay_vuc': {
      const v = nhayVuc(d, rng)
      if (v.song) luaHau = 'nhay_vuc_song'
      else if (v.muc === 'thap') lyDoChet = 'khong_coc_day_vuc' // Phúc duyên < 30: tử vong ngay, kết cục #17
      else tuVong('tu_tran')
      break
    }
  }

  // Trụ vững: đủ 3 hiệp mà không bị hạ gục và không đầu hàng là thắng (HS04 II.2)
  const songSot = lyDoChet === null
  const biHaGuc = kq.lua_chon === 'ha_guc' && kq.nguoi_thang !== 'a'
  if (tran.che_do === 'tru_vung' && !biHaGuc && kq.lua_chon !== 'dau_hang') ketCuc = 'thang'

  // Danh vọng và thống kê (HS01 II.2)
  if (songSot) {
    const dv = DANH_VONG_THANG_TRAN[nc?.hang ?? 'truong_lao']
    if (ketCuc === 'thang') congChiSo(dl, nv, 'danh_vong', dv)
    else if (ketCuc === 'thua') congChiSo(dl, nv, 'danh_vong', -Math.floor(dv / 2))
  }
  if (ketCuc === 'thang') nv.thong_ke['tran_thang'] = (nv.thong_ke['tran_thang'] ?? 0) + 1
  if (ketCuc === 'thua') nv.thong_ke['tran_thua'] = (nv.thong_ke['tran_thua'] ?? 0) + 1
  if (giet) nv.thong_ke['npc_da_giet'] = (nv.thong_ke['npc_da_giet'] ?? 0) + 1

  // HP, Nội tức, vật phẩm đã dùng
  nv.hp = Math.max(daCuuMang ? nv.hp : 0, songSot ? 1 : 0, Math.round(tran.a.hp))
  nv.noi_tuc = Math.max(0, Math.round(tran.a.mp))
  for (const ma of tran.da_dung_vat_pham) {
    const con = (nv.hanh_trang[ma] ?? 0) - 1
    if (con > 0) nv.hanh_trang[ma] = con
    else delete nv.hanh_trang[ma]
  }
  if (trongThuong) nv.trong_thuong = true
  nv.co_su_kien[KHOA_LICH_SU_HUONG] = [
    ...docLichSuHuong(d),
    ...tran.nhat_ky.filter((e) => e.loai === 'huong' && e.ben === 'a').map((e) => (e.loai === 'huong' ? e.huong : 'T')),
  ]
    .slice(-5)
    .join('')

  // Biên Niên Sử: 1 dòng tóm tắt trận + 1 dòng kết quả
  ghi(mau(`ket_thuc.${ketCuc}`))
  if (lyDoChet) ghi(mau(`ket_thuc.${lyDoChet}`))
  else if (luaHau) ghi(mau(`ket_thuc.${luaHau}`))

  if (lyDoChet) {
    // TODO M1-18: chuyển sang ketThucKiep(d, rng, dl, lyDo)
    nv.hp = 0
    d.ket_thuc = { nguyen_nhan: lyDoChet, tuoi: nv.tuoi }
    d.cho = { loai: 'chuyen_giai_doan', ma: 'van_bia' }
    return dong
  }

  // Săn Tiền Thưởng (HS06 II.1): thắng thì nhận thưởng theo hạng và Hiệp nghĩa +40
  d.cho = null
  if (nc?.truy_na) {
    const h = TRUY_NA[nc.truy_na]
    if (h && ketCuc === 'thang') {
      const tien = rng.nguyen(h.thuong[0], h.thuong[1])
      const kqThu = thu(d, tien, 'Tiền thưởng')
      congChiSo(dl, nv, 'hiep_nghia', TRUY_NA_HIEP_NGHIA)
      congChiSo(dl, nv, 'thanh_danh', TRUY_NA_HIEP_NGHIA)
      ghi(`Lục Phiến Môn trao ${tien} lạng tiền thưởng (Hiệp nghĩa +${TRUY_NA_HIEP_NGHIA}).`)
      dong.push(...kqThu.dong_moi)
    }
    return dong
  }

  // Áp nhánh của sự kiện đã mở trận (hòa không phải thắng)
  if (nc) {
    const sk = dl.su_kien?.[nc.su_kien]
    const lc = sk?.lua_chon.find((c) => c.ma === nc.lua_chon)
    const nhanh = ketCuc === 'thang' ? lc?.thanh_cong : lc?.that_bai
    if (sk && nhanh) dong.push(...apKetQua(sk, nhanh, d, rng, dl, nc.bien))
    dong.push(...hoanTatSuKien(d, rng, dl, nc.su_kien))
  }
  return dong
}
