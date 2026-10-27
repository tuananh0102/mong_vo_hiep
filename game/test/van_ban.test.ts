import { describe, expect, it } from 'vitest'
import { napTuDia } from '../src/du_lieu/nap_node'
import { taoTrangThaiRong } from '../src/luat/chi_so'
import { bienTrongMau, dienMau } from '../src/luat/van_ban'

const dl = napTuDia()

describe('van_ban', () => {
  it('bienTrongMau trích xuất đúng danh sách biến', () => {
    const mau = 'Ngày bạn {tuoi} tuổi, {cha_me} gặp {vai:truong_lao} và chào {gt:sư huynh|sư tỷ}.'
    const cacBien = bienTrongMau(mau)
    expect(cacBien).toEqual(['tuoi', 'cha_me', 'vai:truong_lao', 'gt:sư huynh|sư tỷ'])
  })

  it('dienMau điền đúng giới tính người chơi: nam và nữ', () => {
    const dNam = taoTrangThaiRong(1)
    dNam.nhan_vat.gioi_tinh = 'nam'
    const kqNam = dienMau('Chào {gt:sư huynh|sư tỷ}!', dNam, dl)
    expect(kqNam).toBe('Chào sư huynh!')

    const dNu = taoTrangThaiRong(1)
    dNu.nhan_vat.gioi_tinh = 'nu'
    const kqNu = dienMau('Chào {gt:sư huynh|sư tỷ}!', dNu, dl)
    expect(kqNu).toBe('Chào sư tỷ!')
  })

  it('dienMau điền đúng các biến dựng sẵn và biến truyền vào', () => {
    const d = taoTrangThaiRong(1)
    d.nhan_vat.ten = 'Tiểu Lý'
    d.nhan_vat.tuoi = 18
    d.nhan_vat.vung = 'giang_nam'

    const mau = '{ten} ({tuoi} tuổi), sinh sống tại {vung}, được {vai:su_phu} chỉ dạy.'
    const kq = dienMau(mau, d, dl, { su_phu: 'Trương Tam Phong' })
    expect(kq).toBe('Tiểu Lý (18 tuổi), sinh sống tại Giang Nam, được Trương Tam Phong chỉ dạy.')
  })
})
