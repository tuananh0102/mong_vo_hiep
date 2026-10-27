import type { Lenh } from '../luat/kieu'
import type { DuLieuManHinh } from '../luat/xem'
import { BanDieuKhien } from './BanDieuKhien'
import { BienNien } from './BienNien'
import { ThanhTrangThai } from './ThanhTrangThai'

export interface PropsManHinh {
  duLieu: DuLieuManHinh
  phat: (lenh: Lenh) => void
}

export function ManHinh({ duLieu, phat }: PropsManHinh) {
  return (
    <div className="vk-man-hinh">
      <ThanhTrangThai duLieu={duLieu} />
      <BienNien bienNien={duLieu.bien_nien} />
      <BanDieuKhien ap={duLieu.ap} phat={phat} />
    </div>
  )
}
