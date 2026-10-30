import type { Lenh } from '../luat/kieu'
import type { DuLieuManHinh } from '../luat/xem'
import { ghiKiepVaoMeta } from './luu_meta'

export interface PropsVanBia {
  duLieu: DuLieuManHinh
  phat: (lenh: Lenh) => void
}

/** M1-18: màn Văn bia (toàn khung, chủ đề Tang, HS07 II). */
export function VanBia({ duLieu, phat }: PropsVanBia) {
  const { van_bia: vb, ket_thuc: kt } = duLieu
  if (!vb || !kt) return null

  const tiepTuc = (): void => {
    ghiKiepVaoMeta(kt.diem_luan_hoi, [kt.ket_cuc, ...kt.danh_hieu_phu])
    phat({ loai: 'tiep_tuc' })
  }

  return (
    <div className="vk-mo-man" data-chu-de="tang">
      <article className="vk-van-bia" aria-label="Văn bia">
        <p className="vk-van-bia__nam">{vb.nam}</p>
        <h1 className="vk-van-bia__ten">{duLieu.ten}</h1>
        <p className="vk-van-bia__ket-cuc">
          {vb.ten_ket_cuc}{' '}
          {vb.pham !== null && (
            <span className="vk-huy-hieu" data-pham={vb.pham}>
              {vb.tier}
            </span>
          )}
        </p>
        {vb.doan.map((d) => (
          <p className="vk-van-bia__minh-van" key={d}>
            {d}
          </p>
        ))}
        <p className="vk-dong__meta">{vb.mo_ta_ket_cuc}</p>
        {vb.danh_hieu_phu.length > 0 && (
          <p className="vk-dong__meta">Danh hiệu phụ: {vb.danh_hieu_phu.join(', ')}</p>
        )}
        <table className="vk-van-bia__diem">
          <tbody>
            {vb.diem.map((x) => (
              <tr key={x.nhan}>
                <td>{x.nhan}</td>
                <td>{x.diem}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>Điểm Luân Hồi</td>
              <td>{vb.tong_diem}</td>
            </tr>
          </tfoot>
        </table>
        <button className="vk-nut vk-nut--chinh vk-nut--khoi" type="button" onClick={tiepTuc}>
          Đầu thai kiếp mới
        </button>
      </article>
    </div>
  )
}
