// 01 mục 7.4: kiểm tra ngữ nghĩa bắt buộc cho toàn bộ dữ liệu game.
import { bienTrongMau } from '../luat/van_ban'
import type {
  DieuKien,
  DuLieu,
  GiaCanh,
  HieuUng,
  LuaChon,
  MonPhai,
  NhanDuLieu,
  SuKien,
  ThienPhuDuLieu,
  TrangThaiDuLieu,
  VoHoc,
} from './luoc_do'

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
  } else if ('trang_thai' in dk) {
    if (dl.trang_thai && Object.keys(dl.trang_thai).length > 0 && !dl.trang_thai[dk.trang_thai]) {
      loi.push(`${duong}: điều kiện trạng thái tham chiếu "${dk.trang_thai}" không tồn tại`)
    }
  } else if ('nhan' in dk) {
    if (dl.nhan && Object.keys(dl.nhan).length > 0 && !dl.nhan[dk.nhan]) {
      loi.push(`${duong}: điều kiện nhãn tham chiếu "${dk.nhan}" không tồn tại`)
    }
  } else if ('vo_hoc' in dk) {
    if (dl.vo_hoc && Object.keys(dl.vo_hoc).length > 0 && !dl.vo_hoc[dk.vo_hoc]) {
      loi.push(`${duong}: điều kiện võ học tham chiếu "${dk.vo_hoc}" không tồn tại`)
    }
  } else if ('va' in dk) {
    dk.va.forEach((c, i) => kiemTraDieuKien(c, `${duong}.va[${i}]`, dl, loi))
  } else if ('hoac' in dk) {
    dk.hoac.forEach((c, i) => kiemTraDieuKien(c, `${duong}.hoac[${i}]`, dl, loi))
  } else if ('khong' in dk) {
    kiemTraDieuKien(dk.khong, `${duong}.khong`, dl, loi)
  }
}

function kiemTraHieuUng(hu: HieuUng, duong: string, dl: DuLieu, sk: SuKien, loi: string[]): void {
  // Kiểm tra tham chiếu võ học và môn phái
  if ('hoc_vo_hoc' in hu) {
    if (dl.vo_hoc && Object.keys(dl.vo_hoc).length > 0 && !dl.vo_hoc[hu.hoc_vo_hoc]) {
      loi.push(`${duong}: hiệu ứng hoc_vo_hoc tham chiếu võ học không tồn tại "${hu.hoc_vo_hoc}"`)
    }
  }
  if ('gia_nhap_mon_phai' in hu) {
    if (dl.mon_phai && Object.keys(dl.mon_phai).length > 0 && !dl.mon_phai[hu.gia_nhap_mon_phai]) {
      loi.push(`${duong}: hiệu ứng gia_nhap_mon_phai tham chiếu môn phái không tồn tại "${hu.gia_nhap_mon_phai}"`)
    }
  }
  if ('them_trang_thai' in hu) {
    if (dl.trang_thai && Object.keys(dl.trang_thai).length > 0 && !dl.trang_thai[hu.them_trang_thai]) {
      loi.push(`${duong}: hiệu ứng them_trang_thai tham chiếu trạng thái không tồn tại "${hu.them_trang_thai}"`)
    }
  }
  if ('xoa_trang_thai' in hu) {
    if (dl.trang_thai && Object.keys(dl.trang_thai).length > 0 && !dl.trang_thai[hu.xoa_trang_thai]) {
      loi.push(`${duong}: hiệu ứng xoa_trang_thai tham chiếu trạng thái không tồn tại "${hu.xoa_trang_thai}"`)
    }
  }
  if ('them_nhan' in hu) {
    if (dl.nhan && Object.keys(dl.nhan).length > 0 && !dl.nhan[hu.them_nhan]) {
      loi.push(`${duong}: hiệu ứng them_nhan tham chiếu nhãn không tồn tại "${hu.them_nhan}"`)
    }
  }
  if ('doi_gia_canh' in hu) {
    if (dl.gia_canh && Object.keys(dl.gia_canh).length > 0 && !dl.gia_canh[hu.doi_gia_canh]) {
      loi.push(`${duong}: hiệu ứng doi_gia_canh tham chiếu gia cảnh không tồn tại "${hu.doi_gia_canh}"`)
    }
  }

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

function kiemTraVoHoc(vh: VoHoc, duong: string, dl: DuLieu, loi: string[]): void {
  if (!vh.nguon || vh.nguon.trim() === '') {
    loi.push(`${duong}: thiếu nguon (01 mục 7.4 #12)`)
  }

  if (vh.tru_cot === 'noi_cong') {
    if (!vh.he_noi_luc) {
      loi.push(`${duong}: võ học nội công "${vh.ma}" bắt buộc phải có he_noi_luc (HS02 II.2, G16)`)
    }
  } else if (vh.he_noi_luc !== null) {
    loi.push(`${duong}: võ học không phải nội công "${vh.ma}" không được có he_noi_luc (HS02 II.2)`)
  }

  if (vh.tru_cot === 'ngoai_cong' && !vh.loai_binh_khi) {
    loi.push(`${duong}: võ học ngoại công "${vh.ma}" bắt buộc phải có loai_binh_khi (HS02 II.1)`)
  }

  if (vh.tru_cot === 'khinh_cong') {
    const tranToiDa = vh.tier === 1 ? 4 : vh.tier === 2 ? 6 : vh.tier === 3 ? 8 : 10
    if (vh.tran_cap > tranToiDa) {
      loi.push(
        `${duong}: khinh công tier ${vh.tier} "${vh.ma}" có tran_cap = ${vh.tran_cap} vượt quá trần quy định ${tranToiDa} (HS02 II.1)`,
      )
    }
  }

  if (vh.uy_luc_lech < -0.1 || vh.uy_luc_lech > 0.1) {
    loi.push(`${duong}: uy_luc_lech của "${vh.ma}" phải nằm trong [-0.1, 0.1] (HS06 I.4)`)
  }

  if (vh.mon_phai !== null && dl.mon_phai && Object.keys(dl.mon_phai).length > 0) {
    if (!dl.mon_phai[vh.mon_phai]) {
      loi.push(`${duong}: võ học "${vh.ma}" tham chiếu môn phái không tồn tại "${vh.mon_phai}"`)
    }
  }

  if (vh.dieu_kien_hoc) {
    kiemTraDieuKien(vh.dieu_kien_hoc, `${duong}.dieu_kien_hoc`, dl, loi)
  }
}

function kiemTraMonPhai(mp: MonPhai, duong: string, dl: DuLieu, loi: string[]): void {
  if (!mp.nguon || mp.nguon.trim() === '') {
    loi.push(`${duong}: thiếu nguon (01 mục 7.4 #12)`)
  }

  if (dl.vung && Object.keys(dl.vung).length > 0 && !dl.vung[mp.vung]) {
    loi.push(`${duong}: môn phái "${mp.ma}" tham chiếu vùng không tồn tại "${mp.vung}"`)
  }

  kiemTraDieuKien(mp.dieu_kien_gia_nhap, `${duong}.dieu_kien_gia_nhap`, dl, loi)

  // Kiểm tra võ học theo bậc
  if (!mp.vo_hoc_theo_bac['1']) {
    loi.push(`${duong}: môn phái "${mp.ma}" thiếu võ học bậc 1`)
  }

  for (const [bacStr, dsVh] of Object.entries(mp.vo_hoc_theo_bac)) {
    for (const maVh of dsVh) {
      if (dl.vo_hoc && Object.keys(dl.vo_hoc).length > 0 && !dl.vo_hoc[maVh]) {
        loi.push(`${duong}.vo_hoc_theo_bac[${bacStr}]: tham chiếu võ học không tồn tại "${maVh}"`)
      }
    }
  }

  // G15: bậc 1 có ít nhất 1 nội công và 1 khinh công
  if (dl.vo_hoc && Object.keys(dl.vo_hoc).length > 0 && mp.vo_hoc_theo_bac['1']) {
    const dsB1 = mp.vo_hoc_theo_bac['1']
    const coNoiCong = dsB1.some(m => dl.vo_hoc?.[m]?.tru_cot === 'noi_cong')
    const coKhinhCong = dsB1.some(m => dl.vo_hoc?.[m]?.tru_cot === 'khinh_cong')
    if (!coNoiCong) {
      loi.push(`${duong}: môn phái "${mp.ma}" bậc 1 thiếu Nội công Nhập môn (G15)`)
    }
    if (!coKhinhCong) {
      loi.push(`${duong}: môn phái "${mp.ma}" bậc 1 thiếu Khinh công (G15)`)
    }
  }

  // G17: cấp sư phụ theo bậc
  const capChuan: Record<string, number> = { '1': 6, '2': 8, '3': 10, '4': 10, '5': 10 }
  for (const [bacStr, cap] of Object.entries(capChuan)) {
    if (mp.cap_su_phu_theo_bac[bacStr] !== undefined && mp.cap_su_phu_theo_bac[bacStr] !== cap) {
      loi.push(
        `${duong}: cap_su_phu_theo_bac bậc ${bacStr} của "${mp.ma}" phải bằng ${cap} (G17)`,
      )
    }
  }
}

function kiemTraGiaCanh(gc: GiaCanh, duong: string, dl: DuLieu, loi: string[]): void {
  if (!gc.nguon || gc.nguon.trim() === '') {
    loi.push(`${duong}: thiếu nguon (01 mục 7.4 #12)`)
  }
  if (dl.chi_so && Object.keys(dl.chi_so).length > 0) {
    for (const maCs of Object.keys(gc.dieu_chinh_chi_so)) {
      if (!dl.chi_so[maCs]) {
        loi.push(`${duong}: điều chỉnh chỉ số tham chiếu chỉ số không tồn tại "${maCs}"`)
      }
    }
  }
}

function kiemTraThienPhu(tp: ThienPhuDuLieu, duong: string, dl: DuLieu, loi: string[]): void {
  if (!tp.nguon || tp.nguon.trim() === '') {
    loi.push(`${duong}: thiếu nguon (01 mục 7.4 #12)`)
  }
  if (dl.chi_so && Object.keys(dl.chi_so).length > 0) {
    for (let i = 0; i < tp.hieu_ung_tuoi_0.length; i++) {
      const hu = tp.hieu_ung_tuoi_0[i]!
      if ('cong' in hu) {
        for (const ma of Object.keys(hu.cong)) {
          if (!dl.chi_so[ma]) {
            loi.push(`${duong}.hieu_ung_tuoi_0[${i}]: tham chiếu chỉ số không tồn tại "${ma}"`)
          }
        }
      }
    }
    for (let i = 0; i < tp.hieu_ung_moi_nam.length; i++) {
      const hu = tp.hieu_ung_moi_nam[i]!
      if ('cong' in hu) {
        for (const ma of Object.keys(hu.cong)) {
          if (!dl.chi_so[ma]) {
            loi.push(`${duong}.hieu_ung_moi_nam[${i}]: tham chiếu chỉ số không tồn tại "${ma}"`)
          }
        }
      }
    }
  }
}

function kiemTraTrangThai(tt: TrangThaiDuLieu, duong: string, dl: DuLieu, loi: string[]): void {
  if (!tt.nguon || tt.nguon.trim() === '') {
    loi.push(`${duong}: thiếu nguon (01 mục 7.4 #12)`)
  }
  if (dl.chi_so && Object.keys(dl.chi_so).length > 0) {
    for (let i = 0; i < tt.hieu_ung_moi_nam.length; i++) {
      const hu = tt.hieu_ung_moi_nam[i]!
      if ('cong' in hu) {
        for (const ma of Object.keys(hu.cong)) {
          if (!dl.chi_so[ma]) {
            loi.push(`${duong}.hieu_ung_moi_nam[${i}]: tham chiếu chỉ số không tồn tại "${ma}"`)
          }
        }
      }
    }
  }
}

function kiemTraNhan(nh: NhanDuLieu, duong: string, _dl: DuLieu, loi: string[]): void {
  if (!nh.nguon || nh.nguon.trim() === '') {
    loi.push(`${duong}: thiếu nguon (01 mục 7.4 #12)`)
  }
}

export function kiemTraNguNghia(dl: DuLieu): string[] {
  const loi: string[] = []

  // Luật 9: không dấu gạch dài, không chữ Hán
  duyetChuoi(dl, 'du_lieu', (duong, s) => {
    if (EM_DASH.test(s)) loi.push(`${duong}: chứa dấu gạch dài (01 mục 7.4 #9)`)
    if (CHU_HAN.test(s)) loi.push(`${duong}: chứa chữ Hán (01 mục 7.4 #9)`)
  })

  // Kiểm tra gia cảnh
  if (dl.gia_canh && Object.keys(dl.gia_canh).length > 0) {
    const tongTiLe = Object.values(dl.gia_canh).reduce((sum, gc) => sum + gc.ti_le, 0)
    if (tongTiLe !== 100) {
      loi.push(`gia_canh: tổng ti_le của các gia cảnh = ${tongTiLe}; bắt buộc phải bằng 100 (HS01 III.1)`)
    }
    for (const [ma, gc] of Object.entries(dl.gia_canh)) {
      kiemTraGiaCanh(gc, `gia_canh[${ma}]`, dl, loi)
    }
  }

  // Kiểm tra thiên phú
  if (dl.thien_phu) {
    for (const [ma, tp] of Object.entries(dl.thien_phu)) {
      kiemTraThienPhu(tp, `thien_phu[${ma}]`, dl, loi)
    }
  }

  // Kiểm tra trạng thái
  if (dl.trang_thai) {
    for (const [ma, tt] of Object.entries(dl.trang_thai)) {
      kiemTraTrangThai(tt, `trang_thai[${ma}]`, dl, loi)
    }
  }

  // Kiểm tra nhãn
  if (dl.nhan) {
    for (const [ma, nh] of Object.entries(dl.nhan)) {
      kiemTraNhan(nh, `nhan[${ma}]`, dl, loi)
    }
  }

  // Kiểm tra võ học
  if (dl.vo_hoc) {
    for (const [ma, vh] of Object.entries(dl.vo_hoc)) {
      kiemTraVoHoc(vh, `vo_hoc[${ma}]`, dl, loi)
    }
  }

  // Kiểm tra môn phái
  if (dl.mon_phai) {
    for (const [ma, mp] of Object.entries(dl.mon_phai)) {
      kiemTraMonPhai(mp, `mon_phai[${ma}]`, dl, loi)
    }
  }

  // Kiểm tra tất cả các sự kiện đã nạp
  if (dl.su_kien) {
    for (const [ma, sk] of Object.entries(dl.su_kien)) {
      kiemTraSuKien(sk, `su_kien[${ma}]`, dl, loi)
    }
  }

  return loi
}
