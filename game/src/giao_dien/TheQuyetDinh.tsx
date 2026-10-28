import { useEffect, useRef } from 'react'
import type { Lenh } from '../luat/kieu'
import type { NhanDoKho } from '../luat/kiem_dinh'
import type { SuKienHienThi } from '../luat/xem'

export interface PropsTheQuyetDinh {
  suKien: SuKienHienThi
  phat: (lenh: Lenh) => void
}

const NHAN_DO_KHO: Record<NhanDoKho, string> = { hiem: 'Hiểm', kho: 'Khó', kha: 'Khá', de: 'Dễ' }

/**
 * M1-05, M1-16: thẻ quyết định sự kiện (thiết kế mục 9).
 * Chỉ hiển thị dữ liệu từ `xemSuKien`; gửi lệnh `chon`.
 */
export function TheQuyetDinh({ suKien, phat }: PropsTheQuyetDinh) {
  const luaChonDauRef = useRef<HTMLButtonElement>(null)

  // Thiết kế mục 10: mở Modal thì đưa focus vào lựa chọn đầu tiên.
  useEffect(() => {
    luaChonDauRef.current?.focus()
  }, [suKien.ma])

  return (
    <div className="vk-phu">
      <section className="vk-modal" role="dialog" aria-modal="true" aria-labelledby="tieu-de-su-kien">
        <h2 className="vk-modal__tieu-de" id="tieu-de-su-kien">
          {suKien.tieu_de}
        </h2>
        <p className="vk-modal__than">{suKien.mo_ta}</p>
        <ul className="vk-modal__lua-chon">
          {suKien.lua_chon.map((lc, idx) => (
            <li key={lc.ma}>
              <button
                ref={idx === 0 ? luaChonDauRef : undefined}
                className={lc.nguy ? 'vk-lua-chon vk-lua-chon--nguy' : 'vk-lua-chon'}
                type="button"
                aria-disabled={lc.bi_khoa ? 'true' : undefined}
                onClick={() => {
                  if (lc.bi_khoa) return
                  phat({ loai: 'chon', ma_lua_chon: lc.ma })
                }}
              >
                <span className="vk-lua-chon__noi-dung">{lc.nhan}</span>
                {lc.bi_khoa && lc.ly_do && (
                  <span className="vk-lua-chon__kiem-dinh">{lc.ly_do}</span>
                )}
                {!lc.bi_khoa && lc.la_tam_hiep && (
                  <span className="vk-lua-chon__kiem-dinh">Giao chiến</span>
                )}
                {!lc.bi_khoa && !lc.la_tam_hiep && lc.do_kho && (
                  <span className="vk-lua-chon__kiem-dinh">
                    {lc.chi_so_hien}{' '}
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
