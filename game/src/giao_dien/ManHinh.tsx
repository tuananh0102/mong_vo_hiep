import type { Lenh } from '../luat/kieu'
import type { DuLieuManHinh } from '../luat/xem'
import { BanDieuKhien } from './BanDieuKhien'
import { BangTamHiep } from './BangTamHiep'
import { BienNien } from './BienNien'
import { ThanhTrangThai } from './ThanhTrangThai'
import { TheQuyetDinh } from './TheQuyetDinh'

export interface PropsManHinh {
  duLieu: DuLieuManHinh
  phat: (lenh: Lenh) => void
}

/** HS07 I.1: 4 phân vùng của màn hình chính. */
export function ManHinh({ duLieu, phat }: PropsManHinh) {
  return (
    <div className="vk-man-hinh">
      <ThanhTrangThai duLieu={duLieu} />
      <BienNien bienNien={duLieu.bien_nien} voHoc={duLieu.vo_hoc} />
      <BanDieuKhien
        ap={duLieu.ap}
        tongAp={duLieu.tong_ap}
        nenQuaNam={duLieu.nen_qua_nam}
        phat={phat}
      />
      {duLieu.su_kien && <TheQuyetDinh suKien={duLieu.su_kien} phat={phat} />}
      {duLieu.tam_hiep && <BangTamHiep tran={duLieu.tam_hiep} phat={phat} />}
    </div>
  )
}
