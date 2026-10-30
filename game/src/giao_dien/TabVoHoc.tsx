import { Fragment, useState } from 'react'
import type { Lenh } from '../luat/kieu'
import { TEN_TIER, type DuLieuTabVoHoc, type TruCot } from '../luat/xem'
import { Sheet } from './Sheet'

export interface PropsTabVoHoc {
  duLieu: DuLieuTabVoHoc
  phat: (lenh: Lenh) => void
  onDong: () => void
}

const ID_TIEU_DE = 'tieu-de-tab-vo-hoc'

/**
 * M1-17, HS07 I.2 Tab 2: 4 trụ cột võ học (số ô thật), đan dược trong hành trang, chợ.
 * Chạm ô để đổi môn (lệnh `trang_bi`), đan dược dùng bằng lệnh `dung_vat_pham`, chợ bằng `mua`.
 */
export function TabVoHoc({ duLieu, phat, onDong }: PropsTabVoHoc) {
  const [truCotMo, setTruCotMo] = useState<TruCot | null>(null)
  const truCot = truCotMo ? duLieu.tru_cot.find((tc) => tc.tru_cot === truCotMo) : undefined

  if (truCot) {
    return (
      <Sheet
        idTieuDe={ID_TIEU_DE}
        tieuDe={truCot.ten}
        onDong={onDong}
        onQuayLai={() => {
          setTruCotMo(null)
        }}
      >
        {truCot.thao_duoc && (
          <ul className="vk-danh-sach">
            <li>
              <button
                className="vk-dong"
                type="button"
                onClick={() => {
                  phat({ loai: 'trang_bi', o: truCot.tru_cot, ma: null })
                }}
              >
                <span className="vk-dong__chinh">
                  <span className="vk-dong__tieu-de">Tháo môn đang dùng</span>
                  <span className="vk-dong__meta">Trả ô trống, vẫn giữ cấp võ học đã luyện.</span>
                </span>
              </button>
            </li>
          </ul>
        )}

        <h3 className="vk-tieu-de-muc">{truCot.ten} đã học</h3>
        {truCot.lua_chon.length > 0 ? (
          <ul className="vk-danh-sach">
            {truCot.lua_chon.map((lc) => (
              <li key={lc.ma}>
                <button
                  className="vk-dong"
                  type="button"
                  disabled={lc.bi_khoa && !lc.dang_dung}
                  onClick={() => {
                    phat({ loai: 'trang_bi', o: truCot.tru_cot, ma: lc.ma })
                  }}
                >
                  <span className="vk-dong__chinh">
                    <span className="vk-dong__tieu-de">{lc.ten}</span>
                    <span className="vk-dong__meta">
                      {lc.bi_khoa && !lc.dang_dung ? lc.ly_do : lc.chi_tiet}
                    </span>
                  </span>
                  <span className="vk-dong__phu">
                    {lc.dang_dung ? (
                      <span className="vk-huy-hieu">Đang dùng</span>
                    ) : (
                      <span className="vk-huy-hieu" data-pham={lc.tier}>
                        {TEN_TIER[lc.tier]}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="vk-dong__meta">Chưa học môn nào thuộc trụ cột này.</p>
        )}
      </Sheet>
    )
  }

  return (
    <Sheet idTieuDe={ID_TIEU_DE} tieuDe="Võ Học & Hành Trang" onDong={onDong}>
      <h3 className="vk-tieu-de-muc">Ô võ học</h3>
      <div className="vk-o-luoi">
        {duLieu.tru_cot.map((tc) => (
          <Fragment key={tc.tru_cot}>
            {tc.o.map((o) => (
              <button
                key={`${tc.tru_cot}-${o.vi_tri}`}
                className="vk-o"
                type="button"
                data-trong={o.trong ? 'true' : undefined}
                onClick={() => {
                  setTruCotMo(tc.tru_cot)
                }}
              >
                <span className="vk-o__loai">{tc.ten}</span>
                <span className="vk-o__ten">{o.ten}</span>
                {o.tier !== null && o.chi_tiet && (
                  <span className="vk-huy-hieu" data-pham={o.tier}>
                    {o.chi_tiet}
                  </span>
                )}
              </button>
            ))}
          </Fragment>
        ))}
      </div>

      <h3 className="vk-tieu-de-muc">Đan dược</h3>
      {duLieu.hanh_trang.length > 0 ? (
        <ul className="vk-danh-sach">
          {duLieu.hanh_trang.map((vp) => (
            <li key={vp.ma}>
              <div className="vk-dong">
                <span className="vk-dong__chinh">
                  <span className="vk-dong__tieu-de">{vp.ten}</span>
                  <span className="vk-dong__meta">
                    {vp.dung_duoc ? vp.mo_ta : vp.ly_do}
                  </span>
                </span>
                <span className="vk-dong__phu">
                  ×{vp.so_luong}
                  <button
                    className="vk-nut"
                    type="button"
                    disabled={!vp.dung_duoc}
                    onClick={() => {
                      phat({ loai: 'dung_vat_pham', ma: vp.ma })
                    }}
                  >
                    Dùng
                  </button>
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="vk-dong__meta">Hành trang chưa có đan dược.</p>
      )}

      <h3 className="vk-tieu-de-muc">Chợ</h3>
      {duLieu.cho.map((vp) => (
        <article className="vk-uu-dai" key={vp.ma}>
          <div className="vk-uu-dai__dau">
            <h4 className="vk-uu-dai__ten">{vp.ten}</h4>
            <span className="vk-chi-phi">{vp.gia.toLocaleString('vi-VN')} lạng</span>
          </div>
          <p className="vk-uu-dai__mo-ta">{vp.mo_ta}</p>
          <button
            className="vk-nut vk-nut--chinh"
            type="button"
            disabled={!vp.mua_duoc}
            onClick={() => {
              phat({ loai: 'mua', ma: vp.ma, so_luong: 1 })
            }}
          >
            {vp.mua_duoc ? 'Mua' : vp.ly_do}
          </button>
        </article>
      ))}
      {duLieu.cho.length === 0 && <p className="vk-dong__meta">Chợ hôm nay không bán gì.</p>}
    </Sheet>
  )
}
