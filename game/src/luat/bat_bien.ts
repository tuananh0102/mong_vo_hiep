// 01 mục 10.4: Kiểm tra bất biến trạng thái game (sau mỗi lệnh ở môi trường test / dev).
import type { DuLieu } from '../du_lieu/luoc_do'
import type { TrangThaiGame } from './kieu'

export function kiemTraBatBien(d: TrangThaiGame, dl?: DuLieu): string[] {
  const viPham: string[] = []
  const nv = d.nhan_vat

  // 1. Mọi chỉ số thiên phú trong thang, trần cứng 150 (HS01 II.8)
  if (nv.can_cot < 0 || nv.can_cot > 150) {
    viPham.push(`can_cot = ${nv.can_cot} ngoài khoảng [0, 150]`)
  }
  if (nv.can_cot_dinh < 0 || nv.can_cot_dinh > 150) {
    viPham.push(`can_cot_dinh = ${nv.can_cot_dinh} ngoài khoảng [0, 150]`)
  }
  if (nv.ngo_tinh < 0 || nv.ngo_tinh > 150) {
    viPham.push(`ngo_tinh = ${nv.ngo_tinh} ngoài khoảng [0, 150]`)
  }
  if (nv.phuc_duyen < 0 || nv.phuc_duyen > 150) {
    viPham.push(`phuc_duyen = ${nv.phuc_duyen} ngoài khoảng [0, 150]`)
  }
  if (nv.mi_luc < 0 || nv.mi_luc > 150) {
    viPham.push(`mi_luc = ${nv.mi_luc} ngoài khoảng [0, 150]`)
  }

  // 2. Tiền bạc và Nợ
  if (nv.ngan_luong < 0) {
    viPham.push(`ngan_luong = ${nv.ngan_luong} < 0`)
  }
  for (const [chuNo, kn] of Object.entries(nv.no)) {
    if (kn.goc < 0) {
      viPham.push(`nợ ${chuNo} có gốc = ${kn.goc} < 0`)
    }
  }

  // 3. Sinh tồn: 0 <= hp, 0 <= noi_tuc
  if (nv.hp < 0) {
    viPham.push(`hp = ${nv.hp} < 0`)
  }
  if (nv.noi_tuc < 0) {
    viPham.push(`noi_tuc = ${nv.noi_tuc} < 0`)
  }

  // 4. Cấp võ học trong [1, 10]
  for (const [ma, vh] of Object.entries(nv.vo_hoc)) {
    if (vh.cap < 1 || vh.cap > 10) {
      viPham.push(`võ học ${ma} có cấp = ${vh.cap} ngoài khoảng [1, 10]`)
    }
    if (vh.hoan_thien > 100 || vh.hoan_thien < 0) {
      viPham.push(`võ học ${ma} có độ hoàn thiện = ${vh.hoan_thien} ngoài [0, 100]`)
    }
  }

  // 5. AP còn lại >= 0
  if (nv.ap_con_lai < 0) {
    viPham.push(`ap_con_lai = ${nv.ap_con_lai} < 0`)
  }

  // 6. ket_thuc !== null thì cho phải là màn chuyển giai đoạn
  if (d.ket_thuc !== null && d.cho?.loai !== 'chuyen_giai_doan') {
    viPham.push('nhân vật đã kết thúc nhưng cho không phải là chuyen_giai_doan')
  }

  // 7. cho.loai = su_kien thì sự kiện phải tồn tại trong dữ liệu
  if (d.cho?.loai === 'su_kien') {
    if (dl?.su_kien && Object.keys(dl.su_kien).length > 0 && !dl.su_kien[d.cho.ma]) {
      viPham.push(`quyết định chờ sự kiện "${d.cho.ma}" nhưng không tồn tại trong dữ liệu`)
    }
  }

  return viPham
}
