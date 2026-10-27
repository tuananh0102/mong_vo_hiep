// 01 mục 7.4: kiểm tra ngữ nghĩa bắt buộc cho toàn bộ dữ liệu game.
import { bienTrongMau } from '../luat/van_ban'
import type { DieuKien, DuLieu, HieuUng, LuaChon, SuKien } from './luoc_do'

const EM_DASH = /—/
const CHU_HAN = /[\u4E00-\u9FFF]/

const BIEN_DUNG_SAN = new Set(['ten', 'tuoi', 'vung', 'mon_phai', 'su_phu', 'cha_me'])

const MA_CHI_SO_DAC_BIET = new Set([
  'tuoi',
  'vo_luc',
  'chien_luc',
  'canh_gioi_noi_cong',
  'cap_khinh_cong',
  'bac_mon_phai',
  'cong_hien',
  'danh_vong',
])

function duyetChuoi(v: unknown, duong: string, ra: (duong: string, s: string) => void): void {
  if (typeof v === 'string') ra(duong, v)
  else if (Array.isArray(v)) v.forEach((x, i) => duyetChuoi(x, `${duong}[${i}]`, ra))
  else if (v && typeof v === 'object') {
    for (const [k, x] of Object.entries(v)) duyetChuoi(x, `${duong}.${k}`, ra)
  }
}

function kiemTraBienMau(vanBan: string, duong: string, vaiHopLe: Set<string>, loi: string[]): void {
  const cacBien = bienTrongMau(vanBan)
  for (const b of cacBien) {
    if (BIEN_DUNG_SAN.has(b)) continue
    if (b.startsWith('gt:')) continue
    if (b.startsWith('gt_vai:')) continue
    if (b.startsWith('vai:')) {
      const tenVai = b.slice(4)
      if (vaiHopLe.has(tenVai)) continue
    }
    if (b.startsWith('vo_hoc:') || b.startsWith('vat_pham:')) continue
    if (vaiHopLe.has(b)) continue

    loi.push(`${duong}: mẫu văn bản dùng biến không tồn tại "{${b}}" (01 mục 7.5)`)
  }
}

function kiemTraDieuKien(dk: DieuKien, duong: string, dl: DuLieu, loi: string[]): void {
  if ('so' in dk) {
    if (!MA_CHI_SO_DAC_BIET.has(dk.so) && dl.chi_so && Object.keys(dl.chi_so).length > 0 && !dl.chi_so[dk.so]) {
      loi.push(`${duong}: điều kiện tham chiếu chỉ số không tồn tại "${dk.so}"`)
    }
  } else if ('la' in dk) {
    if (dk.la === 'vung' && dl.vung && Object.keys(dl.vung).length > 0) {
      for (const v of dk.trong) {
        if (!dl.vung[v]) loi.push(`${duong}: điều kiện vùng tham chiếu vùng không tồn tại "${v}"`)
      }
    }
  } else if ('thien_phu' in dk) {
    if (dl.thien_phu && Object.keys(dl.thien_phu).length > 0 && !dl.thien_phu[dk.thien_phu]) {
      loi.push(`${duong}: điều kiện thiên phú tham chiếu "${dk.thien_phu}" không tồn tại`)
    }
  } else if ('va' in dk) {
    dk.va.forEach((c, i) => kiemTraDieuKien(c, `${duong}.va[${i}]`, dl, loi))
  } else if ('hoac' in dk) {
    dk.hoac.forEach((c, i) => kiemTraDieuKien(c, `${duong}.hoac[${i}]`, dl, loi))
  } else if ('khong' in dk) {
    kiemTraDieuKien(dk.khong, `${duong}.khong`, dl, loi)
  }
}

function kiemTraHieuUng(hu: HieuUng, duong: string, _dl: DuLieu, sk: SuKien, loi: string[]): void {
  // Luật 3: Hiệu ứng cột mốc sau chưa hỗ trợ
  if ('hao_cam' in hu) {
    loi.push(`${duong}: hiệu ứng hao_cam chưa được hỗ trợ trước cột mốc M2 (01 mục 7.3)`)
  }
  if ('cuu_gia' in hu) {
    loi.push(`${duong}: hiệu ứng cuu_gia chưa được hỗ trợ trước cột mốc M2 (01 mục 7.3)`)
  }
  if ('hiep_nghia' in hu && hu.am) {
    loi.push(`${duong}: hiệu ứng [Ám] chưa được hỗ trợ trước cột mốc M2 (01 mục 7.3)`)
  }

  // Luật 8: cong trên hiep_nghia / thanh_danh
  if ('cong' in hu) {
    for (const [ma, delta] of Object.entries(hu.cong)) {
      if (ma === 'hiep_nghia' || ma === 'thanh_danh') {
        loi.push(`${duong}: hiệu ứng cong không được dùng trên "${ma}"; phải dùng khóa riêng (01 mục 7.4 #8)`)
      }
      // Luật 11: kỳ ngộ cấp B không được cộng chỉ số > 10
      if (sk.loai === 'ky_ngo' && sk.cap_ky_ngo === 'B' && delta > 10) {
        loi.push(
          `${duong}: kỳ ngộ cấp B "${sk.ma}" có phần thưởng vượt cấp (cộng ${ma} = ${delta} > 10, HS01 II.7)`,
        )
      }
    }
  }
}

function layMoiHieuUng(lc: LuaChon): HieuUng[] {
  const kq: HieuUng[] = []
  if (lc.ket_qua?.hieu_ung) kq.push(...lc.ket_qua.hieu_ung)
  if (lc.thanh_cong?.hieu_ung) kq.push(...lc.thanh_cong.hieu_ung)
  if (lc.that_bai?.hieu_ung) kq.push(...lc.that_bai.hieu_ung)
  if (lc.kiem_dinh?.loai === 'ngau_nhien') {
    for (const n of lc.kiem_dinh.nhanh) {
      if (n.ket_qua?.hieu_ung) kq.push(...n.ket_qua.hieu_ung)
    }
  }
  return kq
}

function kiemTraSuKien(sk: SuKien, duong: string, dl: DuLieu, loi: string[]): void {
  // Luật 12: thiếu nguon
  if (!sk.nguon || sk.nguon.trim() === '') {
    loi.push(`${duong}: thiếu nguon (01 mục 7.4 #12)`)
  }

  // Luật 11: loai = ky_ngo thiếu cap_ky_ngo
  if (sk.loai === 'ky_ngo' && !sk.cap_ky_ngo) {
    loi.push(`${duong}: sự kiện kỳ ngộ "${sk.ma}" thiếu cap_ky_ngo (HS01 II.7)`)
  }

  // Luật 7: số lượng lựa chọn từ 2 đến 4
  if (sk.lua_chon.length < 2 || sk.lua_chon.length > 4) {
    loi.push(
      `${duong}: sự kiện "${sk.ma}" có ${sk.lua_chon.length} lựa chọn; chỉ được từ 2 đến 4 lựa chọn (01 mục 7.4 #7)`,
    )
  }

  // Vùng cấp sự kiện
  if (sk.vung && dl.vung && Object.keys(dl.vung).length > 0) {
    for (const v of sk.vung) {
      if (!dl.vung[v]) loi.push(`${duong}: sự kiện "${sk.ma}" tham chiếu vùng không tồn tại "${v}"`)
    }
  }

  // Điều kiện cấp sự kiện
  if (sk.dieu_kien) {
    kiemTraDieuKien(sk.dieu_kien, `${duong}.dieu_kien`, dl, loi)
  }

  // Tập hợp các vai hợp lệ
  const vaiHopLe = new Set(sk.vai ? Object.keys(sk.vai) : [])

  // Luật 10: kiểm tra mẫu văn bản mô tả sự kiện
  kiemTraBienMau(sk.mo_ta, `${duong}.mo_ta`, vaiHopLe, loi)

  // Kiểm tra từng lựa chọn
  for (let i = 0; i < sk.lua_chon.length; i++) {
    const lc = sk.lua_chon[i]!
    const duongLc = `${duong}.lua_chon[${i}]`

    // Mẫu văn bản nhãn lựa chọn
    kiemTraBienMau(lc.nhan, `${duongLc}.nhan`, vaiHopLe, loi)

    // Cổng
    if (lc.cong) kiemTraDieuKien(lc.cong, `${duongLc}.cong`, dl, loi)
    if (lc.cong_an) kiemTraDieuKien(lc.cong_an, `${duongLc}.cong_an`, dl, loi)

    // Kiểm tra kiểm định
    if (lc.kiem_dinh) {
      if (lc.kiem_dinh.loai === 'ngau_nhien') {
        // Luật 6: ngau_nhien có tổng ti_le khác 100
        const tong = lc.kiem_dinh.nhanh.reduce((s, n) => s + n.ti_le, 0)
        if (Math.abs(tong - 100) > 1e-6) {
          loi.push(
            `${duongLc}: lựa chọn "${lc.ma}" có kiểm định ngẫu nhiên với tổng ti_le = ${tong}; bắt buộc phải bằng 100 (01 mục 7.4 #6)`,
          )
        }
        for (let ni = 0; ni < lc.kiem_dinh.nhanh.length; ni++) {
          const nh = lc.kiem_dinh.nhanh[ni]!
          kiemTraBienMau(nh.ket_qua.van_ban, `${duongLc}.nhanh[${ni}].van_ban`, vaiHopLe, loi)
        }
      } else {
        // Luật 4: có kiểm định (khác ngẫu nhiên) mà thiếu thanh_cong hoặc that_bai
        if (!lc.thanh_cong) {
          loi.push(
            `${duongLc}: lựa chọn "${lc.ma}" có kiểm định nhưng thiếu nhánh thanh_cong (01 mục 7.4 #4)`,
          )
        }
        if (!lc.that_bai) {
          loi.push(
            `${duongLc}: lựa chọn "${lc.ma}" có kiểm định nhưng thiếu nhánh that_bai (01 mục 7.4 #4)`,
          )
        } else {
          // Luật 5: that_bai không có hiệu ứng nào
          if (lc.that_bai.hieu_ung.length === 0) {
            loi.push(
              `${duongLc}: lựa chọn "${lc.ma}" có nhánh that_bai rỗng không có hiệu ứng nào (01 mục 7.4 #5)`,
            )
          }
        }
      }
    }

    if (lc.ket_qua) {
      kiemTraBienMau(lc.ket_qua.van_ban, `${duongLc}.ket_qua.van_ban`, vaiHopLe, loi)
    }
    if (lc.thanh_cong) {
      kiemTraBienMau(lc.thanh_cong.van_ban, `${duongLc}.thanh_cong.van_ban`, vaiHopLe, loi)
    }
    if (lc.that_bai) {
      kiemTraBienMau(lc.that_bai.van_ban, `${duongLc}.that_bai.van_ban`, vaiHopLe, loi)
    }

    // Kiểm tra mọi hiệu ứng trong lựa chọn
    const dsHieuUng = layMoiHieuUng(lc)
    for (let hi = 0; hi < dsHieuUng.length; hi++) {
      kiemTraHieuUng(dsHieuUng[hi]!, `${duongLc}.hieu_ung[${hi}]`, dl, sk, loi)
    }
  }
}

export function kiemTraNguNghia(dl: DuLieu): string[] {
  const loi: string[] = []

  // Luật 9: không dấu gạch dài, không chữ Hán
  duyetChuoi(dl, 'du_lieu', (duong, s) => {
    if (EM_DASH.test(s)) loi.push(`${duong}: chứa dấu gạch dài (01 mục 7.4 #9)`)
    if (CHU_HAN.test(s)) loi.push(`${duong}: chứa chữ Hán (01 mục 7.4 #9)`)
  })

  // Kiểm tra tất cả các sự kiện đã nạp
  if (dl.su_kien) {
    for (const [ma, sk] of Object.entries(dl.su_kien)) {
      kiemTraSuKien(sk, `su_kien[${ma}]`, dl, loi)
    }
  }

  return loi
}
