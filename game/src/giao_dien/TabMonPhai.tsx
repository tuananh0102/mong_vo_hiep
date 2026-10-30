import { useEffect, useRef, useState, type CSSProperties } from 'react'
import type { Lenh } from '../luat/kieu'
import { TEN_TIER, type MonPhaiHienThi } from '../luat/xem'
import { Sheet } from './Sheet'

export interface PropsTabMonPhai {
  duLieu: MonPhaiHienThi
  phat: (lenh: Lenh) => void
  onDong: () => void
}

const ID_TIEU_DE = 'tieu-de-tab-mon-phai'
const ID_XAC_NHAN = 'tieu-de-xac-nhan-roi-phai'

/**
 * M1-17, HS07 I.2 Tab 4: bậc, Cống hiến / mốc bậc kế, Tàng Kinh Các, rời môn phái.
 * Chỉ mở được khi đã gia nhập môn phái (Dock khóa Tab này khi chưa có phái).
 */
export function TabMonPhai({ duLieu, phat, onDong }: PropsTabMonPhai) {
  const [xacNhanRoi, setXacNhanRoi] = useState(false)
  const nutOHaiRef = useRef<HTMLButtonElement>(null)

  // Esc đóng Modal xác nhận (bắt ở pha capture để Sheet bên dưới không đóng luôn)
  useEffect(() => {
    if (!xacNhanRoi) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        setXacNhanRoi(false)
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => {
      window.removeEventListener('keydown', onKey, true)
    }
  }, [xacNhanRoi])

  useEffect(() => {
    if (xacNhanRoi) nutOHaiRef.current?.focus()
  }, [xacNhanRoi])

  if (!duLieu.co_mon_phai) {
    return (
      <Sheet idTieuDe={ID_TIEU_DE} tieuDe="Môn Phái" onDong={onDong}>
        <p className="vk-dong__meta">Chưa gia nhập môn phái nào.</p>
      </Sheet>
    )
  }

  const moc = duLieu.moc_ke

  return (
    <>
      <Sheet idTieuDe={ID_TIEU_DE} tieuDe="Môn Phái" onDong={onDong}>
        <h3 className="vk-tieu-de-muc">
          {duLieu.ten} · {duLieu.ten_bac}
        </h3>
        <div
          className="vk-thanh vk-thanh--tien-do"
          style={{ '--ti-le': `${duLieu.tien_do}%` } as CSSProperties}
        >
          <span className="vk-thanh__nhan">Cống hiến</span>
          <span className="vk-thanh__track" />
          <span className="vk-thanh__gia-tri">
            {duLieu.cong_hien.toLocaleString('vi-VN')}
            {moc ? ` / ${moc.cong_hien.toLocaleString('vi-VN')}` : ''}
          </span>
        </div>
        {moc ? (
          <p className="vk-dong__meta">
            Bậc kế: {moc.ten_bac} · cần {moc.tuoi} tuổi
            {moc.qua_su_kien ? ' và mở qua đại sự kiện Kế Vị' : ' và đủ Cống hiến'}
          </p>
        ) : (
          <p className="vk-dong__meta">Đã ở bậc cao nhất của môn phái.</p>
        )}

        <h3 className="vk-tieu-de-muc">Tàng Kinh Các</h3>
        {duLieu.tang_kinh_cac.length > 0 ? (
          <ul className="vk-danh-sach">
            {duLieu.tang_kinh_cac.map((h) => (
              <li key={h.ma}>
                <div className="vk-dong">
                  <span className="vk-dong__chinh">
                    <span className="vk-dong__tieu-de">
                      {h.ten}{' '}
                      <span className="vk-huy-hieu" data-pham={h.tier}>
                        {TEN_TIER[h.tier]}
                      </span>
                    </span>
                    <span className="vk-dong__meta">Đổi bằng Cống hiến của môn phái.</span>
                  </span>
                  <span className="vk-dong__phu">
                    {!h.bi_khoa && <span className="vk-chi-phi">{h.gia} Cống hiến</span>}
                    <button
                      className="vk-nut"
                      type="button"
                      disabled={h.bi_khoa}
                      onClick={() => {
                        phat({ loai: 'hanh_dong', ma: 'tang_kinh_cac', tham_so: { vo_hoc: h.ma } })
                      }}
                    >
                      {h.bi_khoa ? (h.ly_do ?? 'Thiếu Cống hiến') : 'Đổi'}
                    </button>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="vk-dong__meta">Không còn bí kíp nào để đổi ở bậc này.</p>
        )}

        {duLieu.roi_duoc && (
          <>
            <h3 className="vk-tieu-de-muc">Khác</h3>
            <ul className="vk-danh-sach">
              <li>
                <button
                  className="vk-dong"
                  type="button"
                  onClick={() => {
                    setXacNhanRoi(true)
                  }}
                >
                  <span className="vk-dong__chinh">
                    <span className="vk-dong__tieu-de">Rời môn phái</span>
                    <span className="vk-dong__meta">
                      Cống hiến về 0, mất Danh vọng chức vị, giữ nguyên võ công đã học.
                    </span>
                  </span>
                </button>
              </li>
            </ul>
          </>
        )}
      </Sheet>

      {xacNhanRoi && (
        <div className="vk-phu">
          <section className="vk-modal" role="dialog" aria-modal="true" aria-labelledby={ID_XAC_NHAN}>
            <h2 className="vk-modal__tieu-de" id={ID_XAC_NHAN}>
              Rời môn phái?
            </h2>
            <p className="vk-modal__than">
              Bạn sẽ xuống núi làm Lãng khách. Cống hiến mất hết và Danh vọng chức vị không còn, chỉ võ
              công đã học là ở lại.
            </p>
            <ul className="vk-modal__lua-chon">
              <li>
                <button
                  className="vk-lua-chon vk-lua-chon--nguy"
                  type="button"
                  onClick={() => {
                    phat({ loai: 'hanh_dong', ma: 'roi_mon_phai' })
                    onDong()
                  }}
                >
                  <span className="vk-lua-chon__noi-dung">Xác nhận rời phái</span>
                </button>
              </li>
              <li>
                <button
                  ref={nutOHaiRef}
                  className="vk-lua-chon"
                  type="button"
                  onClick={() => {
                    setXacNhanRoi(false)
                  }}
                >
                  <span className="vk-lua-chon__noi-dung">Ở lại</span>
                </button>
              </li>
            </ul>
          </section>
        </div>
      )}
    </>
  )
}
