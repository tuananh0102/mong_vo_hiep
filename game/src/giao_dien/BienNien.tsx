import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import type { DongBienNien } from '../luat/kieu'
import { TEN_TIER, type VoHocHienThi } from '../luat/xem'

export interface PropsBienNien {
  bienNien: DongBienNien[]
  voHoc: VoHocHienThi[]
}

interface DoanVan {
  chu: string
  voHoc: VoHocHienThi | null
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Tách một dòng Biên Niên Sử thành các đoạn chữ và tên võ học đã học (HS07 I.1: tên chạm được). */
function chiaDoan(vanBan: string, tuDien: Map<string, VoHocHienThi>): DoanVan[] {
  if (tuDien.size === 0) return [{ chu: vanBan, voHoc: null }]
  const tenDai = [...tuDien.keys()].sort((a, b) => b.length - a.length).map(escapeRegex)
  const re = new RegExp(`(${tenDai.join('|')})`, 'g')

  return vanBan
    .split(re)
    .filter((p) => p !== '')
    .map((p) => ({ chu: p, voHoc: tuDien.get(p) ?? null }))
}

/** M1-16: cuộn giấy Biên Niên Sử, tự cuộn tới dòng mới, tên võ học mở `.vk-popover`. */
export function BienNien({ bienNien, voHoc }: PropsBienNien) {
  const cuoiRef = useRef<HTMLDivElement>(null)
  // `soDong` giữ số dòng lúc mở: có dòng mới thì thẻ xem nhanh tự đóng
  const [dangMo, setDangMo] = useState<{ ma: string; dong: number; soDong: number } | null>(null)

  const tuDienTen = useMemo(() => new Map(voHoc.map((vh) => [vh.ten, vh])), [voHoc])
  const tuDienMa = useMemo(() => new Map(voHoc.map((vh) => [vh.ma, vh])), [voHoc])

  useEffect(() => {
    const giamChuyenDong =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    cuoiRef.current?.scrollIntoView({ behavior: giamChuyenDong ? 'auto' : 'smooth' })
  }, [bienNien.length])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDangMo(null)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <main className="vk-bien-nien" aria-live="polite">
      {bienNien.map((dong, idx) => {
        const dongTruoc = bienNien[idx - 1]
        const laNamMoi = idx === 0 || dongTruoc?.tuoi !== dong.tuoi
        const laDauNam = dong.van_ban === `Năm ${dong.tuoi} tuổi.`
        const dangMoVh =
          dangMo !== null && dangMo.dong === idx && dangMo.soDong === bienNien.length
            ? (tuDienMa.get(dangMo.ma) ?? null)
            : null

        if (laDauNam) {
          return (
            <h2 key={idx} className="vk-bien-nien__nam">
              Năm {dong.tuoi} tuổi
            </h2>
          )
        }

        return (
          <Fragment key={idx}>
            {laNamMoi && <h2 className="vk-bien-nien__nam">Năm {dong.tuoi} tuổi</h2>}
            <div className="vk-bien-nien__muc" data-loai={dong.loai_hien_thi}>
              {chiaDoan(dong.van_ban, tuDienTen).map((doan, i) =>
                doan.voHoc === null ? (
                  <Fragment key={i}>{doan.chu}</Fragment>
                ) : (
                  <button
                    key={i}
                    className="vk-lien-ket"
                    type="button"
                    aria-expanded={dangMoVh?.ma === doan.voHoc.ma}
                    onClick={() => {
                      setDangMo((cu) =>
                        cu !== null && cu.dong === idx && cu.ma === doan.voHoc?.ma
                          ? null
                          : { ma: doan.voHoc?.ma ?? '', dong: idx, soDong: bienNien.length },
                      )
                    }}
                  >
                    {doan.chu}
                  </button>
                ),
              )}
              {dangMoVh && (
                <div className="vk-popover" role="dialog" aria-label={dangMoVh.ten}>
                  <div className="vk-popover__tieu-de">
                    {dangMoVh.ten}
                    <span className="vk-huy-hieu" data-pham={dangMoVh.tier}>
                      {TEN_TIER[dangMoVh.tier]}
                    </span>
                  </div>
                  <p>
                    Cấp {dangMoVh.cap}/{dangMoVh.tran_cap}
                  </p>
                  <p>{dangMoVh.mo_ta}</p>
                </div>
              )}
            </div>
          </Fragment>
        )
      })}
      <div ref={cuoiRef} />
    </main>
  )
}
