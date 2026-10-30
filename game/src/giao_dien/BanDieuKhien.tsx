import type { Lenh } from '../luat/kieu'

export type MaTab = 'tu_luyen' | 'vo_hoc' | 'nhan_mach' | 'mon_phai'

export interface PropsBanDieuKhien {
  ap: number
  tongAp: number
  nenQuaNam: boolean
  tabMo: MaTab | null
  coMonPhai: boolean
  onChonTab: (ma: MaTab, nut: HTMLButtonElement) => void
  phat: (lenh: Lenh) => void
}

const SO_NGOC_TOI_DA = 4

interface DinhNghiaTab {
  ma: MaTab
  ten: string
  bieuTuong: string
}

/** HS07 I.2: 5 Tab, Tab Môn Phái mở ngay khi gia nhập phái, Tab 5 khóa tới M2-14. */
const CAC_TAB: readonly DinhNghiaTab[] = [
  { ma: 'tu_luyen', ten: 'Tu Luyện', bieuTuong: '⛰' },
  { ma: 'vo_hoc', ten: 'Võ Học', bieuTuong: '⚔' },
  { ma: 'nhan_mach', ten: 'Nhân Mạch', bieuTuong: '⚭' },
  { ma: 'mon_phai', ten: 'Môn Phái', bieuTuong: '⛩' },
]

/** HS07 I.1, HS01 IV: Dock - ngọc AP, nút "+1 Tuổi", 5 Tab. */
export function BanDieuKhien({
  ap,
  tongAp,
  nenQuaNam,
  tabMo,
  coMonPhai,
  onChonTab,
  phat,
}: PropsBanDieuKhien) {
  const soNgoc = Math.max(ap, Math.min(tongAp, SO_NGOC_TOI_DA))

  return (
    <nav className="vk-dock" aria-label="Bàn điều khiển">
      <div className="vk-dock__hanh-dong">
        <ul className="vk-ap" aria-label={`Điểm hành động: còn ${ap} trên ${tongAp}`}>
          {Array.from({ length: soNgoc }, (_, i) => (
            <li key={i} className="vk-ap__ngoc" data-sang={i < ap ? 'true' : undefined} />
          ))}
        </ul>
        <button
          className="vk-nut vk-nut--chinh vk-nut--lon vk-qua-nam"
          type="button"
          data-nhac={nenQuaNam ? 'true' : undefined}
          onClick={() => {
            phat({ loai: 'qua_nam' })
          }}
        >
          +1 Tuổi
        </button>
      </div>
      <ul className="vk-tabs" role="tablist">
        {CAC_TAB.map((tab) => {
          const khoa = tab.ma === 'mon_phai' && !coMonPhai
          return (
            <li key={tab.ma}>
              <button
                className="vk-tab"
                role="tab"
                aria-selected={tabMo === tab.ma}
                aria-disabled={khoa ? 'true' : undefined}
                type="button"
                onClick={(e) => {
                  if (khoa) return
                  onChonTab(tab.ma, e.currentTarget)
                }}
              >
                <span className="vk-tab__bieu-tuong" aria-hidden="true">
                  {tab.bieuTuong}
                </span>
                {tab.ten}
              </button>
            </li>
          )
        })}
        <li>
          <button
            className="vk-tab"
            role="tab"
            aria-selected="false"
            aria-disabled="true"
            type="button"
          >
            <span className="vk-tab__bieu-tuong" aria-hidden="true">
              ☰
            </span>
            Phong Vân
          </button>
        </li>
      </ul>
    </nav>
  )
}
