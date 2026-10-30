import { Fragment } from 'react'
import type { BatTuHienThi } from '../luat/xem'
import { Sheet } from './Sheet'

export interface PropsSheetBatTu {
  duLieu: BatTuHienThi
  onDong: () => void
}

const ID_TIEU_DE = 'tieu-de-bat-tu'

/**
 * M1-17, HS07 I.1: Sheet Bát Tự & Thiên Phú mở từ tên ở Header.
 * Mọi chỉ số `hien_thi = "hien"`; Phúc duyên chỉ hiện mô tả (G02); Thiên phú / Trạng thái / Nhãn là `.vk-nhan`.
 */
export function SheetBatTu({ duLieu, onDong }: PropsSheetBatTu) {
  return (
    <Sheet idTieuDe={ID_TIEU_DE} tieuDe="Bát Tự & Thiên Phú" onDong={onDong}>
      <h3 className="vk-tieu-de-muc">{duLieu.ten}</h3>
      <p className="vk-dong__meta">
        {duLieu.gioi_tinh} · {duLieu.tuoi} tuổi · {duLieu.danh_hieu}
      </p>
      <p className="vk-dong__meta">{duLieu.gia_canh}</p>
      <p className="vk-dong__meta">
        {duLieu.vung} · {duLieu.mon_phai}
      </p>
      <p className="vk-dong__meta">Phúc duyên: {duLieu.phuc_duyen}</p>

      {duLieu.nhom.map((g) => (
        <Fragment key={g.nhom}>
          <h3 className="vk-tieu-de-muc">{g.ten}</h3>
          <table className="vk-bang">
            <tbody>
              {g.chi_so.map((cs) => (
                <tr key={cs.ma}>
                  <td>{cs.ten}</td>
                  <td className="so">{cs.gia_tri}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Fragment>
      ))}

      <h3 className="vk-tieu-de-muc">Thiên phú</h3>
      <p>
        {duLieu.thien_phu.length > 0 ? (
          duLieu.thien_phu.map((tp) => (
            <Fragment key={tp.ma}>
              <span className="vk-nhan" data-pham={tp.do_hiem}>
                {tp.ten}
              </span>{' '}
            </Fragment>
          ))
        ) : (
          <span className="vk-dong__meta">Chưa có</span>
        )}
      </p>

      <h3 className="vk-tieu-de-muc">Trạng thái</h3>
      <p>
        {duLieu.trang_thai.length > 0 ? (
          duLieu.trang_thai.map((tt) => (
            <Fragment key={tt.ma}>
              <span className="vk-nhan">{tt.ten}</span>{' '}
            </Fragment>
          ))
        ) : (
          <span className="vk-dong__meta">Không có</span>
        )}
      </p>

      <h3 className="vk-tieu-de-muc">Nhãn tính cách</h3>
      <p>
        {duLieu.nhan.length > 0 ? (
          duLieu.nhan.map((n) => (
            <Fragment key={n.ma}>
              <span className="vk-nhan">{n.ten}</span>{' '}
            </Fragment>
          ))
        ) : (
          <span className="vk-dong__meta">Chưa có</span>
        )}
      </p>
    </Sheet>
  )
}
