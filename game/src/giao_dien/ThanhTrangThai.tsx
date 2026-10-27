import type { CSSProperties } from 'react'
import type { DuLieuManHinh } from '../luat/xem'

export interface PropsThanhTrangThai {
  duLieu: DuLieuManHinh
}

export function ThanhTrangThai({ duLieu }: PropsThanhTrangThai) {
  const hpTiLe = Math.min(100, Math.max(0, Math.round((duLieu.hp / Math.max(duLieu.hp, 100)) * 100)))
  const mpTiLe = Math.min(100, Math.max(0, Math.round((duLieu.noi_tuc / Math.max(duLieu.noi_tuc, 50)) * 100)))

  return (
    <header className="vk-header">
      <div className="vk-header__hang">
        <div>
          <button className="vk-header__ten" type="button">
            {duLieu.ten}
          </button>
          <div className="vk-header__danh-hieu">Thiếu Hiệp</div>
        </div>
        <span className="vk-header__tuoi">{duLieu.tuoi} tuổi</span>
      </div>
      <div className="vk-header__meta">
        <button className="vk-header__vung" type="button">
          {duLieu.vung}
        </button>
        <span>Vô môn vô phái</span>
        <span className="vk-tien vk-so">{duLieu.ngan_luong.toLocaleString('vi-VN')} lạng</span>
      </div>
      <div className="vk-header__chi-so">
        <div
          className="vk-thanh vk-thanh--hp"
          style={{ '--ti-le': `${hpTiLe}%` } as CSSProperties}
        >
          <span className="vk-thanh__nhan">HP</span>
          <span className="vk-thanh__track" />
          <span className="vk-thanh__gia-tri">{duLieu.hp}</span>
        </div>
        <div
          className="vk-thanh vk-thanh--mp"
          style={{ '--ti-le': `${mpTiLe}%` } as CSSProperties}
        >
          <span className="vk-thanh__nhan">MP</span>
          <span className="vk-thanh__track" />
          <span className="vk-thanh__gia-tri">{duLieu.noi_tuc}</span>
        </div>
      </div>
    </header>
  )
}
