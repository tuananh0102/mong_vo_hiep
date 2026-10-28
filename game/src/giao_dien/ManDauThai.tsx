import { useState } from 'react'
import type { Lenh } from '../luat/kieu'

export interface PropsManDauThai {
  phat: (lenh: Lenh) => void
}

/** M1-16: màn Đầu thai (toàn khung, thiết kế mục 6.2) - chọn giới tính, tên, rồi tạo kiếp. */
export function ManDauThai({ phat }: PropsManDauThai) {
  const [gioiTinh, setGioiTinh] = useState<'nam' | 'nu'>('nam')
  const [ten, setTen] = useState('')

  return (
    <div className="vk-mo-man">
      <h1 className="vk-mo-man__tieu-de">Vạn Kiếp Giang Hồ</h1>
      <p className="vk-mo-man__than">
        Một kiếp người giữa chốn giang hồ. Chọn thân phận rồi bước vào đời.
      </p>

      <ul className="vk-mo-man__lua-chon" aria-label="Giới tính">
        <li>
          <button
            className="vk-lua-chon"
            type="button"
            aria-pressed={gioiTinh === 'nam'}
            onClick={() => {
              setGioiTinh('nam')
            }}
          >
            <span className="vk-lua-chon__noi-dung">Nam tử</span>
          </button>
        </li>
        <li>
          <button
            className="vk-lua-chon"
            type="button"
            aria-pressed={gioiTinh === 'nu'}
            onClick={() => {
              setGioiTinh('nu')
            }}
          >
            <span className="vk-lua-chon__noi-dung">Nữ tử</span>
          </button>
        </li>
      </ul>

      <label className="vk-truong">
        <span className="vk-truong__nhan">Tên (để trống thì trời định)</span>
        <input
          className="vk-truong__o"
          name="ten"
          type="text"
          maxLength={20}
          autoComplete="off"
          value={ten}
          onChange={(e) => {
            setTen(e.target.value)
          }}
        />
      </label>

      <button
        className="vk-nut vk-nut--chinh vk-nut--lon vk-nut--khoi"
        type="button"
        onClick={() => {
          phat({ loai: 'tao_kiep', seed: Date.now(), gioi_tinh: gioiTinh, ten, uu_dai: [] })
        }}
      >
        Đầu thai
      </button>
    </div>
  )
}
