import { Fragment, useState } from 'react'
import type { Lenh } from '../luat/kieu'
import type { NhanDoKho } from '../luat/kiem_dinh'
import type { HanhDongHienThi, NhomHanhDongHienThi } from '../luat/xem'
import { Sheet } from './Sheet'

export interface PropsTabTuLuyen {
  nhom: NhomHanhDongHienThi[]
  phat: (lenh: Lenh) => void
  onDong: () => void
}

const NHAN_DO_KHO: Record<NhanDoKho, string> = { hiem: 'Hiểm', kho: 'Khó', kha: 'Khá', de: 'Dễ' }
const ID_TIEU_DE = 'tieu-de-tab-tu-luyen'

/**
 * M1-17, HS07 I.2 Tab 1: danh sách việc làm theo độ tuổi.
 * Hành động cần tham số mở danh sách con ngay trong Sheet.
 */
export function TabTuLuyen({ nhom, phat, onDong }: PropsTabTuLuyen) {
  const [dangChon, setDangChon] = useState<string | null>(null)
  const hanhDong = nhom
    .flatMap((g) => g.hanh_dong)
    .find((hd) => hd.ma === dangChon)

  if (hanhDong && hanhDong.tham_so) {
    return (
      <Sheet
        idTieuDe={ID_TIEU_DE}
        tieuDe={hanhDong.ten}
        onDong={onDong}
        onQuayLai={() => {
          setDangChon(null)
        }}
      >
        <h3 className="vk-tieu-de-muc">{hanhDong.nhan_chon}</h3>
        <ul className="vk-danh-sach">
          {hanhDong.tham_so.map((ts) => (
            <li key={ts.ma}>
              <button
                className="vk-dong"
                type="button"
                disabled={ts.bi_khoa}
                onClick={() => {
                  const khoa = hanhDong.khoa_tham_so
                  if (!khoa) return
                  phat({ loai: 'hanh_dong', ma: hanhDong.ma, tham_so: { [khoa]: ts.ma } })
                  onDong()
                }}
              >
                <span className="vk-dong__chinh">
                  <span className="vk-dong__tieu-de">{ts.nhan}</span>
                  <span className="vk-dong__meta">{ts.bi_khoa ? ts.ly_do : ts.phu}</span>
                </span>
                {!ts.bi_khoa && hanhDong.ap > 0 && (
                  <span className="vk-dong__phu">
                    <span className="vk-chi-phi vk-chi-phi--ap">{hanhDong.ap} AP</span>
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </Sheet>
    )
  }

  return (
    <Sheet idTieuDe={ID_TIEU_DE} tieuDe="Tu Luyện & Hành Động" onDong={onDong}>
      {nhom.map((g) => (
        <Fragment key={g.nhom}>
          <h3 className="vk-tieu-de-muc">{g.ten}</h3>
          <ul className="vk-danh-sach">
            {g.hanh_dong.map((hd) => (
              <DongHanhDong
                key={hd.ma}
                hanhDong={hd}
                onChon={() => {
                  if (hd.bi_khoa) return
                  if (hd.tham_so && hd.tham_so.length > 0) {
                    setDangChon(hd.ma)
                    return
                  }
                  phat({ loai: 'hanh_dong', ma: hd.ma })
                  onDong()
                }}
              />
            ))}
          </ul>
        </Fragment>
      ))}
      {nhom.length === 0 && <p className="vk-dong__meta">Năm nay chưa có việc gì làm được.</p>}
    </Sheet>
  )
}

interface PropsDongHanhDong {
  hanhDong: HanhDongHienThi
  onChon: () => void
}

function DongHanhDong({ hanhDong, onChon }: PropsDongHanhDong) {
  return (
    <li>
      <button className="vk-dong" type="button" disabled={hanhDong.bi_khoa} onClick={onChon}>
        <span className="vk-dong__chinh">
          <span className="vk-dong__tieu-de">{hanhDong.ten}</span>
          <span className="vk-dong__meta">{hanhDong.mo_ta}</span>
          {hanhDong.bi_khoa && hanhDong.ly_do && (
            <span className="vk-dong__meta">{hanhDong.ly_do}</span>
          )}
        </span>
        <span className="vk-dong__phu">
          {hanhDong.do_kho && (
            <span className="vk-huy-hieu" data-do-kho={hanhDong.do_kho}>
              {NHAN_DO_KHO[hanhDong.do_kho]}
            </span>
          )}
          {hanhDong.ap > 0 ? (
            <span className="vk-chi-phi vk-chi-phi--ap">{hanhDong.ap} AP</span>
          ) : (
            <span className="vk-chi-phi">0 AP</span>
          )}
        </span>
      </button>
    </li>
  )
}
