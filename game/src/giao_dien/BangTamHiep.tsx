import type { CSSProperties } from 'react'
import type { Lenh } from '../luat/kieu'
import type { NhanDoKho } from '../luat/kiem_dinh'
import type { TranHienThi } from '../luat/tam_hiep/xem_tran'

export interface PropsBangTamHiep {
  tran: TranHienThi
  phat: (lenh: Lenh) => void
}

const NHAN_DO_KHO: Record<NhanDoKho, string> = { hiem: 'Hiểm', kho: 'Khó', kha: 'Khá', de: 'Dễ' }
const NHAN_CHE_DO = { ty_thi: 'Tỷ thí', sinh_tu: 'Sinh tử', tru_vung: 'Trụ vững' } as const
const SO_DONG_NHAT_KY = 4

function Thanh({ loai, nhan, tiLe }: { loai: 'hp' | 'mp'; nhan: string; tiLe: number }) {
  return (
    <div className={`vk-thanh vk-thanh--${loai}`} style={{ '--ti-le': `${tiLe}%` } as CSSProperties}>
      <span className="vk-thanh__nhan">{nhan}</span>
      <span className="vk-thanh__track" />
      <span className="vk-thanh__gia-tri">{tiLe}%</span>
    </div>
  )
}

/** Thẻ quyết định Quyết Đấu Tam Hiệp (HS02 V). Chỉ hiển thị dữ liệu từ `xemTranDau` và gửi lệnh `tam_hiep`. */
export function BangTamHiep({ tran, phat }: PropsBangTamHiep) {
  return (
    <div className="vk-phu">
      <section className="vk-modal" role="dialog" aria-modal="true" aria-labelledby="tieu-de-tam-hiep">
        <h2 className="vk-modal__tieu-de" id="tieu-de-tam-hiep">
          Quyết Đấu Tam Hiệp
        </h2>
        <div className="vk-tam-hiep">
          <div className="vk-tam-hiep__doi-thu">
            <span>{tran.ten_doi_thu}</span>
            <span className="vk-huy-hieu">{NHAN_CHE_DO[tran.che_do]}</span>
          </div>
          <Thanh loai="hp" nhan="HP" tiLe={tran.b.hp_pct} />
          <ol className="vk-hiep" aria-label={`Hiệp ${tran.hiep} trên 3`}>
            {[1, 2, 3].map((i) => (
              <li key={i} className="vk-hiep__o" aria-current={i === tran.hiep ? 'step' : undefined}>
                {i}
              </li>
            ))}
          </ol>
          <Thanh loai="hp" nhan="Bạn" tiLe={tran.a.hp_pct} />
          <Thanh loai="mp" nhan="MP" tiLe={tran.a.mp_pct} />
        </div>
        <div className="vk-modal__than" aria-live="polite">
          {tran.nhat_ky.slice(-SO_DONG_NHAT_KY).map((dong, i) => (
            <p key={`${tran.nhat_ky.length}-${i}`}>{dong}</p>
          ))}
        </div>
        <ul className="vk-modal__lua-chon">
          {tran.lua_chon.map((lc) => (
            <li key={JSON.stringify(lc.buoc)}>
              <button
                className={lc.nguy ? 'vk-lua-chon vk-lua-chon--nguy' : 'vk-lua-chon'}
                type="button"
                onClick={() => {
                  phat({ loai: 'tam_hiep', buoc: lc.buoc })
                }}
              >
                <span className="vk-lua-chon__noi-dung">{lc.nhan}</span>
                {lc.do_kho && (
                  <span className="vk-lua-chon__kiem-dinh">
                    {lc.chi_so}{' '}
                    <span className="vk-huy-hieu" data-do-kho={lc.do_kho}>
                      {NHAN_DO_KHO[lc.do_kho]}
                    </span>
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
