import { Fragment, useEffect, useRef } from 'react'
import type { DongBienNien } from '../luat/kieu'

export interface PropsBienNien {
  bienNien: DongBienNien[]
}

export function BienNien({ bienNien }: PropsBienNien) {
  const cuoiRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    cuoiRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [bienNien.length])

  return (
    <main className="vk-bien-nien" aria-live="polite">
      {bienNien.map((dong, idx) => {
        const dongTruoc = bienNien[idx - 1]
        const laNamMoi = idx === 0 || dongTruoc?.tuoi !== dong.tuoi
        const laDauNam = dong.van_ban === `Năm ${dong.tuoi} tuổi.`

        if (laDauNam) {
          return (
            <h2 key={idx} className="vk-bien-nien__nam">
              Năm {dong.tuoi} tuổi
            </h2>
          )
        }

        return (
          <Fragment key={idx}>
            {laNamMoi && (
              <h2 className="vk-bien-nien__nam">Năm {dong.tuoi} tuổi</h2>
            )}
            <p className="vk-bien-nien__muc" data-loai={dong.loai_hien_thi}>
              {dong.van_ban}
            </p>
          </Fragment>
        )
      })}
      <div ref={cuoiRef} />
    </main>
  )
}
