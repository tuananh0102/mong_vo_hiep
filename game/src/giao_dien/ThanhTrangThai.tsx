import { useEffect, useState, type CSSProperties, type RefObject } from 'react'
import type { DuLieuManHinh } from '../luat/xem'

export interface PropsThanhTrangThai {
  duLieu: DuLieuManHinh
  nutTenRef: RefObject<HTMLButtonElement | null>
  onMoBatTu: () => void
}

/** HS07 I.1: Header - tên, danh hiệu, tuổi, vùng, môn phái, HP / Nội tức, ngân lượng. */
function tiLe(giaTri: number, toiDa: number): number {
  if (toiDa <= 0) return 0
  return Math.min(100, Math.max(0, Math.round((giaTri / toiDa) * 100)))
}

export function ThanhTrangThai({ duLieu, nutTenRef, onMoBatTu }: PropsThanhTrangThai) {
  // M1-16: chạm vùng tạm mở Popover tên vùng; bản đồ Thần Châu ở M3-01
  const [moVung, setMoVung] = useState(false)

  useEffect(() => {
    if (!moVung) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMoVung(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
    }
  }, [moVung])

  return (
    <header className="vk-header">
      <div className="vk-header__hang">
        <div>
          {/* M1-17: chạm tên mở Sheet Bát Tự */}
          <button
            ref={nutTenRef}
            className="vk-header__ten"
            type="button"
            aria-haspopup="dialog"
            onClick={onMoBatTu}
          >
            {duLieu.ten}
          </button>
          <div className="vk-header__danh-hieu">{duLieu.danh_hieu}</div>
        </div>
        <span className="vk-header__tuoi">
          {duLieu.tuoi} tuổi
          <span className="vk-header__tuoi-tho">{duLieu.tuoi_tho}</span>
        </span>
      </div>
      <div className="vk-header__meta">
        <button
          className="vk-header__vung"
          type="button"
          aria-expanded={moVung}
          onClick={() => {
            setMoVung((cu) => !cu)
          }}
        >
          {duLieu.vung}
        </button>
        <span>{duLieu.mon_phai}</span>
        <span className="vk-tien vk-so">{duLieu.ngan_luong.toLocaleString('vi-VN')} lạng</span>
      </div>
      <div className="vk-header__chi-so">
        <div
          className="vk-thanh vk-thanh--hp"
          style={{ '--ti-le': `${tiLe(duLieu.hp, duLieu.hp_max)}%` } as CSSProperties}
        >
          <span className="vk-thanh__nhan">HP</span>
          <span className="vk-thanh__track" />
          <span className="vk-thanh__gia-tri">{duLieu.hp}</span>
        </div>
        <div
          className="vk-thanh vk-thanh--mp"
          style={{ '--ti-le': `${tiLe(duLieu.noi_tuc, duLieu.noi_tuc_max)}%` } as CSSProperties}
        >
          <span className="vk-thanh__nhan">MP</span>
          <span className="vk-thanh__track" />
          <span className="vk-thanh__gia-tri">{duLieu.noi_tuc}</span>
        </div>
      </div>
      {moVung && (
        <div className="vk-popover" role="dialog" aria-label={duLieu.vung}>
          <div className="vk-popover__tieu-de">{duLieu.vung}</div>
          <p>Vùng đang đứng.</p>
        </div>
      )}
    </header>
  )
}
