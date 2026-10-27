import type { Lenh } from '../luat/kieu'

export interface PropsBanDieuKhien {
  ap: number
  phat: (lenh: Lenh) => void
}

export function BanDieuKhien({ ap, phat }: PropsBanDieuKhien) {
  return (
    <nav className="vk-dock" aria-label="Bàn điều khiển">
      <div className="vk-dock__hanh-dong">
        <ul className="vk-ap" aria-label={`Điểm hành động: còn ${ap} trên 4`}>
          <li className="vk-ap__ngoc" data-sang={ap >= 1 ? 'true' : undefined} />
          <li className="vk-ap__ngoc" data-sang={ap >= 2 ? 'true' : undefined} />
          <li className="vk-ap__ngoc" data-sang={ap >= 3 ? 'true' : undefined} />
          <li className="vk-ap__ngoc" data-sang={ap >= 4 ? 'true' : undefined} />
        </ul>
        <button
          className="vk-nut vk-nut--chinh vk-nut--lon vk-qua-nam"
          type="button"
          data-nhac={ap === 0 ? 'true' : undefined}
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
          <button className="vk-tab" role="tab" aria-selected="false" type="button">
            <span className="vk-tab__bieu-tuong" aria-hidden="true">☰</span>
            Phong Vân
          </button>
        </li>
      </ul>
    </nav>
  )
}
