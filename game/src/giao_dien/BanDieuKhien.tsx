import type { Lenh } from '../luat/kieu'

export interface PropsBanDieuKhien {
  ap: number
  tongAp: number
  nenQuaNam: boolean
  phat: (lenh: Lenh) => void
}

const SO_NGOC_TOI_DA = 4

/** HS07 I.1, HS01 IV: Dock - ngọc AP, nút "+1 Tuổi", 5 Tab (Tab 5 khóa tới M2-14). */
export function BanDieuKhien({ ap, tongAp, nenQuaNam, phat }: PropsBanDieuKhien) {
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
        <li>
          <button className="vk-tab" role="tab" aria-selected="false" type="button">
            <span className="vk-tab__bieu-tuong" aria-hidden="true">⛰</span>
            Tu Luyện
          </button>
        </li>
        <li>
          <button className="vk-tab" role="tab" aria-selected="false" type="button">
            <span className="vk-tab__bieu-tuong" aria-hidden="true">⚔</span>
            Võ Học
          </button>
        </li>
        <li>
          <button className="vk-tab" role="tab" aria-selected="false" type="button">
            <span className="vk-tab__bieu-tuong" aria-hidden="true">⚭</span>
            Nhân Mạch
          </button>
        </li>
        <li>
          <button className="vk-tab" role="tab" aria-selected="false" type="button">
            <span className="vk-tab__bieu-tuong" aria-hidden="true">⛩</span>
            Môn Phái
          </button>
        </li>
        <li>
          <button
            className="vk-tab"
            role="tab"
            aria-selected="false"
            aria-disabled="true"
            type="button"
          >
            <span className="vk-tab__bieu-tuong" aria-hidden="true">☰</span>
            Phong Vân
          </button>
        </li>
      </ul>
    </nav>
  )
}
