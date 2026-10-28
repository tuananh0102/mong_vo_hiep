import type { Lenh } from '../luat/kieu'
import type { DuLieuManHinh } from '../luat/xem'

export interface PropsChonThienPhu {
  duLieu: DuLieuManHinh
  phat: (lenh: Lenh) => void
}

/** M1-06, M1-16: màn chọn 1 trong 3 Thiên phú bẩm sinh (`.vk-nhan[data-pham]`). */
export function ChonThienPhu({ duLieu, phat }: PropsChonThienPhu) {
  return (
    <div className="vk-mo-man">
      <h1 className="vk-mo-man__tieu-de">Thiên phú bẩm sinh</h1>
      <p className="vk-mo-man__than">Bạn chào đời đã mang sẵn một tư chất. Chọn lấy một.</p>

      <ul className="vk-danh-sach">
        {duLieu.thien_phu_chon.map((tp) => (
          <li key={tp.ma}>
            <button
              className="vk-dong"
              type="button"
              onClick={() => {
                phat({ loai: 'chon_thien_phu', ma: tp.ma })
              }}
            >
              <span className="vk-dong__chinh">
                <span className="vk-dong__tieu-de">
                  <span className="vk-nhan" data-pham={tp.do_hiem}>
                    {tp.ten}
                  </span>
                </span>
                <span className="vk-dong__meta">{tp.mo_ta}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
