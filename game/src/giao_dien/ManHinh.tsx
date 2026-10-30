import { useRef, useState } from 'react'
import type { Lenh } from '../luat/kieu'
import type { DuLieuManHinh, DuLieuTab } from '../luat/xem'
import { BanDieuKhien, type MaTab } from './BanDieuKhien'
import { BangTamHiep } from './BangTamHiep'
import { BienNien } from './BienNien'
import { SheetBatTu } from './SheetBatTu'
import { TabMonPhai } from './TabMonPhai'
import { TabNhanMach } from './TabNhanMach'
import { TabTuLuyen } from './TabTuLuyen'
import { TabVoHoc } from './TabVoHoc'
import { ThanhTrangThai } from './ThanhTrangThai'
import { TheQuyetDinh } from './TheQuyetDinh'

export interface PropsManHinh {
  duLieu: DuLieuManHinh
  xemTab: DuLieuTab
  phat: (lenh: Lenh) => void
}

/** HS07 I.1: 4 phân vùng của màn hình chính, cộng các Sheet Tab và Bát Tự (M1-17). */
export function ManHinh({ duLieu, xemTab, phat }: PropsManHinh) {
  const [tabMo, setTabMo] = useState<MaTab | null>(null)
  const [batTuMo, setBatTuMo] = useState(false)
  // Nút đã mở Sheet: đóng thì trả focus về đúng chỗ cũ (thiết kế mục 10)
  const nutTabRef = useRef<HTMLButtonElement | null>(null)
  const nutTenRef = useRef<HTMLButtonElement | null>(null)

  const dongTab = () => {
    nutTabRef.current?.focus()
    setTabMo(null)
  }

  const dongBatTu = () => {
    nutTenRef.current?.focus()
    setBatTuMo(false)
  }

  return (
    <div className="vk-man-hinh">
      <ThanhTrangThai
        duLieu={duLieu}
        nutTenRef={nutTenRef}
        onMoBatTu={() => {
          setTabMo(null)
          setBatTuMo(true)
        }}
      />
      <BienNien bienNien={duLieu.bien_nien} voHoc={duLieu.vo_hoc} />
      <BanDieuKhien
        ap={duLieu.ap}
        tongAp={duLieu.tong_ap}
        nenQuaNam={duLieu.nen_qua_nam}
        tabMo={tabMo}
        coMonPhai={duLieu.co_mon_phai}
        onChonTab={(ma, nut) => {
          nutTabRef.current = nut
          setBatTuMo(false)
          setTabMo(ma)
        }}
        phat={phat}
      />
      {duLieu.su_kien && <TheQuyetDinh suKien={duLieu.su_kien} phat={phat} />}
      {duLieu.tam_hiep && <BangTamHiep tran={duLieu.tam_hiep} phat={phat} />}

      {tabMo === 'tu_luyen' && (
        <TabTuLuyen nhom={xemTab.tu_luyen} phat={phat} onDong={dongTab} />
      )}
      {tabMo === 'vo_hoc' && <TabVoHoc duLieu={xemTab.vo_hoc} phat={phat} onDong={dongTab} />}
      {tabMo === 'nhan_mach' && <TabNhanMach nguoi={xemTab.nhan_mach} onDong={dongTab} />}
      {tabMo === 'mon_phai' && (
        <TabMonPhai duLieu={xemTab.mon_phai} phat={phat} onDong={dongTab} />
      )}
      {batTuMo && <SheetBatTu duLieu={xemTab.bat_tu} onDong={dongBatTu} />}
    </div>
  )
}
