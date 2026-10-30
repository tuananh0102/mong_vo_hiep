import type { NguoiHienThi } from '../luat/xem'
import { Sheet } from './Sheet'

export interface PropsTabNhanMach {
  nguoi: NguoiHienThi[]
  onDong: () => void
}

const ID_TIEU_DE = 'tieu-de-tab-nhan-mach'

/**
 * M1-17, HS07 I.2 Tab 3: sư phụ và nhân vật đã gặp qua sự kiện.
 * Hồng nhan, huynh đệ, cừu gia và Gia phả thuộc M2-03 / M3-08.
 */
export function TabNhanMach({ nguoi, onDong }: PropsTabNhanMach) {
  return (
    <Sheet idTieuDe={ID_TIEU_DE} tieuDe="Nhân Mạch" onDong={onDong}>
      {nguoi.length > 0 ? (
        <ul className="vk-danh-sach">
          {nguoi.map((n) => (
            <li key={n.ma}>
              <div className="vk-dong">
                <span className="vk-dong__chinh">
                  <span className="vk-dong__tieu-de">{n.ten}</span>
                  <span className="vk-dong__meta">{n.mo_ta}</span>
                </span>
                <span className="vk-dong__phu">{n.vai_tro}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="vk-dong__meta">Chưa gặp ai trên giang hồ.</p>
      )}
    </Sheet>
  )
}
